import {
  AfterContentInit, AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import * as _ from 'lodash';
import {Observable} from 'rxjs';

@Component({
  selector: 'dc-list-show',
  template: `
    <div>
      <div class="show-box">
        <span class="show-action-left" (mouseleave)="listActionHout()" (mouseup)="listActionUp('right')"
              (mousedown)="listActionDown('right')" (mouseenter)="listActionHover('right')" *ngIf="listActionFlag"></span>
        <div class="show-ul-outer" #listBoxP>
          <div class="show-ul" #listBox>
            <ng-template ngFor let-item [ngForOf]="data" let-i="index">
              <div class="show-item" [class.no-del]="!canDelete" [title]="item[showKey]" [style.width]="itemWidth + 'px'">
                {{item[showKey] || item[idKey]}}
                <span class="show-item-del" title="Remove" *ngIf="canDelete" (click)="removeItemEvent(item, i, $event)"></span>
              </div>
            </ng-template>
          </div>
        </div>
        <span class="show-action-right" (mouseleave)="listActionHout()" (mouseup)="listActionUp('left')"
              (mousedown)="listActionDown('left')" (mouseenter)="listActionHover('left')" *ngIf="listActionFlag"></span>
      </div>
    </div>
  `,
  styles: [
      `
      .show-box {
        display: flex;
        flex-direction: row;
        height: 25px;
      }

      .show-action-left,
      .show-action-right {
        flex-shrink: 0;
        flex-grow: 0;
        width: 30px;
        height: 25px;
        cursor: pointer;
      }

      .show-action-left {
        margin-right: 10px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAALCAYAAACzkJeoAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAAHdJREFUGJV1ziEOAjEABMC5SxMMFscvTtSRYO4BBDSfIPcJHBZB8CBrEDwAwSeQWCw5VE1T1s5ms01KSSUTHEIF5rggtgUs8USEjA12uGGWmwFTnLAu9wPOWNVetdji+g8/2GDAt0QYsUePd4k5d3R41BBeWOD4A9jUEkm0prjHAAAAAElFTkSuQmCC) no-repeat center center transparent;
      }

      .show-action-left:hover {
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAALCAYAAACzkJeoAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAAHdJREFUGJV1ziEOwkAABMBpc0kNFtdfIOpIMDyAgOYTDR6Nq60g+PIBBA8ghE9UYrGkqDOXY+1sNls4PmVSoQsZqDGgKRNY4YUGIhZoccM8NgNmOGOb7gdcsMm9KrHH9R9+sMMB3xRhwglrvFOMuWOBRw5hxBL9D9PvEXfEIYOZAAAAAElFTkSuQmCC) no-repeat center center transparent;
      }

      .show-action-right {
        margin-left: 10px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAALCAYAAACzkJeoAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAAHlJREFUGJVtz6EKwnAUhfHfxqJ1be9hE3yHKcbFRYM+hQ8g+AYD678YBqsGX8JotRiEFYVx2Vc/7jnnZimlM/b4CORoMaCak7DEA+s5CSVuOCCLEgqc0GFRxJ4fG+Tx8s8VTZRfHLHFexr7wg79dADcUeMZX7lgFQWMdzcTKv3OMggAAAAASUVORK5CYII=) no-repeat center center transparent;
      }

      .show-action-right:hover {
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAALCAYAAACzkJeoAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAAHpJREFUGJVtzyEKwgAYhuFnY3HV5j1sgnfYxGhcNMwDmD2AsBsInmBBsIp4iUWrZWFgcTB+9taX//u+P3F6XXBAL5CiwgPLOQkrvLGZk7BAixpJlJDhjCvyLPb8KZHGy5Eb9lEOOGKL7zT2gx3u0wHwRIEuvtJgHQX8AHJSEliW6yLRAAAAAElFTkSuQmCC) no-repeat center center transparent;
      }

      .show-ul-outer {
        flex: 1;
        position: relative;
        overflow: hidden;
      }

      .show-ul {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 14px;
        position: absolute;
      }

      .show-item {
        position: relative;
        height: 25px;
        line-height: 22px;
        color: #333;
        flex-shrink: 0;
        flex-grow: 0;
        background: #fff;
        text-align: left;
        padding: 0 20px 0 6px;
        border: 1px solid #0081cc;
        margin-right: 20px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        border-radius: 3px;
      }

      .show-item.no-del {
        padding: 0 6px;
      }

      .show-item-del {
        position: absolute;
        right: 6px;
        width: 10px;
        top: 0;
        height: 25px;
        cursor: pointer;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAAG1JREFUCJlNzrENwlAMhOGPF6bwGq9nCcIcoUAiFRPQZAuKvCXSIabIIojGEbnG1v2W7w611oYJi79OGEqCOY0NzJi6iFjxRsM3jy9YuoiANcETD7yg7F7dccO4RRxzaThnqU9m9gXDDsjZ4/oD2aAYLP0YveEAAAAASUVORK5CYII=) no-repeat center transparent;
      }
    `
  ]
})
export class ListShowComponent implements OnInit, AfterViewInit {


  _data: Array<any>;
  @Input() set data(v) {
    this._data = _.cloneDeep(v);
  }

  get data() {
    return this._data;
  }

  @Input() itemWidth = 80;
  @Input() showKey = 'name';
  @Input() idKey = 'id';
  @Input() canDelete: boolean;
  listActionFlag = false;
  @Output() removeItemEmit: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('listBox') listBox: ElementRef;
  @ViewChild('listBoxP') listBoxP: ElementRef;
  hoverMoveTimer: any;
  resizeEvent: any;

  constructor() {
  }


  ngOnInit() {
    this.resizeEvent = Observable.fromEvent(window, 'resize').subscribe(event => {
      this.calcIsShowAction();
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.calcIsShowAction();
    }, 10);
  }

  removeItemEvent(item: any, index: number, ev: any) {
    this.data.splice(index, 1);
    this.removeItemEmit.emit(item);
    setTimeout(() => {
      this.calcIsShowAction();
    }, 10);
    setTimeout(() => {
      this.isResetPostion();
    }, 20);
  }

  removeItems(items: Array<any>) {
    for (let i = 0; i < items.length; i++) {
      this.removeItem(items[i], true);
    }
    setTimeout(() => {
      this.calcIsShowAction();
    }, 10);
    setTimeout(() => {
      this.isResetPostion();
    }, 20);
  }

  removeItem(item: any, unRecount?: boolean) {
    if (!item) {
      return;
    }
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i][this.idKey] == item[this.idKey]) {
        this.data.splice(i, 1);
      }
    }
    if (!unRecount) {
      setTimeout(() => {
        this.calcIsShowAction();
      }, 10);
      setTimeout(() => {
        this.isResetPostion();
      }, 20);
    }
  }

  addItem(item: any, unRecount?: boolean) {
    this.data.push(_.cloneDeep(item));
    if (!unRecount) {
      setTimeout(() => {
        this.calcIsShowAction();
      }, 10);
      setTimeout(() => {
        this.showLastItem();
      }, 20);
    }
  }

  addItems(items: Array<any>) {
    for (let i = 0; i < items.length; i++) {
      this.addItem(items[i], true);
    }
    setTimeout(() => {
      this.calcIsShowAction();
    }, 10);
    setTimeout(() => {
      this.showLastItem();
    }, 20);
  }

  getData() {
    return _.cloneDeep(this.data);
  }

  isResetPostion() {
    if (!this.listBox || !this.listBoxP) {
      return false;
    }
    const listUl = this.listBox.nativeElement;
    const left = listUl.offsetLeft;
    const l = this.data.length;
    const ulWidth = l * this.itemWidth + l * 20;
    const ulPWidth = this.listBoxP.nativeElement.offsetWidth;
    if (left < 0) {
      if (ulWidth + this.itemWidth <= ulPWidth) {
        this.listBox.nativeElement.style.left = '0px';
      } else {
        this.listBox.nativeElement.style.left = left + this.itemWidth + 20 + 'px';
      }
    }
    if (ulWidth - Math.abs(left) < ulPWidth) {
    }
  }

  showLastItem() {
    if (!this.listBox || !this.listBoxP) {
      return false;
    }
    const l = this.data.length;
    const ulWidth = l * this.itemWidth + l * 20;
    const ulPWidth = this.listBoxP.nativeElement.offsetWidth;
    if (ulWidth > ulPWidth) {
      this.listBox.nativeElement.style.left = -(ulWidth - ulPWidth) + 'px';
    }
  }

  calcIsShowAction() {
    if (!this.listBox || !this.listBoxP) {
      return false;
    }
    const l = this.data.length;
    const ulWidth = l * this.itemWidth + l * 20;
    const ulPWidth = this.listBoxP.nativeElement.offsetWidth;
    if (ulWidth > ulPWidth) {
      this.listActionFlag = true;
    } else {
      this.listActionFlag = false;
    }
  }

  listActionHout() {
    if (this.hoverMoveTimer) {
      clearInterval(this.hoverMoveTimer);
      this.hoverMoveTimer = null;
    }
  }

  listActionHover(offset: string) {
    if (this.hoverMoveTimer) {
      clearInterval(this.hoverMoveTimer);
      this.hoverMoveTimer = null;
    }
    this.hoverMoveTimer = setInterval(() => {
      this.listUlMove(offset, 2);
    }, 10);
  }

  listActionDown(offset: string) {
    if (this.hoverMoveTimer) {
      clearInterval(this.hoverMoveTimer);
      this.hoverMoveTimer = null;
    }
    this.hoverMoveTimer = setInterval(() => {
      this.listUlMove(offset, 6);
    }, 10);
  }

  listActionUp(offset: string) {
    if (this.hoverMoveTimer) {
      clearInterval(this.hoverMoveTimer);
      this.hoverMoveTimer = null;
    }
    this.hoverMoveTimer = setInterval(() => {
      this.listUlMove(offset, 1);
    }, 10);
  }

  listUlMove(offset: string, step: number) {
    const listUl = this.listBox.nativeElement;
    const left = listUl.offsetLeft;
    const l = this.data.length;
    const ulWidth = l * this.itemWidth + l * 20;
    const ulPWidth = this.listBoxP.nativeElement.offsetWidth;
    let leftRes = 0;
    if (offset === 'left') {
      if (ulWidth - Math.abs(left) <= ulPWidth) {
        leftRes = left;
      } else {
        if (ulWidth - Math.abs(left) - step <= ulPWidth) {
          leftRes = -(ulWidth - ulPWidth);
        } else {
          leftRes = left - step;
        }
      }
    } else if (offset === 'right') {
      if (left >= 0) {
        leftRes = 0;
      } else {
        if (left + step >= 0) {
          leftRes = 0;
        } else {
          leftRes = left + step;
        }
      }
    }
    listUl.style.left = leftRes + 'px';
  }
}
