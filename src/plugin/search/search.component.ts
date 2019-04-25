import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'dc-search',
  template: `
    <div class="search" [style.width]="width || ''">
      <input #searchInput [class.dc-valid]="keyword" type="text" [(ngModel)]="keyword" (ngModelChange)="modelChange()"
             (click)="$event.stopPropagation()" (keyup.enter)="sendSearchResult()"
             [placeholder]=" placeholder || '请输入要搜索的内容'">
      <i [hidden]="!keyword" class="clear-input-value" (click)="clearValue(searchInput)"></i>
      <span (click)="sendSearchResult()"></span>
    </div>
  `,
  styles: [`

    .search {
      width: 310px;
      height: 30px;
      line-height: 30px;
      background-color: #fff;
      position: relative;
    }

    .search:hover {

    }

    .clear-input-value {
      position: absolute;
      right: 50px;
      top: 0;
      cursor: pointer;
      width: 12px;
      height: 30px;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAAOVJREFUKJF90DFKA1EQBuAvj2Cu8MBqe8FokedeQb2A6WzU0uN4gxTbxkM8CKKSfqvAXsAi2lj4dlkh5Icp5p9/Zv6ZSdM0Ck7whDucFW6LFV7wDdNSOMUac/9xVeIet9iFMvmQeIw5XjELeOzFdV2LMQ6qGKO6rvv0HA8By55p21ZKSYxRjFFKSdu2403LKS77rOs6OWcpJZBz1nXduOEiHPF9CD8Bb2PPKSU552HT+CZsg78/g6qqBhu9vaqqxg2rSdM0M+TyhWP4xCJgjxu8HxF/4Br7/ugdEp6xwVeJTeEWReMX1Y9FK/4RDOgAAAAASUVORK5CYII=) no-repeat center center transparent;
    }

    .clear-input-value:hover {
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAAOtJREFUKJF90b1NAzEcBfBfriCVm2vR3S2ABFXYAViADACUjMMGWQCGQIoQWJngrLTXWBSBIhRxooBCnuTCz++9/4dHMUYFJ3jALc4Kt8AMT/iCUTGc4hkXDuMdN1hWJfmYWHl7wbjC/VbcdZ0Qwk4VQtB13fZ6jrsK0y0zDIO2bYUQhBA0TWMYhv1K01GMcVXa2qW2bWu9XkspyTnvG1bVkb4P4bvC29/0vu+llDRN82smLCqbPYO6rvV9L+cs5yylpK7rfcNsFGMc47Vs4RgiJhVWuLb5nP/wgSt7Qy9xiUfM8VnOvHCTovEDCGVJpA/ldQoAAAAASUVORK5CYII=) no-repeat center center transparent;
    }

    .search > input {
      width: 100%;
      height: 30px;
      transition: none;
      background: none;
      color: #333;
      font-size: 12px;
      border-radius: 4px;
      border: 1px solid #ccc;
      padding-right: 60px;
    }

    .search > input::placeholder {
      color: #bbb;
      font-size: 12px;
    }

    .search > input.dc-valid {
      transition: none;
      background: none;
      border-color: #3FB992;
    }

    .search > input:focus {
      transition: none;
      background: none;
      border-color: #2BB1FF;
    }

    .search > span {
      cursor: pointer;
      display: block;
      width: 30px;
      height: 22px;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABlUlEQVQ4jaXUz4tNUQAH8M+V5i8Q8iNDipXStUB5xUiz8GNhQRZEShoLYme68Sg1i5kaQ35EWVlNirGQLOyIV0rys2bMYy1ZmRrX4t5bZ27vvd7c+a5O597z6XRO5xu5/FaL7MNJbMeSfO4bnmEUX4of0ySes3BRCVqLSTzGVrzAAC6hmY8/42arXcDiYLwbz/Eem/GuzZoTuIdd2Fj+WOxwVY49waYOGNzHOmzAy3bgG0xhfwcozCR6UYvqjXNlsB/LsbNLrMh3PMJwGTyPX/kO55vjENUbe0OwhokKGPzGDA6FYA9eVQThB1aEICxdANiD2RD8iT0LAFfiUwg+xbaK2BZEuB2CV/Px0QrgBKbTJP4Qgk3cwQOsmQd2BstwIJwsLuWU7LamsL4L7CyuYzxN4jnPNGybXrzGV9yVve9yarLqGsFDHGz19IrMyirrouw8m/gj68Fp/JOVwQx24AguYDiqNwYLJGpTsHAYfViNv/iIcVmRhBnEFZxOk/hWJ7CrpEksqjcGMIahcmNXRW/gGo79B+9PXu4lS/dFAAAAAElFTkSuQmCC) no-repeat center center transparent;
      position: absolute;
      right: 15px;
      top: 5px;
    }

  `]
})
export class SearchComponent implements OnInit {

  keyword: string;
  @Input() placeholder: string;
  @Input() width: string;
  @Input() realTime: boolean; // 是否实时监听变化
  @Output() search = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  modelChange() {
    if (this.realTime) {
      this.sendSearchResult();
    }
  }

  sendSearchResult() {
    this.search.emit(_.trim(this.keyword));
  }

  setSearchText(text?: string) {
    this.keyword = text || '';
  }

  clearValue(dom: any) {
    this.setSearchText();
    this.sendSearchResult();
    dom.focus();
  }
}
