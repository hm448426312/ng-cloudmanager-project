import { OnChanges, OnInit, DoCheck, OnDestroy, SimpleChanges, ComponentFactoryResolver, ViewContainerRef, ElementRef, Injector, ApplicationRef } from '@angular/core';
import { Router } from '@angular/router';
export interface CanDraw {
    beforeLeave(): boolean | Promise<boolean>;
    beforeClose(): void;
}
export declare class DrawComponent implements OnChanges, OnInit, DoCheck, OnDestroy {
    private router;
    private resolver;
    private elementRef;
    private injector;
    private applicationRef;
    instance: any;
    show: any;
    injectComponet: any;
    data: any;
    componentRef: any;
    beforeLeave: any;
    firstInit: any;
    closeResolve: any;
    container: ViewContainerRef;
    constructor(router: Router, resolver: ComponentFactoryResolver, elementRef: ElementRef, injector: Injector, applicationRef: ApplicationRef);
    onClick(event: any): void;
    private closeComponent();
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    ngDoCheck(): void;
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
}
