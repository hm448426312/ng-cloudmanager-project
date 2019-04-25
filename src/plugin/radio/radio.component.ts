import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import * as _ from 'lodash';
import {RadioDataClass, RadioOptionsClass} from '../../app/demo/demo-radio/radio.type';

@Component({
  selector: 'dc-radio',
  template: `
    <div class="radio-box" [style.flex-direction]="options?.direction || 'row'" [style.flex-wrap]="options?.newLine?'wrap':'nowrap'">
      <ng-template ngFor let-item [ngForOf]="radioData" let-i="index">
        <label [title]="item.name" class="form-radio" [class.radio-disabled]="item.disabled" [style.min-width]="options?.minWidth || '80px'"
               [style.height]="options?.height || '30px'"
               [style.max-width]="options?.maxWidth" [style.margin-right]="options?.direction === 'column'?'0px':'20px'">
          <input type="radio" [disabled]="item.disabled" (change)="changeChecked(item)" [checked]="!!item.checked"
                 [name]="options?.name || ''">
          <div class="simulation"></div>
          <span class="form-radio-text" [style.height]="options?.height || '30px'"
                [style.line-height]="options?.height || '30px'">{{ item.name }}</span>
        </label>
      </ng-template>
    </div>
  `,
  styles: [`
    .radio-box {
      display: flex;
      justify-content: flex-start;
    }

    .form-radio {
      margin: 0 20px 0 0;
      font-size: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
    }

    .form-radio.radio-disabled {
      cursor: not-allowed;
    }

    .form-radio-text {
      margin-left: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0 5px;
      flex: 1;
    }

    .form-radio:hover .form-radio-text {
      background: #edf0f5;
      /*color: #fff;*/
    }

    .simulation {
      width: 13px;
      height: 13px;
      border: 1px solid #cdcdcd;
      border-radius: 50%;
      vertical-align: middle;
      position: relative;
      flex-grow: 0;
      flex-shrink: 0;
    }

    .simulation:after {
      content: '';
      width: 6px;
      height: 6px;
      background: #0081cc;
      border-radius: 50%;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      opacity: 0;
    }

    input[type='radio'] {
      vertical-align: middle;
      display: none;
    }

    input[type='radio']:checked + .simulation {
      border-color: #0081cc;
    }

    input[type='radio']:checked + .simulation:after {
      opacity: 1;
    }

    input[type='radio']:disabled + .simulation,
    input[type='radio']:disabled + .simulation:after {
      opacity: 0.4;
    }

    .form-radio input[type='radio']:disabled + .simulation {
      border-color: #cdcdcd;
    }

    .form-radio input[type='radio']:disabled + .simulation:after {
      display: none;
    }
  `]
})
export class RadioComponent implements OnInit {
  constructor() {
  }

  @Input() options: RadioOptionsClass;
  _radioData: Array<RadioDataClass>;
  @Input() set radioData(v) {
    this._radioData = v;
  }

  get radioData() {
    return this._radioData;
  }

  _defaultData: any;
  @Input() set defaultData(v) {
    this._defaultData = v;
    this.initCheck();
  }

  get defaultData() {
    return this._defaultData;
  }

  @Output() checked: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
  }

  // 初始化根据defaultData选中数据
  initCheck() {
    if (this.defaultData) {
      for (const item of this.radioData) {
        if (this.defaultData.id == item.id) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      }
    }
  }

  // 单个radio改变事件
  changeChecked(ev: any) {
    for (const item of this.radioData) {
      item.checked = false;
    }
    ev.checked = true;
    this.checked.emit(ev);
  }

  // 选中某个radio
  checkedRadio(data: RadioDataClass) {
    for (const item of this.radioData) {
      if (item.id == data.name) {
        item.checked = true;
      } else {
        item.checked = false;
      }
    }
  }

  // 清除选中
  clearChecked() {
    for (const item of this.radioData) {
      item.checked = false;
    }
  }

  // 外部获取当前选中的radio
  getCheckedRadio() {
    let res = null;
    for (const item of this.radioData) {
      if (item.checked) {
        res = item;
        break;
      }
    }
    return res;
  }
}
