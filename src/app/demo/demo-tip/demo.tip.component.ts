import { Component, OnInit } from '@angular/core';
import { TipService } from '../../../plugin/tip/tip.service';

@Component({
  selector: 'app-demo-tip',
  template: `
    <div>
      <div (click)="showSuccess()">success</div>
      <div (click)="showError()">error</div>
      <div (click)="showAsk()">ask</div>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <div (click)="showSuccess()">success</div>
    </div>
  `,
  styleUrls: []
})
export class DemoTipComponent implements OnInit {

  constructor(private tipService: TipService) {

  }

  showSuccess() {
    this.tipService.show({
      type: 'success',
      title: '成功啦成功啦成功啦成功啦成功啦成功啦成功啦成功啦成功啦成功啦成功啦成功啦成功啦成功啦成功啦成功啦成功啦成功啦成功啦成功啦成功啦成功啦成功啦成功啦！'
    });
  }

  showError() {
    this.tipService.show({
      type: 'error',
      title: 'dadfadf dfwiefjdslkdsd wewfewofi dxcvxczvcdsf weefwfadfasdfadfsdfdfwefwefsdfadsfafds！'
    });
  }

  showAsk() {
    this.tipService.show({
      type: 'ask',
      title: '这是一条正确消息，会自动消失sssss'
    });
  }

  ngOnInit() {
  }


}
