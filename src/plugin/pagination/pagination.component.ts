import {Component, Input, OnInit, Output, EventEmitter, SimpleChanges, ViewChild} from '@angular/core';
import {Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RoutesRecognized} from '@angular/router';

@Component({
  selector: 'dc-pagination',
  template: `
    <div class="display-flex width-100 flex-end" *ngIf="total!=0">

      <div style="line-height:30px;font-size: 12px;color: #666666">
        共{{total}}条
      </div>
      <div class="display-flex" style="margin-left:20px; height: 30px; align-items: center;">
        <div *ngIf="!hideSizeList" style="margin-right: 10px;">
          <dc-select [width]="'80px'" [dropUp]="true" [optionList]="pageSizeList" [currentSelect]="pageSize"
                     (changeValueEvent)="changeLimit($event)"
                     [isReadonly]="true"></dc-select>
        </div>
        <div class="select-box left" (click)="jumpPage('before')" [ngClass]="{'cursor-pointer':nowPage!=1}">
          <div class="img"></div>
        </div>
        <div class="cursor-pointer number" style="margin-left:5px" (click)="jumpPage(1)" [ngClass]="{'selet':nowPage==1}">1</div>
        <div *ngIf="showBeforeDot" style="margin-left:10px">...</div>
        <div class="cursor-pointer number" style="margin-left:10px" *ngFor="let c of showList" (click)="jumpPage(c)"
             [ngClass]="{'selet':nowPage==c}">{{c}}
        </div>
        <div *ngIf="showAfterDot" style="margin-left:10px">...</div>
        <div class="cursor-pointer number" *ngIf="maxPage!=1" style="margin-left:10px" (click)="jumpPage(maxPage)"
             [ngClass]="{'selet':nowPage==maxPage}">{{maxPage}}
        </div>
        <div class="select-box right" style="margin-left:5px" (click)="jumpPage('after')"
             [ngClass]="{'cursor-pointer':nowPage!=maxPage}">
          <div class="img"></div>
        </div>
      </div>
      <div style="margin-left:20px;font-size: 12px;color: #666666;display: flex;flex-direction: row;align-items: center;">
        跳转至
        <input [(ngModel)]="jump" type="number" class="jump-input"
               (keypress)="pressInput($event)">
      </div>
    </div>
  `,
  styles: [
      `
      .jump-input {
        height: 17px;
        width: 50px;
        min-width: 30px;
      }

      input[type=number] {
        border: solid 1px #ccc;
        margin-left: 10px;
        border-radius: 2px;
        height: 22px;
        ime-mode: Disabled;
        -moz-appearance: textfield;
      }

      input[type=number]::-webkit-outer-spin-button,
      input[type=number]::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        margin: 0;
      }

      .select-box {
        display: flex;
        justify-content: center;
      }

      .selet {
        color: #0081cc !important;
        background-color: #edf0f5;
        width: 24px;
        height: 24px;
        border-radius: 2px;
      }

      .number {
        width: auto;
        height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        color: #666666;
        padding: 0 8px;
      }

      .left {
        width: 24px;
        height: 24px
      }

      .right {
        width: 24px;
        height: 24px
      }

      .left .img:hover, .right .img:hover {
        border: 0px;
        background-color: rgba(237, 240, 245, 0.7);
      }

      .right .img {
        width: 24px;
        height: 24px;
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAOCAYAAAD9lDaoAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFQjQ2RTdENjM2NEQxMUU4Qjg0NUFGM0NBNEI1QTU5RiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFQjQ2RTdENzM2NEQxMUU4Qjg0NUFGM0NBNEI1QTU5RiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkVCNDZFN0Q0MzY0RDExRThCODQ1QUYzQ0E0QjVBNTlGIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkVCNDZFN0Q1MzY0RDExRThCODQ1QUYzQ0E0QjVBNTlGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+9VfmmQAAAIFJREFUeNpinDlzJgMQyDFAwCMGLIAJiGWAeD8Uy+FS9BmI3wCxEi6FIEUfgdgNiE/hUsgEpfEqZELSAFN4El0hE5r1IIXu6AqZGPADRmwm8QPxTiA2B+L7QOwACjsmQgqQTcKpAKYIrwKYIl4gFgPie9gUgAALED+BSuKMYIAAAwDYWiOo8+PEvgAAAABJRU5ErkJggg==") no-repeat center;
        border: solid 1px rgba(204, 204, 204, 0.5);
      }

      .left .img {
        width: 24px;
        height: 24px;
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAOCAYAAAD9lDaoAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxNkU3NjQ3MTM2NEUxMUU4OTJDOTk0NTAxMEZCMzdDRSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxNkU3NjQ3MjM2NEUxMUU4OTJDOTk0NTAxMEZCMzdDRSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjE2RTc2NDZGMzY0RTExRTg5MkM5OTQ1MDEwRkIzN0NFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjE2RTc2NDcwMzY0RTExRTg5MkM5OTQ1MDEwRkIzN0NFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+bs19ngAAAHhJREFUeNpinDlzJgMOIAelH7HgUbAfyrZnwqNACYhfA/FnJjwKTgKxOxB/ZCKkACTBREgBTBFeBcgmMULp/9i8ClL0CIgdgPg+EFsA8Q4g5sdmEkzhPWwKkX0HUuiITSF6OGFViC3EkRWKATEvrriDKQSBJwABBgAMTCQOrDj/SAAAAABJRU5ErkJggg==") no-repeat center;
        border: solid 1px rgba(204, 204, 204, 0.5);
      }
    `
  ]
})
export class PaginationComponent implements OnInit {
  @Input() pageSizeList: Array<number> = [20, 30, 50, 100];
  @Input() pageSize: number = 20;
  @Input() pageNum: any;
  @Input() hideSizeList: boolean;
  showAfterDot: boolean = false;
  showBeforeDot: boolean = false;
  maxPage: number;
  jump: number;
  showList: Array<number>;
  nowPageSize: number;

  get total() {
    return this._total;
  }

  _nowPage: any;
  @Input() set nowPage(v) {
    if (this._nowPage != v) {
      this._nowPage = v;
    }
  }

  get nowPage() {
    return this._nowPage;
  }

  _total: number;
  @Input() set total(v: number) {
    this._total = v;
    this.nowPageSize = this.pageSize;
    this.draw();
  }

  @Output() nowPageChange = new EventEmitter();
  @Output() pageSizeChange = new EventEmitter();
  @Output() paginationEvent = new EventEmitter();

  constructor() {
    this.showList = [];
  }

  ngOnInit(): void {
    // this.draw();
  }

  private draw() {
    this.showList = [];
    this.showBeforeDot = false;
    this.showAfterDot = false;
    if (this.total == 0) return;
    this.maxPage = Math.ceil(this.total / this.nowPageSize);

    if (this.pageNum !== undefined && (this.pageNum === 3 || this.pageNum === 1)) {// 分页中间显示3或1
      if (this.nowPage <= 2) {
        if (this.maxPage <= 3) {
          for (let i = 2; i <= this.maxPage - 1; i++) {
            this.showList.push(i);
          }
        }
        if (this.maxPage > 3) {
          for (let i = 2; i <= 2; i++) {
            this.showList.push(i);
          }
          this.showAfterDot = true;
        }
      } else {
        if (this.nowPage - 1 > 1) {
          if (this.pageNum === 3) {
            this.showList.push(this.nowPage - 1);
          }
          if (this.nowPage - 1 > 1) {
            this.showBeforeDot = true;
          }
        }
        if (this.nowPage != this.maxPage) {
          this.showList.push(this.nowPage);
        }

        if (this.nowPage + 1 < this.maxPage) {
          if (this.pageNum === 3) {
            this.showList.push(this.nowPage + 1);
          }
          if (this.nowPage + 1 < this.maxPage - 1) {
            this.showAfterDot = true;
          }
        }
      }
    } else {
      if (this.nowPage <= 3) {
        if (this.maxPage <= 6) {
          for (let i = 2; i <= this.maxPage - 1; i++) {
            this.showList.push(i);
          }
        }

        if (this.maxPage > 6) {//6
          for (let i = 2; i <= 5; i++) {
            this.showList.push(i);
          }
          this.showAfterDot = true;
        }
      } else {
        if (this.nowPage - 2 > 1) {
          this.showList.push(this.nowPage - 2);
          if (this.nowPage - 2 > 2) {
            this.showBeforeDot = true;
          }
        }
        if (this.nowPage - 1 > 1) {
          this.showList.push(this.nowPage - 1);
        }
        if (this.nowPage != this.maxPage) {
          this.showList.push(this.nowPage);
        }

        if (this.nowPage + 1 < this.maxPage) {
          this.showList.push(this.nowPage + 1);
        }

        if (this.nowPage + 2 < this.maxPage) {
          this.showList.push(this.nowPage + 2);
          if (this.nowPage + 2 < this.maxPage - 1) {
            this.showAfterDot = true;
          }
        }
      }
    }
  }

  jumpPage(page?: any) {
    if (page == null) {
      this.nowPage = this.jump === 0 ? 1 : this.jump;
    } else {
      if (page == 'before') {
        if (this.nowPage == 1) {
          return;
        }
        this.nowPage = this.nowPage - 1;
      } else if (page == 'after') {
        if (this.nowPage == this.maxPage) {
          return;
        }
        this.nowPage = this.nowPage + 1;
      } else {
        this.nowPage = page;
      }
    }

    if (this.nowPage > this.maxPage) {
      this.nowPage = this.maxPage;
    }

    this.draw();
    this.nowPageChange.emit(this.nowPage);
    this.paginationEvent.emit();
  }

  pressInput(event: any) {
    if (event.key == 'Enter') {
      if (event.target.value !== undefined && event.target.value !== '') {
        this.jumpPage();
        this.jump = null;
      }
    }
    event = event || window.event;
    const keyCode = window.event ? event.keyCode : event.which;
    return keyCode >= 48 && keyCode <= 57 || keyCode === 8;
  }

  changeLimit(limit: number) {
    if (this.nowPageSize === limit) {
      return;
    }
    this.nowPageSize = limit;
    this.nowPage = 1;
    this.draw();
    this.pageSizeChange.emit(limit);
  }

  /*ngOnChanges(changes: SimpleChanges) {
    if (!changes.total.firstChange) {
      this.draw();
    }
  }*/
}
