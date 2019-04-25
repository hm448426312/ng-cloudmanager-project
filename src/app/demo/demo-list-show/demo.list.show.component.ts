import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-demo-list-show',
  template: `
    <button (click)="getData()">获取数据</button>
    <div #test style="width: 40%; margin: 10px;">
      <dc-list-show #dcListShow (removeItemEmit)="removeItemEmit($event)" [itemWidth]="itemWidth" [canDelete]="canDelete" [data]="listData"
                    [idKey]="idKey" [showKey]="showKey"></dc-list-show>
    </div>
    <div>
      <dc-table-new #tableNew [datas]="tableData" [headers]="headerConfig" [options]="tableOptions" (checkEvent)="checkEvent($event)">
        <ng-template let-data>
          <dc-table-column-new [header]="data.h" [data]="data.d" [field]="'No'">
            {{data.d.No}}
          </dc-table-column-new>
          <dc-table-column-new [header]="data.h" [data]="data.d" [field]="'index'">
            {{data.d.index}}
          </dc-table-column-new>
          <dc-table-column-new [header]="data.h" [data]="data.d" [field]="'name'">
            {{data.d.name}}
          </dc-table-column-new>
          <dc-table-column-new [header]="data.h" [data]="data.d" [field]="'desc'">
            {{data.d.desc}}
          </dc-table-column-new>
          <dc-table-column-new [header]="data.h" [field]="'action'">
            操作
          </dc-table-column-new>
        </ng-template>
      </dc-table-new>
    </div>
  `,
  styles: [`
  `]
})
export class DemoListShowComponent implements OnInit {
  @ViewChild('dcListShow') dcListShow;
  @ViewChild('tableNew') tableNew;
  itemWidth = 100; // number 每个元素的宽度，默认80
  canDelete = true; // boolean 是否可删除， 默认false
  idKey = 'id';
  showKey = 'name';
  text;
  listData = [
    {
      name: 'namenamenamenamename1',
      id: '1'
    },
  ];


  tableOptions = {
    // maxHeight: '200px',
    // minHeight: '100px',
    checkbox: true,
    // loading: true,
    multiple: true,
    showIndex: true
  };
  headerConfig = [
    {
      field: 'No', // 显示字段
      title: '编号', // 表头显示
      canSort: true, // 是否可排序
      width: '100px', // 单元格宽度
      filter: { // 过滤配置
        type: 'text', // 过滤类型
        offset: 'right', // 过滤框是否右偏移
        fn: (filter) => { // 过滤回调方法
          console.log(filter, 'No');
        }
      },
      hideTitle: true,
      /*alignTd: 'center',
      alignTh: 'center',*/
    }, {
      field: 'index', // 显示字段
      title: '序号', // 表头显示
      width: '100px', // 单元格宽度
      hideTitle: true,
      flex: '1', // 单元格自适应宽度优先级,
      filter: { // 过滤配置
        type: 'text', // 过滤类型
        offset: 'left', // 过滤框是否左偏移
        fn: (filter) => { // 过滤回调方法
          console.log(filter, 'index');
        }
      },
      /*alignTd: 'center',
      alignTh: 'center',*/
    }, {
      field: 'name', // 显示字段
      title: '名称名称名称名称名称名称名称名称', // 表头显示
      canSort: true, // 是否可排序
      width: '150px', // 单元格宽度
      isGroup: true,
      hideHeaderGroup: false,
      filter: { // 过滤配置
        type: 'checkList',
        optionList: [
          {
            checked: true,
            name: '状态1'
          }, {
            checked: true,
            name: '状态2'
          }, {
            checked: true,
            name: '状态3'
          }, {
            checked: true,
            name: '状态4'
          }, {
            checked: true,
            name: '状态5'
          }
        ],
        fn: (filter) => {
          console.log(filter, 'name');
        }
      },
      /*alignTd: 'center',
      alignTh: 'center',*/
    }, {
      field: 'desc', // 显示字段
      title: '描述', // 表头显示
      width: '500px', // 单元格宽度
      filter: {
        type: 'date',
        offset: 'left',
        option: {
          minDate: new Date('2015-12-31'), // Minimal selectable date
          maxDate: new Date(Date.now()),  // Maximal selectable date
          width: '180px' // 单日期必须写这个值
        },
        fn: (filter) => {
          console.log(filter, 'desc', 'datepicker');
        }
      }
    }, {
      field: 'action', // 显示字段
      title: '操作', // 表头显示
      width: '150px', // 单元格宽度
      filter: {
        type: 'date',
        offset: 'left',
        isCross: true, // 是否有开始结束选项，默认为单日期选择
        option: {
          minDate: new Date('2015-12-31'), // Minimal selectable date
          maxDate: new Date(Date.now()),  // Maximal selectable date
        },
        fn: (filter) => {
          console.log(filter, 'action', 'datepicker');
        }
      }
    }
  ];
  tableData = [];

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.tableData = [

      {
        id: '1',
        name: 'namenamenamenamename1',
        desc: '描述1',
        checked: true
      }, {
        id: '2',
        name: 'name3',
        desc: '描述3'
      }, {
        id: '3',
        name: 'name2',
        desc: '描述2',
      }, {
        id: '4',
        name: 'name4',
        desc: '描述4'
      }, {
        id: '5',
        name: 'name5',
        desc: '描述4'
      }, {
        id: '6',
        name: 'name6',
        desc: '描述4'
      }, {
        id: '7',
        name: 'name7',
        desc: '描述4'
      }
    ];
  }


  removeList() {
    this.dcListShow.removeItem({
      id: '1'
    });
  }

  getData() {
    console.log(this.dcListShow.getData());
  }

  removeItemEmit(ev: any) {
    for (let i = 0; i < this.tableData.length; i++) {
      if (this.tableData[i].id == ev.id) {
        this.tableNew.checkedDataByIndex(i, false);
      }
    }
  }

  checkEvent(ev: any) {
    console.log('demo checkEvent', ev);
    if (ev.type === 'single' && ev.data) {
      if (ev.data.checkModel && ev.data.checkModel.checked) {
        this.dcListShow.addItem({
          id: ev.data.id,
          name: ev.data.name
        });
      } else {
        this.dcListShow.removeItem({
          id: ev.data.id,
          name: ev.data.name
        });
      }
    } else if (ev.type === 'all' && ev.data) {
      const temp = [];
      if (ev.data[0].checkModel && ev.data[0].checkModel.checked) {
        for (let i = 0; i < ev.data.length; i++) {
          temp.push({
            id: ev.data[i].id,
            name: ev.data[i].name
          });
        }
        // item自行去重 this.dcListShow.getData();
        this.dcListShow.addItems(temp);
      } else {
        const selectItems = this.dcListShow.getData();
        this.dcListShow.removeItems(selectItems);
      }
    }
  }
}
