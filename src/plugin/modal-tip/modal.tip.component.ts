import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import * as _ from 'lodash';

@Component({
  template: `
    <div class="title">
      <div class="tip-type">
        <img [src]="data?.icon || imgBase64">
        <b>{{data?.typeTitle || '确认'}}</b>
      </div>
      <div class="tip-msg">
        <ng-template [ngIf]="judgeMsg(data.msg) === 'array'">
          <div class="tip-msg-list" *ngFor="let list of data.msg">{{list}}</div>
        </ng-template>
        <ng-template [ngIf]="judgeMsg(data.msg) === 'string'">
          {{data.msg}}
        </ng-template>
        <ng-template [ngIf]="!judgeMsg(data.msg)">
          System error.
        </ng-template>
      </div>
    </div>
    <div class="tipBtn">
      <div *ngIf="data && data.button && data.button.length > 0">
        <ng-template ngFor let-btn [ngForOf]="data.button">
          <dc-button [hideTitle]="true" [text]="btn.text" (click)="btnEventClick(btn)" [type]="btn.type || 1"></dc-button>
        </ng-template>
      </div>
      <div *ngIf="!data || !data.button || data.button.length == 0">
        <ng-template ngFor let-btn [ngForOf]="defaultBtn">
          <dc-button [hideTitle]="true" [text]="btn.text" (click)="btnEventClick(btn)" [type]="btn.type || 1"></dc-button>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .title {
      padding: 30px 50px 30px;
      min-height: 125px;
      text-align: center;
      display: block;
      overflow: hidden;
      font-size: 14px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    img {
      margin-right: 15px;
      width: 30px;
      height: 30px;
    }

    .tip-type {
      text-align: left;
      display: flex;
      align-items: center;
      justify-content: left;
    }

    .tip-type b {
      font-size: 18px;
      color: #333;
    }

    .tip-msg {
      white-space: normal;
      word-break: break-all;
      font-size: 14px;
      color: #333;
      line-height: 30px;
      padding-left: 45px;
      margin-top: 5px;
      text-align: left;
      max-height: 200px;
      overflow: auto;
    }
    .tip-msg-list{
      white-space: normal;
      text-indent: 0;
    }

    .tipBtn {
      height: 70px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 10px 0px;
    }

    dc-button:nth-child(2) {
      margin-left: 15px;
    }
  `],
})

export class ModalTipComponent implements OnInit {
  imgBase64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3RjdDQzE3MjMxOTgxMUU4QkE1MEQyQjQ1QkIzQjA3NyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3RjdDQzE3MzMxOTgxMUU4QkE1MEQyQjQ1QkIzQjA3NyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjdGN0NDMTcwMzE5ODExRThCQTUwRDJCNDVCQjNCMDc3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjdGN0NDMTcxMzE5ODExRThCQTUwRDJCNDVCQjNCMDc3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+H4it5gAAAXpJREFUeNpifHmyjIEAUAPiACB2A2ItIBaGir8F4mtAvAuINwDxLXyGMOKxyB6Im4HYloE4cBiIa4H4IDZJJixiHEA8A4j3k2AJA1TtfqheDkIWCQHxPiBOB/mWgXTACNW7D2oWHLAgsbmAeBsQm+MyRcysE4X/6lQ5LqWWULOcgPgbuo8m4rOEDGAONRMl6EARn8xAfZAMNRtuUQuZcUJMnLXALNIHYhsG2gGQ2fogi4IYaA+CmEjMK+QCO5BFGnSwSJ0JqeyiJRBmYqATYIKWwrQGb0EW3aCDRTdZoMW7IzGq8ZRtBKsQkI/W0cFHa0E+ugjER4gpHUgovZEByOyLsFRXA8T/aeCT/9BaF16ogqrf2TSwCGTmAfT6qBCIT1LRkpNQM7E2TkClxFYqVIAgS7yR8yh6yfAWmtRnkhln/6F6ndALAmxF0HcgzoBaeIwES45BLciAtRNwNU7QASiBWENLd38gdgdiTbQG5HUg3gnEGwmVMAABBgBw8kt1MfPG3gAAAABJRU5ErkJggg==`;
  @Input() data: any;
  @Input() handler: any;

  defaultBtn: any[] = [
    {
      text: '取消',
      type: 2
    }, {
      text: '确认',
      type: 1
    }
  ];

  constructor() {
  }

  ngOnInit() {
  }

  judgeMsg(msg: any) {
    if (_.isString(msg)) {
      return 'string';
    } else if (_.isArray(msg)) {
      return 'array';
    } else {
      return '';
    }
  }

  btnEventClick(btn: any) {
    this.handler(btn);
  }
}
