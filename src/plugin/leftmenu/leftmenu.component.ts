import {Component, OnDestroy, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RoutesRecognized, ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {DcEventService} from '../broadcast/broadcast.service';

@Component({
  selector: 'dc-left-menu',
  template: `
    <div class="dc-left-menu-container" [ngClass]="{'menuClose':!isOpen}">
      <div class="dc-left-menu">
        <div class="logo" *ngIf="isOpen">中移在线研发云</div>
        <div class="small-logo" *ngIf="!isOpen"></div>
        <div class="scroll">
          <ng-container *ngFor="let menu of menus">
            <div class="menu-item">
              <div class="level level-1" [class.menuActive]="currentMenu===menu && currentSubMenu === undefined"
                   (click)="menuClick($event,menu,1,currentMenu!==menu)"
                   [class.left-arrow]="currentMenu!==menu && menu.children && menu.children.length>0"
                   [class.bottom-arrow]="currentMenu===menu && menu.children && menu.children.length>0">
                <span [ngStyle]="getIconStyle(menu)" [title]="menu.menuName">{{menu.menuName}}</span>
                <!--<div [class.left-arrow]="currentMenu!==menu" [class.bottom-arrow]="currentMenu===menu" *ngIf="menu.children && menu.children.length>0">-->
                <!--<div></div>-->
                <!--</div>-->
              </div>
              <div class="sub-menu" *ngIf="menu.children && menu.children.length>0" [hidden]="currentMenu!==menu || !isOpen">
                <ng-container *ngFor="let submenu of menu.children">
                  <div class="level level-2" [class.menuActive]="currentSubMenu===submenu && currentThreeLevelMenu === undefined"
                       [class.left-arrow]="currentSubMenu===submenu && submenu.children && submenu.children.length>0"
                       [class.bottom-arrow]="currentSubMenu!==submenu && submenu.children && submenu.children.length>0"
                       (click)="menuClick($event,submenu,2)">
                    <span [title]="submenu.menuName">{{submenu.menuName}}</span>
                    <!--<div class="double-arrow" *ngIf="submenu.children && submenu.children.length>0">-->
                    <!--<div></div>-->
                    <!--</div>-->
                  </div>
                </ng-container>
              </div>
            </div>
          </ng-container>
          <div class="third-menu" [hidden]="!(currentThreeLevelMenus && currentThreeLevelMenus.length>0 && currentSubMenu!=undefined)"
               (mouseleave)="currentThreeLevelMenus=undefined">
            <ng-container *ngFor="let threeLevelMenu of currentThreeLevelMenus">
              <div class="level level-3" [class.menuActive]="currentThreeLevelMenu===threeLevelMenu">
                <span (click)="menuClick($event,threeLevelMenu,3)" [title]="threeLevelMenu.menuName">{{threeLevelMenu.menuName}}</span>
              </div>
            </ng-container>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
      `
      .dc-left-menu-container {
        width: 250px;
        height: 100vh;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 1001;
        color: #fff
      }

      .scroll {
        height: calc(100vh - 60px);
        overflow-y: auto;
      }

      .menuClose .scroll {
        overflow: hidden;
      }

      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      ::-webkit-scrollbar-track,
      ::-webkit-scrollbar-thumb {
        border-radius: 999px;
        border: 0 solid transparent;
      }

      ::-webkit-scrollbar-thumb {
        min-height: 20px;
        box-shadow: 0 0 0 5px rgba(255, 255, 255, 0.2) inset;
        opacity: 0.2;
      }

      ::-webkit-scrollbar-corner {
        background: transparent;
      }

      .dc-left-menu-container.menuClose {
        width: 45px;
      }

      .dc-left-menu {
        width: 100%;
        height: 100vh;
        background: #294265;
        padding-bottom: 0;
        margin-bottom: 0;
      }

      .logo {
        width: 100%;
        height: 60px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAA8CAYAAADWibxkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjE2ODFCNTI4RUU5MTFFODk1MEM4ODNERTYzNTU2QTUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjE2ODFCNTE4RUU5MTFFODk1MEM4ODNERTYzNTU2QTUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkQwNDI2MjhGOEVERDExRTg5OTZGREZGOEJBMDRDMDE4IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkQwNDI2MjkwOEVERDExRTg5OTZGREZGOEJBMDRDMDE4Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+vzYjzgAACKdJREFUeNrMW2lsVFUU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) no-repeat center 20px #1d2b40;
        background-position: 40px 15px;
        background-size:30px 27px;
        font-size: 18px;
        font-weight: bolder;
        text-align: center;
        padding: 15px 0 0 40px;
        /*background-size: 40px 30px;*/
      }

      .small-logo {
        width: 100%;
        height: 60px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAA8CAYAAADWibxkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjE2ODFCNTI4RUU5MTFFODk1MEM4ODNERTYzNTU2QTUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjE2ODFCNTE4RUU5MTFFODk1MEM4ODNERTYzNTU2QTUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkQwNDI2MjhGOEVERDExRTg5OTZGREZGOEJBMDRDMDE4IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkQwNDI2MjkwOEVERDExRTg5OTZGREZGOEJBMDRDMDE4Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+vzYjzgAACKdJREFUeNrMW2lsVFUU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) no-repeat center #1d2b40;
        background-size: 70%
      }

      .sub-menu {
        background-color: #172b47;
      }

      .level {
        position: relative;
        height: 45px;
        cursor: pointer;
      }

      .level > span {
        display: block;
        padding-left: 30px;
        margin-left: 30px;
        width: 175px;
        line-height: 45px;
        background-position: left center;
        background-repeat: no-repeat;
        cursor: pointer;
        outline: none;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .level-3 > span {
        width: auto;
        padding-left: 0;
        margin-right: 30px;
      }

      .left-arrow {
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAMCAYAAACulacQAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyQTlERjFCNjMzMzExMUU4OUZBMEFFQURGMURENDQ2RSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyQTlERjFCNzMzMzExMUU4OUZBMEFFQURGMURENDQ2RSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjJBOURGMUI0MzMzMTExRTg5RkEwQUVBREYxREQ0NDZFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjJBOURGMUI1MzMzMTExRTg5RkEwQUVBREYxREQ0NDZFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Aa5FEAAAAHNJREFUeNpi+P//fwIQM2DDTAwMDPpAPJ8BCwBJFgLxAyA+D8QCKLJIxoCMPw/EAjAxdHscgPg+EBtgk2SASoAUODAx4AYC6LoKoPaCjWWBq2Jg6IfSjkD8AeZaA6jqAnT7QcR6qCsxHMcI8hfcGDQAEGAAnjSjbsw43PAAAAAASUVORK5CYII=") no-repeat 210px center;
      }

      .bottom-arrow {
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAHCAYAAAA8sqwkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0OEVGQkU5MjMzMzExMUU4QTQ1OEU5NUJBQURGNDA0NyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0OEVGQkU5MzMzMzExMUU4QTQ1OEU5NUJBQURGNDA0NyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjQ4RUZCRTkwMzMzMTExRThBNDU4RTk1QkFBREY0MDQ3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjQ4RUZCRTkxMzMzMTExRThBNDU4RTk1QkFBREY0MDQ3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+DZoNIQAAAGNJREFUeNpi+P//vwEQrwdiASBmwIEFoGoMmBgYGC5AcT8DbrAeiDeC1SGZAjIhAYvp84G4H8ZHt/Y+1IkwsXqoBgZsGhigis9DNYNs249uIzYPJkBtOo8tIHCFSj2uUAMIMADda+a9w4udRwAAAABJRU5ErkJggg==") no-repeat 210px center;
      }

      .dc-left-menu-container.menuClose .level > span {
        margin-left: 15px;
      }

      .menuClose .level {
        overflow: hidden;
      }

      .level:hover,
      .level.menuActive {
        background-color: #0081cc;
        opacity: 1;
      }

      .level-1 {
        font-weight: bold;
        font-size: 15px;
      }

      .level-2,
      .level-3 {
        opacity: 0.7;
        font-size: 14px;
        font-weight: normal;
      }

      .third-menu {
        position: absolute;
        min-width: 250px;
        max-width: 600px;
        height: 100%;
        left: 250px;
        top: 0;
        background: #172b47;
        z-index: 30000;
        padding: 26px 0;
        overflow: auto;
      }

      .dc-left-menu-container.menuClose .third-menu {
        left: 40px;
      }`
  ]
})
export class LeftMenuComponent implements OnInit {
  isOpen: boolean = true;
  currentMenu: any;

  _menus: any;

  @Input() set menus(v) {
    this._menus = v;
  }

  get menus() {
    return this._menus;
  }

  _selectMenu: any;
  @Input() set selectMenu(v) {
    this._selectMenu = v;
    if (v) {
      this.selectTheMenu(v);
    }
  }

  get selectMenu() {
    return this._selectMenu;
  }

  @Output() menuEvent = new EventEmitter();
  currentSubMenu: any;
  currentThreeLevelMenu: any;
  currentThreeLevelMenus: Array<any>;

  constructor(private broadcast: DcEventService,
              private router: Router,
              private activeRoute: ActivatedRoute) {

  }

  selectTheMenu(menu: any) {
    if (!menu || !this.menus) {
      return;
    }
    let result: Array<any> = [];
    this.findTheMenu(result, menu, this.menus);
    if (result.length > 0) {
      this.setMenuActive(result);
    }
  }

  setMenuActive(menus: Array<any>) {
    for (let i = 0; i < menus.length; i++) {
      if (i == 0) {
        this.currentMenu = menus[i];
        this.currentSubMenu = undefined;
        this.currentThreeLevelMenus = undefined;
      } else if (i == 1) {
        this.currentSubMenu = menus[i];
        this.currentThreeLevelMenu = undefined;
      } else if (i == 2) {
        this.currentThreeLevelMenu = menus[i];
      }
    }
  }

  findTheMenu(result: Array<any>, menu: any, datas: Array<any>) {
    for (let i = 0; i < datas.length; i++) {
      if (datas[i].id == menu.id) {
        result.unshift(datas[i]);
        return true;
      }
      if (datas[i].children && datas[i].children.length > 0) {
        let res = this.findTheMenu(result, menu, datas[i].children);
        if (res) {
          result.unshift(datas[i]);
          return true;
        }
      }
    }
  }

  menuClick(ev: any, menu: any, type: number, isopen?: boolean) {
    if (type == 1) {
      if (isopen === true) {
        this.currentMenu = menu;
      } else {
        this.currentMenu = undefined;
      }
      if (!this.isOpen) {
        this.isOpen = true;
        this.broadcast.broadcast('leftmenu_close', true);
        this.currentMenu = menu;
      }
      this.currentSubMenu = undefined;
      this.currentThreeLevelMenus = undefined;
    } else if (type == 2) {
      if (menu.children && menu.children.length > 0) {
        this.currentSubMenu = menu;
        this.currentThreeLevelMenus = menu.children;
      } else {
        this.currentSubMenu = menu;
        this.currentThreeLevelMenus = undefined;
        this.currentThreeLevelMenu = undefined;
      }
    } else if (type == 3) {
      this.currentThreeLevelMenu = menu;
    }
    if (menu.url) {
      this.menuEvent.emit(menu);
    }
  }

  ngOnInit() {
    if (!this.menus) {
      this.menus = [
        {
          'parentName': null,
          'menuOrder': 1,
          'menuDescribe': '12',
          'icon': {
            'id': 17,
            'iconName': '首页',
            'iconDataBlue': null,
            'iconDataBlueGreen': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAATCAYAAACKsM07AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5NDA1MkNEMjMwQ0UxMUU4OTFFMUVBRjdDNjMzRDA5MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5NDA1MkNEMzMwQ0UxMUU4OTFFMUVBRjdDNjMzRDA5MiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjk0MDUyQ0QwMzBDRTExRTg5MUUxRUFGN0M2MzNEMDkyIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjk0MDUyQ0QxMzBDRTExRTg5MUUxRUFGN0M2MzNEMDkyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+zlXo/AAAAPhJREFUeNrUlDEOwjAMRdMqjAh6BSQ4BKgTnWHkAJ3KwlVYOAQ7LKwM7Qy9A2wMjCCFH8mVSlRSB9oBS2+obH8n+ao9pZRghgRr4IEVeHKaPOaAAGzBg747YAFudY0+Q3wIUnAGM+IEMsrZQ9/AwhRcQVyRiykX2TRs4gm4gNBSE1JN4jJAgg3IwaDmhoJqcuqRdQMCcAB70GWIF+jaHfUG5ZxvmJmRgdrIu+CHrp2XzB+ZJkdkmHI49SdU2XzTzKYGFOYv9RP1wQQcRXOhtcagZ/7JilbBL/Gm4YuWQzqcqnKXNTWgSoy1JVt/ov8fIB0MFd/UvgQYAHbT5IUONy6lAAAAAElFTkSuQmCC',
            'userId': null,
            'createTime': null,
            'modifyTime': null
          },
          'menuName': '首页',
          'menuType': 'file',
          'id': 1,
          'menuShortName': '12',
          'state': 1,
          'parentId': -1,
          'menuSource': '菜单来源',
          'url': '/portalui/#/index'
        }, {
          'parentName': null,
          'menuOrder': 2,
          'menuDescribe': '122222222',
          'children': [
            {
              'parentName': 'IAM服务',
              'menuOrder': 231,
              'menuDescribe': '12',
              'menuName': '权限管理',
              'menuType': 'file',
              'id': 233,
              'menuShortName': '12',
              'state': 1,
              'parentId': 2,
              'menuSource': '系统管理平台',
              'url': '/IAMui/#/authority'
            }, {
              'parentName': 'IAM服务',
              'menuOrder': 233,
              'menuDescribe': '',
              'menuName': '角色管理',
              'menuType': 'file',
              'id': 232,
              'menuShortName': '',
              'state': 1,
              'parentId': 2,
              'menuSource': '',
              'url': '/IAMui/#/roles'
            }, {
              'parentName': 'IAM服务',
              'menuOrder': 233,
              'menuDescribe': '',
              'menuName': '菜单管理',
              'menuType': 'file',
              'id': 231,
              'menuShortName': '',
              'state': 1,
              'parentId': 2,
              'menuSource': '系统管理平台',
              'url': '/IAMui/#/menu'
            }, {
              'parentName': 'IAM服务',
              'menuOrder': 234,
              'menuDescribe': '12',
              'menuName': '用户组管理',
              'menuType': 'file',
              'id': 234,
              'menuShortName': '12',
              'state': 1,
              'parentId': 2,
              'menuSource': 'IT支撑平台',
              'url': '/IAMui/#/userGroup'
            }, {
              'parentName': 'IAM服务',
              'menuOrder': 235,
              'menuDescribe': '',
              'children': [{
                'parentName': '其他管理',
                'menuOrder': 242,
                'menuDescribe': '',
                'icon': {
                  'id': 2,
                  'iconName': '更多',
                  'iconDataBlue': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAECAYAAACHtL/sAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCRDEwRjY5RTJDRTIxMUU4OUMyREI1RjcxNzRFQUIzMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCRDEwRjY5RjJDRTIxMUU4OUMyREI1RjcxNzRFQUIzMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkJEMTBGNjlDMkNFMjExRTg5QzJEQjVGNzE3NEVBQjMxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkJEMTBGNjlEMkNFMjExRTg5QzJEQjVGNzE3NEVBQjMxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8++bDpOgAAAEZJREFUeNpiSUtL82RgYJjLAAHJQLwdyiZKnBFowDMgQxIq8ByIpaBsosSZGFABIwN2gFMcZEAKEL8A4qdQp8IAUeIAAQYAecgVXM6QXfYAAAAASUVORK5CYII=',
                  'iconDataWhite': null,
                  'userId': 1,
                  'createTime': 1521701901000,
                  'modifyTime': 1521701904000
                },
                'menuName': '百度子系统',
                'menuType': 'file',
                'id': 242,
                'menuShortName': '',
                'state': 1,
                'parentId': 235,
                'menuSource': '',
                'url': 'https://www.baidu.com'
              }, {
                'parentName': '其他管理',
                'menuOrder': 243,
                'menuDescribe': '',
                'icon': {
                  'id': 1,
                  'iconName': '图标1',
                  'iconDataBlue': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAjVBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8DizOFAAAALnRSTlMADXF94+G3Vhny23kcFxPltJKIYCQIAu+/rI+DTjv27NTRzbCkonZua11DMcJoegQqWQAAANBJREFUGNN1j9tOwzAQRMc4SXGcW0PSkAZ6b4EW5v8/j91FVEK052E9OhrLa/yhWJ/s/DpmwhgX6ki+qyRTgSyBjombzHKCcGahTuot30QuVc7Yd2EHZRLL+Y/EnI8wBl6brsyD2ZEz0Gt6ZYE+yMCeLwBXTZY1qb7uAruDOix3dZLUm2MPsTXF/eNwhuGMhaZKZlVJ+qSR97gMNFqA25P3cS9LPrGNPsZ1jt+VTEJpElx/VOKDlcbn/Ja8e337IIwmvcYhlfaKysbhUlsKLb4B8+IYJv+BeE4AAAAASUVORK5CYII=',
                  'iconDataWhite': null,
                  'userId': 1,
                  'createTime': 1521600004000,
                  'modifyTime': 1521600008000
                },
                'menuName': '菜鸟子系统',
                'menuType': 'file',
                'id': 243,
                'menuShortName': '',
                'state': 1,
                'parentId': 235,
                'menuSource': '',
                'url': 'https://www.runoob.com'
              }, {
                'parentName': '其他管理',
                'menuOrder': 337,
                'menuDescribe': '',
                'menuName': '百度服务',
                'menuType': 'file',
                'id': 337,
                'menuShortName': '',
                'state': 1,
                'parentId': 235,
                'menuSource': '',
                'url': 'https://www.baidu.com'
              }
              ],
              'icon': {
                'id': 5,
                'iconName': '角色分配',
                'iconDataBlue': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAUCAYAAABiS3YzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1N0Y1RkI2QjJDRTIxMUU4OThFNUI1QkMwOTY2NzlFRSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1N0Y1RkI2QzJDRTIxMUU4OThFNUI1QkMwOTY2NzlFRSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjU3RjVGQjY5MkNFMjExRTg5OEU1QjVCQzA5NjY3OUVFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjU3RjVGQjZBMkNFMjExRTg5OEU1QjVCQzA5NjY3OUVFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+H9bKzQAAAYVJREFUeNqU1M0rRFEYx/E7Q4jQMCWy8VYWFmShbEgZLykrskPZkPwDokaRJsxClsrCxsJbXmosFKWhLIaysJOSBUV5KVnwPfVM3cbcex9PfZrbzDm/nnPuOeOzwpeWR/VgFI3IxxNOEEUi3QS/S1gBtmXyBmqRh1bc4hiLyEidmOkQaAZu4Q31+LD9doc5rOMAhRjRdDqMMgykBNrrHiH0yhZ5hg5hBl8e+/0oXY9rQutwaukqhgZNqOkw29KXTxNquuxSBnbgTBO6gEkUewSWy7iIJvQCyzhEicOYShzJOY5rzqmpeeTgWp738Iwq9MuxC2NFe/hNNaEGASyJFznsZoXfaJf9THgtPxersiSzxAlUIwtFctvMXvbJjZv26jQo+xSQtx9zWMWD2LV91y0NdNpDTSf7eEcbXq3/1Y1sR8geOitLN4GfDhN/FOFTydAKjKHZJfDPzXGq5IsaxA6uPMbHpVtXyVDz97WmaCIqny3SdVp+eSjFuSJ0U85l0G3QrwADAHZlUC1moaopAAAAAElFTkSuQmCC',
                'iconDataWhite': null,
                'userId': 1,
                'createTime': 1521702006000,
                'modifyTime': 1521702009000
              },
              'menuName': '其他管理',
              'menuType': 'folder',
              'id': 235,
              'menuShortName': '',
              'state': 1,
              'parentId': 2,
              'menuSource': ''
            }, {
              'parentName': 'IAM服务',
              'menuOrder': 395,
              'menuDescribe': '',
              'children': [{
                'parentName': '个人用户管理',
                'menuOrder': 396,
                'menuDescribe': '个人资料',
                'menuName': '个人资料',
                'menuType': 'file',
                'id': 396,
                'menuShortName': '',
                'state': null,
                'parentId': 395,
                'menuSource': '门户网站',
                'url': '/IAMui/#/user/view'
              }, {
                'parentName': '个人用户管理',
                'menuOrder': 397,
                'menuDescribe': '',
                'menuName': '修改密码',
                'menuType': 'file',
                'id': 397,
                'menuShortName': '',
                'state': null,
                'parentId': 395,
                'menuSource': '',
                'url': '/IAMui/#/user/reset'
              }
              ],
              'icon': {
                'id': 4,
                'iconName': '基本信息',
                'iconDataBlue': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUCAYAAACAl21KAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5ODEyNDgxMjJDREYxMUU4QTM4NUIxRUFBOTA0Mzg2MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5ODEyNDgxMzJDREYxMUU4QTM4NUIxRUFBOTA0Mzg2MiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjk4MTI0ODEwMkNERjExRThBMzg1QjFFQUE5MDQzODYyIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjk4MTI0ODExMkNERjExRThBMzg1QjFFQUE5MDQzODYyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+L7V9BwAAALZJREFUeNpiZGg8w4AF7ARiNwbs4AAQO6ILMgHxPiD+C8TvgPgBVBxkiBEQM6JhkJgdVM07KP4DxCtYgIQ9EBsC8SUkC9YD8V4cLloEpYWgtB4Qn2OBuuoSmuIgBuIBSC8zEwOVwOA3CMS/D8T/CeD76HpZ0Az6B8SKg8prIBc+JcJrT9F9g+41UCqVHhJeewPEXPgMGvxeGxwGgQo1VwrMAOn9BwrsjUC8HVSmkGkQKFttBQgwAAj4NB7p5ECLAAAAAElFTkSuQmCC',
                'iconDataWhite': null,
                'userId': 1,
                'createTime': 1521701975000,
                'modifyTime': 1521701978000
              },
              'menuName': '个人用户管理',
              'menuType': 'folder',
              'id': 395,
              'menuShortName': '',
              'state': null,
              'parentId': 2,
              'menuSource': ''
            }, {
              'parentName': 'IAM服务',
              'menuOrder': 432,
              'menuDescribe': '',
              'menuName': '用户管理',
              'menuType': 'file',
              'id': 432,
              'menuShortName': '',
              'state': null,
              'parentId': 2,
              'menuSource': '',
              'url': '/IAMui/#/userManage'
            }
          ],
          'icon': {
            'id': 8,
            'iconName': '流程管理',
            'iconDataBlue': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAASCAYAAABfJS4tAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1OTU4QjY3QjJCNDcxMUU4QkQ4NEQzMjY1OUY1MzE2NSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1OTU4QjY3QzJCNDcxMUU4QkQ4NEQzMjY1OUY1MzE2NSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjU5NThCNjc5MkI0NzExRThCRDg0RDMyNjU5RjUzMTY1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjU5NThCNjdBMkI0NzExRThCRDg0RDMyNjU5RjUzMTY1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+7TcIjgAAAMtJREFUeNq0VFsKwjAQNLHRih96Aw/h/QR7Pr2L/VCqCHEDK6RN9qV0YaBku49OpuNijItpuO76fSyTZbh4OhaHjaaQyZGDvdD0rRxubnwHbOdozEULGKik5jNvTK6nbxRVkSlBGnKgGubqsFKxZOWTLVej4gUIRmqeyDm78QOwR/1qkS5xNxb/+aLiMfHH3ENRU9s4/CC9UJNbFHjskRrpVx7V+MwPatgAVoyHUDVrL/jBgC9aItW0/h8/mMsr2GgUfmD24kTHR4ABALD7MJzW+FP6AAAAAElFTkSuQmCC',
            'iconDataWhite': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAASCAYAAABfJS4tAAAACXBIWXMAAAsTAAALEwEAmpwYAAA7SWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMTQgNzkuMTUxNDgxLCAyMDEzLzAzLzEzLTEyOjA5OjE1ICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgICAgICAgICB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgICAgICAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+QWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOkNyZWF0ZURhdGU+MjAxOC0wMy0yMVQxNzo1MjozMyswODowMDwveG1wOkNyZWF0ZURhdGU+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE4LTAzLTI2VDE2OjE3OjAzKzA4OjAwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpNZXRhZGF0YURhdGU+MjAxOC0wMy0yNlQxNjoxNzowMyswODowMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDoxNWVlNTE3OS1mZmI4LTk1NGEtODBiNC0xYmU5NzBlZDAzMzA8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPnhtcC5kaWQ6NTk1OEI2N0MyQjQ3MTFFOEJEODREMzI2NTlGNTMxNjU8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpEZXJpdmVkRnJvbSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgIDxzdFJlZjppbnN0YW5jZUlEPnhtcC5paWQ6NTk1OEI2NzkyQjQ3MTFFOEJEODREMzI2NTlGNTMxNjU8L3N0UmVmOmluc3RhbmNlSUQ+CiAgICAgICAgICAgIDxzdFJlZjpkb2N1bWVudElEPnhtcC5kaWQ6NTk1OEI2N0EyQjQ3MTFFOEJEODREMzI2NTlGNTMxNjU8L3N0UmVmOmRvY3VtZW50SUQ+CiAgICAgICAgIDwveG1wTU06RGVyaXZlZEZyb20+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDo1OTU4QjY3QzJCNDcxMUU4QkQ4NEQzMjY1OUY1MzE2NTwveG1wTU06T3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06SGlzdG9yeT4KICAgICAgICAgICAgPHJkZjpTZXE+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6MTk0OGFjOTItNDQzNC1iMjQ2LTljZGItMDAzZWVlZWM4MGMxPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE4LTAzLTI2VDE2OjE3OjAzKzA4OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6Y2hhbmdlZD4vPC9zdEV2dDpjaGFuZ2VkPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDoxNWVlNTE3OS1mZmI4LTk1NGEtODBiNC0xYmU5NzBlZDAzMzA8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMTgtMDMtMjZUMTY6MTc6MDMrMDg6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgICAgPHBob3Rvc2hvcDpDb2xvck1vZGU+MzwvcGhvdG9zaG9wOkNvbG9yTW9kZT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+NjU1MzU8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjIyPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjE4PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz7I6W4MAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAACsSURBVHjatFXLDgIhDBzYxUc86B/4/38nBw2rm9RLD5qUoaDbpAdamJahGYKIgBhNqgUrOI8ebBWODdDVWbwb+A7gtAUwswOAUkt6rnkjuVx9mMZUWEWuDHCUism70er4CSB1FlyUc9rxA8BF59frBcD5X1PRzXEawEkWx62xyEpNj4bk+KEHlh8B7IiG1M7sg4i8dLESoQmO2Fc+/qIHW2kFtdmhByOfQHkPAKXnKR4eFR+vAAAAAElFTkSuQmCC',
            'userId': 1,
            'createTime': 1521702115000,
            'modifyTime': 1521702117000
          },
          'menuName': 'IAM服务',
          'menuType': 'folder',
          'id': 2,
          'menuShortName': '121111',
          'state': 1,
          'parentId': -1,
          'menuSource': '菜单来源'
        }, {
          'parentName': null,
          'menuOrder': 3,
          'menuDescribe': null,
          'children': [{
            'parentName': '公共服务',
            'menuOrder': 334,
            'menuDescribe': '12212',
            'menuName': '组织管理112',
            'menuType': 'file',
            'id': 335,
            'menuShortName': '1212',
            'state': 1,
            'parentId': 3,
            'menuSource': '系统管理平台',
            'url': '/commonui/#/organization'
          }, {
            'parentName': '公共服务',
            'menuOrder': 393,
            'menuDescribe': '12',
            'menuName': '岗位管理',
            'menuType': 'file',
            'id': 334,
            'menuShortName': '12',
            'state': 1,
            'parentId': 3,
            'menuSource': 'DEVOPS平台',
            'url': '/commonui/#/post'
          }
          ],
          'icon': {
            'id': 7,
            'iconName': '开发管理',
            'iconDataBlue': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAASCAYAAABb0P4QAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0NjkwM0YxNDJCNDcxMUU4OEMzMzgyMkFFQzRFNTk2RSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0NjkwM0YxNTJCNDcxMUU4OEMzMzgyMkFFQzRFNTk2RSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjQ2OTAzRjEyMkI0NzExRTg4QzMzODIyQUVDNEU1OTZFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjQ2OTAzRjEzMkI0NzExRTg4QzMzODIyQUVDNEU1OTZFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+RNDvKgAAAOFJREFUeNpiZGg885+BMPgKxL+IUMfAAqUZCajjBmI2Isx7x8JAHPgKxQQBExD/AWJmJDE5IN4FxJ+htBwDCYAJajMPkthcID4AxJJQeiEpBjICI+UDkJYH4o9QMZDLhKGRALLoLYHwY0Ry3F8mLApOAHEJ1LA8ID4G1YQLwwAvEH/CZmAyEDsC8QsonUCCj/9ji+VHQOzKQCZgYqAyINVAgkkKZOAXtGSDDxBMUqAw/IuWsPHlbZDl3tAkNQmI64nxMr4kgi1JURSGBJMUC4kGEkxSVE82MBc+pJJ5zwACDACC+TFQ5WInTwAAAABJRU5ErkJggg==',
            'iconDataWhite': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAASCAYAAABb0P4QAAAACXBIWXMAAAsTAAALEwEAmpwYAAA7SWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMTQgNzkuMTUxNDgxLCAyMDEzLzAzLzEzLTEyOjA5OjE1ICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgICAgICAgICB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgICAgICAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+QWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOkNyZWF0ZURhdGU+MjAxOC0wMy0yMVQxNzo1MjozMyswODowMDwveG1wOkNyZWF0ZURhdGU+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE4LTAzLTI2VDE2OjE2OjIxKzA4OjAwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpNZXRhZGF0YURhdGU+MjAxOC0wMy0yNlQxNjoxNjoyMSswODowMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDo3MWE0ZWQ0NC01ODhjLWFjNGQtOWQ4YS01ZGNiYjUyNWJjMWM8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPnhtcC5kaWQ6NDY5MDNGMTUyQjQ3MTFFODhDMzM4MjJBRUM0RTU5NkU8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpEZXJpdmVkRnJvbSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgIDxzdFJlZjppbnN0YW5jZUlEPnhtcC5paWQ6NDY5MDNGMTIyQjQ3MTFFODhDMzM4MjJBRUM0RTU5NkU8L3N0UmVmOmluc3RhbmNlSUQ+CiAgICAgICAgICAgIDxzdFJlZjpkb2N1bWVudElEPnhtcC5kaWQ6NDY5MDNGMTMyQjQ3MTFFODhDMzM4MjJBRUM0RTU5NkU8L3N0UmVmOmRvY3VtZW50SUQ+CiAgICAgICAgIDwveG1wTU06RGVyaXZlZEZyb20+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDo0NjkwM0YxNTJCNDcxMUU4OEMzMzgyMkFFQzRFNTk2RTwveG1wTU06T3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06SGlzdG9yeT4KICAgICAgICAgICAgPHJkZjpTZXE+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6MDMyN2VhZTUtM2FiMi1iNTRmLWE3NTctMTc2NTViN2M2NWQwPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE4LTAzLTI2VDE2OjE2OjIxKzA4OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6Y2hhbmdlZD4vPC9zdEV2dDpjaGFuZ2VkPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDo3MWE0ZWQ0NC01ODhjLWFjNGQtOWQ4YS01ZGNiYjUyNWJjMWM8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMTgtMDMtMjZUMTY6MTY6MjErMDg6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgICAgPHBob3Rvc2hvcDpDb2xvck1vZGU+MzwvcGhvdG9zaG9wOkNvbG9yTW9kZT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+NjU1MzU8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjIwPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjE4PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz4DZtNIAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAADpSURBVHjarJQ9TgMxEIW/NVEaglLTLGeh4B5I9Km4DgXXgIYKcY1QICoUkVAEIX00s9KCHHsX9kmjZ/ln/Dzz5EaVOj6AzwH7mAU3lX3HwHxAvrcmFDZMAxPwBRz1JlvgDtgGt2MypqjPojd3AzwAp8G34zTqRl2qRGzVeYwX6t4yunNJNWXueAKuQ/UKeIwaH4oOJ8B7TmGr3qu74LPeWimW6maWUfgMXPy1zYmJMTZh1VIJ2P2yTQl1S6nraERX3BJylvrRlNyTSxbJWepfNbwCzoHX4MtDv81QVC01uW06heuJ8r18DwC+e/QkrIOQyQAAAABJRU5ErkJggg==',
            'userId': 1,
            'createTime': 1521702081000,
            'modifyTime': 1521702083000
          },
          'menuName': '公共服务',
          'menuType': 'folder',
          'id': 3,
          'menuShortName': null,
          'state': 1,
          'parentId': -1,
          'menuSource': null
        }, {
          'parentName': null,
          'menuOrder': 373,
          'menuDescribe': '',
          'children': [{
            'parentName': 'test2',
            'menuOrder': 431,
            'menuDescribe': '1',
            'menuName': 'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq',
            'menuType': 'file',
            'id': 431,
            'menuShortName': '1',
            'state': 1,
            'parentId': 373,
            'menuSource': '系统管理平台',
            'url': '1'
          }
          ],
          'icon': {
            'id': 4,
            'iconName': '基本信息',
            'iconDataBlue': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUCAYAAACAl21KAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5ODEyNDgxMjJDREYxMUU4QTM4NUIxRUFBOTA0Mzg2MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5ODEyNDgxMzJDREYxMUU4QTM4NUIxRUFBOTA0Mzg2MiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjk4MTI0ODEwMkNERjExRThBMzg1QjFFQUE5MDQzODYyIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjk4MTI0ODExMkNERjExRThBMzg1QjFFQUE5MDQzODYyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+L7V9BwAAALZJREFUeNpiZGg8w4AF7ARiNwbs4AAQO6ILMgHxPiD+C8TvgPgBVBxkiBEQM6JhkJgdVM07KP4DxCtYgIQ9EBsC8SUkC9YD8V4cLloEpYWgtB4Qn2OBuuoSmuIgBuIBSC8zEwOVwOA3CMS/D8T/CeD76HpZ0Az6B8SKg8prIBc+JcJrT9F9g+41UCqVHhJeewPEXPgMGvxeGxwGgQo1VwrMAOn9BwrsjUC8HVSmkGkQKFttBQgwAAj4NB7p5ECLAAAAAElFTkSuQmCC',
            'iconDataWhite': null,
            'userId': 1,
            'createTime': 1521701975000,
            'modifyTime': 1521701978000
          },
          'menuName': 'test2',
          'menuType': 'folder',
          'id': 373,
          'menuShortName': '',
          'state': null,
          'parentId': -1,
          'menuSource': ''
        }, {
          'parentName': null,
          'menuOrder': 418,
          'menuDescribe': '',
          'children': [{
            'parentName': '洛阳',
            'menuOrder': 419,
            'menuDescribe': '12',
            'menuName': '新安1',
            'menuType': 'file',
            'id': 419,
            'menuShortName': '12',
            'state': null,
            'parentId': 418,
            'menuSource': '系统管理平台',
            'url': '12'
          }
          ],
          'icon': {
            'id': 5,
            'iconName': '角色分配',
            'iconDataBlue': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAUCAYAAABiS3YzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1N0Y1RkI2QjJDRTIxMUU4OThFNUI1QkMwOTY2NzlFRSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1N0Y1RkI2QzJDRTIxMUU4OThFNUI1QkMwOTY2NzlFRSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjU3RjVGQjY5MkNFMjExRTg5OEU1QjVCQzA5NjY3OUVFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjU3RjVGQjZBMkNFMjExRTg5OEU1QjVCQzA5NjY3OUVFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+H9bKzQAAAYVJREFUeNqU1M0rRFEYx/E7Q4jQMCWy8VYWFmShbEgZLykrskPZkPwDokaRJsxClsrCxsJbXmosFKWhLIaysJOSBUV5KVnwPfVM3cbcex9PfZrbzDm/nnPuOeOzwpeWR/VgFI3IxxNOEEUi3QS/S1gBtmXyBmqRh1bc4hiLyEidmOkQaAZu4Q31+LD9doc5rOMAhRjRdDqMMgykBNrrHiH0yhZ5hg5hBl8e+/0oXY9rQutwaukqhgZNqOkw29KXTxNquuxSBnbgTBO6gEkUewSWy7iIJvQCyzhEicOYShzJOY5rzqmpeeTgWp738Iwq9MuxC2NFe/hNNaEGASyJFznsZoXfaJf9THgtPxersiSzxAlUIwtFctvMXvbJjZv26jQo+xSQtx9zWMWD2LV91y0NdNpDTSf7eEcbXq3/1Y1sR8geOitLN4GfDhN/FOFTydAKjKHZJfDPzXGq5IsaxA6uPMbHpVtXyVDz97WmaCIqny3SdVp+eSjFuSJ0U85l0G3QrwADAHZlUC1moaopAAAAAElFTkSuQmCC',
            'iconDataWhite': null,
            'userId': 1,
            'createTime': 1521702006000,
            'modifyTime': 1521702009000
          },
          'menuName': '洛阳',
          'menuType': 'folder',
          'id': 418,
          'menuShortName': '',
          'state': null,
          'parentId': -1,
          'menuSource': ''
        }
      ];
    }
    this.broadcast.on('leftmenu_close').subscribe(event => {
      this.isOpen = event;
    });
  }

  getIconStyle(menu: any) {
    if (menu.icon && (menu.icon.iconDataBlueGreen || menu.icon.iconDataWhite)) {
      return {
        'background-image': 'url(' + (menu.icon.iconDataBlueGreen || menu.icon.iconDataWhite) + ')'
      };
    }
  }
}
