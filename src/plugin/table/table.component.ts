import {
  Component,
  Input,
  Output,
  EventEmitter,
  ContentChildren,
  OnInit,
  QueryList,
  ContentChild,
  TemplateRef,
  OnChanges,
  SimpleChanges,
  ViewChild,
  HostListener,
  ElementRef,
  OnDestroy,
  Renderer
} from '@angular/core';
import {TableColumnComponent} from './column.component';
import {Observable} from 'rxjs';
import * as _ from 'lodash';
import {DcEventService} from '../broadcast/broadcast.service';

@Component({
  selector: 'dc-table',
  template:
      `
    <table class="table" #table>
      <thead>
      <tr>
        <th *ngIf="checkBox" class="check-box">
          <input *ngIf="!radio" id='hcheckbox{{tableId}}' type='checkbox' [(ngModel)]='allSelect' (ngModelChange)="allSelectCheck()"><label
          *ngIf="!radio" for="hcheckbox{{tableId || ''}}"></label>
        </th>
        <th class="table-title" *ngFor="let header of headers; let j = index"
            title="{{header.hideTitle?'':header.title}}" [style.width]="setWidth(header.width, j)">
          <div class="table-title-th" [ngStyle]="setThCenter(header.isThCenter)">
            <div [ngStyle]="{'border-left':j===0?'none':'solid 0px #ccc'}" class="text-over-flow">{{header.title}}</div>
            <div *ngIf="header.filter" class="table-th-filter" [ngClass]="{'hasFilter':hasFilter[j]}">
              <div class="filterBtn" (click)="showFilterBox($event, header)"></div>
              <ng-container [ngTemplateOutlet]="filterTemplate"
                            [ngTemplateOutletContext]="{$implicit: {header: header,index:j}}"></ng-container>
            </div>
            <div *ngIf="header.canSort" class="table-th-sort" (click)="sort(header)"
                 [ngClass]="{'asc':nowSort.field==header.field && nowSort.sort=='asc','desc':nowSort.field==header.field && nowSort.sort=='desc'}">
            </div>
          </div>
        </th>
      </tr>
      </thead>
      <div *ngIf="!datas || datas.length == 0" class="noDatas" [style.height]="scrollHeight || 'auto'">
        <div style="text-align: center; height: 80px; line-height: 80px; font-size: 14px;">暂无数据</div>
      </div>
      <div *ngIf="datas && datas.length != 0" [style.height]="scrollHeight || 'auto'" #overflowBox>
        <tbody>
        <tr *ngFor="let data of datas; let i = index" [style.background-color]="checks[i]?'#edf0f5':''" [class.bgc]="oddEven">
          <td *ngIf="checkBox">
            <input type='checkbox' id="checkbox{{tableId || ''}}{{i}}" [disabled]="data.readOnly" [(ngModel)]='checks[i]'
                   (ngModelChange)="checkSelect(i)"><label for="checkbox{{tableId || ''}}{{i}}"></label>
          </td>
          <td *ngFor="let header of headers">
            <ng-container [ngTemplateOutlet]="template"
                          [ngTemplateOutletContext]="{$implicit: {d: data, h: header, w: setWidth(header.width)}}"></ng-container>
          </td>
        </tr>
        </tbody>
      </div>
    </table>

    <ng-template #filterTemplate let-data>
      <div *ngIf="data.header.filter.type === 'text'" class="filter-box" [class.offset-left]="data.header.filter.offsetLeft">
        <input type="text" value="" (keyup.enter)="clickFilter($event, data.header,data.index)" [ngModel]="curSearchValue"
               (ngModelChange)="checkEmpty($event,data.header,data.index)" placeholder="请输入筛选内容">
      </div>
      <div *ngIf="data.header.filter.type === 'checkList'" class="filter-box" [class.offset-left]="data.header.filter.offsetLeft">
        <ng-container *ngFor="let option of data.header.filter.optionList; let k = index">
          <input type='checkbox' id="fcheckbox{{tableId || ''}}{{k}}" [(ngModel)]='option.check'
                 (ngModelChange)="checkOption($event, k, data.header)">
          <label for="fcheckbox{{tableId || ''}}{{k}}"></label>
          <span>{{option.name}}</span>
          <br/>
        </ng-container>
        <div>
          <div class="filterSubmit" (click)="sendCheckOption(data.header,data.index)" [ngClass]="{'hasSubmit':hasFilter[data.index]}">确定
          </div>
        </div>
      </div>
    </ng-template>`,
  styles: [
      `
      .canSort {
        cursor: pointer
      }

      .table-title {
        font-size: 14px;
      }

      table {
        border: none;
      }

      table thead, table tbody {
        display: table;
      }

      table > div {
        display: block;
        overflow-x: hidden;
        overflow-y: auto;
      }

      table th {
        color: #333;
        background-color: #fff;
        border-bottom: 1px solid #cccccc;
      }

      table td {
        border-bottom: 1px solid #e2e2e2;
        border-top: none;
      }

      .sort {
        background-image: url(/assets/img/sort.png);
        background-repeat: no-repeat;
        background-position: center;
        width: 20px;
        height: 13px;
        display: inline-block;
      }

      .sort-desc {
        background-image: url(/assets/img/sort.png);
        background-repeat: no-repeat;
        background-position: center;
        width: 20px;
        height: 13px;
        transform: rotate(180deg);
      }

      .table-title-th {
        display: flex;
      }

      .table-title-th > div {
        display: inline-block;
        margin-right: 5px
      }

      .table {
        font-size: 12px;
        color: #666 !important;
      }

      .table th {
        font-size: 14px;
        color: #333 !important;
        line-height: 13px;
      }

      .table-th-sort {
        position: relative;
        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAMBAMAAACtsOGuAAAAHlBMVEUAAABmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmbpCqcMAAAACXRSTlMA5sZkORkGnJnb+QAcAAAAMElEQVQI12NgYDZgYGDwnMLAwCo5MYAhaeZMNYbOmTNnMCBA5cyZ08ESYCVgxWBtAGv8DCictG4/AAAAAElFTkSuQmCC') no-repeat left center;
        width: 8px;
        height: 12px;
        top: 1px;
        cursor: pointer;
      }

      .table-th-sort.asc {
        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAFBAMAAACKv7BmAAAAG1BMVEUAAABmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZ8aTmeAAAACHRSTlMA5MaZYzkYBjL+0/MAAAAhSURBVAjXY2BgcWBgYIhoZWBgk2hMYCjq6FBnsOjoaAYAMaEFlaDQ04sAAAAASUVORK5CYII=') no-repeat left top;
      }

      .table-th-sort.desc {
        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAFBAMAAACKv7BmAAAAG1BMVEUAAABmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZ8aTmeAAAACHRSTlMA58acZjkbBtcF5e8AAAAhSURBVAjXY7Do6GhmKOroUGdgk2hMYGCIaGVgYGBxYAAAWCUFlY5P/qEAAAAASUVORK5CYII=') no-repeat left bottom;
      }

      .table-th-filter {
        position: relative;
        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAOBAMAAAAGUYvhAAAAKlBMVEUAAABmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZY/DOeAAAADXRSTlMA7hHexqWBXTwhA65Xbt8TvwAAAEBJREFUCNdjiL0LAgEMyiDqsgIDB4i+wcDAkAukE4D0krt3rywA0pyydyUZQKD2bgGY5r3LgJfmkWWAAG0GBAAA/oQb9Q1/UEkAAAAASUVORK5CYII=') no-repeat left bottom;
        width: 13px;
        height: 14px;
        top: 1px;
        font-size: 12px;
        color: #666;
        font-weight: normal
      }

      .hasFilter {
        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAOCAYAAAD0f5bSAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgV2luZG93cyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2QjVCMDc1RDQ4RkQxMUU4QkVBOTgyOUExQkY4MDU0MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2QjVCMDc1RTQ4RkQxMUU4QkVBOTgyOUExQkY4MDU0MyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZCNUIwNzVCNDhGRDExRThCRUE5ODI5QTFCRjgwNTQzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjZCNUIwNzVDNDhGRDExRThCRUE5ODI5QTFCRjgwNTQzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Z/aSswAAAIpJREFUeNpiZGg8s5SBgSGKgXiwjAlIZALxAyI1gNRlgTR9AuJoIP5LQMNfqLqPTFCBY0DcQkBTC1QdAxOSYDMQH8eh4ThUngFd019ogHxC0/AJKv4XmyaYRzPRxLLQA4oRGOTYnPMfRQ0aYGIgAwy8pnAgfkWqplVArAvEq7FJMv7//59k5wEEGACgyx6ML12vzAAAAABJRU5ErkJggg==') no-repeat left bottom;
      }

      .noDatas {
        min-width: 100px;
      }

      .filterBtn {
        width: 100%;
        height: 100%;
        display: block;
        cursor: pointer;
      }

      .filter-box {
        position: absolute;
        left: 0;
        top: 20px;
        display: none;
        background: #fff;
        padding: 5px;
        box-shadow: 0px 0px 2px 1px #ccc;
        text-indent: 0;
        border-radius: 2px;
        white-space: nowrap;
        z-index: 10;
      }

      .filter-box.offset-left {
        right: 0;
        left: auto;
      }

      .filter-box > input[type=text] {
        width: 159px;
        height: 26px;
        border: solid 1px #ccc;
        padding: 0;
        margin: 0;
        background: #fff;
        transition: none;
        text-indent: 5px;
        font-size: 14px;
        font-weight: normal;
        color: #666;
        border-radius: 2px;
        font-size: 12px
      }

      .filter-box > input:focus {
        border-color: #0081cc
      }

      .filter-box > span {
        display: inline-block;
        font-size: 14px;
        line-height: 25px;
        text-indent: 7px
      }

      .filter-box > input[type=checkbox] {
        position: relative;
        display: none;
        bottom: -2px;
        cursor: pointer;
      }

      .filterSubmit {
        padding: 0 20px;
        text-align: center;
        margin: 5px auto;
        color: #fff;
        width: 94px;
        height: 26px;
        line-height: 23px;
        font-size: 14px;
        background: #0081cc;
        border-radius: 10px;
        box-shadow: 0px 0px 1px 1px #ccc;
        cursor: pointer;
      }

      .filterSubmit:hover {
        background: #0067a3
      }

      .filterSubmit:active {
        box-shadow: none
      }

      .hasSubmit {
        color: #000000;
        background: #ccc;
        box-shadow: 0px 0px 1px 1px #ccc;
      }

      th.check-box {
        width: 33px;
      }

      .table th,
      .table td {
        text-align: left;
        border-top: none;
        padding: 18px 0 13px;
        text-indent: 20px;
        height: 14px;
        line-height: 14px
      }

      .check-box, td {
        position: relative;
      }

      input[type=checkbox] {
        visibility: hidden;
      }

      .check-box label,
      td label {
        cursor: pointer;
        position: absolute;
        width: 18px;
        height: 18px;
        top: 18px;
        left: 15px;
        background: #fff;
        border: 1px solid #c8c8c8;
        -moz-border-radius: 3px; /* Gecko browsers */
        -webkit-border-radius: 3px; /* Webkit browsers */
        border-radius: 3px; /* W3C syntax */
      }

      .filter-box label {
        display: inline-block;
        position: relative;
        cursor: pointer;
        width: 16px;
        height: 16px;
        top: 10px;
        left: 5px;
        background: #fff;
        border: 1px solid #c8c8c8;
        -moz-border-radius: 3px; /* Gecko browsers */
        -webkit-border-radius: 3px; /* Webkit browsers */
        border-radius: 3px; /* W3C syntax */
      }

      .check-box label:hover,
      .filter-box label:hover,
      td label:hover {
        background: #0081CC;
      }

      .check-box label:after,
      td label:after {
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

      .filter-box label:after {
        opacity: 0;
        content: '';
        position: absolute;
        width: 9px;
        height: 5px;
        background: transparent;
        top: 3px;
        left: 3px;
        border: 2px solid #fff;
        border-top: none;
        border-right: none;
        -webkit-transform: rotate(-45deg);
        -moz-transform: rotate(-45deg);
        -o-transform: rotate(-45deg);
        -ms-transform: rotate(-45deg);
        transform: rotate(-45deg);
      }

      .check-box label:hover::after,
      .filter-box label:hover::after,
      td label:hover::after {
        opacity: 0.6;
      }

      input[type=checkbox]:disabled + label {
        cursor: not-allowed;
        background-color: #f5f5f5;
        opacity: 0.4;
      }

      input[type=checkbox]:disabled + label:hover {
        background: #ffffff;
      }

      input[type=checkbox]:checked + label {
        background: #0081CC;
      }

      input[type=checkbox]:checked + label:after {
        opacity: 1.0;
      }

      tbody tr.bgc:nth-child(odd) {
        background-color: #f8f8f8;
      }

      tbody tr.bgc:nth-child(even) {
        background-color: #ffffff;
      }

      tbody tr:hover {
        background-color: #edf0f5;
      }

      tbody tr.bgc:hover {
        background-color: #edf0f5;
      }
    `
  ]
})

export class TableComponent implements OnInit, OnDestroy {
  @ContentChild(TemplateRef) template: TemplateRef<TableColumnComponent>;
  // @ContentChildren(TableColumnComponent)
  // childCmps: QueryList<TableColumnComponent>;
  @ViewChild('filterTemplate') filterTemplate: any;
  @ViewChild('table') tableContainer: ElementRef;
  @ViewChild('overflowBox') overflowBox: ElementRef;
  @Input() headers: Array<any>;
  @Input() oddEven: any; // 是否奇偶变色
  @Input() isSmall: any; // 表格行高设置
  @Input() tableId: any; // 设置table表格唯一Id
  @Input() radio: boolean; // 是否单选
  @Input() userPersentWidth: boolean = false;
  hasFilter: Array<boolean> = []; // 表格列是否过滤数组
  _datas: any;
  @Input() set datas(v) {
    this.allSelect = false;
    this._datas = v;
    this.setDivWidth();
    this.initCheck();
  }

  get datas() {
    return this._datas;
  }

  @Input() checkBox: boolean = false;
  @Output() sortEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() checkEvent: EventEmitter<any> = new EventEmitter<any>();
  nowSort: any = {};
  allSelect: boolean = false;
  checks: Array<boolean> = [];
  checks_data: any = [];
  currentField: any;
  @Input() scrollHeight: string;
  _parentHidden: boolean;
  curSearchValue: any;

  @Input() set parentHidden(v: boolean) {
    this._parentHidden = v;
    setTimeout(() => this.setDivWidth());
  }

  get parentHidden(): boolean {
    return this._parentHidden;
  }

  initWidth: any;
  resizeEvent: any;
  scrollBarWidth: any = 0;
  showFilter: any = [];
  broadCastPromise: any;

  constructor(private renderer: Renderer, private broadcast: DcEventService) {
  }

  ngOnInit(): void {
    this.broadCastPromise = this.broadcast.on('leftmenu_close').subscribe(event => {
      setTimeout(() => {
        this.setDivWidth();
      }, 100);
    });
    this.setDivWidth();
    this.resizeEvent = Observable.fromEvent(window, 'resize').subscribe(event => {
      this.setDivWidth();
    });
    // this.initCheck();
  }

  ngOnDestroy() {
    this.resizeEvent && this.resizeEvent.unsubscribe();
    this.broadCastPromise && this.broadCastPromise.unsubscribe();
  }

  setWidth(width: any, index?: number) {
    if (this.userPersentWidth) {
      if (width.indexOf('%') <= 0) {
        width = width + '%';
        return width;
      }
    } else {
      if (width && width.indexOf('%') > 0) {
        // if (this.checkBox && index === 0) {
        //   return (parseInt(width) / 100 * this.initWidth) - 30 + 'px';
        // } else {
        let _w;
        if (this.checkBox) {
          _w = this.initWidth - 35;
        } else {
          _w = this.initWidth;
        }
        if (_w < 0) {
          _w = 0;
        }

        return parseInt(width) / 100 * _w + 'px';
        // }
      } else {
        return width;
      }
    }
  }

  setDivWidth() {
    const parent = this.tableContainer.nativeElement.parentNode.parentNode;
    this.initWidth = parent.offsetWidth || this.initWidth;
    if (this.scrollHeight && this.overflowBox) {
      this.renderer.setElementStyle(this.overflowBox.nativeElement, 'width', this.initWidth + 'px');
    }
  }

  private initCheck() {
    this.checks = [];
    for (let d of this.datas) {
      this.checks.push(false);
    }
  }

  allSelectCheck() {
    this.checks = [];
    if (this.radio) {
      return;
    }
    for (let d of this.datas) {
      if (d.readOnly) {
        this.checks.push(false);
      } else {
        this.checks.push(this.allSelect);
      }
    }
    this.sendCheckEvent();
  }

  checkSelect(index: number) {
    if (this.radio) {
      for (let i = 0; i < this.checks.length; i++) {
        if (!this.datas[i].readOnly && i !== index) {
          this.checks[i] = false;
        }
      }
    }
    let allTrue = true;
    for (let i = 0; i < this.checks.length; i++) {
      if (!this.checks[i] && !this.datas[i].readOnly) {
        allTrue = false;
      }
    }

    if (allTrue) {
      this.allSelect = true;
    } else {
      this.allSelect = false;
    }
    this.sendCheckEvent();
  }

  checkOption(event: any, k: any, header: any) {
    header.filter.optionList[k].check = event;
  }

  private sendCheckOption(header: any, index: any) {
    let result: any = header.filter.optionList.filter((item: any) => item.check);
    if (result.length === 0) {
      this.hasFilter[index] = false;
    } else {
      this.hasFilter[index] = true;
    }
    header.filter.fn(result);
  }

  private sendCheckEvent(): any {
    this.checks_data = [];
    for (let i = 0; i < this.datas.length; i++) {
      if (this.checks[i]) {
        this.checks_data.push(this.datas[i]);
      }
    }
    this.checkEvent.emit(this.checks_data);
  }

  sort(header: any) {
    if (!header.canSort) {
      return;
    }
    if (this.nowSort.field == header.field) {
      if (this.nowSort.sort == 'desc') {
        this.nowSort.sort = 'asc';
      } else if (this.nowSort.sort == 'asc') {
        this.nowSort.sort = '';
      } else {
        this.nowSort.sort = 'desc';
      }
    } else {
      this.nowSort.field = header.field;
      this.nowSort.sort = 'desc';
    }
    if (this.sortEvent.observers.length) {
      this.sortEvent.emit(this.nowSort);
    } else {
      this.datas.sort((a: any, b: any) => {
        let result = this.nowSort.sort === 'asc' ? a[this.nowSort.field] > b[this.nowSort.field] : b[this.nowSort.field] > a[this.nowSort.field];
        return result ? 1 : 0;
      });
    }
  }

  showFilterBox(event: any, header: any) {
    this.hideFilter();
    event.stopPropagation();
    event.preventDefault();
    let filterBoxDom = event.target.nextElementSibling;
    filterBoxDom.style.display = 'block';
    let flag = false;
    for (let i = 0; i < this.showFilter.length; i++) {
      if (this.showFilter[i] == filterBoxDom) {
        flag = true;
        break;
      }
    }
    if (!flag) {
      this.showFilter.push(filterBoxDom);
    }
    this.currentField = header.field;
  }

  hideFilter() {
    for (let i = 0; i < this.showFilter.length; i++) {
      this.showFilter[i].style.display = 'none';
    }
    this.showFilter = [];
  }

  clickFilter(event: any, header: any, index?: any) {
    if (event.target.value === '') {
    } else {
      this.hasFilter[index] = true;
      header.filter.fn(_.trim(event.target.value));
    }
    let filterBoxDom = event.target.parentNode;
    filterBoxDom.style.display = 'none';
  }

  checkEmpty(event: any, header: any, index?: number) {
    if (event === '') {
      this.hasFilter[index] = false;
      header.filter.fn(event);
    }
  }

  // 设置th内容居中
  setThCenter(isCenter: boolean) {
    let center: any;
    if (isCenter) {
      center = {
        'display': 'flex',
        'justify-content': 'center'
      };
    }
    return center;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick($event: any) {
    let current = $event.target;
    for (let i = 0; i < this.showFilter.length; i++) {
      if (current.parentNode !== this.showFilter[i] && current !== this.showFilter[i].prevElementSibling && current !== this.showFilter[i])
        this.showFilter[i].style.display = 'none';
    }
  }
}
