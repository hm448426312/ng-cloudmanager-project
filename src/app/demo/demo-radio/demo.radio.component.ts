import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-demo-radio',
  template: `
    <div style="">
      <p>横向布局
        <dc-button [text]="'获取选中的值1'" (click)="getRadioChecked(radio1)"></dc-button>
        <dc-button [text]="'清除选中'" (click)="clearChecked(radio1)"></dc-button>
        <dc-button [text]="'选中1'" (click)="checkedRadio(radio1)"></dc-button>
      </p>
      <dc-radio #radio1 (checked)="radioChecked($event)" [options]="radioOptions" [radioData]="data" [defaultData]="default"></dc-radio>
      <p>纵向布局
        <dc-button [text]="'获取选中的值2'" (click)="getRadioChecked(radio2)"></dc-button>
        <dc-button [text]="'清除选中'" (click)="clearChecked(radio2)"></dc-button>
      </p>
      <dc-radio #radio2 (checked)="radioChecked($event)" [options]="radioOptions1" [radioData]="data"></dc-radio>
    </div>
  `,
  styles: [``]
})
export class DemoRadioComponent implements OnInit {
  constructor() {
  }

  radioOptions: any = {
    keyText: 'name', // 数据中显示单选框文本的key,默认为name
    maxWidth: '100px', // 单选框单个最大宽度
    minWidth: '50px', // 单选框默认宽度，默认为80px
    height: '30px', // 单个radio的高度，默认为30px
    direction: 'row', // 单选框布局 row|column，默认为row
    newLine: true, // 单选框布局为row时，是否需要换行，默认为false
    keyId: '', // 数据中唯一字段的key，默认为id
    name: 'xxx', // 必填字段，单选框的name值,如果name相同，即使不是一个dc-radio中，也会互斥
  };
  radioOptions1: any = {
    keyText: 'name', // 数据中显示单选框文本的key,默认为name
    maxWidth: '', // 单选框单个最大宽度
    minWidth: '100%', // 单选框默认宽度，默认为80px
    height: '30px', // 单个radio的高度，默认为30px
    direction: 'column', // 单选框布局 row|column，默认为row
    newLine: false, // 单选框布局为row时，是否需要换行，默认为false
    keyId: '', // 数据中唯一字段的key，默认为id
    name: 'xxx1', // 必填字段，单选框的name值,如果name相同，即使不是一个dc-radio中，也会互斥
  };
  data: Array<any> = [
    {
      id: '1',
      name: 'radio1radio1radio1radio1radio1radio1radio1',
      checked: true,
    }, {
      id: '2',
      name: 'radio2',
      disabled: true,
    }, {
      id: '3',
      name: 'radio3',
    }, {
      id: '4',
      name: 'radio4',
    }, {
      id: '5',
      name: 'radio5',
    }
  ];
  default: any = {
    id: '2'
  };

  ngOnInit(): void {
  }

  radioChecked(ev) {
    console.log(ev);
  }

  getRadioChecked(radio) {
    const res = radio.getCheckedRadio();
    console.log(res);
  }

  clearChecked(radio) {
    radio.clearChecked();
  }

  checkedRadio(radio) {
    radio.checkedRadio({id: '1'});
  }
}
