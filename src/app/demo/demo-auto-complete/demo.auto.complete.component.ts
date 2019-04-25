import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TipService} from '../../../plugin/tip/tip.service';

@Component({
  selector: 'app-demo-auto-component',
  template: `
    <div class="demo-content">
      <div class="demo-api-title">Examples</div>
      <div class="demo-eg-list">
        <div class="demo-eg-effect">
          <div class="demo-eg-list-title">AutoComplete</div>
          <div class="demo-eg-effect-content">
            <dc-button [text]="'获取输入框的值'" (click)="getText()"></dc-button>
            <dc-auto-component #autoComponent [required]="true" [source]='datas' [text]="text" (textChangeEvent)="changeText($event)">
            </dc-auto-component>
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
        <app-demo-auto-api></app-demo-auto-api>
      </div>
    </div>
  `,
  styleUrls: []
})
export class DemoAutoCompleteComponent implements OnInit {
  datas = [
    '娄蓉蓉',
    '娄蓉蓉',
    '李小龙',
    '',
    '李小龙12',
    '李小龙123',
    '罗永波',
    '石晓波',
  ];
  @ViewChild('autoComponent') autoComponent;
  text;

  html_html1 = `<dc-button [text]="'获取输入框的值'" (click)="getText()"></dc-button>
<dc-auto-component #autoComponent [required]="true" [source]='datas' [text]="text" (textChangeEvent)="changeText($event)">

</dc-auto-component>`;
  ts_ts1 = `
@ViewChild('autoComponent') autoComponent;
text;
datas = [
  '娄蓉蓉',
  '娄蓉蓉',
  '李小龙',
  '',
  '李小龙12',
  '李小龙123',
  '罗永波',
  '石晓波',
];
getText() {
  // 可自行获取组件中输入框的值
  console.log(this.autoComponent['text']);
}

changeText(event) {
  console.log(event);
}
  `;

  constructor() {
    // this.text = 'test1';
    setTimeout(() => {
      // this.text = 'adsfa';
    }, 3000);
  }

  getText() {
    console.log(this.autoComponent['text']);
  }

  changeText(event) {
    console.log(event);
  }

  ngOnInit() {
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

  selectBasicTab(ev: any, showTarget: any, hideTarget: any, hideTarget1?: any) {
    const children = ev.target.parentElement.children;
    for (let i = 0; i < children.length; i++) {
      children[i].classList.remove('active');
    }
    ev.target.classList.add('active');
    showTarget.style.display = 'block';
    hideTarget.style.display = 'none';
    if (hideTarget1) {
      hideTarget1.style.display = 'none';
    }
  }
}
