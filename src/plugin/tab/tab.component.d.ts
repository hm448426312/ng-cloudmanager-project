import { OnInit, EventEmitter, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Router } from '@angular/router';
export declare class TabComponent implements OnInit {
    private resolver;
    private router;
    _tabDatas: any;
    tabDatas: any;
    ref: any;
    tabChangeEvent: EventEmitter<{}>;
    nowSelectTab: any;
    dyComponent: ViewContainerRef;
    constructor(resolver: ComponentFactoryResolver, router: Router);
    ngOnInit(): void;
    init(): void;
    changeTab(tab: any): void;
}
