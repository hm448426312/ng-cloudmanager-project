import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[dcTabContentHost]'
})

export class TabContentDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}