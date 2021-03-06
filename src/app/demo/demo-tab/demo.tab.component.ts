import {Component, OnInit} from '@angular/core';
import {DemoTabDetail1Component} from './demo.tab.detail1.component';
import {DemoTabDetail2Component} from './demo.tab.detail2.component';

@Component({
  selector: 'app-demo-tab',
  template: `
    <div *ngIf="tabDatas">
      <dc-tab [tabDatas]="tabDatas" [likeButton]="true"></dc-tab>
    </div>
  `,
  styleUrls: []
})
export class DemoTabComponent implements OnInit {
  constructor() {
  }

  tabDatas;

  ngOnInit() {
    this.setTabData();
  }

  setTabData() {
    this.tabDatas = [
      {
        title: 'demo1',
        icon: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUCAYAAACAl21KAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFNTg0QzUwMjI3NEExMUU4OENGMkJGOTlGMTY4RkVCQiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFNTg0QzUwMzI3NEExMUU4OENGMkJGOTlGMTY4RkVCQiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkU1ODRDNTAwMjc0QTExRTg4Q0YyQkY5OUYxNjhGRUJCIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkU1ODRDNTAxMjc0QTExRTg4Q0YyQkY5OUYxNjhGRUJCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+YOXzmQAAAONJREFUeNpiZGg8w4AHcADxDwYC4H+dMQMLiGYgHzDCGCzoAiQAFAcwMVAJUM0gFnzOJRQu+AxiHPUaqqamsxR5jRFfGP3HgmGAE4gbgfgOEP+E0o1QcQyDGLFgEOAC4j1ArAnE/kDMC6U1oOJcLER6owKInwFxGJLLQZaEA/EqIC4j1qAoIA7AIQfy3iZiDZIF4ls4kgo7EMsQG2uPgVgVR1iCxJ8Sa9ByIG7AIVcHxIuZ8EQ7cvS3A7EUEK+AxhwrlAbxZYC4kwlHlKNH/zcgdgHim0C8GYi/QOmbUPFvAAEGAPNEMcNC3dOzAAAAAElFTkSuQmCC`,
        notify: '120',
        notifyColor: '#f95f5b',
        component: DemoTabDetail1Component,
        select: true,
        data: {test: 1}
      },
      {
        title: 'demo2',
        icon: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAUCAYAAABvVQZ0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxMDRFOTMxQzI3NEIxMUU4QkM3OUJGQ0U2RTY5ODIwMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxMDRFOTMxRDI3NEIxMUU4QkM3OUJGQ0U2RTY5ODIwMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjEwNEU5MzFBMjc0QjExRThCQzc5QkZDRTZFNjk4MjAxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjEwNEU5MzFCMjc0QjExRThCQzc5QkZDRTZFNjk4MjAxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+1AOK4gAAANVJREFUeNpiZGg8w4AHcADxDwYC4H+dMZhmAbEZyAeMyBwWbIJEAgxHMDFQEVDVMBZCTicUTvgMYxz1Jk29yUjIsP9YMDrwBOJnUOxJqTfnAnEYlL0KiKVwGUZqdgJbzth0lmzDUoB4NRD/BeJkfN4kBIKBuBiI+aH8KiDmBOK1pBrWBMQRQFwAxIegYnZAPBGIjYC4mljDrIA4HogNgfgdkvg2ID4KxKASdhsLESkfFMh5QNyMZhAPELNC2ZNBLmYkUGzDwCsgFkUT+wLEv5H47wACDABG+ylvkQEwmgAAAABJRU5ErkJggg==`,
        notify: '12',
        notifyColor: '#ec8c45',
        component: DemoTabDetail2Component,
        initFn: 'initPage',
        select: false
      }
    ];
  }
}
