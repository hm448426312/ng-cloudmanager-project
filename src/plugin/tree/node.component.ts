import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver, ElementRef
} from '@angular/core';
import {Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RoutesRecognized} from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'dc-node',
  template: `
    <div #treeNode class="display-flex flex-direction-column node-container" *ngIf="!nodeData.isHide">
      <div class="display-flex tree-node-list" [class.tree-node-selected]="nodeData.selected" (mouseleave)="hideMoreBtn($event)"
           [style.padding-left]="(((options && options.paddingLeft)? (options.paddingLeft - 0) : 20) + deepIndex*15) + 'px'">
        <div class="tree-expand" (click)="changeShow($event)"
             [class.tree-expanded]="nodeData.show" [class.tree-no-child]="!(nodeData[keyChild]!=null && nodeData[keyChild].length>0)">
        </div>
        <label *ngIf="options && options['checkbox']" class="tree-checkbox-box">
          <input type="checkbox" [class.half-checked]="nodeData.checked == 2" id="checkbox{{(checkboxId || '')+''+myIndex+''+deepIndex}}"
                 [(ngModel)]="nodeData.checked"
                 (click)="checkNodeEvent($event)">
          <label (click)="$event.stopPropagation()" class="clabel" for="checkbox{{(checkboxId || '')+''+myIndex+''+deepIndex}}"></label>
        </label>
        <div class="tree-icon" *ngIf="options && options['iconCls']"
             [ngClass]="[getFileIcon(),getFolderIcon(),getExpandIcon()]">
        </div>
        <div class="tree-icon-config" *ngIf="nodeData.icon && options.iconDataKey && nodeData.icon[options.iconDataKey]"
             [ngStyle]="{'background-image':'url('+nodeData.icon[options.iconDataKey]+')'}">
        </div>
        <div class="cursor-pointer tree-node-text {{nodeData.cls || ''}}" style="margin-left:10px;line-height: 30px;"
             [ngStyle]="setNodeWidth(nodeData.icon,deepIndex)"
             (click)="clickNode($event,nodeData)" [class.active]="nodeData.lighthight" [class.selected]="nodeData.selected"
             [title]="nodeData[keyName]">
          {{nodeData[keyName]}}
        </div>
        <div class="tree-option-box" *ngIf="options && options.actionBtn">
          <div #actionBtnDom style="display: flex; flex-direction: row;height:30px;">
            <ng-template ngFor let-actbtn [ngForOf]="options.actionBtn">
              <i *ngIf="showActionBtn(actbtn)" class="{{actbtn.cls}} tree-options-btn" (click)="doNodeFn(actbtn)"
                 [ngStyle]="{'background-image':'url('+actbtn.icon+')'}" [title]="actbtn.text">{{actbtn.showText ? actbtn.text : ''}}</i>
            </ng-template>
            <ng-template [ngIf]="options.moreActionBtn">
              <i class="tree-options-btn tree-more-btn" [title]="'more'" [ngStyle]="{'background-image':'url('+treeMoreBtn+')'}"
                 (click)="shouwMoreActionBtn($event)">.</i>
              <ul class="tree-more-btn-box" (mouseleave)="hideMe($event)">
                <ng-template ngFor let-list [ngForOf]="options.moreActionBtn">
                  <li *ngIf="showActionBtn(list)" [title]="list.text" (click)="doNodeFn(list)">{{list.text}}</li>
                </ng-template>
              </ul>
            </ng-template>
          </div>
        </div>
      </div>

      <div *ngIf="nodeData[keyChild]!=null && nodeData[keyChild].length>0 && nodeData.show"
           class="display-flex flex-direction-column sub-node-container">
        <div *ngFor="let node of nodeData[keyChild]; let i = index;">
          <div>
            <dc-node [nodeData]="node" [keyChild]="keyChild" [keyId]="keyId" [treeId]="treeId + myIndex"
                     [options]="options" [keyName]="keyName" [parentNode]="nodeData" [myIndex]="i"
                     (clickEvent)="_clickNode($event)" [deepIndex]="deepIndex+1" (checkEvent)="_checkNode($event)"
                     (extendEvent)="_extendNode($event)"></dc-node>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
      `
      li {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .sub-node-container {
      }

      .before-node {
      }

      .left-line {
        position: absolute;
        width: 1px;
        height: 100000px;
        border-left: 1px solid red;
      }

      .node-container {
        /*position: relative;*/
      }

      .tree-expand {
        cursor: pointer;
        min-width: 20px;
        flex-grow: 0;
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpBRjI2RjgxNDJCNDYxMUU4QUIxNkRENDdDRTFGOURBRiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpBRjI2RjgxNTJCNDYxMUU4QUIxNkRENDdDRTFGOURBRiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkFGMjZGODEyMkI0NjExRThBQjE2REQ0N0NFMUY5REFGIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkFGMjZGODEzMkI0NjExRThBQjE2REQ0N0NFMUY5REFGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+bQubIwAAAFxJREFUeNpiDImI8WRgYJgLxJIMhMFzIE5mIkEDA1TdXCZcGlYvX4xTIxMDGYB+mljw+QFdLDQyFlUTTABZA7oY/f1Etqbn2CRw+QcIXoA0pYAYRFryFJT2AAIMAFsOFXDcTQR2AAAAAElFTkSuQmCC") no-repeat center transparent;
      }

      .tree-expand.tree-no-child {
        cursor: default;
        background: none;
      }

      .tree-expanded {
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2OUQ2NjIwMTJCNDYxMUU4OTQyOUNGRTMyODY0NTA2NyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2OUQ2NjIwMjJCNDYxMUU4OTQyOUNGRTMyODY0NTA2NyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjY5RDY2MUZGMkI0NjExRTg5NDI5Q0ZFMzI4NjQ1MDY3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjY5RDY2MjAwMkI0NjExRTg5NDI5Q0ZFMzI4NjQ1MDY3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Fve+rwAAAFRJREFUeNpiDImI8WRgYJgLxJIMhMFzIE5mIkEDA1TdXCYSNMA1MjGQAeiniQXGWL18MUHFoZGxqJpgAoPLT2Rrek6inhcgTSkgBpEanoLSHkCAAQDBsw17IO7pLwAAAABJRU5ErkJggg==") no-repeat center transparent;
      }

      .noIcon {
        margin-left: 10px;
      }

      .tree-icon {
        display: inline-block;
        min-width: 20px;
        height: 20px;
        flex-grow: 0;
      }

      .tree-icon-config {
        min-width: 20px;
        margin: 0 0 0 10px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        flex-grow: 0;
      }

      .tree-checkbox-box {
        display: block;
        position: relative;
        min-width: 20px;
        margin: 0;
        text-align: center;
        flex-grow: 0;
      }

      .tree-checkbox-box input {
        margin-top: 10px;
      }

      .tree-option-box {
        position: absolute;
        right: 20px;
        height: 30px;
        display: none;
      }

      .tree-node-list {
        position: relative;
        height: 30px;
        line-height: 30px;
      }

      .tree-node-list:hover,
      .tree-node-list.tree-node-selected {
        color: #0081cc;
        background-color: #edf0f5;
      }

      .tree-node-list:hover .tree-option-box {
        display: block;
      }

      .tree-node-list .tree-node-text.active{
        color: #0067A3;
      }
      input[type=checkbox] {
        visibility: hidden;
      }

      .clabel {
        cursor: pointer;
        position: absolute;
        width: 18px;
        height: 18px;
        top: 7px;
        left: 4px;
        background: #fff;
        border: 1px solid #c8c8c8;
        -moz-border-radius: 3px; /* Gecko browsers */
        -webkit-border-radius: 3px; /* Webkit browsers */
        border-radius: 3px; /* W3C syntax */
      }

      .clabel:hover {
        background: #0081CC;
      }

      .clabel:after {
        opacity: 0;
        content: '';
        position: absolute;
        width: 9px;
        height: 5px;
        background: transparent;
        top: 4px;
        left: 4px;
        border: 2px solid #fff;
        border-top: none;
        border-right: none;
        -webkit-transform: rotate(-45deg);
        -moz-transform: rotate(-45deg);
        -o-transform: rotate(-45deg);
        -ms-transform: rotate(-45deg);
        transform: rotate(-45deg);
      }

      .clabel:hover:after {
        opacity: 0.6;
      }

      input.half-checked[type=checkbox] + .clabel {
        background: #fff;
      }

      input.half-checked[type=checkbox] + .clabel:after {
        opacity: 1;
        content: '';
        position: absolute;
        width: 11px;
        height: 7px;
        background: #0081CC;
        top: 3px;
        left: 3px;
        border: 5px solid #0081CC;
        -webkit-transform: none;
        -moz-transform: none;
        -o-transform: none;
        -ms-transform: none;
        transform: none;
      }

      input[type=checkbox]:checked + label {
        background: #0081CC;
      }

      input[type=checkbox]:checked + label:after {
        opacity: 1.0;
      }

      .tree-options-btn {
        overflow: hidden;
        cursor: pointer;
        margin-left: 5px;
        text-align: center;
        min-width: 20px;
        white-space: nowrap;
        background-repeat: no-repeat;
        background-position: center;
      }

      .tree-more-btn-box {
        display: none;
        position: absolute;
        right: 1px;
        top: 30px;
        background-color: #fff;
        z-index: 20;
        box-shadow: 3px 3px 10px 0 rgba(0, 0, 0, .2);
      }

      .tree-more-btn {
        text-indent: -999px;
      }

      .tree-more-btn-box li {
        padding: 0 10px;
        white-space: nowrap;
        text-align: center;
        color: #565656;
        cursor: pointer;
      }

      .cursor-pointer {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .tree-more-btn-box li:first-child {
        border-radius: 3px 3px 0 0;
      }

      .tree-more-btn-box li:last-child {
        border-radius: 0 0 3px 3px;
      }

      .tree-more-btn-box li:hover {
        background-color: #0081cc;
        color: #fff;
      }
    `
  ]
})
export class NodeComponent implements OnInit {
  checkboxId: string = Math.random().toString().slice(2);
  treeMoreBtn: any = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAECAYAAACHtL/sAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCRDEwRjY5RTJDRTIxMUU4OUMyREI1RjcxNzRFQUIzMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCRDEwRjY5RjJDRTIxMUU4OUMyREI1RjcxNzRFQUIzMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkJEMTBGNjlDMkNFMjExRTg5QzJEQjVGNzE3NEVBQjMxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkJEMTBGNjlEMkNFMjExRTg5QzJEQjVGNzE3NEVBQjMxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8++bDpOgAAAEZJREFUeNpiSUtL82RgYJjLAAHJQLwdyiZKnBFowDMgQxIq8ByIpaBsosSZGFABIwN2gFMcZEAKEL8A4qdQp8IAUeIAAQYAecgVXM6QXfYAAAAASUVORK5CYII=';
  @Input() deepIndex: number;
  @Input() parentNode: any;
  @Input() myIndex: string;
  @Input() root: boolean;
  @Input() keyId: string;
  @Input() keyName: string;
  @Input() keyChild: string;
  @Input() options: any;
  @Input() treeId: string;

  @Output() clickEvent = new EventEmitter();
  @Output() extendEvent = new EventEmitter();
  @Output() checkEvent = new EventEmitter();
  @ViewChild('actionBtnDom') actionBtnDom: ElementRef;
  @ViewChild('treeNode') treeNode: ElementRef;
  iconClsFolder: string;
  iconClsExpand: string;
  iconClsFile: string;
  isFirst: any = true;


  _nodeData: any;
  @Input() set nodeData(v) {

    this.isFirst = false;
    v.treeDom = this.treeNode;
    this._nodeData = v;
    this.init();
  }

  get nodeData() {
    return this._nodeData;
  }

  @Output() nodeChangeEvent = new EventEmitter();


  constructor(private resolver: ComponentFactoryResolver, private router: Router) {
  }

  init() {
    if (this.needShow(this.nodeData)) {
      this.nodeData.show = true;
    }
  }

  private needShow(node: any): any {
    if (node.show) {
      return true;
    }
    if (node.subNode == null || node.subNode.length == 0) {
      return false;
    }
    let result = false;
    for (let n of node.subNode) {
      if (this.needShow(n)) {
        result = true;
      }
    }
    return result;
  }

  ngOnInit(): void {
    this.initClsObj();
  }

  initClsObj() {
    if (this.options && this.options.iconCls) {
      this.iconClsFolder = this.options.iconCls.folder;
      this.iconClsFile = this.options.iconCls.file;
      this.iconClsExpand = this.options.iconCls.expand;
    }
  }

  getFileIcon(): any {
    if (this.iconClsFile && (!this.nodeData[this.keyChild] || this.nodeData[this.keyChild].length == 0)) {
      return this.iconClsFile;
    }
    return '';
  }

  getFolderIcon(): any {
    if (this.iconClsFolder && this.nodeData[this.keyChild] && this.nodeData[this.keyChild].length > 0) {
      return this.iconClsFolder;
    }
    return '';
  }

  getExpandIcon(): any {
    if (this.iconClsExpand && this.nodeData.show) {
      return this.iconClsExpand;
    }
    return '';
  }

  clickNode(event: any, nodeData: any) {
    event.stopPropagation();
    this.clickEvent.emit(this.nodeData);
  }

  changeShow(event: any): any {
    event.stopPropagation();
    if (!(this.nodeData[this.keyChild] == null || this.nodeData[this.keyChild].length > 0)) {
      return;
    }
    this.nodeData.show = !this.nodeData.show;
    this.extendEvent.emit(this.nodeData);
  }

  doNodeFn(option: any) {
    if (option.fn) {
      option.fn(this.nodeData);
    }
  }

  _clickNode(event: any) {
    this.clickEvent.emit(event);
  }

  _extendNode(event: any) {
    this.extendEvent.emit(event);
  }

  _checkNode(event: any) {
    this.checkEvent.emit(event);
  }

  checkNodeEvent(event: any) {
    event.stopPropagation();
    setTimeout(() => {
      this.checkEvent.emit(this.nodeData);
    }, 1);
  }

  shouwMoreActionBtn(ev: any) {
    ev.stopPropagation();
    ev.preventDefault();
    const target = ev.target;
    target.nextElementSibling.style.display = 'block';
  }

  hideMe(ev: any) {
    ev.target.style.display = 'none';
  }

  hideMoreBtn(ev: any) {
    if (this.actionBtnDom) {
      const btnArr = this.actionBtnDom.nativeElement.children;
      if (btnArr[btnArr.length - 1].className == 'tree-more-btn-box') {
        btnArr[btnArr.length - 1].style.display = 'none';
      }
    }
  }

  // 设置树节点长度
  setNodeWidth(icon: any, deep: any) {
    let nodeWidth: any;
    let icons: number = 25; // 树节点图标个数,默认1图标距离右边距1*25px
    if (icon) {
      icons += 30; // 树节点复选框中间图标宽度
    }
    if (this.options && this.options.actionBtn && !this.options.moreActionBtn) {
      icons += this.options.actionBtn.length * 25;
      nodeWidth = {
        'width': 'calc(100% - ' + icons + 'px - 35px)'
      };
    } else if (this.options && this.options.moreActionBtn) {
      icons += (this.options.actionBtn.length + 1) * 25;
      nodeWidth = {
        'width': 'calc(100% - ' + icons + 'px - 35px)'
      };
    } else {
      nodeWidth = {
        'width': '100%'
      };
    }
    return nodeWidth;
  }

  // 判断按钮是否需要展示 true展示false隐藏
  showActionBtn(btn: any, data: any): boolean {
    if (this.root && btn.rootHide) {
      return false;
    }
    if (btn.belongs) {
      if (_.indexOf(btn.belongs.value, this.nodeData[btn.belongs.key]) == -1) {
        return false;
      }
    }
    return true;
  }
}
