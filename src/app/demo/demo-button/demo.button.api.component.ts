import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-demo-button-api',
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
export class DemoButtonApiComponent implements OnInit {
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

  @Input() icon: string;
  @Input() class: string;
  @Input() text: string;
  @Input() disable: boolean;
  @Input() type: number;
  data = [
    {
      attr: '[icon]',
      type: `string`,
      default: '无',
      desc: `按钮的小图标（base64码）`,
      required: '否'
    }, {
      attr: '[text]',
      type: `string`,
      default: '确定',
      desc: `按钮的文本`,
      required: '是'
    }, {
      attr: '[disable]',
      type: `boolean`,
      default: 'false',
      desc: '是否为disable样式',
      required: '否'
    }, {
      attr: '[type]',
      type: `number`,
      default: '1',
      desc: `按钮的样式，默认为1`,
      required: '否'
    },
  ];

  ngOnInit() {
  }
}
