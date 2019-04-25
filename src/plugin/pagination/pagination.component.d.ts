import { OnInit, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
export declare class PaginationComponent implements OnInit, OnChanges {
    showAfterDot: boolean;
    showBeforeDot: boolean;
    maxPage: number;
    jump: number;
    showList: Array<number>;
    total: number;
    pageSize: number;
    nowPage: number;
    nowPageChange: EventEmitter<{}>;
    paginationEvent: EventEmitter<{}>;
    constructor();
    ngOnInit(): void;
    private draw();
    jumpPage(page?: any): void;
    pressInput(event: any): void;
    ngOnChanges(changes: SimpleChanges): void;
}
