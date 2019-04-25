import { EventEmitter, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { TableColumnComponent } from './column.component';
export declare class TableComponent implements OnInit {
    private router;
    template: TemplateRef<TableColumnComponent>;
    filterTemplate: any;
    headers: Array<any>;
    _datas: any;
    datas: any;
    checkBox: boolean;
    sortEvent: EventEmitter<number>;
    checkEvent: EventEmitter<any>;
    nowSort: any;
    allSelect: boolean;
    checks: Array<boolean>;
    checks_data: any[];
    constructor(router: Router);
    ngOnInit(): void;
    private initCheck();
    ngAfterContentInit(): void;
    allSelectCheck(): void;
    checkSelect(): void;
    private sendCheckEvent();
    sort(header: any): void;
    showFilter: any[];
    showFilterBox(event: any): void;
    clickFilter(event: any, header: any): void;
    onDocumentClick($event: any): void;
}
