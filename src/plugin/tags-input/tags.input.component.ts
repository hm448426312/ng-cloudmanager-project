import {Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import {DcTagsOptions} from './tags.option.type';

@Component({
  selector: 'dc-tags-input',
  template: `
    <div class="tags-input-box" (click)="tagsInputFocus($event)" [style.width]="options?.width || '100%'">
      <ul class="tags-input-show clearFix" *ngIf="showList && showList.length > 0">
        <li class="tags-input-show-list" *ngFor="let item of showList; let i = index">
          <span (click)="$event.stopPropagation()">{{item[defaultNameKey]}}</span>
          <img class="tag-remove" title="Remove" (click)="removeTag(item, i)"
               src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1RDQ5NEIzNzI3NTUxMUU4OTgwOEJBMThGREI0Q0E3RCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1RDQ5NEIzODI3NTUxMUU4OTgwOEJBMThGREI0Q0E3RCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjVENDk0QjM1Mjc1NTExRTg5ODA4QkExOEZEQjRDQTdEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjVENDk0QjM2Mjc1NTExRTg5ODA4QkExOEZEQjRDQTdEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+y+qW+gAAAQRJREFUeNqckk9Kw0AYxSfBZdCNzgEStN15keAm2AN0L4pnENx3Xy9gsyn0FgE3XRQkc4Chqxo3uqjvDd+E6Sht8cEPkjffm79f0jSNCnQOHkEJrsRbgTmYgLUvPAlCFZiCM7Wra+EejEFNMw1Cr3+EQp1KTeWDF+AFJOqwEqnVDN7JbE55nqssy/pKftOLVn5g8CZ0rbV92IfoRSp5OcPQ6bpOGWNUURTuv21b50UapOp/+krlnX6diSuR+Mwik8rj9tJau61ye37b9CItEnQO3ffwZg9oAy65opWO2B4R2kqt9ZfDNhqBjz0hjt3GLUfN+P7gGSzBN/gEb+BJxmpf/CPAAIzBSre1IOOtAAAAAElFTkSuQmCC">
        </li>
      </ul>
      <div class="tags-input-content">
        <input #tagsInput class="tags-input-text" type="text" [(ngModel)]="inputValue" (focus)="showDropList($event)"
               (ngModelChange)="tagInputChange()" (click)="showDropList($event)" (keyup.enter)="addTag()" (blur)="hideDropList()"/>
        <ul class="tags-input-drop" *ngIf="dropList && showDropFlag">
          <li class="tags-input-drop-list" *ngFor="let item of (dropList | arrFilter:defaultNameKey:inputValue); let i = index"
              (click)="addTag(item)">{{item[defaultNameKey]}}
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    ul, li {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .clearFix {
      zoom: 1;
    }

    .clearFix:after {
      clear: both;
      height: 0;
      width: 100%;
      overflow: hidden;
      visibility: hidden;
      display: block;
      content: '.';
    }

    .tags-input-box {
      border: 1px solid #ccc;
      padding: 15px;
      position: relative;
    }

    .tags-input-show-list {
      display: inline-block;
      max-width: 150px;
      padding-right: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      position: relative;
      height: 30px;
      line-height: 30px;
      padding-left: 10px;
      border: 1px solid #ccc;
      margin-right: 15px;
    }
    .tags-input-content{
      position: relative;
    }
    .tags-input-text{
      height: 30px;
      line-height: 30px;
      width: 100%;
    }
    .tag-remove{
      margin: 0;
      padding: 0;
      border: none;
      width: 14px;
      height: 14px;
      overflow: hidden;
      cursor: pointer;
      position: absolute;
      right: 5px;
      top: 8px;
    }
    .tags-input-drop{
      position: absolute;
      left: 0;
      top: 29px;
      width: 100%;
      height: auto;
      max-height: 200px;
      overflow: auto;
      border: 1px solid #ccc;
      background: #fff;
    }
    .tags-input-drop-list {
      cursor: pointer;
      width: 100%;
      height: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 30px;
      text-indent: 10px;
    }

    .tags-input-drop-list:hover {
      color: #fff;
      background-color: #0081cc;
    }

  `]
})
export class TagsInputComponent implements OnInit {

  dropList: any = [];
  showList: any = [];
  showDropFlag: boolean = false;
  inputValue: string;
  defaultNameKey: string = 'name';
  defaultCheckedKey: string = 'checked';
  hideDropListTimer: any;
  @Input() options: DcTagsOptions;
  _tagDatas: any;
  @Input() set tagDatas(v) {
    const temp: any[] = _.cloneDeep(v || []);
    let tempShowList: any[] = [];
    let tempDropList: any[] = [];
    for (let i = 0; i < temp.length; i++) {
      let checkKey = 'checked';
      if (this.options && this.options.checkKey) {
        checkKey = this.options.checkKey;
      }
      if (temp[i][checkKey]) {
        tempShowList.push(temp[i]);
      } else {
        tempDropList.push(temp[i]);
      }
    }
    this.dropList = tempDropList;
    this.showList = tempShowList;
    this._tagDatas = temp;
  }

  get tagDatas() {
    return this._tagDatas;
  }

  @ViewChild('tagsInput') tagsInput: ElementRef;

  constructor() {
  }

  ngOnInit() {
    if (this.options && this.options.nameKey) {
      this.defaultNameKey = this.options.nameKey;
    }
    if (this.options && this.options.checkKey) {
      this.defaultCheckedKey = this.options.checkKey;
    }
  }

  tagsInputFocus(ev: any) {
    this.tagsInput.nativeElement.focus();
    ev.stopPropagation();
  }

  tagInputChange() {
    this.showDropFlag = true;
  }

  removeTag(item: any, index: number) {
    item[this.defaultCheckedKey] = false;
    const temp = this.showList.splice(index, 1)[0];
    if (temp.type != 'add') {
      this.dropList.push(temp);
    }
  }

  // input点回车/下拉点击列表，插入到show中
  addTag(selectItem?: any) {
    this.showDropFlag = false;
    let val = _.trim((selectItem && selectItem[this.defaultNameKey]) || this.inputValue);
    if (!val) {
      this.inputValue = '';
      return;
    }
    const dropIndex = _.findIndex(this.dropList, (item: any) => {
      return _.trim(item[this.defaultNameKey]) === val;
    });
    const showIndex = _.findIndex(this.showList, (item: any) => {
      return _.trim(item[this.defaultNameKey]) === val;
    });
    let item: any = {};
    // 在下拉列表中，不在showlist中，则将下拉的移入到showlist中
    if (dropIndex != -1 && showIndex == -1) {
      item = this.dropList.splice(dropIndex, 1)[0];
      item[this.defaultCheckedKey] = true;
      this.showList.push(item);
    } else if (dropIndex != -1 && showIndex != -1) {
      // 在下拉列表中，也在showlist中，则移除下拉列表的数据，不插入
      this.dropList.splice(dropIndex, 1);
    } else if (dropIndex == -1 && showIndex == -1) {
      // 不在下拉列表中，也不在showlist中，则插入数据到showlist中，无ID
      item[this.defaultNameKey] = val;
      item[this.defaultCheckedKey] = true;
      item['type'] = 'add';
      this.showList.push(item);
    }
    this.inputValue = '';
  }

  showDropList(ev: any) {
    if (this.hideDropListTimer) {
      clearTimeout(this.hideDropListTimer);
      this.hideDropListTimer = null;
    }
    ev.stopPropagation();
    this.showDropFlag = true;
  }

  hideDropList() {
    if (this.hideDropListTimer) {
      clearTimeout(this.hideDropListTimer);
      this.hideDropListTimer = null;
    }
    this.hideDropListTimer = setTimeout(() => {
      this.showDropFlag = false;
    }, 300);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(ev: any) {
    this.hideDropList();
  }
  public getCheckedTags(){
    return this.showList;
  }
}
