import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit, OnInit,
} from '@angular/core';

@Component({
  selector: 'dc-title',
  template: `
    <div class="display-flex width-100 flex-direction-column">
      <div class="display-flex width-100 tabs">
        <div *ngFor="let d of titleDatas">
          <div class="title" (click)="changeTab(d)" [ngClass]="{'active':d.select}" [style.border-bottom]="d.select && hasBottomLine?'solid 2px #333': ''">
            <div *ngIf="d.icon" class="icon"><img src="{{d.icon}}"></div>
            <div>{{d.title}}</div>
            <i *ngIf="d.notify && d.notify>0" [ngStyle]="{'background-color':d.notifyColor}">{{d.notify}}</i>
          </div>
        </div>
      </div>
    </div>`,
  styles: [
      `.tabs {
      padding: 15px 20px 0;
      border-bottom: solid 1px #d6d6d6
    }

    .tabs > div {
      margin-right: 70px
    }

    .title {
      cursor: pointer;
      display: table;
      position: relative;
      bottom: 0;
      font-size: 18px;
      height: 36px;
      color: #666;
    }

    .title.active {
      font-weight: bold;
      color: #333;
      bottom: -1px;
    }

    .title > div {
      display: table-cell;
      vertical-align: middle;
    }

    .title.active > div {
      padding-bottom: 3px
    }

    .title > div.icon {
      padding: 0 10px 5px 0
    }

    .title > i {
      font-size: 10px;
      font-weight: 400;
      position: absolute;
      left: calc(100% + 7px);
      top: 10px;
      display: block;
      padding: 0 8px;
      line-height: 14px;
      height: 16px;
      color: #fff;
      border-radius: 10px;
      font-style: normal
    }

    .title.active > i {
       top: 9px
    }`
  ]
})

export class TitleComponent implements OnInit {
  _titleDatas: any;
  @Input() set titleDatas(v) {
    this._titleDatas = v;

  }

  get titleDatas() {
    return this._titleDatas;
  }

  @Input() titleOption: any;
  @Input() hasBottomLine: boolean;

  @Output() titleChangeEvent = new EventEmitter();
  nowSelectTab: any;

  constructor() {
  }

  ngOnInit() {
    this.init();
  }

  init() {
    if (this.titleDatas == null && this.titleDatas.length == 0) {
      return;
    }

    if (this.nowSelectTab == null) {
      this.titleDatas[0].select = true;
    }
  }

  selectTitle(tab: any) {
    for (let d of this.titleDatas) {
      d.select = false;
    }
    tab.select = true;
    this.nowSelectTab = tab;
    this.titleChangeEvent.emit(tab);
    tab.loaded = true;
  }

  changeTab(tab: any) {
    if (this.titleOption && this.titleOption.beforeChange) {
      if (this.titleOption.beforeChange(tab)) {
        this.selectTitle(tab);
      }
    } else {
      this.selectTitle(tab);
    }
  }
}
