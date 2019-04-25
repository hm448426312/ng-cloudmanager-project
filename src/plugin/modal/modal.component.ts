import * as _ from 'lodash';
import {Component, ViewChild, Input, Renderer, OnInit, OnDestroy, ElementRef} from '@angular/core';
import {ModalContainerDirective} from './modal.directive';
import {Observable} from 'rxjs';
import {DocumentRef} from '../document-ref/document-ref.service';
import {Router} from '@angular/router';

@Component({
  selector: 'dc-modal',
  template: `
    <div class="dc-modal-backdrop"></div>
    <div class="dc-modal-click" (click)="onModalClick($event)">
      <div #mdalOuter class="dc-modal-box" tabindex="1" [style.width]="width">
        <div *ngIf="title && !hideTitle" class="dc-modal-header" [ngStyle]="setHeaderShadow(noHeaderShadow)">
          <div class="dc-modal-title">
            <img *ngIf="iconCls" src="{{iconCls}}">
            {{title}}
          </div>
          <div *ngIf="!hideClose" class="dc-modal-close" (click)="onHidden()"></div>
        </div>
        <div class="dc-modal-content">
          <template dcModalContainerHost></template>
        </div>
      </div>
    </div>
  `,
  styles: [
      `.dc-modal-backdrop,
    .dc-modal-click {
      position: fixed;
      width: 100%;
      height: 100%;
      opacity: 0.2;
      background: #000;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 1004;
    }

    .dc-modal-click {
      opacity: 1;
      background: transparent;
      z-index: 1010;
      overflow-y: auto;
      display: block;
      display: -ms-flexbox;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center
    }

    .dc-modal-box {
      width: 60%;
      box-shadow: 5px 5px 20px 0 rgba(0, 0, 0, .2);
      margin: 0 auto;
      background: #fff;
    }

    .dc-modal-header {
      /*box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, .1);*/
      padding: 0 20px;
      font-size: 18px;
      font-weight: bold;
      height: 50px;
      line-height: 50px;
      position: relative;
    }

    .dc-modal-title {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      width: calc(100% - 46px);
      display: flex;
      align-items: center;
    }

    .dc-modal-title img {
      margin-right: 5px;
    }

    .dc-modal-close {
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAfCAMAAAAocOYLAAAATlBMVEUAAAAAAAAAAAAAAAAAAACcnJzw8PDk5OT+/v7W1tb+/v78/Pz4+Pj29vb09PTm5ub9/f3R0dGVlZX////x8fF9fX1mZmZ/f3/5+fmJiYmRqov8AAAAE3RSTlMABgkOES6kevRd+ufSw7+F8lgpV5JIPgAAAOBJREFUKM+lk+kSgyAMhAsRj3obz/d/0UYUVoszdKb7Qxm+TSaE8PpdSiktkt8z1USJiEgsT9RkTcVcNZkJHEKHlL3SQRx33Od8Ud5bA3DGX8ouBkUFBypI+XDTycY6OjSu8umMVi483fG2jCdett2QknLhdneaxWDxPNnFmUBRyzAAc0sHT2qGAZjrg+ukZG+YJo+5TPTB3wwDML/jHPld5bZI5Ed9Z+UjDDW58wGjDzifNsDumOgP+muxNaC/Z4I8vJ9cwiP3G58PGIr7fBXBAJrrfBrgyHxH3kfkff2vD54SI6E1SleBAAAAAElFTkSuQmCC) no-repeat center;
      width: 31px;
      height: 31px;
      position: absolute;
      right: 15px;
      top: 10px;
      cursor: pointer;
    }

    .dc-modal-content {
      min-height: 100px;
    }`
  ]
})
export class ModalComponent implements OnInit, OnDestroy {
  @ViewChild(ModalContainerDirective) modalContainerHost: ModalContainerDirective;
  @ViewChild('mdalOuter') mdalOuter: ElementRef;
  @Input() id: string;
  @Input() title: string;
  @Input() width: string;
  @Input() hideClose: boolean;
  @Input() hideTitle: boolean;
  @Input() backdropCloseable: boolean;
  @Input() beforeHidden: () => boolean | Promise<boolean> | Observable<boolean>;
  @Input() noHeaderShadow: boolean;
  @Input() iconCls: any;

  constructor(private doc: DocumentRef, private renderer: Renderer,
              private router: Router) {
    this.backdropCloseable = _.isUndefined(this.backdropCloseable) ? true : this.backdropCloseable;
  }

  routerChangeEvent: any;

  ngOnInit() {
    this.routerChangeEvent = this.router.events.subscribe((ev: any) => {
      this.hide();
    });
  }

  ngOnDestroy() {
    if (this.routerChangeEvent) {
    }
    this.routerChangeEvent = null;
  }

  onHidden() {
  }

  canHideModel() {
    let hiddenResult = Promise.resolve(true);
    if (this.beforeHidden) {
      const result: any = this.beforeHidden();
      if (typeof result !== undefined) {
        if (result.then) {
          hiddenResult = result;
        } else if (result.subscribe) {
          hiddenResult = (result as Observable<boolean>).toPromise();
        } else {
          hiddenResult = Promise.resolve(result);
        }
      }
    }
    return hiddenResult;
  }

  onModalClick = ($event: any) => {
    if (this.backdropCloseable && !this.mdalOuter.nativeElement.contains($event.target)) {
      this.hide();
    }
  }

  setHeaderShadow(has: any) {
    let boxShadow: any;
    if (!has) {
      boxShadow = {
        'box-shadow': '0px 0px 40px 0px rgba(0, 0, 0, .1)'
      };
    }
    return boxShadow;
  }

  hide() {
    this.canHideModel().then((canHide) => {
      if (!canHide) {
        return;
      }
      this.renderer.setElementClass(this.doc.body, 'modal-open', false);
      this.onHidden();
    });
  }

  show() {
    this.renderer.setElementClass(this.doc.body, 'modal-open', true);
  }
}
