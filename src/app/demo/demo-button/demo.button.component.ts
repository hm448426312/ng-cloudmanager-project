import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-demo-button',
  template: `
    <div class="demo-content">
      <div class="demo-api-title">Examples</div>
      <div class="demo-eg-list">
        <div class="demo-eg-effect">
          <div class="demo-eg-list-title">Button</div>
          <div class="demo-eg-effect-content">
            <dc-button [text]="'测试'" [icon]="imgSrc"></dc-button>
            <dc-button [text]="'测试'" [class]="'red'"></dc-button>
            <dc-button [text]="'测试'" [type]="2"></dc-button>
            <dc-button [text]="'测试'" [disable]="true"></dc-button>
          </div>
          <span class="demo-eg-basic-btn" (click)="toggleBasicContent($event, basic1)">basic</span>
        </div>
        <div #basic1 class="demo-eg-basic-content">
          <ul class="demo-eg-basic-tab-box">
            <li class="demo-eg-basic-tab active" (click)="selectBasicTab($event, html1, ts1, css1)">basic.html</li>
            <li class="demo-eg-basic-tab" (click)="selectBasicTab($event, css1, html1, ts1)">basic.css</li>
            <li class="demo-eg-basic-tab" (click)="selectBasicTab($event, ts1, html1, css1)">basic.ts</li>
          </ul>
          <div>
            <code class="demo-eg-basic-code active" #html1>
              <pre>{{html_html1}}</pre>
            </code>
            <code class="demo-eg-basic-code active" #css1>
              <pre>{{css_css1}}</pre>
            </code>
            <code class="demo-eg-basic-code" #ts1>
              <pre>{{ts_ts1}}</pre>
            </code>
          </div>
        </div>
      </div>
      <div class="demo-api">
        <app-demo-button-api></app-demo-button-api>
      </div>
    </div>
  `,
  styles: [`
    dc-button {
      margin: 0 20px;
    }

    :host /deep/ .red {
      background-color: #f00 !important;
    }
  `]
})
export class DemoButtonComponent implements OnInit {
  imgSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAdVBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////li2ZAAAAAJnRSTlMA22og6OOkcfnfv7qylIh6Sxztx6ybmX49NDAl89TSYl5YRCsPA1oVtjUAAACeSURBVBjTbZBXDsQgDEQhPUBIr9vb3P+IGwiiSJkPa3gybkSrER1AqwtxikskWTQzoLLsjft2uAeoYS2E+wN2mKT0KyHXPRATTwNU5B3x9UWzxyLzmXkjCiFlCs4hTLkKfQj1AhMCtuKjZ39a4qae/EEjbKY07HVyDMb9eoytMgtFhpwY1QWuNAVuy55b21qvkQu56oRgG9dLnlCZ/AEG1Qm11McNegAAAABJRU5ErkJggg==';

  css_css1 = `
    :host /deep/ .red {
      background-color: #f00 !important;
    }
  `;
  html_html1 = `
<dc-button [text]="'测试'" [icon]="imgSrc"></dc-button>
<dc-button [text]="'测试'" [class]="'red'"></dc-button>
<dc-button [text]="'测试'" [type]="2"></dc-button>
<dc-button [text]="'测试'" [disable]="true"></dc-button>`;
  ts_ts1 = `
imgSrc = 'data:image/png;base64,*** // 此处省略图片的base64码

  `;

  constructor() {
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
