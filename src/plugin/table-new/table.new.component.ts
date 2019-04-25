import {
  Component, Input, Output, EventEmitter, ContentChildren, OnInit, TemplateRef, ViewChild, HostListener, ElementRef, OnDestroy,
  ContentChild, AfterViewInit, ChangeDetectorRef
} from '@angular/core';
import * as _ from 'lodash';
import {TableHeaderClass, TableOptionsClass} from './table.type';
import {ColumnNewComponent} from './column.new.component';
import {TipService} from '../tip/tip.service';

@Component({
  selector: 'dc-table-new',
  template: `
    <div class="table-box">
      <div #tableHead class="table-head" [style.padding-right]="calcTheadPadding()">
        <div *ngIf="options && options.checkbox" class="table-head-th table-checkbox">
          <dc-checkbox *ngIf="options?.multiple && !options?.hideAllCheck" [checkModel]="allCheck"
                       (checkboxChangeEvent)="allCheckEvent($event)"></dc-checkbox>
        </div>
        <div *ngIf="options && options.showIndex" class="table-head-th table-index">
          <span>序号</span>
        </div>
        <div class="table-head-th" *ngFor="let header of headers;let i = index;" [title]="header.hideTitle?'':header.title"
             [style.width]="header.width" [style.min-width]="header.width"
             [style.flex-grow]="header.flex" [style.text-align]="header.alignTh">
          <div class="table-head-th-inner">
            <span *ngIf="header.isGroup && !header.hideHeaderGroup" (click)="expandAll(header, $event)" class="table-expand"
                  [class.table-expanded]="expandAllFlag"></span>
            <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{header.title}}</span>
            <span class="table-filter-icon" [class.has-filter]="header.filter?.hasFilter" *ngIf="header.filter"
                  (click)="showFilterDrop(i, $event)"></span>
            <div *ngIf="header.canSort" class="table-th-sort" (click)="sort(header)"
                 [ngClass]="{'asc':nowSort.field==header.field && nowSort.sort=='asc','desc':nowSort.field==header.field && nowSort.sort=='desc'}">
            </div>
            <div class="table-filter-drop" *ngIf="header.filter" [class.filter-date-drop]="header.filter.type === 'date'"
                 [class.filter-radio-drop]="header.filter.type === 'radio'" [class.show-filter-drop]="filterDrop && filterDrop[i]?.show"
                 (click)="$event.stopPropagation()" [style.left]="dropLeft + 'px'" [class.offset-left]="header.filter.offset == 'left'"
                 [class.offset-right]="header.filter.offset == 'right'">
              <div style="padding: 5px 10px; font-weight: normal;">
                <ng-container [ngTemplateOutlet]="filterTemplate"
                              [ngTemplateOutletContext]="{$implicit: {header: header, index: i, filter: filterDrop[i]}}"></ng-container>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div *ngIf="!options?.loading && datas && datas.length > 0" class="table-body"
           [style.max-height]="options && calcBodyHeight(options.maxHeight)"
           [style.min-height]="options && calcBodyHeight(options.minHeight)">
        <ng-container [ngTemplateOutlet]="tableBodyTemplate"
                      [ngTemplateOutletContext]="{$implicit: datas}"></ng-container>
      </div>
      <div *ngIf="(!datas || datas.length == 0) && !options?.loading" class="table-body"
           [style.max-height]="options && calcBodyHeight(options.maxHeight)"
           [style.min-height]="options && calcBodyHeight(options.minHeight)">
        <div style="text-align: center; height: 80px; line-height: 80px; font-size: 14px;">暂无数据</div>
      </div>
      <div *ngIf="options?.loading && (datas || datas.length == 0)" class="table-body"
           [style.max-height]="options && calcBodyHeight(options.maxHeight)"
           [style.min-height]="options && calcBodyHeight(options.minHeight)">
        <div style="text-align: center; height: 80px; line-height: 80px; font-size: 14px;">Loading......</div>
      </div>
    </div>
    <ng-template #filterTemplate let-data>
      <div *ngIf="data.header.filter.type === 'radio'" class="filter-box" title="">
        <div style="overflow: auto; max-height: 150px;" [style.max-height]="data.header.filter.option?.maxHeight">
          <dc-radio (checked)="filterRadioCheckEvent($event, data.header)" [radioData]="data.header.filter?.optionList || []"
                    [options]="data.header.filter?.option" [defaultData]="data.header.filter?.defaultRadio"></dc-radio>
        </div>
        <!--<ul style="overflow: auto; max-height: 150px;" [style.max-height]="data.header.filter.option?.maxHeight">
          <ng-container *ngFor="let list of data.header.filter.optionList;">
            <li>
              <dc-checkbox [checkModel]="list"
                           [options]="{text: (list[data.header.filter.option?.filterKey] || 'name'), width: '100%'}"
                           (checkboxChangeEvent)="filterCheckItemEvent($event)"></dc-checkbox>
            </li>
          </ng-container>
        </ul>-->
        <div style="display: flex; justify-content: center; height: 40px; border-top: 1px solid #ccc; margin-top: 5px;">
          <dc-button (click)="clearRadioCheckOption($event, data.header, data.header.filter.optionList)"
                     style="margin: 8px 15px 0 0;" [text]="'清除'" [type]="2"></dc-button>
          <dc-button (click)="sendRadioCheckOption($event, data.header, data.header.filter.optionList)" style="margin-top: 8px;"
                     [text]="'确定'"></dc-button>
        </div>
      </div>
      <div *ngIf="data.header.filter.type === 'text'" class="filter-box" title="">
        <!--<dc-input (dcKeyenter)=""></dc-input>-->
        <input type="text" (keyup.enter)="clickFilter($event, data.header, data.index)" [(ngModel)]="data.filter.searchModel"
               (ngModelChange)="checkEmpty($event, data.header, data.index)" [placeholder]="data.header.filter?.placeholder || '请输入筛选内容'">
        <i [hidden]="!data.filter.searchModel" class="clear-input-value" (click)="clearValue($event, data.filter, data.header)"></i>
      </div>
      <div *ngIf="data.header.filter.type === 'date'" class="filter-box" title="">
        <ng-template [ngIf]="data.header.filter.isCross">
          <div>
            <div class="flex-box" style="margin-bottom: 5px;">
              <span style="margin-right: 5px;">开始</span>
              <dc-date-picker [options]="data.header.filter.option"
                              (dateChangeEvent)="dateChangeEvent($event, data.header.filter, 'start')"></dc-date-picker>
            </div>
            <div class="flex-box">
              <span style="margin-right: 5px;">结束</span>
              <dc-date-picker [options]="data.header.filter.option"
                              (dateChangeEvent)="dateChangeEvent($event, data.header.filter, 'end')"></dc-date-picker>
            </div>
            <div style="display: flex; justify-content: center; height: 40px; border-top: 1px solid #ccc; margin-top: 5px;">
              <dc-button [text]="'确认'" (click)="sendDateCheckEvent($event, data.header.filter, data.header)" [type]="1"
                         style="margin-top: 8px;"></dc-button>
            </div>
          </div>
        </ng-template>
        <ng-template [ngIf]="!data.header.filter.isCross">
          <div>
            <div class="flex-box" style="margin-bottom: 5px;">
              <dc-date-picker [options]="data.header.filter.option"
                              (dateChangeEvent)="dateChangeEvent($event, data.header.filter)"></dc-date-picker>
            </div>
            <div style="display: flex; justify-content: center; height: 40px; border-top: 1px solid #ccc; margin-top: 5px;">
              <dc-button [text]="'确认'" (click)="sendDateCheckEvent($event, data.header.filter, data.header)" [type]="1"
                         style="margin-top: 8px;"></dc-button>
            </div>
          </div>
        </ng-template>
      </div>
      <div *ngIf="data.header.filter.type === 'checkList'" class="filter-box" title="">
        <ul style="overflow: auto; max-height: 150px;" [style.max-height]="data.header.filter.option?.maxHeight">
          <li>
            <dc-checkbox [checkModel]="data.header.filter.filterAllCheck"
                         [options]="{text: '全选', width: '100%'}" (checkboxChangeEvent)="filterCheckAllEvent($event)"></dc-checkbox>
          </li>
          <ng-container *ngFor="let list of data.header.filter.optionList;">
            <li>
              <dc-checkbox [checkModel]="list"
                           [options]="{text: (list[data.header.filter.option?.filterKey] || 'name'), width: '100%'}"
                           (checkboxChangeEvent)="filterCheckItemEvent($event)"></dc-checkbox>
            </li>
          </ng-container>
        </ul>
        <div style="display: flex; justify-content: center; height: 40px; border-top: 1px solid #ccc; margin-top: 5px;">
          <dc-button (click)="sendCheckOption($event, data.header, data.header.filter.optionList)" style="margin-top: 8px;"
                     [text]="'确定'"></dc-button>
        </div>
      </div>
    </ng-template>
    <ng-template #tableBodyTemplate let-rows>
      <ng-template ngFor let-row [ngForOf]="rows" let-i="index">
        <div class="table-body-tr" [class.table-body-tr-checked]="row.checkModel?.checked">
          <div *ngIf="options && options.checkbox && options.multiple" class="table-body-td table-checkbox">
            <dc-checkbox [checkModel]="row?.checkModel" [options]="row?.checkOption"
                         (checkboxChangeEvent)="checkBoxChange($event, row)"></dc-checkbox>
          </div>
          <div *ngIf="options && options.checkbox && !options.multiple" class="table-body-td table-radiobox">
            <label class="radioLabel" [class.radioDisable]="row?.readonly">
              <input type="radio" [disabled]="row?.readonly" [checked]="row?.checkModel?.checked" (change)="raDioChange($event, row)"
                     name="radio_{{radioName}}">
              <div class="simulation"></div>
            </label>
          </div>
          <div *ngIf="options && options.showIndex" class="table-body-td table-index">
            {{i - 0 + 1 }}
          </div>
          <ng-template ngFor let-header [ngForOf]="headers">
            <div *ngIf="!header.isGroup" [class.overShow]="header.overShow" class="table-body-td" [style.width]="header.width"
                 [style.min-width]="header.width" [style.flex-grow]="header.flex" [style.text-align]="header.alignTd"
                 [style.padding-left]="calcPaddingLeft(header, row)">
              <ng-container [ngTemplateOutlet]="cloumnTemplate"
                            [ngTemplateOutletContext]="{$implicit: {d: row, h: header, i: i}}"></ng-container>
            </div>
            <div *ngIf="header.isGroup" [class.overShow]="header.overShow" class="table-body-td" [style.width]="header.width"
                 [style.min-width]="header.width" [style.flex-grow]="header.flex" [style.text-align]="header.alignTd"
                 [style.padding-left]="calcPaddingLeft(header, row)">
              <span *ngIf="row.isParent" class="table-expand" [class.table-expanded]="row.expand"
                    (click)="expandItem(header, row, $event)"></span>
              <ng-container [ngTemplateOutlet]="cloumnTemplate"
                            [ngTemplateOutletContext]="{$implicit: {d: row, h: header}}"></ng-container>
            </div>
          </ng-template>
        </div>
        <ng-container *ngIf="row.children && row.expand" [ngTemplateOutlet]="tableBodyTemplate"
                      [ngTemplateOutletContext]="{$implicit: row.children}"></ng-container>
      </ng-template>
    </ng-template>
  `,
  styles: [`
    * {
      margin: 0;
      padding: 0;
    }

    ul, li {
      list-style: none;
    }

    .flex-box {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .table-box {
      position: relative;
    }

    .table-expand {
      cursor: pointer;
      display: inline-block;
      width: 20px;
      flex: 0 0 auto;
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpBRjI2RjgxNDJCNDYxMUU4QUIxNkRENDdDRTFGOURBRiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpBRjI2RjgxNTJCNDYxMUU4QUIxNkRENDdDRTFGOURBRiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkFGMjZGODEyMkI0NjExRThBQjE2REQ0N0NFMUY5REFGIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkFGMjZGODEzMkI0NjExRThBQjE2REQ0N0NFMUY5REFGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+bQubIwAAAFxJREFUeNpiDImI8WRgYJgLxJIMhMFzIE5mIkEDA1TdXCZcGlYvX4xTIxMDGYB+mljw+QFdLDQyFlUTTABZA7oY/f1Etqbn2CRw+QcIXoA0pYAYRFryFJT2AAIMAFsOFXDcTQR2AAAAAElFTkSuQmCC") no-repeat left center transparent;
    }

    .table-head-th-inner .table-expand {
      height: 20px;
    }

    .table-expanded {
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2OUQ2NjIwMTJCNDYxMUU4OTQyOUNGRTMyODY0NTA2NyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2OUQ2NjIwMjJCNDYxMUU4OTQyOUNGRTMyODY0NTA2NyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjY5RDY2MUZGMkI0NjExRTg5NDI5Q0ZFMzI4NjQ1MDY3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjY5RDY2MjAwMkI0NjExRTg5NDI5Q0ZFMzI4NjQ1MDY3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Fve+rwAAAFRJREFUeNpiDImI8WRgYJgLxJIMhMFzIE5mIkEDA1TdXCYSNMA1MjGQAeiniQXGWL18MUHFoZGxqJpgAoPLT2Rrek6inhcgTSkgBpEanoLSHkCAAQDBsw17IO7pLwAAAABJRU5ErkJggg==") no-repeat left center transparent;
    }

    .table-box * {
      box-sizing: border-box;
    }

    .table-box .table-checkbox,
    .table-box .table-radiobox {
      width: 30px;
      min-width: 30px;
    }

    .table-radiobox {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .table-box .table-index {
      width: 40px;
      min-width: 40px;
      justify-content: center;
    }

    .table-head, .table-body-tr {
      width: 100%;
      display: flex;
    }

    .table-head {
      background-color: #fff;
      border-bottom: 1px solid #ccc;
    }

    .table-body {
      min-width: 100px;
      overflow-y: scroll;
      overflow-x: hidden;
    }

    .table-head-th, .table-body-td {
      flex-grow: 0;
      height: 50px;
      line-height: 50px;
      padding-left: 5px;
      font-size: 14px;
      color: #3A3E55;
      white-space: nowrap;
      display: flex;
    }

    .table-head-th {
      background-color: #fff;
      border-left: 2px solid #fff;
      align-items: center;
      font-weight: bold;
    }

    .table-head-th-inner {
      white-space: nowrap;
      display: flex;
      position: relative;
      align-items: center;
      width: 100%;
    }

    .table-th-sort {
      position: relative;
      background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAMBAMAAACtsOGuAAAAHlBMVEUAAABmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmbpCqcMAAAACXRSTlMA5sZkORkGnJnb+QAcAAAAMElEQVQI12NgYDZgYGDwnMLAwCo5MYAhaeZMNYbOmTNnMCBA5cyZ08ESYCVgxWBtAGv8DCictG4/AAAAAElFTkSuQmCC') no-repeat center center;
      width: 8px;
      margin-left: 5px;
      flex: 0 0 auto;
      cursor: pointer;
      margin-right: 20px;
      height: 20px;
    }

    .table-th-sort.asc {
      background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAFBAMAAACKv7BmAAAAG1BMVEUAAABmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZ8aTmeAAAACHRSTlMA5MaZYzkYBjL+0/MAAAAhSURBVAjXY2BgcWBgYIhoZWBgk2hMYCjq6FBnsOjoaAYAMaEFlaDQ04sAAAAASUVORK5CYII=') no-repeat center center;
    }

    .table-th-sort.desc {
      background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAFBAMAAACKv7BmAAAAG1BMVEUAAABmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZ8aTmeAAAACHRSTlMA58acZjkbBtcF5e8AAAAhSURBVAjXY7Do6GhmKOroUGdgk2hMYGCIaGVgYGBxYAAAWCUFlY5P/qEAAAAASUVORK5CYII=') no-repeat center center;
    }

    .table-filter-icon {
      position: relative;
      background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAOBAMAAAAGUYvhAAAAKlBMVEUAAABmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZY/DOeAAAADXRSTlMA7hHexqWBXTwhA65Xbt8TvwAAAEBJREFUCNdjiL0LAgEMyiDqsgIDB4i+wcDAkAukE4D0krt3rywA0pyydyUZQKD2bgGY5r3LgJfmkWWAAG0GBAAA/oQb9Q1/UEkAAAAASUVORK5CYII=') no-repeat left bottom;
      width: 13px;
      height: 14px;
      cursor: pointer;
      top: 1px;
      font-size: 12px;
      color: #666;
      font-weight: normal;
      flex: 0 0 auto;
      margin-left: 5px;
    }

    .has-filter {
      background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAOCAYAAAD0f5bSAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgV2luZG93cyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2QjVCMDc1RDQ4RkQxMUU4QkVBOTgyOUExQkY4MDU0MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2QjVCMDc1RTQ4RkQxMUU4QkVBOTgyOUExQkY4MDU0MyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZCNUIwNzVCNDhGRDExRThCRUE5ODI5QTFCRjgwNTQzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjZCNUIwNzVDNDhGRDExRThCRUE5ODI5QTFCRjgwNTQzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Z/aSswAAAIpJREFUeNpiZGg8s5SBgSGKgXiwjAlIZALxAyI1gNRlgTR9AuJoIP5LQMNfqLqPTFCBY0DcQkBTC1QdAxOSYDMQH8eh4ThUngFd019ogHxC0/AJKv4XmyaYRzPRxLLQA4oRGOTYnPMfRQ0aYGIgAwy8pnAgfkWqplVArAvEq7FJMv7//59k5wEEGACgyx6ML12vzAAAAABJRU5ErkJggg==') no-repeat left bottom;
    }

    .table-filter-drop {
      position: absolute;
      z-index: 10;
      top: 40px;
      width: 150px;
      background: #fff;
      max-height: 0;
      visibility: hidden;
      margin-left: -75px;
    }

    .table-filter-drop.offset-left {
      margin-left: -150px;
    }

    .table-filter-drop.offset-right {
      margin-left: 0;
    }

    .table-filter-drop.filter-date-drop {
      width: 200px;
      margin-left: -100px;
    }

    .table-filter-drop.filter-date-drop.offset-left {
      margin-left: -200px;
    }

    .table-filter-drop.filter-radio-drop {
      width: 250px;
    }

    .table-filter-drop.show-filter-drop {
      box-shadow: 0 0 2px 1px #ccc;
      border-radius: 2px;
      max-height: none;
      visibility: visible;
    }

    .table-head .table-head-th:first-child {
      border-left: none;
    }

    .table-body .table-body-tr:nth-child(odd) {
      background-color: #f8f8f8;
    }

    .table-body .table-body-tr:nth-child(even) {
      background-color: #ffffff;
    }

    .table-box .table-body .table-body-tr:hover,
    .table-box .table-body .table-body-tr-checked {
      background-color: #edf0f5;
    }

    .table-body-td {
      padding-left: 7px;
      padding-right: 5px;
      border-bottom: 1px solid #ccc;
      overflow: hidden;
    }

    .table-body-td.overShow {
      overflow: visible;
    }

    :host /deep/ .table-body-td dc-table-column-new {
      overflow: hidden;
    }

    :host /deep/ .table-body-td.overShow dc-table-column-new {
      overflow: visible;
    }

    :host /deep/ .table-body-td.overShow dc-table-column-new .table-font {
      overflow: visible;
    }

    .filter-box {
      line-height: normal;
      position: relative;
    }

    .filter-box input[type=text],
    .filter-box input[type=number] {
      height: 30px;
      line-height: 30px;
      border: solid 1px #ccc;
      padding: 0 30px 0 10px;
      margin: 0;
      background: #fff;
      transition: none;
      font-weight: normal;
      color: #666;
      border-radius: 4px;
      font-size: 12px;
      width: 100%;
    }

    .filter-box input:focus {
      border-color: #2BB1FF
    }

    .clear-input-value {
      position: absolute;
      right: 8px;
      top: 0;
      cursor: pointer;
      width: 12px;
      height: 30px;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAAOVJREFUKJF90DFKA1EQBuAvj2Cu8MBqe8FokedeQb2A6WzU0uN4gxTbxkM8CKKSfqvAXsAi2lj4dlkh5Icp5p9/Zv6ZSdM0Ck7whDucFW6LFV7wDdNSOMUac/9xVeIet9iFMvmQeIw5XjELeOzFdV2LMQ6qGKO6rvv0HA8By55p21ZKSYxRjFFKSdu2403LKS77rOs6OWcpJZBz1nXduOEiHPF9CD8Bb2PPKSU552HT+CZsg78/g6qqBhu9vaqqxg2rSdM0M+TyhWP4xCJgjxu8HxF/4Br7/ugdEp6xwVeJTeEWReMX1Y9FK/4RDOgAAAAASUVORK5CYII=) no-repeat center center transparent;
    }

    .clear-input-value:hover {
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAAOtJREFUKJF90b1NAzEcBfBfriCVm2vR3S2ABFXYAViADACUjMMGWQCGQIoQWJngrLTXWBSBIhRxooBCnuTCz++9/4dHMUYFJ3jALc4Kt8AMT/iCUTGc4hkXDuMdN1hWJfmYWHl7wbjC/VbcdZ0Qwk4VQtB13fZ6jrsK0y0zDIO2bYUQhBA0TWMYhv1K01GMcVXa2qW2bWu9XkspyTnvG1bVkb4P4bvC29/0vu+llDRN82smLCqbPYO6rvV9L+cs5yylpK7rfcNsFGMc47Vs4RgiJhVWuLb5nP/wgSt7Qy9xiUfM8VnOvHCTovEDCGVJpA/ldQoAAAAASUVORK5CYII=) no-repeat center center transparent;
    }

    dc-checkbox {
      display: flex;
      align-items: center;
    }

    .table-radiobox .radioLabel {
      font-size: 12px;
      cursor: pointer;
      display: inline-block;
    }

    .simulation {
      width: 13px;
      height: 13px;
      border: 1px solid #cdcdcd;
      border-radius: 50%;
      vertical-align: middle;
      margin-right: 5px;
      position: relative;
    }

    .simulation:after {
      content: '';
      width: 6px;
      height: 6px;
      background: #0081cc;
      border-radius: 50%;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      opacity: 0;
    }

    label.radioDisable .simulation {
      opacity: .4 !important;
    }

    input[type='radio'] {
      vertical-align: middle;
      display: none;
    }

    .radioLabel:hover .simulation {
      border-color: #0081cc;
      opacity: 0.5;
    }

    .radioLabel:hover .simulation:after {
      opacity: .5;
    }

    .radioLabel.radioDisable:hover .simulation {
      border-color: #cdcdcd;
    }

    .radioLabel.radioDisable:hover .simulation:after {
      opacity: 0;
    }

    .radioLabel input[type='radio']:checked + .simulation,
    .radioLabel:hover input[type='radio']:checked + .simulation {
      border-color: #0081cc;
      opacity: 1;
    }

    .radioLabel input[type='radio']:checked + .simulation:after,
    .radioLabel:hover input[type='radio']:checked + .simulation:after {
      opacity: 1;
    }

    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track,
    ::-webkit-scrollbar-thumb {
      border-radius: 999px;
      border: 0 solid transparent;
    }

    ::-webkit-scrollbar-thumb {
      min-height: 20px;
      box-shadow: 0 0 0 5px rgba(0, 0, 0, .5) inset;
      /*box-shadow: 0 0 0 15px rgba(0, 0, 0, .5) inset;*/
      opacity: 0.2;
    }

    ::-webkit-scrollbar-corner {
      background: transparent;
    }
  `]
})

export class TableNewComponent implements OnInit, AfterViewInit {
  radioName = Math.random().toString();
  nowSort: any = {};
  dropLeft: number;
  filterDrop: Array<any>;
  allCheck: any = {
    checked: false,
  };
  allCheckFlag: boolean;
  expandAllFlag: boolean = false;
  defaultShowFilterDropIndex: number = -1;
  @ContentChild(TemplateRef) cloumnTemplate: TemplateRef<ColumnNewComponent>;
  @Input() options: TableOptionsClass;
  _headers: TableHeaderClass[];
  @Input() set headers(v: TableHeaderClass[]) {
    this._headers = _.cloneDeep(v || []);
    this.filterDrop = [];
    for (let i = 0; i < this.headers.length; i++) {
      let temp: any = {
        show: false
      };
      if (this.headers[i].filter) {
        if (this.headers[i].filter.type == 'text') {
          temp.searchModel = this.headers[i].filter.defaultText == null ? '' :
            this.headers[i].filter.defaultText;

          if (this.headers[i].filter.defaultText &&
            this.headers[i].filter.defaultText.trim().length > 0) {
            this.headers[i].filter.hasFilter = true;
          }
          if (this.headers[i].filter.showFilterDrop) {
            this.defaultShowFilterDropIndex = i;
          }
        } else if (this.headers[i].filter.type == 'checkList') {
          let allCheckFlag = true;
          for (let j = 0; j < this.headers[i].filter.optionList.length; j++) {
            this.headers[i].filter.optionList[j].index = i;
            if (!this.headers[i].filter.optionList[j].checked) {
              allCheckFlag = false;
            }
          }
          this.headers[i].filter.filterAllCheck = {
            checked: allCheckFlag,
            header: this.headers[i]
          };
        } else if (this.headers[i].filter.type == 'radio') {
          const defaultRadio: any = this.headers[i].filter.defaultRadio || null;
          for (let j = 0; j < this.headers[i].filter.optionList.length; j++) {
            const theI: any = this.headers[i].filter.optionList[j];
            if (defaultRadio && defaultRadio['id'] == theI['id']) {
              theI.checked = true;
              this.headers[i].filter.hasFilter = true;
            } else {
              theI.checked = false;
            }
          }
        }
      }
      if (this.headers[i].canSort && this.headers[i].defaultSort) {
        this.nowSort.field = this.headers[i].field;
        this.nowSort.sort = this.headers[i].defaultSort;
      }
      this.filterDrop.push(temp);
    }
  }

  get headers() {
    return this._headers;
  }

  _datas: Array<any>;
  @Input() set datas(v) {
    if (!v) {
      v = [];
    }
    let temp = _.cloneDeep(v);
    this.allCheckFlag = true;
    this.initDatas(temp);
    this._datas = temp;
  }

  get datas() {
    return this._datas;
  }

  @Output() checkEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() radioEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() expandAllEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() expandItemEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() sortEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() filterToggleEvent: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('tableHead') tableHead: ElementRef;

  constructor(private tipService: TipService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.defaultShowFilterDropIndex !== -1) {
        let index = 0;
        if (this.options && this.options.checkbox) {
          index++;
        }
        if (this.options && this.options.showIndex) {
          index++;
        }
        // this.tableHead.nativeElement
        const head = this.tableHead;
        const box = head.nativeElement.children[this.defaultShowFilterDropIndex + index];
        let filterIcon = box.getElementsByClassName('table-filter-icon');
        if (filterIcon && filterIcon.length > 0) {
          filterIcon = filterIcon[0];
        }
        setTimeout(() => {
          this.showFilterDrop(this.defaultShowFilterDropIndex, {target: filterIcon});
        }, 100);
      }
    }, 10);
  }

  initAllCheckStatus(checked: boolean, source?: Array<any>) {
    this.allCheck.checked = checked;
    const tmpArr = source || this.datas;
    if (tmpArr && tmpArr.length > 0) {
      for (let i = 0; i < tmpArr.length; i++) {
        const dataI = tmpArr[i];
        if (dataI.checkModel && !dataI.readonly) {
          dataI.checkModel.checked = checked;
        }
        if (dataI.children && dataI.children.length > 0) {
          this.initAllCheckStatus(checked, dataI.children);
        }
      }
    }
    this.cdr.detectChanges();
  }

  calcTheadPadding() {
    let userAgent: any = navigator.userAgent;
    let isIE: boolean = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; //判断是否IE<11浏览器
    let isEdge: boolean = userAgent.indexOf('Edge') > -1 && !isIE; //判断是否IE的Edge浏览器
    let isIE11: boolean = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
    let isFF: boolean = userAgent.indexOf('Firefox') > -1;
    if (isIE || isEdge || isIE11 || isFF) {
      return '18px';
    } else {
      return '8px';
    }
  }

  calcBodyHeight(height?: string) {
    let temp: any = height;
    if (!height) {
      return '';
    }
    if (temp.indexOf('px') != -1) {
      temp = parseInt(temp.slice(0, temp.indexOf('px')));
    }
    if (temp - 40 <= 0) {
      return temp + 'px';
    } else {
      return (temp - 40) + 'px';
    }
  }

  deleteDefaultFilter(filed: string) {
    if (!this.headers || !filed) {
      return;
    }
    for (let i = 0; i < this.headers.length; i++) {
      const theI = this.headers[i];
      if (theI.field == filed) {
        if (theI.filter.type == 'text') {
          if (theI.filter.defaultText) {
            delete theI.filter.defaultText;
          }
          this.filterDrop[i].searchModel = '';
          theI.filter.hasFilter = false;
          break;
        } else if (theI.filter.type == 'checkList') {
          theI.filter.hasFilter = false;
          for (let j = 0; j < theI.filter.optionList.length; j++) {
            theI.filter.optionList[j].index = i;
            theI.filter.optionList[j].checked = true;
          }
          theI.filter.filterAllCheck = {
            checked: true,
            header: this.headers[i]
          };
        }
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(ev: any) {
    this.hideFilterDrop();
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
      if (this.nowSort.sort) {
        this.datas.sort((a: any, b: any) => {
          let result = this.nowSort.sort === 'asc' ? a[this.nowSort.field] > b[this.nowSort.field] : b[this.nowSort.field] > a[this.nowSort.field];
          return result ? 1 : 0;
        });
      }
    }
  }

  hideFilterDrop() {
    let index;
    for (let i = 0; i < this.filterDrop.length; i++) {
      if (this.filterDrop[i].show) {
        index = i;
      }
      this.filterDrop[i].show = false;
    }
    if (index !== undefined) {
      this.filterToggleEvent.emit({
        index: index,
        showFilter: false
      });
    }
  }

  filterCheckAllEvent(ev: any) {
    let listArr = ev.header.filter.optionList;
    for (let i = 0; i < listArr.length; i++) {
      listArr[i].checked = ev.checked;
    }
  }

  filterRadioCheckEvent(ev: any, header: any) {
    let list: Array<any> = [];
    if (header.filter) {
      if (header.filter.optionList) {
        list = header.filter.optionList;
      }
    }
    for (const item of list) {
      if (ev.id == item.id) {
        item.checked = true;
      } else {
        item.checked = false;
      }
    }
  }

  filterCheckItemEvent(ev: any) {
    if (!ev.checked) {
      this.headers[ev.index].filter.filterAllCheck.checked = false;
    } else {
      let list = this.headers[ev.index].filter.optionList;
      let flag = true;
      for (let i = 0; i < list.length; i++) {
        if (!list[i].checked) {
          flag = false;
          break;
        }
      }
      if (!flag) {
        this.headers[ev.index].filter.filterAllCheck.checked = false;
      } else {
        this.headers[ev.index].filter.filterAllCheck.checked = true;
      }
    }
  }

  showFilterDrop(index: number, ev: any) {
    if (ev.stopPropagation) {
      ev.stopPropagation();
    }
    this.dropLeft = ev.target.offsetLeft;
    if (this.filterDrop[index] && this.filterDrop[index].show) {
      this.filterDrop[index].show = false;
    } else {
      for (let i = 0; i < this.filterDrop.length; i++) {
        this.filterDrop[i].show = false;
      }
      this.filterDrop[index].show = true;
    }
    if (this.filterDrop[index].searchModel !== undefined) {
      let sibling = ev.target.nextElementSibling;
      while (!sibling.classList.contains('table-filter-drop')) {
        sibling = sibling.nextElementSibling;
      }
      setTimeout(() => {
        let inputs = sibling.getElementsByTagName('input');
        inputs && inputs.length > 0 && inputs[0].focus();
      }, 10);
    }
    this.filterToggleEvent.emit({
      index: index,
      showFilter: this.filterDrop[index].show
    });
  }

  clickFilter(ev: any, header: any, index: number) {
    let val = _.trim(ev.target.value);
    const execute = () => {
      if (header.filter.fn && val) {
        header.filter.fn(val);
      }
      if (val) {
        header.filter.hasFilter = true;
      } else {
        header.filter.hasFilter = false;
      }
      ev.target.blur();
      this.hideFilterDrop();
    };
    if (header.filter.selfCheck) {
      const filterPromise = header.filter.selfCheck(val);
      filterPromise.then((res: boolean) => {
        if (res) {
          execute();
        }
      });
    } else {
      execute();
    }
  }

  checkEmpty(ev: any, header: any, index?: number) {
    let val = _.trim(ev);
    if (val == '' && header.filter.fn) {
      header.filter.fn(val);
      header.filter.hasFilter = false;
    }
  }

  calcPaddingLeft(header: any, row: any) {
    // header.isGroup && (row.deep*20 + 7) + 'px'
    if (header.isGroup) {
      if (row.isParent) {
        return (row.deep * 20 + 7) + 'px';
      } else {
        return (row.deep * 20 + 27) + 'px';
      }
    } else {
      return '7px';
    }
  }

  clearRadioCheckOption(ev: any, header: any, list: any) {
    for (let i = 0; i < list.length; i++) {
      list[i].checked = false;
    }
  }

  sendRadioCheckOption(ev: any, header: any, list: any) {
    let res: any = null;
    if (header.filter.fn) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].checked) {
          res = list[i];
          break;
        }
      }
      header.filter.fn(res);
    }
    if (res) {
      header.filter.hasFilter = true;
    } else {
      header.filter.hasFilter = false;
    }
    this.hideFilterDrop();
  }

  sendCheckOption(ev: any, header: any, list: any) {
    let res: Array<any> = [];
    if (header.filter.fn) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].checked) {
          res.push(list[i]);
        }
      }
      header.filter.fn(res);
    }
    if (res.length === list.length) {
      header.filter.hasFilter = false;
    } else {
      header.filter.hasFilter = true;
    }
    this.hideFilterDrop();
  }


  insertData(datas: Array<any>, parent?: any, index?: number) {
    let parentChildren;
    if (parent) {
      if (!parent.children) {
        parent.children = [];
        parent.isParent = true;
      }
      if (!parent.expanded) {
        parent.expanded = true;
        parent.expand = true;
      } else {
        if (!parent.expand) {
          parent.expand = true;
        }
      }
      parentChildren = parent.children;
    } else {
      parentChildren = this.datas;
    }
    this.initDatas(datas, parent);
    if (index !== undefined) {
      parentChildren.splice(index, 0, ...datas);
    } else {
      for (let i = 0; i < datas.length; i++) {
        parentChildren.push(datas[i]);
      }
    }
  }

  deleteDataByKey(key: string, val: any) {
    let item = this.findItemByKey(key, val);
    if (!item) {
      return false;
    }
    let parent = this.findParentByKey(key, val);
    if (parent) {
      parent = parent.children;
    } else {
      parent = this.datas;
    }
    for (let i = 0; i < parent.length; i++) {
      if (parent[i][key] == val) {
        parent.splice(i, 1);
        break;
      }
    }
  }

  updateDataByKey(key: string, val: any, data: any) {
    let item = this.findItemByKey(key, val);
    if (!item || _.isEmpty(data)) {
      return false;
    }
    for (let d in data) {
      if (d !== 'children') {
        item[d] = data[d];
      }
    }
  }

  checkedDataByIndex(index: number, checked: boolean) {
    this.datas[index].checked = checked;
    this.datas[index].checkModel.checked = checked;
    let allCheckFlag = true;
    let readonlyL = 0;
    for (let i = 0; i < this.datas.length; i++) {
      const dataI = this.datas[i];
      if (dataI.readonly) {
        readonlyL++;
      } else {
        if (!dataI.checkModel || !dataI.checkModel.checked) {
          allCheckFlag = false;
        }
      }
    }
    if (readonlyL == this.datas.length - 1) {
      allCheckFlag = false;
    }
    this.allCheck.checked = allCheckFlag;
  }

  initDatas(datas: any, parent?: any) {
    const checked = this.allCheck.checked;
    let readonlyL = 0;
    for (let i = 0; i < datas.length; i++) {
      if (datas[i].readonly) {
        readonlyL++;
        datas[i].checkModel = {
          checked: false,
          index: i,
        };
      } else {
        if (!datas[i].checked) {
          this.allCheckFlag = false;
        }
        datas[i].checkModel = {
          checked: datas[i].checked === undefined ? checked : datas[i].checked,
          index: i,
        };
      }
      datas[i].checkOption = {
        disabled: datas[i].readonly
      };
      if (parent) {
        datas[i].deep = parent.deep + 1;
      } else {
        datas[i].deep = 0;
      }
      if (datas[i].children && datas[i].children.length > 0) {
        if (this.expandAllFlag) {
          datas[i].expand = true;
        }
        datas[i].expanded = true;
        this.initDatas(datas[i].children, datas[i]);
      }
    }
    if (this.allCheckFlag && datas && datas.length > 0 && readonlyL !== datas.length && this.options && this.options.checkbox) {
      this.allCheck.checked = true;
    } else {
      this.allCheck.checked = false;
    }
  }

  expandAll(header: any, ev: any) {
    let target = ev.target;
    if (header.expand) {
      this.expandAllFlag = false;
      header.expand = false;
    } else {
      this.expandAllFlag = true;
      header.expand = true;
    }
    this.expandAllEvent.emit({
      expand: header.expand,
      header: header,
    });
  }

  expandItem(header: any, data: any, ev: any) {
    let flag = true;
    if (data.expanded) {
      flag = false;
    } else {
      data.expanded = true;
    }
    if (data.expand) {
      data.expand = false;
    } else {
      data.expand = true;
    }
    flag && this.expandItemEvent.emit({
      expand: data.expand,
      header: header,
      parent: data,
    });
  }

  checkRows(datas: any, check: boolean) {
    for (let i = 0; i < datas.length; i++) {
      const dataI = datas[i];
      if (!dataI.readonly) {
        dataI.checkModel.checked = check;
      }
      if (dataI.children && dataI.children.length > 0) {
        this.checkRows(dataI.children, check);
      }
    }
  }

  deepGetAllChecked(source: Array<any>, result: Array<any>) {
    for (let i = 0; i < source.length; i++) {
      const dataI = source[i];
      if (dataI.checkModel.checked && !dataI.readonly) {
        result.push(dataI);
      }
      if (dataI.children && dataI.children.length > 0) {
        this.deepGetAllChecked(dataI.children, result);
      }
    }
  }

  allCheckEvent(ev: any) {
    this.checkRows(this.datas, ev.checked);
    const checkedArr: Array<any> = [];
    if (ev.checked) {
      this.deepGetAllChecked(this.datas, checkedArr);
    }
    this.checkEvent.emit({
      type: 'all',
      data: this.datas,
      checked: _.cloneDeep(checkedArr),
    });
  }

  deepCheckBoxChange(checkedArr: Array<any>, source: Array<any>, flag: any) {
    for (let i = 0; i < source.length; i++) {
      const dataI = source[i];
      if (!dataI.checkModel.checked && !dataI.readonly) {
        flag.allCheck = false;
      } else if (dataI.checkModel.checked && !dataI.readonly) {
        checkedArr.push(dataI);
      }
      const keyId = (this.options && this.options.keyId) || 'id';
      if (dataI.children && dataI.children.length > 0) {
        this.deepCheckBoxChange(checkedArr, dataI.children, flag);
      }
    }
  }

  deepUnCheck(source: Array<any>, expRow: any) {
    const keyId = (this.options && this.options.keyId) || 'id';
    for (let i = 0; i < source.length; i++) {
      const dataI = source[i];
      if (!dataI.readonly && dataI[keyId] != expRow[keyId]) {
        dataI.checkModel.checked = false;
      }
      if (dataI.children && dataI.children.length > 0) {
        this.deepUnCheck(dataI.children, expRow);
      }
    }
  }

  checkBoxChange(ev: any, row: any) {
    if (this.options && this.options.multiple) {
      const flag = {
        allCheck: true
      };
      const checkedArr: Array<any> = [];
      this.deepCheckBoxChange(checkedArr, this.datas, flag);
      if (flag.allCheck) {
        this.allCheck.checked = true;
      } else {
        this.allCheck.checked = false;
      }
      this.checkEvent.emit({
        type: 'single',
        data: row,
        checked: _.cloneDeep(checkedArr),
      });
    } else {
      let checkedItem: any = null;
      if (ev.checked) {
        checkedItem = row;
      }
      this.deepUnCheck(this.datas, row);
      this.checkEvent.emit({
        type: 'single',
        data: row,
        checked: _.cloneDeep(checkedItem)
      });
    }
  }

  private _findItemByKey(key: string, val: any, datas: Array<any>): any {
    for (let i = 0; i < datas.length; i++) {
      if (datas[i][key] == val) {
        return datas[i];
      } else {
        if (datas[i].children && datas[i].children.length > 0) {
          const res: any = this._findItemByKey(key, val, datas[i].children);
          if (res) {
            return res;
          }
        }
      }
    }
  }

  private _findParentsByItem(result: Array<any>, key: string, val: any, datas: Array<any>) {
    for (let i = 0; i < datas.length; i++) {
      let theI = datas[i];
      if (theI[key] == val) {
        result.push(theI);
        return theI;
      }
      if (theI.children && theI.children.length > 0) {
        let res: any = this._findParentsByItem(result, key, val, theI.children);
        if (res) {
          result.push(theI);
          return res;
        }
      }
    }
  }

  private _findParentByKey(key: string, val: any, datas: Array<any>, parent?: any) {
    for (let i = 0; i < datas.length; i++) {
      let theI = datas[i];
      if (theI[key] == val) {
        return parent;
      }
      if (theI.children && theI.children.length > 0) {
        let res: any = this._findParentByKey(key, val, theI.children, theI);
        if (res) {
          return res;
        }
      }
    }
  }

  findParentsByKey(key: string, val: any) {
    let result: any = [];
    this._findParentsByItem(result, key, val, this.datas);
    return result;
  }

  findParentByKey(key: string, val: any) {
    return this._findParentByKey(key, val, this.datas);
  }

  findItemByKey(key: string, val: any) {
    if (this.datas && this.datas.length > 0) {
      return this._findItemByKey(key, val, this.datas);
    } else {
      return null;
    }
  }

  getCheckedsItem() {
    let result: Array<any> = [];
    if (!this.datas) {
      return result;
    }
    this.getCheckedsItemByDatas(result, this.datas);
    return result;
  }

  getCheckedsItemByDatas(result: Array<any>, source: Array<any>) {
    for (let i = 0; i < source.length; i++) {
      let theI = source[i];
      if (theI.checkModel && theI.checkModel.checked) {
        result.push(theI);
      }
      if (theI.children && theI.children.length > 0) {
        this.getCheckedsItemByDatas(result, theI.children);
      }
    }
  }

  toggleItemByItem(item: any) {
    if (item.isParent) { // 是否有子节点
      if (item.expanded) { // 是否展开过
        if (!item.expand) { // 是否展开状态
          item.expand = true;
        } else {
          item.expand = false;
        }
      } else {
        item.expanded = true;
        item.expand = true;
        let header: any;
        for (let i = 0; i < this.headers.length; i++) {
          if (this.headers[i].isGroup) {
            header = this.headers[i];
          }
        }
        this.expandItemEvent.emit({
          expand: item.expand,
          header: header,
          parent: item,
        });
      }
    }
  }

  dateChangeEvent(ev: any, filter: any, type?: string) {
    if (!filter.result) {
      filter.result = {};
    }
    if (type === 'start') {
      filter.result['start'] = ev.date.toString() === 'Invalid Date' ? '' : ev.date;
    } else if (type === 'end') {
      filter.result['end'] = ev.date.toString() === 'Invalid Date' ? '' : ev.date;
    } else {
      filter.result['date'] = ev.date.toString() === 'Invalid Date' ? '' : ev.date;
    }
  }

  checkDate(filter: any): boolean {
    if (filter.result && filter.result['start'] && filter.result['end']) {
      if (new Date(filter.result['end']).getTime() < new Date(filter.result['start']).getTime()) {
        return false;
      }
    }
    return true;
  }

  sendDateCheckEvent(ev: any, filter: any, header: any) {
    let result: any = null;
    let hasFilter = false;
    if (filter.result) {
      result = {};
      if (filter.result.start) {
        hasFilter = true;
        result['start'] = filter.result.start;
      }
      if (filter.result.end) {
        hasFilter = true;
        result['end'] = filter.result.end;
      }
      if (filter.result.date) {
        hasFilter = true;
        result['date'] = filter.result.date;
      }
      if (!this.checkDate(filter)) {
        this.tipService.show({
          type: 'error',
          title: '开始时间不能大于结束时间'
        });
        return false;
      }
    }
    header.filter.hasFilter = hasFilter;
    if (filter.fn) {
      filter.fn(result);
    }
    this.hideFilterDrop();
  }

  raDioChange(ev: any, row: any) {
    this.checkEvent.emit({
      type: 'single',
      data: row,
      checked: _.cloneDeep(row)
    });
  }

  clearValue(ev: any, filter: any, header: any) {
    filter.searchModel = '';
    if (header.filter.fn) {
      header.filter.fn('');
      header.filter.hasFilter = false;
    }
    ev.target.parentElement.children[0].focus();
  }
}
