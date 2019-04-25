import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, Output, ViewChild
} from '@angular/core';
import * as _ from 'lodash';
import {Observable} from 'rxjs';

@Component({
  selector: 'dc-step',
  template: `
    <div [ngClass]="{'step-new':newStep}">
      <div *ngIf="stepData && stepData.length > 0" class="step-box">
        <span class="step-action-left" (mouseleave)="stepActionHout()" (mouseup)="stepActionUp('right')"
              (mousedown)="stepActionDown('right')" (mouseenter)="stepActionHover('right')" *ngIf="showActionFlag"></span>
        <div class="step-ul-outer" #stepUlP>
          <div class="step-ul" #stepUl>
            <ng-template ngFor let-item [ngForOf]="stepData" let-i="index">
              <div class="step-item"
                   [ngClass]="{stepDone:(i < currentIndex),stepDoing: (i == currentIndex), stepUndo: (i > currentIndex)}">
                <div [title]="item[showKey]" class="step-desc">{{item[showKey]}}</div>
              </div>
              <div *ngIf="i !== stepData.length-1" class="step-line"
                   [ngClass]="{stepDone:(i < currentIndex),stepDoing: (i == currentIndex), stepUndo: (i > currentIndex)}"></div>
            </ng-template>
          </div>
        </div>
        <span class="step-action-right" (mouseleave)="stepActionHout()" (mouseup)="stepActionUp('left')"
              (mousedown)="stepActionDown('left')" (mouseenter)="stepActionHover('left')"
              *ngIf="showActionFlag"></span>
      </div>
    </div>
  `,
  styles: [
      `
      ul, li {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .step-box {
        display: flex;
        flex-direction: row;
        height: 55px;
      }

      .step-action-left,
      .step-action-right {
        flex-shrink: 0;
        flex-grow: 0;
        width: 30px;
        height: 30px;
        cursor: pointer;
      }

      .step-action-left {
        margin-right: 10px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjk5ODM3NTJGOEYwNjExRThBQTU5QURDMjEzMEIxMTExIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjk5ODM3NTMwOEYwNjExRThBQTU5QURDMjEzMEIxMTExIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTk4Mzc1MkQ4RjA2MTFFOEFBNTlBREMyMTMwQjExMTEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4Mzc1MkU4RjA2MTFFOEFBNTlBREMyMTMwQjExMTEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5Yp4h0AAAC6ElEQVR42sxXvasaQRDf+4iXh+g1QSuRpEi0MZA2qQQrg6DYvlajYB3SPEiRP8JKLERECSKIhWBSJLVoF5WAogiSxq9CvY/sXvbM6vO82yMPsjDs6c7Mb2d2dmaWAdYHYzCrBrMlZWbrLP7WZ+YMWCeFmK9ugjEBZQniMLHEBgABhEjGpBCk0rgUKeYhCZCckMRCoRAaj8fvt9vtF0mS5oqi7CFt9/v9T/hfZzKZfEA8iBfLCFgHa8GzJ6CPIbmLxeLL1Wr1WVVVSTUfEuJFMkgW67AEroPeoJ0PBoOULMsblXJAT2ygbBpbf0OAG1qrWyrOZrM7pEO1P5TpdHqHwXXLmUugHD4X93A4fEcDul6vDcGRLux2AWMw58CPUFCg80Gusgra6/XUXC6nzUZux2fuxBgMIPyuXxE+Ho9/ZBjGaSX8+/0+yOfzYLfbgdFodPn8oC6kkzhnFpwlBA7u7KnL5XpLAwqvFohEIiCRSBjyIp2lUukZ4WqGtJiDCpJ4kQo0mUyaiXDhcDhJJKATi1lRFN88AKg23G7360sWa8AOh+P5Q4CiIQjCCzLP8+QPjuOeGAk2Gg3QarUAjFJqUM3Xf3QfiwtvRWixWIBms6l9+/1+alCjFHksazA9/rrE5PF4QDQaBSzLAlgoQK1WowbCunWs4z3WShusNAMjwVgsBjKZDOB5HrTbbWpweNd/kEaSFivL5fLbNeFQKATS6bQtcFi1vuNafQQGehGHymp48V+Dy51Op0Y0CX+DDidxEe6sbjVHZ7NZNZVKqdVq9Sov0omrlF4oTrKUFuqBQKAPrbqFOdZxzQSv1wt8Ph/odrtanj4cDiAYDN7jg7jbSqVyW6/XUXBJ5x61XRZNqpNpWbzXCKAibhV8s9nYbgSMWp80TW222/qYNXuyBUwZBZKdZs+wvS2Xy6/m8/kn2Mp+JdrbPfpG/6E1xGO1vbXT0HMGLwmZpqH/L58w1x5t53Iq7aPttwADAHRPvaTBT/N4AAAAAElFTkSuQmCC) no-repeat center center transparent;
      }

      .step-action-right {
        margin-left: 10px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjk5MkFENTc3OEYwNjExRThBOUVFQjkzOTI3NTUyM0YyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjk5MkFENTc4OEYwNjExRThBOUVFQjkzOTI3NTUyM0YyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTkyQUQ1NzU4RjA2MTFFOEE5RUVCOTM5Mjc1NTIzRjIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTkyQUQ1NzY4RjA2MTFFOEE5RUVCOTM5Mjc1NTIzRjIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6pBYSXAAAC7klEQVR42sxXvYsaQRSf3fXcnIJ25zUiCJdgYyDYJZVgIYIg+DdoEKxDmgsp0uUfsBILsVDUxkowV1xq0S4qAUWRSCD4RdC4u3lPZi+juDprLpCBx6zue7/fvJl5HysQ/iEYzJrBzAV26r1In/VZ2CPWRWXmo4sQTpCKjEhURGYBhCFCUaiojGhmthSBLSAyiB3Emc1m/YPB4O1yuWys1+uvqqouQdabzWYM/33q9/tvUAd1qY1MMUSOnd0hfQLiyOVyz2ezWVnTtI12emxQF23QlmJwkeukl7jyTqeTBK8WmsmhKMoCbBPU+0uG3NBb3VPncDi8BQxVO3+oo9HolpLrnguHSCV6Lo5ut/vaiHQ+n5siRyy67TLlEPaJL/BS4PkYbW+r1dLS6fR25mYGLHrmdsohEGbf9RCxxGKx94Ig2A+dRa/XI6vVimQyGdJut/lCBLAQkznnLafE3OSLfD5/EwgEPhpdBJ/PtyXGBTSbTeJ2u4nL5TpJLsvyjdfrLVar1R96bLMeS8FgME4XYzji8TgJhUIE4teM5xLYxJkEtJMCJYfD8ZIH5Rxyp9P5iuXbyb2wJc9405tZcqvV+pRNJHoYWTHQ4RJ+o5eAe5RKJVKv14koiiQcDpNoNHpQD7B/gc41PP4EWYvkLwd67vF4CIQNqdVqZDKZcNmJbGmDVPfdLDF6DAVi63EkEiFXV1cH9Sj2Qwm1sD8gVL7YbLZrs9tssVhIMpkkfr/fUBcqWoctkyJDrEBl+fwvSHFMp9N7hvghjrdFvNFolGghf1RSxAT9EtMk/AlwmsSd4HX1WO4tFotaIpHQUqkUd85GTFql9EJBWI9RNpVK5R3oLg8tu1wum/UUw2iJmIjN8Jgri2dUp5NlkbsRWCy4GxIVMU41Ao/a+qAN2vK2PseaPbxwCk+7dW6zZ9jeFgqFF+Px+AO0snfY0mJry7S3d/gOdXjb23MaesngS0Ix09D/l58wxz7a9u00sx9tvwUYAP+6zi4St3UbAAAAAElFTkSuQmCC) no-repeat center center transparent;
      }

      .step-ul-outer {
        flex: 1;
        position: relative;
        overflow: hidden;
      }

      .step-ul {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 14px;
        position: absolute;
        padding: 5px 0;
        margin-left: 70px;
      }

      .step-item {
        position: relative;
        width: 12px;
        height: 12px;
        color: #0081cc;
        flex-shrink: 0;
        flex-grow: 0;
        background: #fff;
        border-radius: 6px;
        text-align: center;
      }

      .step-desc {
        position: absolute;
        top: 23px;
        left: -50px;
        width: 100px;
        overflow: hidden;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 12px;
        color: #333;
      }

      .step-item.stepDone {
        background: #0081cc;
        color: #fff;
      }

      .step-item.stepDoing {
        background: #0081cc;
        box-shadow: 0 0 0 3px rgba(0, 129, 204, 0.3);
      }

      .step-item.stepUndo {
        background: #c1c0c1;
      }

      .step-line {
        height: 1px;
        width: 100px;
        background-color: #ccc;
        flex-shrink: 0;
        flex-grow: 0;
      }

      .step-line.stepDone {
        background-color: #0081cc;
      }
      .step-new .step-item.stepDone {
        background: #3fb992;
        color: #fff;
      }
      .step-new .step-line.stepDone{
        background-color: #3fb992;
      }
      .step-new .step-item.stepDoing {
        background: #2bb1ff;
        box-shadow: 0 0 0 3px rgba(43, 177, 255, 0.3);
      }
      .step-new .step-item.stepUndo {
        background: #e1e1e1;
      }
      .step-new .step-line{
        background-color: #e1e1e1;
      }
    `
  ],
})
export class StepComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('stepUl') stepUl: ElementRef;
  @ViewChild('stepUlP') stepUlP: ElementRef;
  @Input() stepData: Array<any>;
  @Input() showKey = 'name';
  @Input() idKey = 'id';
  @Input() currentData: any;
  @Input() newStep: boolean;
  currentIndex = 0;
  showActionFlag = false;
  resizeEvent: any;
  hoverMoveTimer: any;
  itemWidth = 12;

  constructor() {
  }

  ngOnInit() {
    this.findCurrentIndex();
    this.resizeEvent = Observable.fromEvent(window, 'resize').subscribe(event => {
      this.calcIsShowStepAction();
    });
  }

  ngOnDestroy() {
    if (this.resizeEvent) {
      this.resizeEvent.unsubscribe();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.calcIsShowStepAction();
    }, 10);
    setTimeout(() => {
      this.showActionItem();
    }, 20);
  }

  showActionItem() {
    const i = this.currentIndex;
    if (i * 100 + i * this.itemWidth + 120 > this.stepUlP.nativeElement.offsetWidth) {
      if (i === this.stepData.length - 1) { // 最后一个
        this.stepUl.nativeElement.style.left = -(i * 100 + i * this.itemWidth + 120 - this.stepUlP.nativeElement.offsetWidth) + 'px';
      } else { // 非最后一个
        this.stepUl.nativeElement.style.left = -(i * 100 + i * this.itemWidth + 220 - this.stepUlP.nativeElement.offsetWidth) + 'px';
      }
    }
  }

  calcIsShowStepAction() {
    if (!this.stepUl || !this.stepUlP) {
      return false;
    }
    const l = this.stepData.length;
    const ulWidth = (l - 1) * 100 + l * this.itemWidth;
    const ulPWidth = this.stepUlP.nativeElement.offsetWidth;
    if (ulWidth + 120 > ulPWidth) {
      this.showActionFlag = true;
    } else {
      this.showActionFlag = false;
    }
  }

  findCurrentIndex() {
    if (this.currentData) {
      let flag = true;
      for (let i = 0; i < this.stepData.length; i++) {
        if (this.stepData[i][this.idKey] == this.currentData[this.idKey]) {
          this.currentIndex = i;
          flag = false;
          break;
        }
      }
      if (flag) {
        this.currentIndex = this.stepData.length;
      }
    } else {
      this.currentIndex = this.stepData.length;
    }
  }

  stepActionHout() {
    if (this.hoverMoveTimer) {
      clearInterval(this.hoverMoveTimer);
      this.hoverMoveTimer = null;
    }
  }

  stepActionHover(offset: string) {
    if (this.hoverMoveTimer) {
      clearInterval(this.hoverMoveTimer);
      this.hoverMoveTimer = null;
    }
    this.hoverMoveTimer = setInterval(() => {
      this.stepUlMove(offset, 2);
    }, 10);
  }

  stepActionDown(offset: string) {
    if (this.hoverMoveTimer) {
      clearInterval(this.hoverMoveTimer);
      this.hoverMoveTimer = null;
    }
    this.hoverMoveTimer = setInterval(() => {
      this.stepUlMove(offset, 6);
    }, 10);
  }

  stepActionUp(offset: string) {
    if (this.hoverMoveTimer) {
      clearInterval(this.hoverMoveTimer);
      this.hoverMoveTimer = null;
    }
    this.hoverMoveTimer = setInterval(() => {
      this.stepUlMove(offset, 1);
    }, 10);
  }

  stepUlMove(offset: string, step: number) {
    const stepUl = this.stepUl.nativeElement;
    const left = stepUl.offsetLeft - 70;
    const l = this.stepData.length;
    const ulWidth = (l - 1) * 100 + l * this.itemWidth + 120;
    const ulPWidth = this.stepUlP.nativeElement.offsetWidth;
    let leftRes = 0;
    if (offset === 'left') {
      if (ulWidth - Math.abs(left) <= ulPWidth) {
        leftRes = left;
      } else {
        if (ulWidth - Math.abs(left) - step <= ulPWidth) {
          leftRes = -(ulWidth - ulPWidth);
        } else {
          leftRes = left - step;
        }
      }
    } else if (offset === 'right') {
      if (left >= 0) {
        leftRes = 0;
      } else {
        if (left + step >= 0) {
          leftRes = 0;
        } else {
          leftRes = left + step;
        }
      }
    }
    stepUl.style.left = leftRes + 'px';
  }
}
