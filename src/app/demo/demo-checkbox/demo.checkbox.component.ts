import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-demo-button',
  template: `
    <button (click)="getCheckStatus()">获取状态</button><br/>
    <dc-checkbox [checkModel]="checkObj1" ></dc-checkbox>
    <dc-checkbox (checkboxChangeEvent)="checkboxChangeEvent($event)" [options]="checkOptions2" [checkModel]="checkObj2"></dc-checkbox>
    <dc-checkbox (checkboxChangeEvent)="checkboxChangeEvent($event)" [options]="checkOptions3" [checkModel]="checkObj3"></dc-checkbox>

    <div class="demo-desc">
      <h2>输入</h2>
      <p><span class="label">options</span>: 数据类型:{{{
        key: 'string(checkModel的选中值key[checked])',
        text: 'string',
        disabled: 'boolean',
        width: 'string'
      } | json}},
        <span class="label">eg</span>: '' || {{['test1', 'test2'] | json}}</p>
      <p><span class="label">checkModel</span>: 数据类型{{{checked: 'boolean'} | json}}, <span class="label">eg</span>: '' || '200px' </p>
      <p><span class="label">text</span>: string, <span class="label">desc</span>: '' || source中的元素(默认选中)</p>
      <h2>输出</h2>
      <p><span class="label">textChangeEvent</span>: 返回数据格式{{{title: '选中的文本'} | json}}</p>
      <h2>主动获取值text</h2>
      <p>this.autoComponent['text'], ccc在标签定义#autoComponent,在component中获取@ViewChild('autoComponent') autoComponent;</p>
    </div>
  `,
  styles: [`
  `]
})
export class DemoCheckboxComponent implements OnInit {
  /**
   * checkModel的checkObj1值为双向绑定：使用方改变checked值，组件改变状态；组件改变checked值，使用方改变状态
   * options的checkOptions1值为双向绑定
   * 抛出事件：checkbox改变事件：checkboxChangeEvent，返回值：checkModel对应的checkObj1
   */
  constructor() {
  }

  checkOptions1 = {
    key: 'checked',
    text: '性别性别性别性别性别性别性别性别性别',
    disabled: true,
    width: '200px'
  };
  checkOptions2 = {
    key: 'checked',
    text: '男女男女男女男女男女男女男女男女男女男女男女男女男女',
    disabled: false,
    width: '100px'
  };
  checkOptions3 = {
    key: 'checked',
    disabled: true,
  };

  checkObj1 = {
    checked: true,
  };
  checkObj2 = {
    checked: false,
  };
  checkObj3 = {
    checked: false,
  };

  ngOnInit() {
    setTimeout(() => {
      this.checkObj1.checked = false;
    }, 2000);
  }

  checkboxChangeEvent(ev) {
    console.log(ev);
  }

  getCheckStatus() {
    console.log(this.checkObj2);
  }
}
