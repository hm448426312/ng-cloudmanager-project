import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-demo-date-pick',
  templateUrl: './demo.date.picker.component.html',
  styleUrls: []
})
export class DemoDatePickerComponent implements OnInit {
  date: any = '2018-10-15'; // "2018/05/13"; // 给date赋值不会回调dateChangeEvent方法
  options = {
    minDate: new Date('2018-10-2'), // Minimal selectable date
    maxDate: new Date('2019-1-2'),  // Maximal selectable date
    width: '300px',
    offset: 'left',
    format: 'yyyy/MM/dd', // yyyy-MM-
    // language: 'en', // zh|en
    // placeholder: '请选择我的日期',
  };
  flag = 1;
  newType = 'day';

  constructor() {
  }

  ngOnInit() {
    /*setTimeout(() => {
      this.date = '2018-08-06';
    }, 3000);*/
  }

  dateChangeEvent(event) {
    console.log('datechangeevent', JSON.stringify(event));

  }

  // 清空日期
  clearDate(ev: any, obj: any) {
    obj.clearDate();
    // 手动触发的清除日期，不会回调dateChangeEvent方法
  }

  outputx(ev: any) {
    console.log(ev, 'xxx');
  }

  changeType(type) {
    this.newType = type;
  }

  changeDate(clear?) {
    if (clear) {
      this.date = '';
    } else {
      this.date = '2018-08-06';
    }
  }
}
