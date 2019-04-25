import {Component, Input, OnInit, Output, EventEmitter, Renderer, HostListener} from '@angular/core';
import {DcEventService} from '../broadcast/broadcast.service';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'dc-header',
  template: `
    <div class="dc-header-container">
      <div class="dc-header" [ngClass]="{'zoomout':!isOpen}" style="display: flex;align-items: center;">
        <div class="toggle-left-menu" (click)="sendToggleLeftMenu()">
          <div class="toggle-arrow" *ngIf="isOpen"></div>
          <div class="toggle-arrow2" *ngIf="!isOpen"></div>
          <div class="toggle-square">
            <div></div>
          </div>
        </div>

        <div class="search">
          <input type="text" [(ngModel)]="keyword" (click)="$event.stopPropagation()" (blur)="hideSearchResultDrop()"
                 (focus)="showSearchResultDrop($event)" (keyup)="showResultFlag = true;" (keyup.enter)="sendSearchResult()"
                 placeholder="请输入要搜索的内容">
          <span (click)="sendSearchResult()"></span>
          <ul class="search-result" *ngIf="searchResults && showResultFlag">
            <li class="search-result-li" *ngFor="let list of (searchResults | arrFilter:searchKey:keyword)"
                (click)="selectResult($event, list)" [title]="list[searchKey]">{{list[searchKey]}}
            </li>
          </ul>
        </div>
        <div style="flex: 1;display: flex;justify-content: flex-end; margin-right: 20px;">
          <div style="color: #fff;cursor: pointer;margin-right: 20px;" (click)="clickUs()">
            联系我们
          </div>
          <div class="user" style="position: relative;" (click)="toggleUserMenuEvent($event)">
            <div class="avatar"></div>
            <div class="user-menu">
              <div class="user-menu-name" [title]="userInfo?.userName || ''">{{userInfo?.userName || '未登录'}}</div>
              <ul [hidden]="!toggleUserMenu">
                <li *ngFor="let menu of userMenuData" (click)="sendUserMenu(menu)">
                  {{menu.text}}
                </li>
              </ul>
            </div>
            <div class="double-arrow">
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>`,
  styles: [
      `.dc-header-container {
      height: 60px;
    }

    .dc-header {
      position: fixed;
      top: 0;
      right: 0;
      width: calc(100% - 249px);
      height: 60px;
      background: #1d2b40;
      z-index: 1000;
    }

    .dc-header.zoomout {
      width: calc(100% - 40px);
    }

    .toggle-left-menu {
      width: 38px;
      height: 18px;
      cursor: pointer;
    }

    .toggle-arrow {
      float: left;
      border: solid 4px transparent;
      border-right-width: 6px;
      border-right-color: #fff;
      width: 0;
      height: 0;
      margin: 5px 0 0 2px;
    }

    .toggle-arrow2 {
      float: right;
      border: solid 4px transparent;
      border-left-width: 6px;
      border-left-color: #fff;
      width: 0;
      height: 0;
      margin: 5px 0 0 5px;
    }

    .toggle-square {
      float: right;
      width: 20px;
      height: 18px;
      border: solid 2px #fff;
      border-left: none;
      border-right: none;
    }

    .toggle-square > div {
      width: 100%;
      height: 8px;
      border-bottom: solid 2px #fff
    }

    .search {
      width: 310px;
      height: 30px;
      padding: 0 0 0 10px;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAdVBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////li2ZAAAAAJnRSTlMA22og6OOkcfnfv7qylIh6Sxztx6ybmX49NDAl89TSYl5YRCsPA1oVtjUAAACeSURBVBjTbZBXDsQgDEQhPUBIr9vb3P+IGwiiSJkPa3gybkSrER1AqwtxikskWTQzoLLsjft2uAeoYS2E+wN2mKT0KyHXPRATTwNU5B3x9UWzxyLzmXkjCiFlCs4hTLkKfQj1AhMCtuKjZ39a4qae/EEjbKY07HVyDMb9eoytMgtFhpwY1QWuNAVuy55b21qvkQu56oRgG9dLnlCZ/AEG1Qm11McNegAAAABJRU5ErkJggg==) no-repeat 280px center #566070;
      border-radius: 2px;
      margin-left: 23px;
      position: relative;
    }

    .search:hover {
      background: url(data:image/png;base64,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) no-repeat 280px center #566070;
    }

    .search > input {
      width: 260px;
      height: 27px;
      border: none;
      transition: none;
      background: none;
      color: #fff;
      opacity: 0.7;
    }

    .search > input:focus {
      border: none;
      transition: none;
      background: none;
    }

    .search > span {
      cursor: pointer;
      display: block;
      width: 30px;
      height: 30px;
      float: right;
    }

    li {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .search-result {
      position: absolute;
      left: 0;
      top: 29px;
      width: 310px;
      height: auto;
      max-height: 200px;
      overflow: auto;
      border: 1px solid #ccc;
      background: #fff;
    }

    .search-result > li {
      cursor: pointer;
      width: 100%;
      height: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 30px;
      text-indent: 10px;
    }

    .search-result > li:hover {
      color: #fff;
      background-color: #0081cc;
    }

    .user {
      display: table;
      color: #fff;
      cursor: pointer;
    }

    .user > div {
      display: table-cell;
      vertical-align: middle;
    }

    .avatar {
      width: 16px;
      height: 16px;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////98JRy6AAAAIHRSTlMAri3+qMO1nYBz2NHMloRoQjoQ+PHnkl9YHBbfvVAlAp88q08AAABzSURBVBjTZY5XDoAgEESXDmIDe7//LS2Aor6fybxkNwMXg+BIwkNfi66YpzF0TMozhA6C5i7Z4gXHLmX2E9+T/v000xAwDVUqTe6OV9si1vDWD1FV57yoi6sTDJ6SHMZUFm4GYoDlECFTSGwstkNQFEH1DkU6BD+b1UMfAAAAAElFTkSuQmCC) no-repeat left 2px;
    }

    .user-menu {
      padding: 0 7px 3px 7px;
    }

    .user-menu-name {
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .user-menu > ul {
      position: absolute;
      right: 0;
      top: 25px;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
    }

    .user-menu > ul > li {
      min-width: 82px;
      height: 30px;
      padding: 8px 10px 0 10px;
      color: #333;
      font-size: 12px;
      background: #fff;
      list-style: none;
      text-align: left;
      line-height: 12px;
      border-radius: 3px 3px 0 0
    }

    /*.user-menu > ul > li:nth-child(even) {*/
    /*background: #edf0f5;*/
    /*}*/

    .user-menu > ul > li:hover {
      background: #0081cc;
      color: #fff;
    }

    .user-menu > ul > li:last-child {
      border-radius: 3px
    }

    .double-arrow {
      position: absolute;
      right: -12px;
      width: 10px;
      height: 100%;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAYAAAAxrNxjAAAAYElEQVQYlXXPUQ2AMAyE4UpAAhKQgAQkTAIScIAEpCABSR8vHVkW9tCkvV7+XgM7ZsSgNiyBFffA9O2qcCS5Nc14MLXGSHHJfkpSnaMn1AgXSnuhz1SSfPZ5/x7oswbiBUJg3DZWt/ucAAAAAElFTkSuQmCC) no-repeat center transparent;
      z-index: 10;
    }
    `
  ]
})
export class HeaderComponent implements OnInit {
  @Input() userInfo: any;
  @Input() searchKey: string;
  @Input() userMenuData: any;
  @Input() leftMenuStatus: boolean;
  @Output() toggleLeftMenuEvent = new EventEmitter();
  @Output() searchResult = new EventEmitter();
  @Output() userMenu = new EventEmitter();
  @Output() contactus = new EventEmitter();
  hideSearchDropTimer: any;
  _searchResults: any;
  @Input() set searchResults(v) {
    this._searchResults = _.cloneDeep(v);
  }

  get searchResults() {
    return this._searchResults;
  }

  showResultFlag = false;
  isOpen = true;
  keyword: string;
  toggleUserMenu = false;

  clickUs() {
    this.contactus.emit();
  }

  constructor(private renderer: Renderer,
              private broadcast: DcEventService,
              private router: Router,
              private activeRoute: ActivatedRoute) {
    this.searchKey = this.searchKey || 'name';
    if (!this.userMenuData) {
      this.userMenuData = [
        {
          id: 1,
          text: '个人资料',
          url: '/IAMui/#/user/view'
        },
        {
          id: 2,
          text: '修改密码',
          url: '/IAMui/#/user/reset'
        },
        {
          id: 3,
          text: '退出',
          url: ''
        }
      ];
    }
  }

  ngOnInit() {
    this.broadcast.on('leftmenu_close').subscribe(event => {
      this.isOpen = event;
      this.toggleLeftMenuEvent.emit(this.isOpen);
    });
  }

  toggleUserMenuEvent(ev: any) {
    ev.stopPropagation();
    ev.preventDefault();
    this.toggleUserMenu = !this.toggleUserMenu;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(ev: any) {
    this.toggleUserMenu = false;
    this.hideSearchResultDrop();
  }

  showSearchResultDrop(ev: any) {
    if (this.hideSearchDropTimer) {
      clearTimeout(this.hideSearchDropTimer);
      this.hideSearchDropTimer = null;
    }
    ev.stopPropagation();
    this.showResultFlag = true;
  }

  hideSearchResultDrop() {
    if (this.hideSearchDropTimer) {
      clearTimeout(this.hideSearchDropTimer);
      this.hideSearchDropTimer = null;
    }
    this.hideSearchDropTimer = setTimeout(() => {
      this.showResultFlag = false;
    }, 300);
  }

  selectResult(ev: any, res: any) {
    this.keyword = res[this.searchKey];
    this.showResultFlag = false;
    this.searchResult.emit(res);
  }

  sendToggleLeftMenu() {
    this.isOpen = !this.isOpen;
    this.broadcast.broadcast('leftmenu_close', this.isOpen);
    // this.toggleLeftMenuEvent.emit(this.isOpen);
  }

  sendSearchResult() {
    if (this.keyword) {
      const res: any = _.filter(this.searchResults, (o) => {
        return o[this.searchKey].indexOf(this.keyword) != -1;
      });
      if (res && res.length > 0) {
        this.keyword = res[0][this.searchKey];
        this.showResultFlag = false;
        this.searchResult.emit(res[0]);
      }
    }
  }

  sendUserMenu(menu: any) {
    /*const reg = new RegExp(/^\/[\da-zA-Z-]*\//gi);
    const menuFirstRoute = menu.url.match(reg);
    const currentpathname = location.pathname;
    if (currentpathname && menuFirstRoute && currentpathname != menuFirstRoute[0]) {
      location.href = location.origin + menu.url;
      if (menu.id == 1) {
        // 查看个人资料
        location.href = location.origin + menu.url;
      } else if (menu.id == 2) {
        // 修改密码
        location.href = location.origin + menu.url;
      } else if (menu.id == 3) {
        // 退出登陆
        // this.router.navigateByUrl('/IAM/user/update');
      }
    } else {
      const targetRout = menu.url.slice(menuFirstRoute[0].length + 1);
      if (menu.id == 1) {
        // 查看个人资料
        this.router.navigate([targetRout]);
      } else if (menu.id == 2) {
        // 修改密码
        this.router.navigate([targetRout]);
      } else if (menu.id == 3) {
        // 退出登陆
        // this.router.navigateByUrl('/IAM/user/update');
      }
    }*/
    this.userMenu.emit(menu);
  }
}
