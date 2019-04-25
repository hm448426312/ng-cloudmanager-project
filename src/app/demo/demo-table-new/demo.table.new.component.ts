import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TipService} from '../../../plugin/tip/tip.service';

@Component({
  template: `
    <input type="text" [(ngModel)]="tableId" [placeholder]="'输入要操作的tableID'"/>
    <dc-button [text]="'获取节点'" (click)="findItemByKey()"></dc-button>
    <dc-button [text]="'展开/折叠节点'" (click)="toggleItemByItem()"></dc-button>
    <dc-button [text]="'插入数据'" (click)="insertItem()"></dc-button>
    <dc-button [text]="'获取父节点'" (click)="findParentByKey()"></dc-button>
    <dc-button [text]="'获取父节点S'" (click)="findParentsByKey()"></dc-button>
    <dc-button [text]="'获取选中的节点'" (click)="getCheckedsItem()"></dc-button>
    <dc-button [text]="'删除节点'" (click)="deleteDataByKey()"></dc-button>
    <dc-button [text]="'更新节点'" (click)="updateDataByKey()"></dc-button>
    <div style="padding: 10px;">
      <dc-table-new #tableNew [datas]="tableData" [headers]="headerConfig" [options]="tableOptions"
                    (checkEvent)="checkEvent($event)" (filterToggleEvent)="filterToggleEvent($event)"
                    (expandAllEvent)="expandAllEvent($event)" (expandItemEvent)="expandItemEvent($event)" (sortEvent)="sortEvent($event)">
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
export class DemoTableNewComponent implements OnInit {
  constructor(private tipService: TipService) {
  }

  tableId: string;
  tableLoading: boolean;
  tableOptions = {
    // maxHeight: '200px', // 表格内容最大高度
    // minHeight: '100px', // 表格内容最小高度
    checkbox: true, // 表格是否支持复选框
    loading: true, // 表格是否有loading状态，自己赋值为false取消loading
    multiple: true, // 表格复选框是否支持多选
    showIndex: true, // 是否显示序号列
    keyId: 'id', // 默认为ID，对比数据的key值
  };
  selectData = [
    {
      field: 'aadsfds',
      title: 'th1',
      width: '50%'
    }, {
      field: '312',
      title: 'th2',
      width: '10%'
    }, {
      field: 'field3field3field3field3field3',
      title: 'th3',
      width: '20%',
      canSort: true
    }, {
      field: 'asdtqrgg',
      title: 'opration',
      canSort: true,
      width: '20%',
    }, {
      field: 'hello',
      title: 'opra2tion',
      canSort: true,
      width: '20%',
    }, {
      field: 'world',
      title: 'oprat1ion',
      canSort: true,
      width: '20%',
    }, {
      field: 'rock',
      title: 'opratio1n1',
      canSort: true,
      width: '20%',
    }, {
      field: 'howard',
      title: 'opration',
      canSort: true,
      width: '20%',
    }, {
      field: 'hollywood',
      title: 'opration',
      canSort: true,
      width: '20%',
    }];
  headerConfig = [
    {
      field: 'No', // 显示字段
      title: '编号', // 表头显示
      canSort: true, // 是否可排序
      defaultSort: 'asc', // 默认排序方式 asc|desc
      width: '100px', // 单元格宽度
      // flex: 1, // 是否自适应宽度（数值参考flex布局）
      filter: { // 过滤配置
        type: 'text', // 过滤类型 text | checkList | date
        defaultText: 'aaaa', // 过滤框默认显示的问题
        showFilterDrop: true, // 是否默认显示该字段的过滤框
        offset: 'right', // 过滤框偏移方向，右
        fn: (filter) => { // 过滤回调方法
          console.log(filter, 'No');
        },
        placeholder: '自定义配置', // type为text的时候，该配置为input的placeholder值
        selfCheck: (filter): Promise<boolean> => {
          // 自定义校验方案，在filter.fn之前触发
          // resolve(true)，校验成功，会调用filter.fn过滤方法
          // resolve(false),校验失败，过滤弹框不消失，不调用filter.fn过滤方法
          return new Promise(resolve => {
            if ((filter + '').length > 3) {
              this.tipService.show({
                type: 'error',
                title: '过长'
              });
              resolve(false);
            } else {
              resolve(true);
            }
          });
        }
      },
      hideTitle: true,
      /*alignTd: 'center', // tbody下的该单元格对齐方式
      alignTh: 'center', // thead下的单元格（表头）文本对齐方式 */
    }, {
      field: 'index', // 显示字段
      title: '序号', // 表头显示
      width: '150px', // 单元格宽度
      hideTitle: true, // 该单元格是否隐藏title
      overShow: true, // 该单元格内容是否不需要超出部分隐藏
      filter: { // 过滤配置
        type: 'radio', // 过滤类型
        offset: 'left', // 过滤框偏移方向，左
        defaultRadio: {id: '2'}, // 过滤框默认显示的数据，也可以在list的数据中用checked标识
        optionList: [ // 参考radio的data配置
          {
            id: '1',
            name: '状态1'
          }, {
            id: '2',
            name: '状态2'
          }, {
            id: '3',
            name: '状态3'
          }, {
            id: '4',
            name: '状态4'
          }, {
            id: '5',
            name: '状态5'
          }
        ],
        option: { // 参考radio的demo配置
          keyText: 'name',
          keyId: 'id',
          name: 'table-filter-radio',
          direction: 'column',
        },
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
      isGroup: true, // 该单元格是否树节点
      hideHeaderGroup: false, // 表头上的展开折叠所有是否隐藏
      flex: 1, // 是否自适应宽度（数值参考flex布局）
      filter: { // 过滤配置
        type: 'checkList',
        optionList: [ // checkList的内容
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
        option: { // checkList的配置
          filterKey: 'name'
        },
        fn: (filter) => {
          console.log(filter, 'name');
        }
      },
      /*alignTd: 'center',
      alignTh: 'center',*/
    }, {
      field: 'desc', // 显示字段
      title: '描述', // 表头显示
      width: '100px', // 单元格宽度
      filter: {
        type: 'date',
        offset: 'left',
        option: { // date的配置
          minDate: new Date('2015-12-31'), // 最小日期，new Date() | null
          maxDate: new Date(Date.now()),  // 最大日期，new Date() | null
          width: '180px' // 单日期（isCross: false）必须写这个值
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
  @ViewChild('tableNew') tableNew;

  ngOnInit() {
    // this.tableOptions.loading = true;
    setTimeout(() => {
      this.tableOptions.loading = false;
      this.tableData = [
        {
          id: '1',
          name: 'namenamenamenamename1',
          desc: '描述1',
          isParent: true,
          // readonly: true,
          expand: false,
          children: [
            {
              id: '11',
              name: 'name 11',
              desc: '描述11',
              isParent: true,
              // readonly: true,
              checked: true,
            }
          ]
        }, {
          id: '2',
          name: 'name3',
          // checked: true,
          desc: '描述3',
          // readonly: true,
        }, {
          id: '3',
          name: 'name2',
          desc: '描述2',
          // readonly: true
        }, {
          id: '4',
          name: 'name4',
          // checked: true,
          desc: '描述4',
        }
      ];
      window['tableNew'] = this.tableNew;
    }, 2000);
    setTimeout(() => {
      // this.tableNew.deleteDefaultFilter('desc');
    }, 5000);
  }

  checkEvent(ev: any) {
    console.log('demo checkEvent', ev);
  }

  expandAllEvent(ev: any) {
    if (ev.expand) {
      this.tableData = [
        {
          id: '1',
          name: 'namenamenamenamename1',
          desc: '描述1',
          isParent: true,
          expand: false,
          children: [
            {
              id: '1_1',
              name: 'name1-1',
              desc: 'name1的子节点',
            }
          ]
        }, {
          id: '2',
          name: 'name3',
          desc: '描述3'
        }, {
          id: '3',
          name: 'name2',
          desc: '描述2',
          readonly: true
        }, {
          id: '4',
          name: 'name4',
          desc: '描述4'
        }
      ];
    } else {
      this.tableData = [
        {
          id: '1',
          name: 'namenamenamenamename1',
          desc: '描述1',
          isParent: true,
        }, {
          id: '2',
          name: 'name3',
          desc: '描述3'
        }, {
          id: '3',
          name: 'name2',
          desc: '描述2',
          readonly: true
        }, {
          id: '4',
          name: 'name4',
          desc: '描述4'
        }
      ];
    }
    console.log('expandAllEvent', ev);
  }

  expandItemEvent(ev: any) {
    console.log('expandItemEvent', ev);
    this.tableNew.insertData([
      {
        id: (ev.parent.id + '_' + (ev.parent.children && (ev.parent.children.length + 1) || '1')),
        name: ev.parent.name + '_' + (ev.parent.children && (ev.parent.children.length + 1) || '1'),
        desc: 'name1的子节点',
        isParent: true
      }
    ], ev.parent);
  }

  sortEvent(ev: any) {
    console.log('sort', ev);
  }

  findItemByKey() {
    console.log(this.tableId && this.tableNew.findItemByKey('id', this.tableId));
  }

  toggleItemByItem() {
    this.tableId && this.tableNew.toggleItemByItem(this.tableNew.findItemByKey('id', this.tableId));
  }

  insertItem() {
    if (this.tableId) {
      let parent = this.tableNew.findItemByKey('id', this.tableId);
      this.tableNew.insertData([
        {
          id: (parent.id + '_' + (parent.children && (parent.children.length + 1) || '1')),
          name: parent.name + '_' + (parent.children && (parent.children.length + 1) || '1'),
          desc: '插入的节点',
        }
      ], parent);
    } else {
      this.tableNew.insertData([
        {
          id: (this.tableData.length + 1).toString(),
          name: 'name' + (this.tableData.length + 1),
          desc: '插入的节点',
        }
      ], null, 0);
    }
  }

  findParentByKey() {
    if (this.tableId) {
      console.log(this.tableNew.findParentByKey('id', this.tableId));
    }
  }

  // 根据id查询行
  findParentsByKey() {
    if (this.tableId) {
      console.log(this.tableNew.findParentsByKey('id', this.tableId));
    }
  }

  // 获取选中的数据行
  getCheckedsItem() {
    console.log(this.tableNew.getCheckedsItem());
  }

  // 删除行数据
  deleteDataByKey() {
    this.tableId && this.tableNew.deleteDataByKey('id', this.tableId);
  }

  // 更新行数据
  updateDataByKey() {
    this.tableId && this.tableNew.updateDataByKey('id', this.tableId, {
      name: 'xxxx',
      desc: 'yyyyy'
    });
  }

  // 过虑框显示/隐藏回调该方法
  filterToggleEvent(ev) {
    console.log(ev);
  }

}
