import {Component, OnInit} from '@angular/core';
import * as _ from 'lodash';

@Component({
  template: `
    <dc-table-new #tableNew [datas]="tableData" [headers]="headerConfig" [options]="tableOptions" (sortEvent)="sortEvent($event)">
      <ng-template let-data>
        <dc-table-column-new [header]="data.h" [data]="data.d" [field]="'No'">
          {{data.d.No}}
        </dc-table-column-new>
        <dc-table-column-new [header]="data.h" [data]="data.d" [field]="'name'">
          {{data.d.name}}
        </dc-table-column-new>
        <dc-table-column-new [header]="data.h" [field]="'action'">
          操作
        </dc-table-column-new>
      </ng-template>
    </dc-table-new>
    <div style="margin-top: 10px;" *ngIf="pager && pager.total != 0">
      <dc-pagination [total]="pager.total" [pageSize]="pager.limit" [nowPage]="pager.page"
                     (nowPageChange)="nowPageChange($event)"></dc-pagination>
    </div>
  `,
  styles: [``]
})
export class BlankTableNewComponent implements OnInit {
  pager;
  filter;
  sorter;
  tableData = [];
  tableOptions = {
    // maxHeight: '200px', // 表格内容最大高度
    // minHeight: '100px', // 表格内容最小高度
    checkbox: true, // 表格是否支持复选框
    loading: true, // 表格是否有loading状态，自己赋值为false取消loading
    multiple: true, // 表格复选框是否支持多选
    showIndex: true, // 是否显示序号列
    keyId: 'id', // 默认为ID，对比数据的key值
  };
  headerConfig = [
    {
      field: 'No', // 显示字段
      title: '编号', // 表头显示
      // canSort: true, // 是否可排序
      // defaultSort: 'asc', // 默认排序方式 asc|desc
      width: '100px', // 单元格宽度
      filter: { // 过滤配置
        type: 'text', // 过滤类型 text | checkList | date
        // defaultText: 'aaaa', // 过滤框默认显示的问题
        // showFilterDrop: true, // 是否默认显示该字段的过滤框
        offset: 'right', // 过滤框偏移方向，右
        fn: (filter) => { // 过滤回调方法
          if (filter || this.filter['No']) { // 该判断必须存在，否则IE会点开就调用
            this.filterEvent('No', filter);
          }
        },
        // placeholder: '自定义配置', // type为text的时候，该配置为input的placeholder值
      },
    }, {
      field: 'name', // 显示字段
      title: '名称', // 表头显示
      // canSort: true, // 是否可排序
      // defaultSort: 'asc', // 默认排序方式 asc|desc
      width: '100px', // 单元格宽度
      flex: 1, // 是否自适应宽，值为自适应宽的比例
      filter: { // 过滤配置
        type: 'text', // 过滤类型 text | checkList | date
        // defaultText: 'aaaa', // 过滤框默认显示的问题
        // showFilterDrop: true, // 是否默认显示该字段的过滤框
        offset: 'left', // 过滤框偏移方向，右
        fn: (filter) => { // 过滤回调方法
          if (filter || this.filter['name']) { // 该判断必须存在，否则IE会点开就调用
            this.filterEvent('name', filter);
          }
        },
        // placeholder: '自定义配置', // type为text的时候，该配置为input的placeholder值
      },
    }, {
      field: 'action', // 显示字段
      title: '操作', // 表头显示
      width: '150px', // 单元格宽度
    }
  ];

  constructor() {
  }

  ngOnInit() {
    this.initFilter();
    this.initSorter();
    this.initPager();
  }

  // 初始化分页
  initPager() {
    this.pager = {
      size: 5,
      page: 1,
      total: 0
    };
  }

  // 初始化过滤条件
  initFilter() {
    this.filter = {};
    /**
     * fitler = {
     *  description: 'string',
     *  currentFlow: '1,2,3',
     *  applicant: 'string'
     * }
     */
  }

  // 初始化排序条件
  initSorter() {
    this.sorter = {};
    /**
     * sorter = {
     *  orderBy: 'key',
     *  sort: 'asc' | 'desc'
     * }
     */
  }

  // 组合参数
  // 如果有自身的其他参数，参考filter,pager,sorter
  groupParams() {
    const params = {};
    _.assign(params, this.pager, this.filter, this.sorter);
    return params;
  }

  filterEvent(key, val) {
    this.initPager();
    if (!val) {
      delete this.filter[key];
    } else {
      this.filter[key] = val;
    }
    this.getData();
  }

  // 切换页码
  nowPageChange(ev) {
    this.pager.page = ev;
    this.getData();
  }

  // 列表排序
  sortEvent(ev) {
    this.sorter = {
      orderBy: ev.field,
      sort: ev.sort,
    };
    this.getData();
  }

  getData() {
    // 参数为: this.groupParams()
    this.tableData = [{
      No: 'xx1',
      name: 'name1'
    }, {
      No: 'xx2',
      name: 'name2'
    }];
  }
}
