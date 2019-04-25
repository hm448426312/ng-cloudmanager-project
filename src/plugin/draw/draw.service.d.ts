import { ComponentFactory, ComponentFactoryResolver, ApplicationRef, Injector } from '@angular/core';
import { DrawComponent } from "./draw.component";
export declare class DrawService {
    private resolver;
    private applicationRef;
    private injector;
    promise: Promise<{}>;
    ref: any;
    component: ComponentFactory<DrawComponent>;
    constructor(resolver: ComponentFactoryResolver, applicationRef: ApplicationRef, injector: Injector);
    open(data: any): void;
}
