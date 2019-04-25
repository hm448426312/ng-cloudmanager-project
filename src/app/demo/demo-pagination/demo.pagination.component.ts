import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-demo-page',
  template: `
    <div *ngIf="pager" style="margin-top: 200px;">
      <dc-pagination [total]="299000" [pageSize]="pager.limit" [nowPage]="pager.page" [pageNum]="pager.pageNum"
                     (nowPageChange)="nowPageChange($event)"></dc-pagination>
    </div><br>
    <div *ngIf="pager2">
      <dc-pagination [total]="pager2.total" [hideSizeList]="true" [pageSize]="20" [nowPage]="pager2.page" [pageNum]="pager2.pageNum"
                     (nowPageChange)="nowPageChange($event)"></dc-pagination>
    </div><br>
    <div *ngIf="pager3">
      <dc-pagination [total]="pager3.total"  [pageSize]="5" [nowPage]="pager3.page"
                     [pageNum]="pager3.pageNum" (pageSizeChange)="pageSizeChange($event)" [hideSizeList]="true"
                     (nowPageChange)="nowPageChange($event)"></dc-pagination>
    </div>
  `,
  styleUrls: []
})
export class DemoPaginationComponent implements OnInit {
  constructor() {
  }

  pager;
  pager2;
  pager3;

  ngOnInit() {
    this.pager = {
      total: 100,
      limit: 20,
      page: 1
    };
    this.pager2 = {
      total: 100,
      limit: 5,
      page: 1,
      pageNum: 3
    };
    this.pager3 = {
      total: 40,
      limit: 5,
      page: 1,
      pageNum: 1
    };
  }

  nowPageChange(pageNum) {
    // pageNum 当前页
  }
  pageSizeChange(limit){
    // 切换size之后，组件内部的页码重置为第一页，业务代码需要自行改变
  }
}
