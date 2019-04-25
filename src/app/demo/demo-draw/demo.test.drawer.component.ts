import { Component, Input, OnInit } from '@angular/core';
import { DrawService } from '../../../plugin/draw/draw.service';


@Component({
  template: `<div>{{data?.title}}</div>
  <div>
    <button (click)="closeDrawer()">点我关闭</button>

    <dc-auto-component [source]='datas' [width]="'500px'"
       [text]="text" (textChangeEvent)="changeText($event)">
    </dc-auto-component>
  </div>`,
})
export class DemoTestDrawComponent implements OnInit {
  @Input() handler;
  data;
  closeDraw;

  datas = [
    "娄蓉蓉",
    "李小龙",
    "罗永波",
    "石晓波"
  ]
  text;

  constructor(private drawService: DrawService) {
  }

  beforeLeave(): boolean | Promise<boolean> {
    return new Promise(resolve => {
      resolve(true);
    });
  }

  closeDrawer() {
    this.handler && this.handler();
  }

  ngOnInit() {
  }

  changeText(event){

  }
}
