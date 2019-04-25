import {Component, OnInit} from '@angular/core';
import {ModalTipService} from '../../../plugin/modal-tip/modal.tip.service';

@Component({
  template: `
    <button (click)="openModal()">点击生成modal tip框</button>
  `,
  styleUrls: []
})
export class DemoModalTipComponent implements OnInit {
  constructor(private modalTip: ModalTipService) {
  }

  testData = {
    inputData: '1'
  };

  ngOnInit() {
  }

  openModal() {
    this.modalTip.openTip({
      typeTitle: '确认',
      msg: [
        '第一行',
        '第二行',
        '第二行',
        '第二行',
        '第二行',
        '第二行',
        '第二行',
        '第二行',
        '第二行',
        '第二行',
        '第二行',
        '第二行'
      ],
      handler: (ev) => {
      }
    });
  }
}
