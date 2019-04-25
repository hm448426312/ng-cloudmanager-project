import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewContainerRef,
  ComponentFactoryResolver,
  ViewChildren,
  QueryList,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RoutesRecognized } from '@angular/router';
import { TabContentDirective } from './tab.directive';
import { Query } from '@angular/compiler/src/core';

@Component({
  selector: 'dc-tab',
  template: `
    <div *ngIf="likeButton" class="display-flex width-100 flex-direction-column">
      <div class="display-flex width-100 tabs2">
        <div *ngFor="let d of tabDatas">
          <div class="title2" (click)="changeTab(d)" [ngClass]="{'active':d.select}">
            <div *ngIf="d.icon" class="icon"><img src="{{d.icon}}"></div>
            <div>{{d.title}}</div>
          </div>
        </div>
      </div>
      <div *ngFor="let c of tabDatas" [hidden]="!c.select">
        <span dcTabContentHost></span>
      </div>
    </div>    
  <div *ngIf="!likeButton" class="display-flex width-100 flex-direction-column">
    <div class="display-flex width-100 tabs">
        <div *ngFor="let d of tabDatas">
            <div class="title" (click)="changeTab(d)" [ngClass]="{'active':d.select}">
                <div *ngIf="d.icon" class="icon"><img src="{{d.icon}}"></div>
                <div>{{d.title}}</div>
                <i *ngIf="d.notify && d.notify>0" [ngStyle]="{'background-color':d.notifyColor}">{{d.notify}}</i>
            </div>
        </div>
    </div>
    <div *ngFor="let c of tabDatas" [hidden]="!c.select">
      <span dcTabContentHost></span>
    </div>
  </div>
  `,
  styles: [
    `.tabs {
      padding: 15px 20px 0;
      border-bottom: solid 1px #d6d6d6
    }
    .tabs2 {
      padding: 15px 20px 0;
    }
    
    .tabs>div {
      margin-right: 70px
    }
    .tabs2>div {
      margin-right: 20px;
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

    .title2 {
      cursor: pointer;
      display: flex;
      position: relative;
      bottom: 0;
      justify-content: center;
      border: solid 1px #e2e2e2;
      font-size: 14px;
      width: 110px;
      border-radius: 2px;
      height: 25px;
      color: #0081cc;
    }
    .title2:hover {
      border: solid 1px #0081cc;
    }
    
    .title.active{
      font-weight: bold;
      color: #333;
      border-bottom: solid 2px #333;
      bottom: -1px;
    }

    .title2.active{
      color: #ffffff;
      background: #0081cc;
      bottom: -1px;
    }
    
    .title>div,.title2>div {
      display: table-cell;
      vertical-align: middle;
    }
    
    .title.active>div,.title2.active>div {
      padding-bottom: 3px
    }
    
    .title>div.icon,.title2>div.icon {
      padding: 0 10px 5px 0
    }
    
    .title>i,.title2>i {
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
    
    .title.active>i,.title2.active>i {
        top: 9px
    }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TabComponent implements AfterViewInit {
  _tabDatas: any;
  @Input() likeButton: boolean;
  @Input() set tabDatas(v) {
    this._tabDatas = v;

  }

  get tabDatas() {
    return this._tabDatas;
  }

  activeInstance: any;
  ref: any;
  @Output() tabChangeEvent = new EventEmitter();
  nowSelectTab: any;
  @ViewChildren(TabContentDirective) tabContents: QueryList<TabContentDirective>;

  constructor(private resolver: ComponentFactoryResolver, private router: Router,
    private changeRef: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    this.init();
  }

  init() {
    if (this.tabDatas == null && this.tabDatas.length == 0) {
      return;
    }

    this.tabContents.map((content, index) => {
      let tab = this.tabDatas[index];
      if (tab.select) {
        tab.loaded = true;
        this.nowSelectTab = tab;
      }
      if (tab.component) {
        let component = this.resolver.resolveComponentFactory(tab.component);
        this.ref = content.viewContainerRef.createComponent(component);
        if (tab.data) {
          let instance = this.ref.instance;
          instance.data = tab.data;
        }
        this.activeInstance = this.ref.instance;
      } else if (tab.url) {
        // let params = tab.params == null ? {} : tab.params;
        // this.router.navigate([tab.url], { queryParams: params });
      }
    });

    if (this.nowSelectTab == null) {
      this.tabDatas[0].select = true;
    }

    this.changeRef.detectChanges();
  }

  /*  ngOnChanges(changes: SimpleChanges) {
	  if (changes.tabDatas && !changes.tabDatas.firstChange) {
		this.init();
	  }
	}*/

  changeTab(tab: any) {
    for (let d of this.tabDatas) {
      d.select = false;
    }
    tab.select = true;
    this.nowSelectTab = tab;
    this.tabChangeEvent.emit(tab);
    if (tab.initFn && this.activeInstance[tab.initFn] && !tab.loaded) {
      this.activeInstance[tab.initFn]();
    }
    tab.loaded = true;
    this.changeRef.detectChanges();
  }
}
