import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
  Renderer,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import {TreeComponent} from '../tree/tree.component';
import * as _ from 'lodash';

@Component({
  selector: 'dc-select',
  template: `
    <div #selectContainer class="dc-select-container" [ngClass]="{'disable':disable}" [style.width]="width">
      <div class="dc-select-input" title="{{currentValue}}">
        <input [class.dc-valid]="currentValue" [class.focus]='showDropFlag' [class.dc-invalid]="calcInvalid()"
               name="dcSelect" [(ngModel)]="keyword" [disabled]="disable" [readonly]="isReadonly || isTree"
               (keyup.enter)="confirm()" (click)="toggleSourceDrop()" (blur)="blurEvent($event)" #inputSelect>
        <span (click)="toggleSourceDrop()" [hidden]="(keyword && keyword.length>0) || isFocus">{{currentValue}}</span>
        <i [hidden]="!(!noClear && !disable && (keyword || (currentValue && currentValue.length > 0)))" class="clear-input-value"
           (click)="clearInputValue($event)"></i>
        <div [hidden]="disable" (click)="toggleSourceDrop()" [class.showDropFlagBtn]="showDropFlag" class="dc-select-btn"
             #dropBtn>
          <div class="dc-select-arrow"></div>
        </div>
      </div>
      <ul *ngIf="!isTree" [hidden]="!showDropFlag" class="dc-select-drop" [class.drop-up]="dropUp" #dropList [style.maxHeight]="maxHeight">
        <li *ngFor="let option of filter(optionList, keyword); let i = index; trackBy: trackByIndex"
            (click)="changeValue(option)" [class.selected]="displayField ? currentValue==option[displayField]: currentValue==option"
            [title]="option[displayField] || option">
          {{option[displayField] || option}}
        </li>
        <div *ngIf="filter(optionList, keyword).length == 0" style="text-align: center; height: 30px; line-height: 30px;">No Data.</div>
      </ul>
      <div (click)="$event.stopPropagation()" style="padding: 10px 0;width:auto;min-width: 100%;"
           *ngIf="isTree && isMultiple && _treeParams.treeDatas"
           [hidden]="!showDropFlag"
           class="dc-select-drop" #dropList>
        <div *ngIf="treeSearch" style="padding: 0 10px;">
          <dc-search [width]="'100%'" (search)="searchTree($event)"></dc-search>
        </div>
        <div [style.maxHeight]="maxHeight">
          <dc-tree [treeDatas]="_treeParams.treeDatas" [keyId]="_treeParams.keyId" [keyName]="_treeParams.keyName"
                   [defaultCheckedNodes]="_treeParams.defaultCheckedNodes" [keyChild]="_treeParams.keyChild" [options]="_treeParams.options"
                   (checkEvent)="treeCheck($event)" #tree></dc-tree>
        </div>
      </div>
      <div (click)="$event.stopPropagation()" [hidden]="!showDropFlag" style="padding: 10px 0;width:auto;min-width: 100%;"
           *ngIf="isTree && !isMultiple && _treeParams.treeDatas"
           class="dc-select-drop" #dropList>
        <div *ngIf="treeSearch" style="padding: 0 10px;" (click)="$event.stopPropagation()">
          <dc-search [width]="'100%'" (search)="searchTree($event)"></dc-search>
        </div>
        <div [style.maxHeight]="maxHeight">
          <dc-tree [treeDatas]="_treeParams.treeDatas" [keyId]="_treeParams.keyId" [keyName]="_treeParams.keyName"
                   [defaultSelectedNode]="_treeParams.defaultSelectedNode" [keyChild]="_treeParams.keyChild" [options]="_treeParams.options"
                   (clickEvent)="treeClick($event)" #tree></dc-tree>
        </div>
      </div>
    </div>`,
  styles: [
      `.dc-select-container {
      width: 160px;
      height: 30px;
      font-size: 14px;
      color: #333;
      background: #fff;
      /*margin: 0 10px;*/
      padding: 0;
      display: inline-block;
      position: relative
    }

    .dc-select-container:hover {
      /*border-color: #3d70b2*/
    }

    .dc-select-container:active {
      /*border-color: #0081cc*/
    }

    .dc-select-container.disable {
      background: #f5f5f5;
      border-color: #ccc;
      color: #999
    }

    .dc-select-input {
      /*padding: 5px 10px;*/
      height: 30px;
      position: relative;
      /*display: flex;*/
      /*flex-direction: row;*/
    }

    .dc-select-input > input {
      outline: none;
      width: 100%;
      padding: 0 30px 0 10px;
      height: 30px;
      line-height: 30px;
      background: none;
      border: 1px solid #ccc;
      border-radius: 4px;
      position: relative;
      z-index: 1;
    }

    .dc-select-input > input.dc-valid {
      border-color: #3FB992;
    }

    .dc-select-input > input.dc-invalid {
      border-color: #FF3B3B;
    }

    .dc-select-input > input.focus,
    .dc-select-input > input:focus {
      border-color: #2BB1FF;
    }

    .dc-select-input > input:read-only {
      cursor: default
    }

    .dc-select-input > span {
      display: block;
      position: absolute;
      width: calc(100% - 40px);
      height: 18px;
      left: 10px;
      top: 5px;
      line-height: 18px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      z-index: 0;
    }

    .clear-input-value {
      position: absolute;
      right: 20px;
      top: 0;
      cursor: pointer;
      width: 12px;
      height: 30px;
      z-index: 2;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAAOVJREFUKJF90DFKA1EQBuAvj2Cu8MBqe8FokedeQb2A6WzU0uN4gxTbxkM8CKKSfqvAXsAi2lj4dlkh5Icp5p9/Zv6ZSdM0Ck7whDucFW6LFV7wDdNSOMUac/9xVeIet9iFMvmQeIw5XjELeOzFdV2LMQ6qGKO6rvv0HA8By55p21ZKSYxRjFFKSdu2403LKS77rOs6OWcpJZBz1nXduOEiHPF9CD8Bb2PPKSU552HT+CZsg78/g6qqBhu9vaqqxg2rSdM0M+TyhWP4xCJgjxu8HxF/4Br7/ugdEp6xwVeJTeEWReMX1Y9FK/4RDOgAAAAASUVORK5CYII=) no-repeat center center transparent;
    }

    .clear-input-value:hover {
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAAOtJREFUKJF90b1NAzEcBfBfriCVm2vR3S2ABFXYAViADACUjMMGWQCGQIoQWJngrLTXWBSBIhRxooBCnuTCz++9/4dHMUYFJ3jALc4Kt8AMT/iCUTGc4hkXDuMdN1hWJfmYWHl7wbjC/VbcdZ0Qwk4VQtB13fZ6jrsK0y0zDIO2bYUQhBA0TWMYhv1K01GMcVXa2qW2bWu9XkspyTnvG1bVkb4P4bvC29/0vu+llDRN82smLCqbPYO6rvV9L+cs5yylpK7rfcNsFGMc47Vs4RgiJhVWuLb5nP/wgSt7Qy9xiUfM8VnOvHCTovEDCGVJpA/ldQoAAAAASUVORK5CYII=) no-repeat center center transparent;
    }

    .dc-select-btn {
      width: 0;
      height: 30px;
      position: absolute;
      right: 0;
      top: 0;
      padding: 12px 15px 0 5px;
      cursor: pointer;
      z-index: 3;
    }

    .dc-select-container.disable .dc-select-btn {
      cursor: default;
    }

    .dc-select-arrow {
      border: solid 4px transparent;
      border-top-width: 6px;
      border-top-color: #333;
      width: 0;
      height: 0;
    }

    .showDropFlagBtn .dc-select-arrow {
      top: 0;
      transform: rotate(180deg);
      -ms-transform: rotate(180deg); /* Internet Explorer */
      -moz-transform: rotate(180deg); /* Firefox */
      -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
      -o-transform: rotate(180deg); /* Opera */
    }

    .dc-select-container.disable .dc-select-arrow {
      border-top-color: #ccc;
    }

    .dc-select-drop {
      position: absolute;
      top: 30px;
      left: -1px;
      width: calc(100% + 2px);
      box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, .2);
      background: #fff;
      list-style: none;
      border-radius: 3px;
      overflow-y: auto;
      overflow-x: hidden;
      z-index: 1000;
    }

    .dc-select-drop.drop-up {
      top: auto;
      bottom: 25px;
    }

    .selected {
      background-color: #0081cc;
      color: #ffffff;
    }

    .dc-select-drop > li {
      width: 100%;
      height: 30px;
      line-height: 26px;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0 11px
    }

    .dc-select-drop > li:hover {
      color: #333333;
      background: #edf0f5;
    }

    .dc-select-drop > li.selected {
      background-color: #0081cc;
      color: #ffffff;
    }`]
})
export class SelectComponent implements OnInit, AfterViewInit {
  firstLoad = true;
  @Input() optionList: any;
  @Input() required: boolean;
  @Input() dropUp: boolean;
  @Input() disable: boolean;
  @Input() treeSearch: boolean;
  @Input() isReadonly: boolean;
  @Input() displayField: string;
  @Input() outputField: string;
  @Input() width: string;
  @Input() maxHeight: string;
  @Input() isMultiple: boolean;
  @Input() isTree: boolean;
  @Input() noClear: boolean;
  __treeParams: any;

  firstLoadTree = true;

  @Input() set treeParams(v) {
    this.__treeParams = v;
    if (this.isTree) {
      this.treeParams.options.checkbox = this.isMultiple;
      this.treeParams.options.actionBtn = false;
      if (this.firstLoadTree) {
        Object.assign(this._treeParams, this.treeParams);
        this.firstLoadTree = false;
      }
    }
  }

  get treeParams() {
    return this.__treeParams;
  }

  _treeParams: any = {
    treeDatas: null,
    keyId: null,
    keyName: null,
    keyChild: null,
    defaultCheckedNodes: null,
    defaultSelectedNode: null,
    options: null
  };
  @Output() treeCheckEvent = new EventEmitter();
  @Output() treeCheckData = new EventEmitter();
  @Output() treeClickEvent = new EventEmitter();
  @Output() changeValueEvent = new EventEmitter();
  @Output() selectBlurEvent = new EventEmitter();
  @ViewChild('inputSelect') inputSelect: ElementRef;
  @ViewChild('dropBtn') dropBtn: ElementRef;
  @ViewChild('dropList') dropList: ElementRef;
  @ViewChild('tree') tree: TreeComponent;
  @ViewChild('selectContainer') selectContainer: ElementRef;
  currentValue: string;
  keyword: string;
  showThis = false;
  isFocus = false;
  _currentSelect: any;
  showDropFlag = false;

  @Input() set currentSelect(v) {
    this._currentSelect = _.cloneDeep(v);
    if (!this.optionList) {
      return;
    }
    const result = this.optionList.find((item: any) => {
      if (this.currentSelect) {
        return this.displayField ? this.currentSelect[this.displayField] === item[this.displayField] : this.currentSelect == item;
      }
    });
    this.currentValue = result && (result[this.displayField] || result);
  }

  get currentSelect() {
    return this._currentSelect;
  }

  constructor(private renderer: Renderer, private cdr: ChangeDetectorRef) {
    this.maxHeight = this.maxHeight || '300px';
    this.width = this.width || '150px';
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.afterViewInit();
  }

  afterViewInit() {
    if (!this.tree) {
      setTimeout(() => {
        this.afterViewInit();
      }, 100);
      return;
    }
    if (this._treeParams.defaultCheckedNodes && !_.isEmpty(this._treeParams.defaultCheckedNodes)) {
      const result = this._treeParams.defaultCheckedNodes.map((value: any) => this.tree.matchSearchNodesByKey(value, this._treeParams.keyId)[0]);
      this.currentValue = this.arrStringJoin(result);
    }
    if (this._treeParams.defaultSelectedNode && !_.isEmpty(this._treeParams.defaultSelectedNode)) {
      const result = this.tree.matchSearchNodesByKey(this._treeParams.defaultSelectedNode[this._treeParams.keyId], this._treeParams.keyId);
      if (result && result.length > 0) {
        this.currentValue = result[0][this.displayField];
      }
    }
    this.cdr.detectChanges();
  }

  calcInvalid() {
    // !firstLoad && required && (!currentValue || currentValue.length == 0)
    if (!this.firstLoad && this.required) {
      if (this.isTree) {
        if (this.showDropFlag) {
          if (!this.keyword) {
            return true;
          } else {
            return false;
          }
        } else {
          if (!this.currentValue || this.currentValue.length == 0) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        if (!this.currentValue || this.currentValue.length == 0) {
          return true;
        } else {
          return false;
        }
      }
    }
  }

  searchTree(ev: string) {
    // this._treeParams.treeDatas = _.cloneDeep(this.treeParams.treeDatas);
    // if (ev) {
    // setTimeout(() => {
    const result = this.tree.fuzzySearchNodesByKey(ev, this._treeParams.keyName);
    // this._treeParams.treeDatas = _.cloneDeep(result);
    // }, 10);
    // }
  }

  changeCurrentValue() {
    const result = this.optionList.find((item: any) => this.currentSelect === item);
    this.currentValue = result && (result[this.displayField] || result);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(ev: any) {
    if (!this.disable) {
      if (this.showDropFlag && !this.selectContainer.nativeElement.contains(ev.target)) {
        this.showDropFlag = false;
        this.isFocus = false;
        if (this.keyword !== undefined) {
          this.currentValue = this.keyword;
          this.keyword = undefined;
        }
      }
      /*
      if (event.target !== this.inputSelect.nativeElement &&
        event.target !== this.dropBtn.nativeElement &&
        event.target.parentNode !== this.dropBtn.nativeElement
      ) {
        if (this.dropList.nativeElement.style.display == 'none') {
          return;
        }
        this.dropList.nativeElement.style.display = 'none';
        this.isFocus = false;
        if (this.keyword !== undefined) {
          this.currentValue = this.keyword;
          this.keyword = undefined;
        }
      } else {
        const elm = this.dropList.nativeElement;
        if (event.target === this.dropBtn.nativeElement ||
          event.target.parentNode === this.dropBtn.nativeElement) {
          elm.style.display = elm.style.display === 'block' ? 'none' : 'block';
          this.isFocus = !this.isFocus;
        } else {
          if (this.tree) {
            let result: Array<any> = [];
            if (this.isMultiple) {
              result = this.tree.getCheckedNodes();
            } else {
              if (this.tree.getSelectedNodes()) {
                result = [this.tree.getSelectedNodes()];
              }
            }
            this.keyword = this.arrStringJoin(result);
          }
          elm.style.display = 'block';
          this.isFocus = true;
        }
      }*/
    }
  }

  filter(data: any, keyword: string) {
    if (!this.isReadonly && keyword) {
      return data.filter((item: any) => item[this.displayField].indexOf(keyword) > -1);
    } else {
      return data || [];
    }
  }

  blurEvent(ev: any) {
    this.selectBlurEvent.emit({
      current: this.currentValue,
      val: this.keyword
    });
  }

  confirm() {
    const result = this.optionList.filter((item: any) => item[this.displayField].indexOf(this.keyword) > -1);
    if (result && result.length > 0) {
      this.dropList.nativeElement.style.display = 'none';
      this.inputSelect.nativeElement.blur();
      this.currentValue = result[0][this.displayField] || result[0];
      this.keyword = '';
      this.isFocus = false;
      const value = result[0][this.outputField] || result[0];
      this.changeValueEvent.emit(value);
    }
  }

  changeValue(option: any) {
    this.currentSelect = option;
    const value = option[this.outputField] || option;
    this.currentValue = option[this.displayField] || option;
    this.keyword = undefined;
    this.changeValueEvent.emit(value);
    this.showDropFlag = false;
    this.isFocus = false;
  }

  // 支持树/单选
  selectValue(item: any) {
    if (this.isTree) {
      if (!this.isMultiple) {
        this.tree.selectTreeNode(item);
        this.keyword = this.arrStringJoin([item]);
      }
    } else {
      this.changeValue(item);
    }
  }

  clearValue() {
    this.firstLoad = false;
    this.currentValue = '';
    this.keyword = undefined;
    this.isFocus = false;
    if (!this.isTree) {
      this.currentSelect = null;
    } else {
      if (this.isMultiple) {
        const checkedNodes = this.tree.getCheckedNodes();
        const halfCheckedNodes = this.tree.getHalfCheckedNodes();
        if (checkedNodes && checkedNodes.length > 0) {
          for (let i = 0; i < checkedNodes.length; i++) {
            checkedNodes[i].checked = 0;
          }
        }
        if (halfCheckedNodes && halfCheckedNodes.length > 0) {
          for (let i = 0; i < halfCheckedNodes.length; i++) {
            halfCheckedNodes[i].checked = 0;
          }
        }
      } else {
        const selectedNode = this.tree.getSelectedNodes();
        if (selectedNode) {
          this.tree.deSelectTreeNode(selectedNode);
        }
      }
    }
    this.changeValueEvent.emit(null);
  }

  trackByIndex(index: number, value: any) {
    return index;
  }

  treeCheck(event: any) {
    // if (result.length === 1 && event.hasOwnProperty(this._treeParams.keyChild) && event[this._treeParams.keyChild].length > 0) {
    //   this.keyword = event[this.displayField];
    // } else {
    const result = this.tree.getCheckedNodes();
    this.keyword = this.arrStringJoin(result);
    // }
    this.treeCheckEvent.emit(event);
    this.treeCheckData.emit(result);
  }

  treeClick(event: any) {
    if (event) {
      this.keyword = event[this.displayField];
      this.treeClickEvent.emit(event);
    } else {
      this.keyword = '';
      this.treeClickEvent.emit(null);
    }
    this.hideSourceDrop();
  }

  arrStringJoin(arr: Array<any>) {
    if (arr && arr.length == 0) {
      return '';
    }
    const str = arr.map(item => item[this.displayField]);
    return str.length > 1 ? str.join(',') : str[0];
  }

  getSelectVal() {
    let res: any;
    if (this.isMultiple) {
      res = this.tree.getCheckedNodes();
    } else {
      res = this.tree.getSelectedNodes();
    }
    return res;
  }

  showSourceDrop() {
    this.showDropFlag = true;
    this.isFocus = true;
  }

  hideSourceDrop() {
    this.showDropFlag = false;
    this.isFocus = false;
  }

  toggleSourceDrop() {
    this.firstLoad = false;
    this.showDropFlag = !this.showDropFlag;
    this.isFocus = this.showDropFlag;
    if (this.tree && this.showDropFlag) {
      let result: Array<any> = [];
      if (this.isMultiple) {
        result = this.tree.getCheckedNodes();
      } else {
        if (this.tree.getSelectedNodes()) {
          result = [this.tree.getSelectedNodes()];
        }
      }
      this.keyword = this.arrStringJoin(result);
    }
  }

  clearInputValue(ev: any) {
    this.clearValue();
    this.showDropFlag = true;
  }
}
