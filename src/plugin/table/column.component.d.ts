import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
export declare class TableColumnComponent implements OnInit {
    private router;
    ngOnInit(): void;
    header: any;
    data: any;
    field: string;
    show: boolean;
    constructor(router: Router);
}
