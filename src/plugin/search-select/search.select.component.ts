import {ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';

import * as _ from 'lodash';

@Component({
  selector: 'dc-search-select',
  template: `
    <div #selectContainer [class.dc-valid]="currentValue && currentValue.length > 0" class="dc-select-container"
         [ngClass]="{'disable':disable}" [class.dc-invalid]="required && !firstLoad && (!currentValue || currentValue.length == 0)"
         [style.width]="width">
      <div class="dc-select-input" [class.focus]="showDropFlag" [class.dc-valid]="currentValue && currentValue.length > 0"
           [class.dc-invalid]="required && !firstLoad && (!currentValue || currentValue.length == 0)">
        <!--<input name="dcSelect" [disabled]="disable" [readonly]="true" #inputSelect>-->
        <ul class="dc-select-current" [style.margin-right]="noClear?'':'30px'" (click)="showDropList($event)">
          <li [title]="showCurrentTitle()">
            <span *ngFor="let list of currentValue; let i = index;">{{list[nameKey]}}{{i == (currentValue.length - 1) ? '' : ','}}</span>
          </li>
        </ul>
        <i [hidden]="noClear || !(currentValue && currentValue.length > 0)" class="clear-input-value" (click)="clearValue($event)"></i>
        <div (click)="showDropList($event)" [class.showDropFlagBtn]="showDropFlag" class="dc-select-btn" #dropBtn>
          <div class="dc-select-arrow"></div>
        </div>
      </div>
      <div *ngIf="showDropFlag" class="dc-select-drop" (click)="$event.stopPropagation()" #dropList>
        <div *ngIf="!noSearch" style="margin-bottom: 10px;padding:0 10px;">
          <dc-search [width]="'100%'" (search)="searchMe($event)"
                     [realTime]="true"></dc-search>
        </div>
        <ul [style.maxHeight]="maxHeight">
          <ng-template ngFor let-list [ngForOf]="filter(source, keyword)">
            <li [class.checked]="list.checkModel?.checked" [class.radioLi]="!multiple">
              <dc-checkbox *ngIf="multiple" [options]="{text: list[nameKey], width: '100%'}"
                           (checkboxChangeEvent)="checkboxChangeEvent($event)"
                           [checkModel]="list.checkModel"></dc-checkbox>
              <span class="dc-search-select-text" *ngIf="!multiple" (click)="selectList(list, $event)"
                    [title]="list[nameKey]">{{list[nameKey]}}</span>
            </li>
          </ng-template>
          <div *ngIf="filter(source, keyword).length == 0" style="text-align: center;">No Data.</div>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    ul, ol, li {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .dc-select-container {
      width: 160px;
      height: 30px;
      font-size: 12px;
      color: #333;
      background: #fff;
      /*border: solid 1px #ccc;*/
      /*border-radius: 3px;*/
      /*margin: 0 10px;*/
      padding: 0;
      display: inline-block;
      position: relative
    }

    .clear-input-value {
      position: absolute;
      right: 20px;
      top: 0;
      cursor: pointer;
      width: 12px;
      height: 32px;
      z-index: 2;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAAOVJREFUKJF90DFKA1EQBuAvj2Cu8MBqe8FokedeQb2A6WzU0uN4gxTbxkM8CKKSfqvAXsAi2lj4dlkh5Icp5p9/Zv6ZSdM0Ck7whDucFW6LFV7wDdNSOMUac/9xVeIet9iFMvmQeIw5XjELeOzFdV2LMQ6qGKO6rvv0HA8By55p21ZKSYxRjFFKSdu2403LKS77rOs6OWcpJZBz1nXduOEiHPF9CD8Bb2PPKSU552HT+CZsg78/g6qqBhu9vaqqxg2rSdM0M+TyhWP4xCJgjxu8HxF/4Br7/ugdEp6xwVeJTeEWReMX1Y9FK/4RDOgAAAAASUVORK5CYII=) no-repeat center center transparent;
    }

    .clear-input-value:hover {
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAAOtJREFUKJF90b1NAzEcBfBfriCVm2vR3S2ABFXYAViADACUjMMGWQCGQIoQWJngrLTXWBSBIhRxooBCnuTCz++9/4dHMUYFJ3jALc4Kt8AMT/iCUTGc4hkXDuMdN1hWJfmYWHl7wbjC/VbcdZ0Qwk4VQtB13fZ6jrsK0y0zDIO2bYUQhBA0TWMYhv1K01GMcVXa2qW2bWu9XkspyTnvG1bVkb4P4bvC29/0vu+llDRN82smLCqbPYO6rvV9L+cs5yylpK7rfcNsFGMc47Vs4RgiJhVWuLb5nP/wgSt7Qy9xiUfM8VnOvHCTovEDCGVJpA/ldQoAAAAASUVORK5CYII=) no-repeat center center transparent;
    }

    .dc-select-input {
      padding: 0 10px;
      width: 100%;
      height: 32px;
      line-height: 32px;
      position: relative;
      border-radius: 4px;
      border: 1px solid #ccc;
      font-size: 14px;
      color: #333;
      box-shadow: none;
    }

    .dc-select-input.dc-valid {
      border-color: #3FB992;
    }

    .dc-select-input.dc-invalid {
      border-color: #FF3B3B;
    }

    .dc-select-input.focus {
      border-radius: 4px;
      border-color: #2BB1FF;
      transition: none;
      background: none;
      outline: none;
    }

    .dc-select-container.disable {
      background: #f5f5f5;
      border-color: #ccc;
      color: #999
    }

    .dc-select-input > .dc-select-current {
      background: none;
      position: relative;
      z-index: 1;
      cursor: default;
      display: flex;
      height: 30px;
    }

    .dc-select-input > .dc-select-current li {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      margin-right: 10px;
    }

    .dc-select-input > .dc-select-current li span {
      margin-right: 10px;
    }

    .dc-select-btn {
      width: 0;
      height: 32px;
      position: absolute;
      right: 0;
      top: 0;
      padding: 12px 15px 0 5px;
      cursor: pointer;
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
      position: relative;
    }

    .dc-select-container.disable .dc-select-arrow {
      border-top-color: #ccc;
    }

    .showDropFlagBtn .dc-select-arrow {
      top: -4px;
      transform: rotate(180deg);
      -ms-transform: rotate(180deg); /* Internet Explorer */
      -moz-transform: rotate(180deg); /* Firefox */
      -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
      -o-transform: rotate(180deg); /* Opera */
    }

    .dc-select-drop {
      position: absolute;
      top: 30px;
      left: -1px;
      width: calc(100% + 2px);
      box-shadow: 0 0 10px 2px rgba(0, 0, 0, .2);
      background: #fff;
      list-style: none;
      border-radius: 3px;
      z-index: 1000;
      padding: 10px 0;
    }

    .dc-select-drop > ul {
      margin: 0;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .dc-select-drop > ul > li {
      width: 100%;
      height: 30px;
      line-height: 26px;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 3px 10px;
      user-select: none;
    }

    .dc-select-drop > ul > li.radioLi {
      display: flex;
      flex-direction: row;
    }

    .dc-select-drop > ul > li:hover,
    .dc-select-drop > ul > li.checked {
      color: #333333;
      background: #edf0f5;
    }

    .dc-search-select-text {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `]
})
export class SearchSelectComponent implements OnInit {

  firstLoad = true;
  showDropFlag: boolean;
  keyword: string;
  @Input() disable: boolean;
  @Input() width: string;
  @Input() maxHeight: string;
  @Input() fieldKey: string;
  @Input() nameKey: string;
  @Input() currentValue: any;
  @Input() multiple: boolean;
  @Input() noSearch: boolean;
  @Input() required: boolean;
  @Input() noClear: boolean;
  /**
   * [{id,name,checked}]
   */
  _source: any;
  @Input() set source(v: any) {
    if (!v) {
      this._source = [];
    }
    for (let i = 0; i < v.length; i++) {
      let vi = v[i];
      vi.checkModel = {
        checked: false,
        index: i,
        field: vi[this.fieldKey]
      };
      if (this.currentValue && this.currentValue.length > 0) {
        for (let j = 0; j < this.currentValue.length; j++) {
          const cj = this.currentValue[j];
          if (vi[this.fieldKey] == cj[this.fieldKey]) {
            vi.checkModel.checked = true;
          }
        }
      } else {
        this.currentValue = [];
      }
    }
    this._source = _.cloneDeep(v);
  }

  @Output() checkEvent = new EventEmitter();

  get source() {
    return this._source;
  }

  @ViewChild('dropList') dropList: ElementRef;
  @ViewChild('selectContainer') selectContainer: ElementRef;

  checkOptions: any;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    this.maxHeight = this.maxHeight || '300px';
    this.width = this.width || '150px';
    this.nameKey = this.nameKey || 'name';
    this.fieldKey = this.fieldKey || 'id';
    this.checkOptions = {
      key: 'checked',
    };
  }

  ngOnInit() {
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(ev: any) {
    if (this.showDropFlag && !this.selectContainer.nativeElement.contains(ev.target)) {
      this.showDropFlag = false;
      this.keyword = '';
    }
  }

  searchMe(ev: any) {
    this.keyword = ev;
  }

  showCurrentTitle() {
    if (this.currentValue) {
      let res: Array<string> = [];
      for (let i = 0; i < this.currentValue.length; i++) {
        res.push(this.currentValue[i][this.nameKey]);
      }
      return res.join(',   ');
    }
    return '';
  }

  selectList(list: any, ev?: any) {
    if (this.multiple) {// 复选
      ev && ev.stopPropagation();
      if (list.checkModel.checked) {
        list.checkModel.checked = false;
      } else {
        list.checkModel.checked = true;
      }
      this.checkboxChangeEvent(list.checkModel);
    } else {// 单选
      this.currentValue = [];
      for (let i = 0; i < this.source.length; i++) {
        this.source[i].checkModel.checked = false;
      }
      /*if (this.currentValue[this.fieldKey] == list[this.fieldKey]) {
        list.checkModel.checked = false;
        return;
      } else {
        list.checkModel.checked = true;
        this.currentValue.push(list);
      }*/
      list.checkModel.checked = true;
      this.currentValue.push(list);
      ev && this.checkEvent.emit(this.currentValue);
      this.showDropFlag = false;
      this.keyword = '';
    }
  }

  checkboxChangeEvent(ev: any) {
    let listItem = _.find(this.source, (item) => {
      return item[this.fieldKey] == ev.field;
    });
    if (ev.checked) {
      let index = _.findIndex(this.currentValue, (o: any) => {
        return o[this.fieldKey] == ev.field;
      });
      if (index == -1) {
        this.currentValue.push(listItem);
      }
    } else {
      for (let i = 0; i < this.currentValue.length; i++) {
        if (this.currentValue[i][this.fieldKey] == ev.field) {
          this.currentValue.splice(i, 1);
          break;
        }
      }
    }
    this.checkEvent.emit(this.currentValue);
  }

  showDropList(ev: any) {
    this.firstLoad = false;
    if (this.showDropFlag) {
      this.showDropFlag = false;
      this.keyword = '';
    } else {
      setTimeout(() => {
        this.showDropFlag = true;
      }, 10);
    }
  }

  getCurrentVal() {
    return this.currentValue;
  }

  filter(data: any, keyword: string) {
    if (keyword) {
      return data.filter((item: any) => (item[this.nameKey].toLowerCase()).indexOf(keyword.toLowerCase()) > -1);
    } else {
      return data || [];
    }
  }

  clearValue(ev: any) {
    this.firstLoad = false;
    this.currentValue = [];
    for (let i = 0; i < this.source.length; i++) {
      this.source[i].checkModel.checked = false;
    }
    this.checkEvent.emit(null);
    this.showDropFlag = true;
  }

  selectValue(item: any) {
    let tempList: any;
    for (let i = 0; i < this.source.length; i++) {
      if (this.fieldKey) {
        if (this.source[i][this.fieldKey] == item[this.fieldKey]) {
          this.source[i].checkModel.checked = true;
          tempList = this.source[i];
        } else {
          this.source[i].checkModel.checked = false;
        }
      }else{
        if(this.source[i] == item){

        }
      }
    }
    this.selectList(tempList);
  }
}
