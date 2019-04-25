import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-demo-async-component',
  template: `
    <div class="demo-content">
      <div class="demo-api-title">Examples</div>
      <div class="demo-eg-list">
        <div class="demo-eg-effect">
          <div class="demo-eg-list-title">AsyncComplete</div>
          <div class="demo-eg-effect-content">
            <dc-async-component [required]="true" [options]="options" [text]="'xxx'" [source]="source"
                                (selectItem)="selectItem($event)"></dc-async-component>
          </div>
          <span class="demo-eg-basic-btn" (click)="toggleBasicContent($event, basic1)">basic</span>
        </div>
        <div #basic1 class="demo-eg-basic-content">
          <ul class="demo-eg-basic-tab-box">
            <li class="demo-eg-basic-tab active" (click)="selectBasicTab($event, html1, ts1)">basic.html</li>
            <li class="demo-eg-basic-tab" (click)="selectBasicTab($event, ts1, html1)">basic.ts</li>
          </ul>
          <div>
            <code class="demo-eg-basic-code active" #html1>
              <pre>{{html_html1}}</pre>
            </code>
            <code class="demo-eg-basic-code" #ts1>
              <pre>{{ts_ts1}}</pre>
            </code>
          </div>
        </div>
      </div>
      <div class="demo-api">
        <app-demo-async-api></app-demo-async-api>
      </div>
    </div>
  `,
  styleUrls: []
})
export class DemoAsyncCompleteComponent implements OnInit {
  options = {
    asyncFilter: this.myFilter,
    asyncSpace: 100 // 文本变化请求异步过滤方法时间间隔，默认300ms
  };
  source = [{
    title: 'a'
  }, {
    title: 'b'
  }];

  html_html1 = `<dc-async-component [required]="true" [options]="options" [text]="'xxx'" [source]="source" (selectItem)="selectItem($event)"></dc-async-component>`;
  ts_ts1 = `options = {
  asyncFilter: this.myFilter,
  asyncSpace: 100 // 文本变化请求异步过滤方法时间间隔，默认300ms
};
source = [{
  title: 'a'
}, {
  title: 'b'
}];
myFilter(text): Promise<any> {
  // 返回promise对象
  return new Promise(resolve => {
    if (text) { // 用户有输入搜索值
      // return [{title: 1}];
      setTimeout(() => {
        resolve([]);
      }, 1000);
    } else if (text === '') { // 用户删除了搜索值
      // return [{title: 1}, {title: 2}];
      resolve([{title: 1}, {title: 2}]);
    } else { // undefined，第一次点击搜索框
      // return this.source;
      resolve(this.source);
    }
  });
}
selectItem(ev: any) {
  console.log(ev, 'selectItem');
}`;

  constructor() {
  }

  ngOnInit() {
  }

  myFilter(text): Promise<any> {
    // 返回promise对象
    return new Promise(resolve => {
      if (text) { // 用户有输入搜索值
        // return [{title: 1}];
        setTimeout(() => {
          resolve([]);
        }, 1000);
      } else if (text === '') { // 用户删除了搜索值
        // return [{title: 1}, {title: 2}];
        resolve([{title: 1}, {title: 2}]);
      } else { // undefined，第一次点击搜索框
        // return this.source;
        resolve(this.source);
      }
    });
  }

  selectItem(ev: any) {
    console.log(ev, 'selectItem');
  }

  // 以下是demo内容，不用关注
  toggleBasicContent(ev: any, target: any) {
    if (!target.style.display || target.style.display === 'none') {
      target.style.display = 'block';
      ev.target.classList.add('active');
    } else {
      target.style.display = 'none';
      ev.target.classList.remove('active');
    }
  }

  selectBasicTab(ev: any, showTarget: any, hideTarget: any) {
    const children = ev.target.parentElement.children;
    for (let i = 0; i < children.length; i++) {
      children[i].classList.remove('active');
    }
    ev.target.classList.add('active');
    showTarget.style.display = 'block';
    hideTarget.style.display = 'none';
  }
}
