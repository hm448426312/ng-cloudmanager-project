import {Component, Input, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {TablePagingService} from '../../../plugin/table-paging/table.paging.service';

@Component({
  selector: 'app-demo-table',
  template: `
    <dc-button (click)="closeModal()" [text]="'关闭弹框'"></dc-button>
    <dc-button (click)="showThis=!showThis" [text]="'表格隐藏测试'"></dc-button>
    <div [hidden]="showThis">
      <dc-table
        [datas]="tableData"
        [headers]="tableHeader"
        [parentHidden]="showThis"
        [checkBox]="true" [oddEven]="true" (sortEvent)="sort($event)">
        <ng-template let-data>
          <dc-table-column [header]="data.h" [data]="data.d" [isTdCenter]="'true'" [width]="data.w" [field]="'field1'">
            {{data.d.field1}}
          </dc-table-column>
          <dc-table-column [header]="data.h" [data]="data.d" [width]="data.w" [field]="'field2'">
            <div>{{data.d.field2}}</div>
          </dc-table-column>
          <dc-table-column [header]="data.h" [data]="data.d" [width]="data.w" [field]="'field3'">
            <div>{{data.d.field3}}</div>
          </dc-table-column>
          <dc-table-column [header]="data.h" [width]="data.w" [field]="'field4'">
            <div>操作</div>
          </dc-table-column>
        </ng-template>
      </dc-table>
      <dc-pagination [total]="tabTotal" [nowPage]="tabPage" [pageSize]="tabLimit"
                     (nowPageChange)="pageChange($event)"></dc-pagination>
    </div>
  `,
  styleUrls: []
})
export class DemoTableComponent implements OnInit {
  showThis: boolean;
  @Input() handler;

  constructor(private tablePagingService: TablePagingService) {
  }

  tableHeader;
  tableData = [];
  tableDatabak;

  filterKey = [];
  filterVal = [];
  filterMatch = [];
  sortKey = '';
  sortVal = '';
  tabLimit = 3;
  tabPage = 1;
  tabTotal = 0;

  ngOnInit() {
    this.setHeader();
    this.setData();
    /*setTimeout(() => {
      this.tableData[1].readOnly = true;
    }, 5000);*/
  }

  closeModal() {
    this.handler();
  }

  beforeLeave(): boolean | Promise<boolean> {
    return new Promise(resolve => {
      resolve(true);
    });
  }

  filterEvent(key: any, value: any) {
    console.log(key, value);
    let flag = true;
    let index = _.findIndex(this.filterKey, (o) => {
      return o == key;
    });
    if (index !== -1) {
      if (value) {
        this.filterVal[index] = value;
      } else {
        this.filterKey.splice(index, 1);
        this.filterVal.splice(index, 1);
        this.filterMatch.splice(index, 1);
      }
    } else {
      this.filterKey.push(key);
      this.filterVal.push(value);
      this.filterMatch.push('dim');
    }
    this.filterData();
  }

  sort(ev) {
    if (ev.sort) {
      this.sortKey = ev.field;
      this.sortVal = ev.sort;
    } else {
      this.sortKey = '';
      this.sortVal = '';
    }
    this.filterData();
  }

  pageChange(ev) {
    this.tabPage = ev;
    this.filterData();
  }

  setHeader() {
    this.tableHeader = [
      {
        field: 'field1',
        title: 'th1',
        width: '50%',
        hideTitle: true,
        isThCenter: 'true',
        filter: {
          type: 'text',
          offsetLeft: true,
          fn: (event) => {
            this.filterEvent('field1', event);
          }
        }
      }, {
        field: 'field2',
        title: 'th2',
        width: '10%',
        canSort: true,
        filter: {
          type: 'checkList',
          optionList: [
            {
              check: true,
              name: '状态1'
            }, {
              check: true,
              name: '状态2'
            }
          ],
          fn: (event) => {
            this.filterEvent('field2', event);
          }
        }
      }, {
        field: 'field3',
        title: 'th3',
        width: '20%',
        canSort: true,
        filter: {
          type: 'text',
          fn: (event) => {
          }
        }
      }, {
        field: 'field4',
        title: 'opration',
        canSort: true,
        width: '20%',
      }
    ];
  }

  setData() {
    const data = [
      {
        id: '1',
        field1: '胡淼1',
        field2: '第二列1',
        field3: '第三列1',
        readOnly: true
      }, {
        id: '2',
        field1: '胡淼1',
        field2: '第二列2',
        field3: '第三列1',
      }, {
        id: '3',
        field1: '胡淼1',
        field2: '第二列1',
        field3: '第三列1',
      }, {
        id: '4',
        field1: '胡淼2',
        field2: '第二列1',
        field3: '第三列1',
      }, {
        id: '5',
        field1: '胡淼2',
        field2: '第二列1',
        field3: '第三列1',
      }
    ];
    this.tableDatabak = _.cloneDeep(data);
    this.filterData();
  }

  filterData() {
    const result = this.tablePagingService.filterTableData(this.tableDatabak, {
      key: this.filterKey,
      value: this.filterVal,
      match: this.filterMatch
    });
    this.tabTotal = result.length;
    setTimeout(() => {
      this.tableData = result.slice((this.tabPage - 1) * this.tabLimit, (this.tabPage - 1) * this.tabLimit + this.tabLimit);
    }, 2000);
  }
}
