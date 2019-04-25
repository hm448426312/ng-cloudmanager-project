import { ElementRef, OnInit } from '@angular/core';
export declare class SelectComponent implements OnInit {
    options: any;
    defaultSelect: any;
    isReadonly: any;
    moreOption: ElementRef;
    constructor();
    ngOnInit(): void;
    onDocumentClick(ev: any): void;
    showOption(ev: any): void;
    changeItem(item: any): void;
}
