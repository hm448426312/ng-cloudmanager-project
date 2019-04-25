import { OnInit, EventEmitter, OnChanges, SimpleChanges, ComponentFactoryResolver } from '@angular/core';
import { Router } from '@angular/router';
import { PinyinService } from '../pinyin.service';
export declare class AutoCompleteComponent implements OnInit, OnChanges {
    private resolver;
    private router;
    private pinyinService;
    showContainer: boolean;
    source: any;
    width: any;
    textChangeEvent: EventEmitter<{}>;
    text: string;
    show_source: Array<any>;
    constructor(resolver: ComponentFactoryResolver, router: Router, pinyinService: PinyinService);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    blur(): void;
    focus(): void;
    press(event: any): void;
    changeText(): void;
    selectText(t: any): void;
}
