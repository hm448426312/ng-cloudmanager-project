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
import {PinyinService} from '../pinyin.service';
import * as _ from 'lodash';

@Component({
  selector: 'dc-auto-component',
  template: `
    <div class="auto-component-box display-flex width-100 flex-direction-column" [style.max-width]="width">
      <input #autoInput type="text" [(ngModel)]="text" (keydown)="press($event)" (blur)="blur()" (focus)="focus()"
             (ngModelChange)="changeText()" [class.dc-valid]="text" [class.dc-invalid]="!firstLoad && !text && required">
      <i [hidden]="!text" class="clear-input-value" (click)="clearValue(autoInput)"></i>
      <div class="complete-container width-100 flex-direction-column" *ngIf="showContainer">
        <div *ngFor="let c of show_source" class="source-title" [class.selected]="myIndex==c.index" (click)="selectText(c)"
             [title]="c.title">
          {{c.title}}
        </div>
        <div *ngIf="!show_source || show_source.length == 0"
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

    .auto-component-box {
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
export class AutoCompleteComponent implements OnInit, OnChanges {
  firstLoad = true;
  @ViewChild('autoInput') autoInput: ElementRef;
  showContainer: boolean;
  @Input() required: boolean;
  _source: Array<any>;
  @Input() set source(v: Array<any>) {
    if (!v) {
      this._source = [];
      return;
    }
    this.changeSourceData(_.cloneDeep(v));
  }

  get source() {
    return this._source;
  }

  @Input() width: any;
  @Input() text: string;
  @Output() textChangeEvent = new EventEmitter();
  preText: string;
  myIndex: number;
  show_source: Array<any> = [];
  blurTimer: any = null;

  constructor(private resolver: ComponentFactoryResolver, private router: Router, private pinyinService: PinyinService) {

  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  changeSourceData(source: Array<any>) {
    let temp: Array<any> = [];
    for (let i = 0; i < source.length; i++) {
      temp.push({
        text: source[i],
        index: i
      });
    }
    this._source = temp;
  }

  blur() {
    if (this.blurTimer) {
      clearTimeout(this.blurTimer);
      this.blurTimer = null;
    }
    this.blurTimer = setTimeout(() => {
      this.showContainer = false;
    }, 200);

  }

  focus() {
    this.firstLoad = false;
    this.changeText();
  }

  press(event: any) {
    if (event.key == 'Tab') {
      event.preventDefault();
      for (let i = 0; i < this.show_source.length; i++) {
        if (this.show_source[i].show) {
          this.show_source[i].show = false;
          if (i == this.show_source.length - 1) {
            this.show_source[0].show = true;
          } else {
            this.show_source[i + 1].show = true;
          }
          break;
        }
      }
    }

    if (event.key == 'Enter') {
      for (let _c of this.show_source) {
        if (_c.show) {
          this.text = _c.title;
          this.textChangeEvent.emit(_c);
        }
      }
      this.showContainer = false;
    }
  }

  changeText() {
    if (this.text == null) {
      this.text = '';
    }
    this.show_source = [];
    let tempSource: Array<any> = [];
    if (this.source && this.source.length > 0) {
      tempSource = this.source.filter((item: any) => {
        let _i = item;
        if (item == null) {
          _i = '';
        } else {
          _i = item.text;
        }
        return _i.indexOf(this.text) >= 0 || this.pinyinService.toPinyin(_i).indexOf(this.text) >= 0;
      });
    }
    const tempArr = [];
    for (let i = 0; i < tempSource.length; i++) {
      let _show = i == 0;
      tempArr.push({
        title: tempSource[i] == null ? '' : tempSource[i].text,
        index: tempSource[i].index,
        show: _show
      });
    }
    this.show_source = tempArr;
    this.showContainer = true;
    if (this.blurTimer) {
      clearTimeout(this.blurTimer);
      this.blurTimer = null;
    }
  }

  selectText(t: any) {
    this.text = t.title;
    this.preText = this.text;
    this.myIndex = t.index;
    this.showContainer = false;
    this.textChangeEvent.emit(t);
  }

  clearValue(dom: any) {
    this.text = '';
    dom.focus();
  }

  setInputValid(valid?: boolean) {
    const classList = this.autoInput.nativeElement.classList;
    if (valid) {
      classList.add('dc-valid');
      classList.remove('dc-invalid');
    } else {
      classList.remove('dc-valid');
      classList.add('dc-invalid');
    }
  }
}
