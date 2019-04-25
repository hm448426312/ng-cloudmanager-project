import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-demo-async-api',
  template: `
    <div>
      <div class="demo-api-title">API</div>
      <div class="demo-api-table">
        <table>
          <thead>
          <tr>
            <th *ngFor="let d of header; let i = index;">{{d.title}}</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let row of data; let i=index">
            <td *ngFor="let d of header">
              <code>
                <pre>{{row[d.field]}}</pre>
              </code>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [``]
})
export class DemoAsyncCompleteApiComponent implements OnInit {
  constructor() {
  }

  options = {
    showIndex: true,
  };
  header = [
    {
      field: 'attr',
      title: '属性',
    }, {
      field: 'type',
      title: '数据类型',
      flex: 2,
    }, {
      field: 'default',
      title: '默认值',
    }, {
      field: 'desc',
      title: '描述',
    }, {
      field: 'required',
      title: '是否必填',
    }
  ];
  data = [
    {
      attr: '[options]',
      type: `{
  asyncFilter: any; // 异步过滤方法（必填），返回promise对象，详情参考代码中的myFilter
  asyncSpace?: number; // 文本变化请求异步过滤方法时间间隔，默认300ms
}`,
      default: '无',
      desc: '配置',
      required: '是'
    }, {
      attr: '[text]',
      type: `string`,
      default: '无',
      desc: '默认文本',
      required: '否'
    }, {
      attr: '[required]',
      type: `boolean`,
      default: 'false',
      desc: '是否必选，如果必选，没有数据时，边框为红色',
      required: '否'
    }, {
      attr: '[width]',
      type: `string`,
      default: '100%',
      desc: `宽度(eg: '100px' | '100%')`,
      required: '否'
    }, {
      attr: '[source]',
      type: `Array<{
    title: string; // 显示的文本
  }>`,
      default: '[]',
      desc: `下拉框中的数据列表`,
      required: '是'
    }, {
      attr: '(selectItem)',
      type: `返回数据格式:
{
  title: '1', // 选中的文本
  index: 0, // 选中文本在source中的index
}`,
      default: '无',
      desc: `选中下拉的某项后，回调方法`,
      required: '不涉及'
    },
  ];

  ngOnInit() {
  }
}
