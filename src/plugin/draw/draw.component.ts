import {
  Component, OnChanges, OnInit, DoCheck, OnDestroy, SimpleChanges, ComponentFactoryResolver, ViewChild, ViewContainerRef,
  HostListener, ElementRef, Injector, ComponentRef, ReflectiveInjector, ApplicationRef, Input, AfterViewInit
} from '@angular/core';
import {Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RoutesRecognized} from '@angular/router';

export interface CanDraw {
  beforeLeave(): boolean | Promise<boolean>;

  beforeClose(): void;
}


@Component({
  selector: 'drawer',
  template: `
    <div *ngIf="mark === undefined ? true : mark" class="draw-back"></div>
    <div class="draw-container" [style.top]="top" [style.height]="calcHeight()" [ngClass]="{'show':show}"
         [style.width]="width ? width : '66%'">
      <div *ngIf="title" class="dc-draw-header">
        <div class="dc-draw-title"><img *ngIf="iconCls" class="draw-img" [src]="iconCls"/>{{title}}</div>
        <div class="dc-draw-close" (click)="onHidden()"></div>
      </div>
      <div class="dc-draw-content" [style.overflow]="getOverFlow()" [style.padding]="padding? padding : '20px'">
        <ng-template #componentContainer></ng-template>
      </div>
    </div>
  `,
  styles: [
      `
      .draw-back {
        position: fixed;
        width: 100%;
        height: 100%;
        opacity: 0.2;
        background: #000;
        z-index: 1002;
      }

      .draw-container {
        opacity: 1;
        width: 66%;
        position: fixed;
        height: 100vh;
        right: 0;
        max-width: 0;
        transition: max-width 0.5s ease-in, color 0.3s ease-out;
        box-shadow: -2px 0px 15px 0px #888888;
        background: #fcfcfc;
        overflow-x: hidden;
        overflow-y: auto;
        z-index: 1003;
        display: flex;
        flex-direction: column;
      }

      .dc-draw-header {
        /*box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, .1);*/
        padding: 0 20px;
        font-size: 18px;
        font-weight: bold;
        height: 50px;
        line-height: 50px;
        flex-grow: 0;
        flex-shrink: 0;
        position: relative;
        border-bottom: solid 1px #ccc;
      }

      .draw-img {
        margin: 0 5px 4px 0;
      }

      .dc-draw-title {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        width: calc(100% - 46px);
      }

      .dc-draw-close {
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAfCAMAAAAocOYLAAAATlBMVEUAAAAAAAAAAAAAAAAAAACcnJzw8PDk5OT+/v7W1tb+/v78/Pz4+Pj29vb09PTm5ub9/f3R0dGVlZX////x8fF9fX1mZmZ/f3/5+fmJiYmRqov8AAAAE3RSTlMABgkOES6kevRd+ufSw7+F8lgpV5JIPgAAAOBJREFUKM+lk+kSgyAMhAsRj3obz/d/0UYUVoszdKb7Qxm+TSaE8PpdSiktkt8z1USJiEgsT9RkTcVcNZkJHEKHlL3SQRx33Od8Ud5bA3DGX8ouBkUFBypI+XDTycY6OjSu8umMVi483fG2jCdett2QknLhdneaxWDxPNnFmUBRyzAAc0sHT2qGAZjrg+ukZG+YJo+5TPTB3wwDML/jHPld5bZI5Ed9Z+UjDDW58wGjDzifNsDumOgP+muxNaC/Z4I8vJ9cwiP3G58PGIr7fBXBAJrrfBrgyHxH3kfkff2vD54SI6E1SleBAAAAAElFTkSuQmCC) no-repeat center;
        width: 31px;
        height: 31px;
        position: absolute;
        right: 15px;
        top: 10px;
        cursor: pointer;
      }

      .draw-container.show {
        max-width: 100%;
      }

      .dc-draw-content {
        flex: 1;
        height: 100px;
      }

      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      ::-webkit-scrollbar-track,
      ::-webkit-scrollbar-thumb {
        border-radius: 999px;
        border: 0 solid transparent;
      }

      ::-webkit-scrollbar-thumb {
        min-height: 20px;
        max-height: 100px;
        box-shadow: 0 0 0 5px rgba(201, 201, 201, 1) inset;
      }

      ::-webkit-scrollbar-corner {
        background: transparent;
      }
    `
  ]
})

export class DrawComponent implements OnChanges, OnInit, DoCheck, OnDestroy, AfterViewInit {
  instance: any;
  show: any;
  injectComponet: any;
  @Input() data: any;
  @Input() handler: any;
  @Input() padding: any; // 手动设置drawer边距
  @Input() title: string; // 需传入的title
  @Input() iconCls: any; // title图标
  @Input() width: any; // draw的宽度
  @Input() mark: boolean; // 是否需要模态背景
  @Input() hiddenScroll: boolean; // 是否需要隐藏滚动条
  @Input() top: string; // 手动设置距离上面的位置
  componentRef: any;
  beforeLeave: any;
  firstInit: any;
  closeResolve: any;
  routerChangeEvent: any;
  @ViewChild('componentContainer', {read: ViewContainerRef}) container: ViewContainerRef;

  constructor(private router: Router, private resolver: ComponentFactoryResolver,
              private elementRef: ElementRef, private injector: Injector, private applicationRef: ApplicationRef) {
    this.show = false;
    this.firstInit = true;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: any) {
    // 第一次点击无效
    if (this.firstInit) {
      this.firstInit = false;
      return;
    }

    // 如果点击的是mark背景div则关闭组件
    if (this.elementRef.nativeElement.querySelector('.draw-back') === event.target) {
      let result = this.componentRef.instance.beforeLeave();
      if (typeof (result) == 'boolean' && result) {
        this.closeComponent();
      }
      if (typeof (result) == 'object' && result.then) {
        result.then((r: any) => {
          if (r) {
            this.closeComponent();
          }
        });
      }
    }

    if (!document.getElementsByTagName('app-root')[0].contains(event.target)
      && !event.target.contains(document.getElementsByTagName('app-root')[0])) {
      return;
    }

    if (!this.elementRef.nativeElement.contains(event.target)) {
      let result = this.componentRef.instance.beforeLeave();
      if (typeof (result) == 'boolean' && result) {
        this.closeComponent();
      }
      if (typeof (result) == 'object' && result.then) {
        result.then((r: any) => {
          if (r) {
            this.closeComponent();
          }
        });
      }
    }
  }

  calcHeight() {
    if (this.top) {
      return 'calc( 100vh - ' + this.top + ' )';
    } else {
      return '100vh';
    }
  }

  closeComponent(): void {
    this.show = false;
    setTimeout(() => {
      this.container.clear();
      this.closeResolve('close');
      document.body.style.overflow = 'auto';
    }, 500);
  }

  getOverFlow() {
    if (this.hiddenScroll == null || !this.hiddenScroll) {
      return 'auto';
    }

    if (this.hiddenScroll) {
      return 'hidden';
    }
  }

  //关闭drawer
  onHidden(): void {
    this.closeComponent();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.show = true;
    });
  }

  ngOnDestroy(): void {
    this.container.clear();
    if (this.routerChangeEvent) {
    }
    this.routerChangeEvent = null;
  }

  ngDoCheck(): void {

  }

  //判断是否出现滚动条
  isScrollY() {
    return document.documentElement.offsetHeight > document.documentElement.clientHeight;
  }

  ngOnInit(): void {
    this.container.clear();
    this.componentRef = this.container.createComponent(this.resolver.resolveComponentFactory(this.injectComponet));
    this.instance = this.componentRef.instance;
    this.instance.data = this.data;
    this.instance.handler = this.handler;
    if (this.isScrollY()) {
      document.body.style.overflow = 'hidden';
    }
    this.routerChangeEvent = this.router.events.subscribe((ev: any) => {
      this.closeComponent();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {

  }
}
