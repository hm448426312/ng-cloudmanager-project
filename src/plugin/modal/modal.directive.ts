import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[dcModalContainerHost]'
})

export class ModalContainerDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}