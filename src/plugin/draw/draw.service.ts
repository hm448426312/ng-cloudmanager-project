import {
  ViewChild, ViewContainerRef, ComponentFactory,
  ComponentFactoryResolver, OnDestroy, Injectable, ElementRef, ApplicationRef, Injector, HostListener
} from '@angular/core';
import {DrawComponent} from './draw.component';

@Injectable()
export class DrawService {
  promise: Promise<{}>;
  ref: any;
  component: ComponentFactory<DrawComponent>;

  constructor(private resolver: ComponentFactoryResolver, private applicationRef: ApplicationRef, private injector: Injector) {
  }

  open(data: any) {
    if (this.component != null) {
      return;
    }
    this.component = this.resolver.resolveComponentFactory(DrawComponent);
    let node = document.body.insertBefore(document.createElement(this.component.selector), document.body.firstChild);
    this.ref = this.component.create(this.injector, [], node);
    let instance = this.ref.instance;
    instance.injectComponet = data.component;
    instance.data = data.data;
    instance.handler = data.handler;
    instance.padding = data.padding;
    instance.title = data.title;
    instance.iconCls = data.iconCls;
    instance.width = data.width;
    instance.mark = data.mark;
    instance.top = data.top;
    instance.hiddenScroll = data.hiddenScroll;
    this.applicationRef.attachView(this.ref.hostView);

    this.promise = new Promise(resolve => {
      instance.closeResolve = resolve;
    });
    this.promise.then(r => {
      this.ref.destroy();
      this.component = null;
      this.ref = null;
      this.promise = null;
    });
    return instance;
  }


}
