import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-demo-select',
  template: `
    <p>
      <dc-select [optionList]="data" (selectBlurEvent)="selectBlurEvent($event)" [displayField]="'field'" [currentSelect]="default"
                 (changeValueEvent)="showResult1($event)" [required]="true" [noClear]="true"
                 #mySelect></dc-select>
      <dc-select [optionList]="data" [displayField]="'field'" [required]="true" (changeValueEvent)="showResult1($event)"
                 #mySelect2></dc-select>
      <span>{{result1}}</span>
      <dc-select [optionList]="data" [displayField]="'field'" [outputField]="'title'" (changeValueEvent)="showResult2($event)"
                 #mySelect3></dc-select>
      <span>{{result2}}</span>
    </p>
    <p>
      <dc-select [optionList]="data" [displayField]="'field'" [width]="'100%'" (changeValueEvent)="showResult1($event)"></dc-select>
    </p>
    <p>
      <dc-select [optionList]="data" [displayField]="'field'" [maxHeight]="'100px'" (changeValueEvent)="showResult1($event)"></dc-select>
    </p>
    <p>
      <dc-select [dropUp]="true" [optionList]="data" [displayField]="'field'" [isReadonly]="true"
                 (changeValueEvent)="showResult1($event)"></dc-select>
    </p>
    <p>
      <dc-select [optionList]="data" [displayField]="'field'" [currentSelect]="default" [disable]="true"></dc-select>
    </p>
    <p>
      <dc-select [optionList]="data" [displayField]="'field'" [disable]="true"></dc-select>
    </p>
    <dc-button [text]="'重置'" (click)="resetData()"></dc-button>
  `,
  styles: [``]
})
export class DemoSelectComponent implements OnInit {
  default: any;
  result1: any;
  result2: any;
  data: any;
  @ViewChild('mySelect') select;
  @ViewChild('mySelect2') select2;
  @ViewChild('mySelect3') select3;

  //@ViewChildren(SelectComponent) selectCmps: QueryList<SelectComponent>;
  constructor() {
  }

  resetData() {
    // this.default = null;
    //this.setData();
    // this.default = this.data[1];
    // this.defaultValue = this.data[2].field;
    // this.select.changeCurrentValue();
    // this.select2.changeCurrentValue();
    // this.select3.changeCurrentValue();
    this.select.clearValue(); // 清除select当前选中/输入的数据
    this.select2.clearValue();
    this.select3.clearValue();
  }

  ngOnInit() {
    this.setData();
    setTimeout(() => {
      this.default = this.data[1];
    }, 2000);
    setTimeout(() => {
      this.default = this.data[2];
    }, 5000);
  }

  // 失去焦点事件
  selectBlurEvent(ev) {
    console.log(ev);
  }

  showResult1(event) {
    this.result1 = JSON.stringify(event);
    console.log(event);
  }

  showResult2(event) {
    this.result2 = JSON.stringify(event);
  }

  setData() {
    this.data = [{
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
  }
}
