import {
  ViewChild, ViewContainerRef, ComponentFactory,
  ComponentFactoryResolver, OnDestroy, Injectable, ElementRef, ApplicationRef, Injector, HostListener, ComponentRef
} from '@angular/core';
import {TipComponent} from './tip.component';

@Injectable()
export class TipService {
  node: HTMLElement;
  promise: Promise<{}>;
  ref: any;
  component: ComponentFactory<{}>;

  constructor(private resolver: ComponentFactoryResolver,
              private applicationRef: ApplicationRef, private injector: Injector) {


  }

  show(data: any) {
    if (this.component != null) {
      this.close();
    }

    this.component = this.resolver.resolveComponentFactory(TipComponent);
    this.node = document.body.insertBefore(document.createElement('tip'), document.body.firstChild);
    this.node.style.width = '100%';
    this.node.style.display = 'flex';
    this.node.style.flexDirection = 'row-reverse';
    this.ref = this.component.create(this.injector, [], this.node);
    let instance = this.ref.instance;
    instance.data = data;
    this.applicationRef.attachView(this.ref.hostView);
    // this.promise = new Promise(resolve => {
    //   instance.closeResolve = resolve;
    // });
    // this.promise.then(r => {
    //   this.close();
    // });
    setTimeout(() => {
      this.close();
    }, 3000);
  }

  private close() {
    if(this.ref){
      this.ref.destroy();
    }
    this.component = null;
    this.ref = null;
    this.promise = null;
  }
}
