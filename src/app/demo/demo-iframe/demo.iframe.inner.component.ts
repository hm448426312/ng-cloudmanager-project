import {Component, OnInit, ViewChild, ElementRef, HostListener, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-demo-iframe-inner',
  template: `
    <div class="content full-box">
      <div class="side-left">
        <p>我是左边</p>
        <p>我是左边</p>
        <p>我是左边</p>
        <p>我是左边</p>
        <p>我是左边</p>
        <p>我是左边</p>
        <ng-template [ngIf]="timerFlag">
          <p *ngFor="let i of arr">
            我是左边
          </p>
        </ng-template>
      </div>
      <div class="side-right">
        <p>我是右边</p>
        <p>我是右边</p>
        <p>我是右边</p>
        <p>我是右边</p>
        <p>我是右边</p>
        <p>我是右边</p>
      </div>
    </div>
  `,
  styles: [`
    html {
      background-color: #ccc;
      min-height: 100%;
      width: 100%;
      color: #fff;
      display: flex;
      flex-direction: column;
    }

    body {
      flex: 1;
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
    }

    app-root {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    app-demo-iframe-inner {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .content {
      width: 100%;
      background-color: red;
      flex-direction: row;
    }

    .side-left {
      width: 250px;
    }

    .side-right {
      flex: 1;
      min-width: 300px;
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class DemoIframeInnerComponent implements OnInit {

  timerFlag = false;
  arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

  constructor() {

  }

  ngOnInit() {
    setTimeout(() => {
      this.timerFlag = true;
    }, 5000);
    setTimeout(() => {
      this.timerFlag = false;
    }, 10000);
  }
}
