import {Component, Input, EventEmitter, Output, OnInit, ViewChild} from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'dc-date-picker',
  template: `
    <dc-ng-datepicker #DatePicker [defaultShow]="defaultShow" [initDate]="date || ''" [width]="options?.width" [minDate]="options?.minDate"
                      [maxDate]="options?.maxDate" [offset]="options?.offset" [language]="options?.language"
                      [placeholder]="options?.placeholder"
                      (ngModelChange)="setDate($event)"></dc-ng-datepicker>
  `,
  styles: [`
  `],
})
export class DatePickerComponent {
  @Input() defaultShow: boolean;
  _date: any;
  @Input() set date(v) {
    this._date = v;
  }

  get date() {
    return this._date;
  }

  @Output() dateChangeEvent = new EventEmitter();
  @ViewChild('DatePicker') DatePicker: any;

  _options: any;
  @Input() set options(v) {
    let temp = v;
    if (temp.minDate && typeof (temp.minDate) === 'string') {
      temp.minDate = new Date(temp.minDate);
    }
    if (temp.maxDate && typeof (temp.maxDate) === 'string') {
      temp.maxDate = new Date(temp.maxDate);
    }
    this._options = temp;
  }

  get options() {
    return this._options;
  }

  constructor() {
    if (this.defaultShow === undefined) {
      this.defaultShow = false;
    }
  }

  setDate(ev: any) {
    this.dateChangeEvent.emit(ev);
  }

  clearDate() {
    this.DatePicker.clearDateByOther();
  }
}
