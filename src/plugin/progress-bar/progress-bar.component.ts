import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'dc-progress-bar',
  template: `
    <div class="dc-progress-outer" [style.width]="width">
      <div class="dc-progress-inner">
        <div #progressBar class="dc-progress-bar" [style.width]="setWidth(progressBar)"></div>
      </div>
      <span *ngIf="option?.showText" class="dc-progress-text">{{progress}}%</span>
    </div>
  `,
  styles: [
      `
      .dc-progress-outer {
        min-width: 150px;
        height: 15px;
        display: flex;
        flex-direction: row;
      }

      .dc-progress-inner {
        background-color: #e5f0f7;
        position: relative;
        flex: 1;
      }

      .dc-progress-bar {
        height: 100%;
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAPCAIAAABSnclZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpkMThkZTE2Ny0wMjYyLWQyNGUtODg5Zi0zZDlmNjcxZjcwYTEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUQ3RDkyQkE4MzIyMTFFOEI2RTVBMDA5NTFEQzlFQzUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUQ3RDkyQjk4MzIyMTFFOEI2RTVBMDA5NTFEQzlFQzUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OWJiNmJkNzUtMmYwNS1jZDQ1LThkYjMtOTRmMTA1ZTJiYzlkIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6NjU0Njg2NGEtM2ZhYy0xMWU4LTk5NDUtYzY4ZTVkMmFlODA3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+wJtu4gAAAORJREFUeNpMkMsOgjAQRWkpCCqQGDU+oqz9UH/PrWs1PqLGhIcCpbQOsU65ySxuznR6Z4i33W3GHiXWT6VQ+2chlbY0jlxkoENSIWvx0KVoHh+Rc4l20meG8Uad0xqta5Nl2Hl6TKDBzF1H0GBp/CqapGqQjXwW9ez2bygh1SnlyBglq9DR0aBOaS06cVehy/7LUJj5KgQymDnybbMYJEJjEwKJ0DbKohAX/SJw2rh/XTJuFoP7TAcMLdzn/hYaw5M46iFT7XW5Tg6aB47HzNhrVpdCauwzOhs6yAohb7m+7leAAQDonllq67NeygAAAABJRU5ErkJggg==") repeat-x transparent;
      }

      .dc-progress-text {
        width: 60px;
        line-height: 15px;
        text-align: center;
        color: #0081cc;
        font-size: 12px;
      }
    `
  ]
})
export class ProgressBarComponent implements OnInit {
  // 背景色#e5f0f7 字体颜色#0081cc 字号12
  @Input() width: string;
  _progress: number;

  @Input() set progress(v: number) {
    this._progress = v;
  }

  get progress() {
    return this._progress;
  }

  @Input() option: {
    showText?: boolean
  };

  constructor() {
  }

  ngOnInit() {
  }

  setWidth(target: any) {
    const pW = target.parentElement.offsetWidth;
    return Math.ceil(pW * this.progress / 100) + 'px';
  }
}
