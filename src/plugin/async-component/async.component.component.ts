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
  ComponentFactoryResolver, HostListener, ElementRef
} from '@angular/core';
import {Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RoutesRecognized} from '@angular/router';
import {PinyinService} from '../pinyin.service';
import * as _ from 'lodash';

@Component({
  selector: 'dc-async-component',
  template: `
    <div class="async-component-box display-flex width-100 flex-direction-column" [style.max-width]="width">
      <input #asyncInput type="text" [class.dc-valid]="text" [(ngModel)]="text" (click)="$event.stopPropagation()"
             (ngModelChange)="changeText()" (focus)="focus()" [class.dc-invalid]="!firstLoad && !text && required">
      <i [hidden]="!text" class="clear-input-value" (click)="clearValue(asyncInput)"></i>
      <div class="complete-container width-100 flex-direction-column" *ngIf="showContainer">
        <div *ngFor="let c of source" class="source-title" (click)="selectText($event, c)"
             [title]="c.title">
          {{c.title}}
        </div>
        <div *ngIf="!source || source.length == 0"
             style="display: flex;align-items: center;justify-content: center; padding: 10px 0;">
          No Data.
        </div>
      </div>
    </div>
  `,
  styles: [`
    .title.active {
      color: red
    }

    .async-component-box {
      position: relative;
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

    input[type=text] {
      border: solid 1px #ccc;
      height: 30px;
      line-height: 30px;
      padding: 0 30px 0 10px;
      border-radius: 4px;
      transition: none;
      background: none;
      outline: none;
    }

    input[type=text].dc-valid {
      border-color: #3FB992;
    }

    input[type=text].dc-invalid {
      border-color: #FF3B3B;
    }

    input[type=text]:focus {
      border-color: #2BB1FF;
    }

    .title {
      cursor: pointer;
    }

    .complete-container {
      position: absolute;
      top: 28px;
      border: solid 1px #ccc;
      background-color: #ffffff;
      box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, .2);
      z-index: 1100;
      max-height: 200px;
      overflow: auto;
    }

    .source-title {
      max-width: 100%;
      height: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      padding: 0 8px;
    }

    .source-title:hover {
      background-color: #edf0f5;
    }

    .source-title.selected {
      background-color: #0081cc;
      color: #ffffff;
    }

    .source-title.source-title.active {
      color: rebeccapurple;
    }
  `]
})
export class AsyncComponentComponent implements OnInit {

  firstLoad = true;
  @ViewChild('asyncInput') asyncInput: ElementRef;
  showContainer: boolean;
  @Input() text: string;
  @Input() required: boolean;
  asyncTimer: any;
  hideTimer: any;
  @Input() options: {
    asyncFilter: any; // 异步过滤方法
    asyncSpace?: number; // 文本变化请求异步过滤方法时间间隔，默认300ms
  };
  @Input() width: string;
  _source: Array<{
    title: string;
    index?: number;
  }>;
  @Input() set source(v: Array<any>) {
    let temp: Array<any> = [];
    if (v) {
      temp = _.cloneDeep(v);
      for (let i = 0; i < temp.length; i++) {
        temp[i]['index'] = i;
      }
    }
    this._source = temp;
  }

  get source() {
    return this._source;
  }

  @Output() selectItem = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  hideDrop() {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
    this.hideTimer = setTimeout(() => {
      this.showContainer = false;
    }, 100);
  }

  focus() {
    this.firstLoad = false;
    this.changeText();
    // this.showContainer = true;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(ev: any) {
    this.hideDrop();
  }

  selectText(ev: any, item: any) {
    ev.stopPropagation();
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
    this.text = item.title;
    this.selectItem.emit(item);
    this.hideDrop();
  }

  changeText() {
    if (this.asyncTimer) {
      clearTimeout(this.asyncTimer);
      this.asyncTimer = null;
    }
    this.source = [];
    this.asyncTimer = setTimeout(() => {
      const filterPromise = this.options.asyncFilter(this.text);
      filterPromise.then((res: Array<{
        title: string;
        index?: number;
      }>) => {
        this.source = _.cloneDeep(res || []);
        this.showContainer = true;
      }).catch((e: any) => {
        this.source = [];
        this.showContainer = true;
      });
    }, (this.options && this.options.asyncSpace) || 300);
  }

  clearValue(dom: any) {
    this.showContainer = false;
    this.text = '';
    // this.changeText();
    dom.focus();
  }

  setInputValid(valid?: boolean) {
    const classList = this.asyncInput.nativeElement.classList;
    if (valid) {
      classList.add('dc-valid');
      classList.remove('dc-invalid');
    } else {
      classList.remove('dc-valid');
      classList.add('dc-invalid');
    }
  }
}
