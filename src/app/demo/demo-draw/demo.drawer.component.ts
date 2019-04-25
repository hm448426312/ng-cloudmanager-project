import {Component, OnInit} from '@angular/core';
import {DemoTestDrawComponent} from './demo.test.drawer.component';
import {DrawComponent} from '../../../plugin/draw/draw.component';

import {DrawService} from '../../../plugin/draw/draw.service';
import {DemoTableComponent} from '../demo-table/demo.table.component';
import {DemoModalComponent} from '../demo-modal/demo.modal.component';

@Component({
  selector: 'app-demo-drawer',
  templateUrl: './demo.drawer.component.html',
  styleUrls: [],
  providers: [
    DrawService
  ],
  entryComponents: [
    DemoTestDrawComponent
    //DrawComponent
  ]
})
export class DemoDrawerComponent implements OnInit {

  constructor(private drawService: DrawService) {
  }

  click() {
    const result = this.drawService.open({
      handler: (type) => { // 传入侧滑component的方法，在component中用@Input() handler:any;接收
        result.closeComponent();
      },
      data: { // 传入侧滑component的数据，在component中用@Input() data:any;接收
        title: 'drawer默认有mark背景，没有title标题头。可以自己设置padding，width属性'
      },
      component: DemoTestDrawComponent, // 侧滑内容的component
      iconCls: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2RjIzNzc1MTJCNDcxMUU4ODY2M0JCNkI1RTJCMjRBRSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2RjIzNzc1MjJCNDcxMUU4ODY2M0JCNkI1RTJCMjRBRSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZGMjM3NzRGMkI0NzExRTg4NjYzQkI2QjVFMkIyNEFFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjZGMjM3NzUwMkI0NzExRTg4NjYzQkI2QjVFMkIyNEFFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+X1Xs2wAAAP5JREFUeNqsk90KAUEUx3flkvIAyhsouSa8Bw9A8hG3ygNgkxK54UFQ4opIuSf7AErusP5TZ2ua7M6MnPpdzJwzv52Ps6bR3hqaEQdHcTKgKamBAyiKiSBwPBY9QIgbV0EJpMGMNjHgRSzMLyL+AxWSZIANsmBOsj4v8gsmKdNim+YuJHVllkyUAD2QAlchx8Z5sAErZruDsIdoD+pgCmJCLkp31QQ7tqO35PUs8AQLkANnkrBjjUCHv6Ob5IjsdV5gCQpgwktcUUSxh4acrAG6Yh/pxBiswenXhpTWqDakb43TSmr/a57xV5FfQ7ohrQkoNKShUqPakNKajwADAARfOijVnTqGAAAAAElFTkSuQmCC',
      title: 'drawer', // 侧滑是否有title
      padding: '30px', // 侧滑内容的padding值
      width: '80%', // 侧滑宽度
      top: '100px',
      hiddenScroll: true, // 隐藏侧滑的滚动条，使用程序自己的滚动条
    });
  }

  click2() {
    const result = this.drawService.open({
      handler: (type) => {
        result.closeComponent();
      },
      data: {
        title: 'drawer默认有mark背景，没有title标题头。可以自己设置padding，width属性'
      },
      component: DemoTestDrawComponent,
      iconCls: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2RjIzNzc1MTJCNDcxMUU4ODY2M0JCNkI1RTJCMjRBRSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2RjIzNzc1MjJCNDcxMUU4ODY2M0JCNkI1RTJCMjRBRSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZGMjM3NzRGMkI0NzExRTg4NjYzQkI2QjVFMkIyNEFFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjZGMjM3NzUwMkI0NzExRTg4NjYzQkI2QjVFMkIyNEFFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+X1Xs2wAAAP5JREFUeNqsk90KAUEUx3flkvIAyhsouSa8Bw9A8hG3ygNgkxK54UFQ4opIuSf7AErusP5TZ2ua7M6MnPpdzJwzv52Ps6bR3hqaEQdHcTKgKamBAyiKiSBwPBY9QIgbV0EJpMGMNjHgRSzMLyL+AxWSZIANsmBOsj4v8gsmKdNim+YuJHVllkyUAD2QAlchx8Z5sAErZruDsIdoD+pgCmJCLkp31QQ7tqO35PUs8AQLkANnkrBjjUCHv6Ob5IjsdV5gCQpgwktcUUSxh4acrAG6Yh/pxBiswenXhpTWqDakb43TSmr/a57xV5FfQ7ohrQkoNKShUqPakNKajwADAARfOijVnTqGAAAAAElFTkSuQmCC',
      padding: '30px',
      mark: false
    });
  }

  click3() {
    const result = this.drawService.open({
      handler: (type) => {
        result.closeComponent();
      },
      data: {
        title: 'drawer默认有mark背景，没有title标题头。可以自己设置padding，width属性'
      },
      component: DemoTableComponent,
      title: 'drawer',
      iconCls: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2RjIzNzc1MTJCNDcxMUU4ODY2M0JCNkI1RTJCMjRBRSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2RjIzNzc1MjJCNDcxMUU4ODY2M0JCNkI1RTJCMjRBRSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZGMjM3NzRGMkI0NzExRTg4NjYzQkI2QjVFMkIyNEFFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjZGMjM3NzUwMkI0NzExRTg4NjYzQkI2QjVFMkIyNEFFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+X1Xs2wAAAP5JREFUeNqsk90KAUEUx3flkvIAyhsouSa8Bw9A8hG3ygNgkxK54UFQ4opIuSf7AErusP5TZ2ua7M6MnPpdzJwzv52Ps6bR3hqaEQdHcTKgKamBAyiKiSBwPBY9QIgbV0EJpMGMNjHgRSzMLyL+AxWSZIANsmBOsj4v8gsmKdNim+YuJHVllkyUAD2QAlchx8Z5sAErZruDsIdoD+pgCmJCLkp31QQ7tqO35PUs8AQLkANnkrBjjUCHv6Ob5IjsdV5gCQpgwktcUUSxh4acrAG6Yh/pxBiswenXhpTWqDakb43TSmr/a57xV5FfQ7ohrQkoNKShUqPakNKajwADAARfOijVnTqGAAAAAElFTkSuQmCC',
      padding: '30px',
      width: '80%',
      mark: true
    });
  }
  click4() {
    const result = this.drawService.open({
      handler: (type) => {
        result.closeComponent();
      },
      data: {
        title: '内容为modal框'
      },
      component: DemoModalComponent,
      title: 'Demo modal',
      padding: '30px',
      width: '80%',
      mark: true
    });
  }


  ngOnInit() {
  }
}
