import {Component, OnInit} from '@angular/core';
import {ModalService} from '../../../plugin/modal/modal.service';
import {DemoModalDetailComponent} from './demo.modal.detail.component';
import {DemoTableComponent} from '../demo-table/demo.table.component';

@Component({
  selector: 'app-demo-modal',
  template: `
    <button (click)="openModal()">点击生成modal框</button>
    {{testData | json}}
    <button (click)="openModal2()">点击生成表格modaltip框</button>
  `,
  styleUrls: []
})
export class DemoModalComponent implements OnInit {
  constructor(private modal: ModalService) {
  }

  testData = {
    inputData: '1'
  };

  ngOnInit() {
  }

  beforeLeave(): boolean | Promise<boolean> {
    return new Promise(resolve => {
      resolve(true);
    });
  }

  openModal() {
    this.modal.open({
      title: 'title',
      component: DemoModalDetailComponent,
      backdropCloseable: true,
      data: this.testData,
      iconCls: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2RjIzNzc1MTJCNDcxMUU4ODY2M0JCNkI1RTJCMjRBRSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2RjIzNzc1MjJCNDcxMUU4ODY2M0JCNkI1RTJCMjRBRSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZGMjM3NzRGMkI0NzExRTg4NjYzQkI2QjVFMkIyNEFFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjZGMjM3NzUwMkI0NzExRTg4NjYzQkI2QjVFMkIyNEFFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+X1Xs2wAAAP5JREFUeNqsk90KAUEUx3flkvIAyhsouSa8Bw9A8hG3ygNgkxK54UFQ4opIuSf7AErusP5TZ2ua7M6MnPpdzJwzv52Ps6bR3hqaEQdHcTKgKamBAyiKiSBwPBY9QIgbV0EJpMGMNjHgRSzMLyL+AxWSZIANsmBOsj4v8gsmKdNim+YuJHVllkyUAD2QAlchx8Z5sAErZruDsIdoD+pgCmJCLkp31QQ7tqO35PUs8AQLkANnkrBjjUCHv6Ob5IjsdV5gCQpgwktcUUSxh4acrAG6Yh/pxBiswenXhpTWqDakb43TSmr/a57xV5FfQ7ohrQkoNKShUqPakNKajwADAARfOijVnTqGAAAAAElFTkSuQmCC'
    });
    setTimeout(() => {
      this.testData.inputData = '2';
    }, 5000);
  }

  openModal2() {
    const res = this.modal.open({
      title: '表格测试',
      component: DemoTableComponent,
      backdropCloseable: false,
      handler() {
        res.modalInstance.hide();
      },
      data: this.testData
    });
    setTimeout(() => {
      this.testData.inputData = '2';
    }, 5000);
  }
}
