import {Component, Input, OnInit} from '@angular/core';
import * as _ from 'lodash';

@Component({
  template: `
    <div>modal content</div>
    <div>data:</div>
    <div>{{data | json}}</div>
  `,
  styleUrls: []
})
export class DemoModalDetailComponent implements OnInit {
  constructor() {
  }

  /**
   * 建议接收方式如下
   * cloneDeep非常有必要，父改变或者当前改变，不会互相影响
   */
  _data;
  @Input() set data(val) {
    this._data = _.cloneDeep(val);
    // this._data = val;
  }

  get data() {
    return this._data;
  }

  ngOnInit() {
  }
}
