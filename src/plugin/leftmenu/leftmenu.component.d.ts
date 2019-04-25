import { OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
export declare class LeftMenuComponent implements OnDestroy {
    private router;
    ngOnDestroy(): void;
    routerlistener: Subscription;
    menus: Array<any>;
    constructor(router: Router);
    menuClick(menu: any): void;
    subMenuClick(menu: any, submenu: any): void;
}
