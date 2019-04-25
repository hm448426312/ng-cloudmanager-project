import {
  Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ChangeDetectionStrategy, OnChanges,
  HostListener, ViewChild, ElementRef
} from '@angular/core';

@Component({
  selector: 'dc-ng-datepicker',
  template: `
    <div #datePickerBox class="date-picker-box" [style.width]="width">
      <div class="date-picker-input">
        <input type="text" class="form-control pointer" [placeholder]="placeholder || '请选择日期'" (click)="toggleCalendar()" readonly
               [value]="displayDate"/>
        <i class="show" (click)="toggleCalendar()"></i>
        <i *ngIf="displayDate" class="clear" title="清除日期" (click)="clearDate()"></i>
      </div>
      <div class="date-picker" [class.offset-left]="offset == 'left'" style="user-select: none;"
           [style.display]="(defaultShow || !isHidden)? 'block' : 'none'"
           (click)="$event.stopPropagation()">
        <div class="nav-bar pull-left">
          <ul *ngIf="quickDateBars">
            <li class="pointer" [class.active]="isBarSelected(bar)" (click)="selectBar(bar)" *ngFor="let bar of quickDateBars">
              {{bar.label}}
            </li>
          </ul>
        </div>
        <div class="calendar pull-left">
          <div class="control-bar">
            <!--<span *ngIf="titleMonth <= maxMonth && titleYear < maxYear" class="material-icons" (click)="decreaseMonth()"> ‹ </span>-->
            <span *ngIf="showYearMonth" class="material-icons de-year" (click)="decreaseYear()"></span>
            <span class="material-icons de-month" (click)="decreaseMonth()"></span>
            <span class="monthTitle" (click)="selectYearMonth()" [class.showYearMonthMore]="showYearMonth" [style.width]="showYearMonth?'92px' : '160px'"> {{pickerTitle}}<i
              class="date-more"></i> </span>
            <ul *ngIf="showYearMonth" class="years-month-ul">
              <li *ngFor="let list of monthArray; let i = index">
                <span *ngIf="yearArray[i] != undefined" (click)="selectYear($event, yearArray[i])"
                      [class.selected]="titleYear == yearArray[i]">{{yearArray[i]}}年</span>
                <span (click)="selectMonth($event, list)" [class.selected]="titleMonth == list">{{list}}月</span>
              </li>
            </ul>
            <!--<span *ngIf="titleMonth >= minMonth && titleYear > minYear" class="material-icons" (click)="increaseMonth()"> › </span>-->
            <span class="material-icons in-month" (click)="increaseMonth()"></span>
            <span *ngIf="showYearMonth" class="material-icons in-year" (click)="increaseYear()"></span>
          </div>
          <div class="days">
            <table>
              <thead>
              <ng-template [ngIf]="!language || language === 'zh'">
                <th *ngFor="let d of weekTitleZh">{{d}}</th>
              </ng-template>
              <ng-template [ngIf]="language === 'en'">
                <th *ngFor="let d of weekTitleEn">{{d}}</th>
              </ng-template>
              </thead>
              <tr *ngFor="let week of dates">
                <td class="pointer" *ngFor="let day of week"
                    [class.active]="day != null && day.isSelected" [class.disabled]="day != null && day.isDisabled"
                    [class.range]="day !=null && !day.isSelected && day.isInRange"
                    (click)="selectDate(day)">
                            <span class="date" *ngIf="day != null"
                                  [ngStyle]="{'display': day ? 'block' : 'none', 'color': isDateSelected(day) ? 'white' : day.isInMonth ? '' : '#999999'}">
                                {{day.date}}
                            </span>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!--<div class="cancelArea" (click)="toggleCalendar(true)"></div>-->
  `,
  styles: [`
    ul, li {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .date-more {
      display: inline-block;
      width: 8px;
      height: 10px;
      border: solid 4px transparent;
      border-top-width: 6px;
      border-top-color: #666;
      position: relative;
      top: 3px;
    }
    .showYearMonthMore .date-more{
      top: 0;
      transform:rotate(180deg);
      -ms-transform:rotate(180deg); /* Internet Explorer */
      -moz-transform:rotate(180deg); /* Firefox */
      -webkit-transform:rotate(180deg); /* Safari 和 Chrome */
      -o-transform:rotate(180deg); /* Opera */
    }

    .form-control {
      display: block;
      width: 100%;
      height: 34px;
      padding: 0 0 0 5px;
      font-size: inherit;
      line-height: 1.42857143;
      color: #555;
      background-color: #fff;
      background-image: none;
      border: 1px solid #ccc;
      border-radius: 4px;
      -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
      box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
      -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
      -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
      transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    }

    input.form-control {
      border: 1px solid #ccc;
    }

    input::placeholder {
      color: #bbb
    }

    div.date-picker-box {
      position: relative;
      display: inline-block;
      width: 150px;
    }

    div.date-picker-input {
      position: relative;
      display: inline-block;
      width: 100%;
      background-color: white;
      color: #333;
      font-size: 12px;
    }

    div.date-picker-input input {
      height: 30px;
      border-radius: 3px;
    }

    div.date-picker-input i.show {
      position: absolute;
      right: 2px;
      top: 0;
      font-size: inherit;
      cursor: pointer;
      width: 20px;
      height: 30px;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAYklEQVQokdWQUQrAIAxDU9m/O6XHn97A/awQ2w4s+1qgIA3h1UhrDaQB4ESsxSsA5jOsSTNoX3VfTOCN5rzDUCLVyLPEbSlRkjn3Ry6DS3MFfj5VJRvvkPijU1PEDuBK5voNJIwdJa4Jkp0AAAAASUVORK5CYII=) no-repeat center center transparent;
    }

    div.date-picker-input i.clear {
      position: absolute;
      right: 22px;
      top: 0;
      font-size: inherit;
      cursor: pointer;
      width: 20px;
      height: 30px;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAAOVJREFUKJF90DFKA1EQBuAvj2Cu8MBqe8FokedeQb2A6WzU0uN4gxTbxkM8CKKSfqvAXsAi2lj4dlkh5Icp5p9/Zv6ZSdM0Ck7whDucFW6LFV7wDdNSOMUac/9xVeIet9iFMvmQeIw5XjELeOzFdV2LMQ6qGKO6rvv0HA8By55p21ZKSYxRjFFKSdu2403LKS77rOs6OWcpJZBz1nXduOEiHPF9CD8Bb2PPKSU552HT+CZsg78/g6qqBhu9vaqqxg2rSdM0M+TyhWP4xCJgjxu8HxF/4Br7/ugdEp6xwVeJTeEWReMX1Y9FK/4RDOgAAAAASUVORK5CYII=) no-repeat center center transparent;
    }
    div.date-picker-input i.clear:hover{
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAAOtJREFUKJF90b1NAzEcBfBfriCVm2vR3S2ABFXYAViADACUjMMGWQCGQIoQWJngrLTXWBSBIhRxooBCnuTCz++9/4dHMUYFJ3jALc4Kt8AMT/iCUTGc4hkXDuMdN1hWJfmYWHl7wbjC/VbcdZ0Qwk4VQtB13fZ6jrsK0y0zDIO2bYUQhBA0TWMYhv1K01GMcVXa2qW2bWu9XkspyTnvG1bVkb4P4bvC29/0vu+llDRN82smLCqbPYO6rvV9L+cs5yylpK7rfcNsFGMc47Vs4RgiJhVWuLb5nP/wgSt7Qy9xiUfM8VnOvHCTovEDCGVJpA/ldQoAAAAASUVORK5CYII=) no-repeat center center transparent;
    }

    div.date-picker {
      position: absolute;
      width: auto;
      min-height: 220px;
      background-color: white;
      box-shadow: 0px 0px 5px gray;
      z-index: 1000;
      right: 0;
    }

    div.date-picker.offset-left {
      right: auto;
      left: 0;
    }

    .years-month-ul {
      position: absolute;
      width: 150px;
      top: 30px;
      right: 0;
      margin-right: 40px;
      background-color: white;
      box-shadow: 0 0 5px gray;
      z-index: 1001;
    }

    .years-month-ul li {
      height: 22px;
      display: flex;
    }

    .years-month-ul li span {
      width: 50%;
      align-items: center;
      justify-content: center;
      text-align: center;
      cursor: pointer;
      font-size: 12px;
      border-radius: 3px;
    }

    .years-month-ul li span:hover {
      background-color: #eeeeee;
    }

    .years-month-ul li span.selected {
      background-color: #0081cc;
      color: #fff;
    }

    .nav-bar ul {
      list-style: none;
      padding-top: 10px;
      padding-left: 10px;
    }

    .nav-bar ul li {
      font-size: 13px;
      background: #f5f5f5;
      border: 1px solid #f5f5f5;
      border-radius: 4px;
      color: #1165E5;
      padding: 3px 12px;
      margin-bottom: 8px;
    }

    .nav-bar ul li.active, .nav-bar ul li:hover {
      background: #0081cc;
      border: 1px solid #0081cc;
      color: #ffffff;
    }

    div.calendar .control-bar {
      width: 100%;
      display: flex;
      height: 35px;
      align-items: center;
      justify-content: center;
      background-color: #eeeeee;
    }

    div.calendar .control-bar .material-icons {
      cursor: pointer;
      font-size: 21px;
      margin: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      font-weight: bold;
      opacity: 0.7;
    }
    div.calendar .control-bar .material-icons:hover{
      opacity: 1;
    }

    div.calendar .control-bar .material-icons.de-year {
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAqklEQVQYlW3QMWoCURAG4G/XxSIg4h28hGCRRNDUogFJq2trZZPC2hMIgpUgSLC2EPQCuUFay1QpA0GbffBYMt3H/DMwk+R5LqoHfGCBz9hZFKrigBc08Bg7LUIVbNHDFaOSX1MkWGGIb3TwHvkZ1xRLTPCDLsYlf0HYGOr2j4XgHBvUccK65CZkxdS0aAxwRjvyBa3wnj+8oVZcusNT5H14D/yijyNmZd8B9VwntmAoiDcAAAAASUVORK5CYII=) no-repeat center center transparent;
    }

    div.calendar .control-bar .material-icons.de-month {
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAKCAYAAACXDi8zAAAAgUlEQVQImU3OIQ9BcRiF8d/9M8FmJmiiTyIg2yiyq0qq7BNIkmTIguCDqDdKos2uct/tPunsnJ3tyfI8V6ONC3bNWtnCDVP0UlU2cMIEBRYJGQ6Y440RioQ9VvhgjBfEIygjJGxxRBcPDGMoscYVfTwxCN0fluhUZufQhS9muGPzB2YAFnw+Bp0mAAAAAElFTkSuQmCC) no-repeat center center transparent;
    }

    div.calendar .control-bar .material-icons.in-month {
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAKCAYAAACXDi8zAAAAhElEQVQImU3OoQ5BYQDF8d/9mCppokfwBIKZaENRfZuo6B5BEkTFZjoTeA/1NkUSbHaV+839p7P9d3ZOFmPsYo0x3koCNhjihEZVTJFjgD1qSeTo4YkJtsjqZfOBPu6Y4xX8KSo5S6KDK5rYYRXQxg0tHLFAEXAo5QUzfNOrJc4Y4ZNGfuOgGIESFz17AAAAAElFTkSuQmCC) no-repeat center center transparent;
    }

    div.calendar .control-bar .material-icons.in-year {
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAyUlEQVQYlXXQIUtDARTF8d/eHtYlEcSiwbjy8BuoIDNMBhNNG4wHfgCx2cVk0qJrgguCZawMg34Ag2VtYUnDsAyLzHK3pZ32v5xz7uUW8jzfwSWOMUEZ1zgKBglucIgOVoL38RI8N9YxQgVtNDDELh5RnBlHMfzGKS6why/UcIdCGs0DHKCPM/xE+A0tjBMLTS1XMmvcRg8l3OIe78EPOE+xEStX4/grvGINz8gxTfEU5i6a0bwZ4RP8QTHLsk+sx5t+8YEtVIPBPx+JKzLiZB3cAAAAAElFTkSuQmCC) no-repeat center center transparent;
    }

    div.calendar .control-bar .monthTitle {
      font-size: inherit;
      font-weight: normal;
      width: 160px;
      color: #333;
      text-align: center;
      cursor: pointer;
      height: 30px;
      line-height: 30px;
    }

    div.calendar .control-bar .monthTitle:hover {
      color: #0081cc;
    }

    div.calendar .control-bar .monthTitle:hover .date-more {
      color: #0081cc;
      border-top-color: #0081cc;
    }

    div.calendar .days {
      width: 100%;
      align-items: center;
      justify-content: center;
      display: flex;
      font-size: inherit;
    }

    table {
      border-spacing: 0;
    }

    th, td {
      text-align: center;
      position: relative;
      font-weight: normal;
    }

    th {
      color: #333;
    }

    tr > td.disabled {
      color: #999999;
      text-decoration: line-through;
      cursor: not-allowed;
    }

    tr > td.range {
      background-color: #ebf4f8;
      border-color: transparent;
    }

    tr > td.active, tr > td.active:hover {
      border-radius: 4px;
      background-color: #0081cc !important;
      color: white;
    }

    tr > td:hover, .control-bar .material-icons:hover {
      background-color: #eeeeee !important;
      border-radius: 4px;
    }

    .date {
      width: 30px;
      height: 30px;
      text-align: center;
      line-height: 30px;
    }

    .cancelArea {
      position: fixed;
      width: 100vw;
      height: 100vh;
      top: 0;
      left: 0;
      z-index: 9;
    }

    .pointer {
      cursor: pointer;
    }

    .pull-left {
      float: left !important;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgDatepickerComponent implements OnInit, OnChanges {
  @Input() width: string;
  @Input() initDate: any;
  @Input() isHidden: boolean;
  @Input() defaultShow: boolean;
  @Input() minDate: Date;
  @Input() maxDate: Date;
  @Input() disabledDates: any[];
  @Input() availableDates: any[];
  @Input() displayDateType: boolean;
  @Input() quickDateBars: QuickDateBar[];
  @Input() selectedQuickDateBar: QuickDateBar;
  @Input() daysOfWeekDisabled: number[] = [];
  @Input() language: string;
  @Input() placeholder: string;
  @Input() offset: string;

  @ViewChild('datePickerBox') datePickerBox: ElementRef;
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter<any>();


  changeDateFlag = false;
  weekTitleEn = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  weekTitleZh = ['日', '一', '二', '三', '四', '五', '六'];
  showYearMonth: boolean = false;
  monthArray: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  yearArray: Array<number> = [];
  displayDate: string = null;
  dates: Array<Day[]> = [[]];
  titleYear: number;
  titleMonth: number;
  pickerTitle: string;
  today: Date;
  monthDays: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  monthFullName: string[] =
    ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  monthName: string[] =
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


  _minDate: Date = new Date('01/01/1900');
  _maxDate: Date = new Date('12/31/2117');
  _disabledDates: (Date | string)[];
  _availableDates: (Date | string)[];
  _daysOfWeekDisabled: number[];
  minYear: number;
  minMonth: number;
  maxYear: number;
  maxMonth: number;

  selectedDate: SelectedDate;
  outputDate: OutputDate;
  startDate: Date;
  endDate: Date;

  hasSelectedBar: boolean;
  hasInitDate: boolean;
  isInited: boolean;

  constructor() {
    if (this.isHidden === undefined) {
      this.isHidden = true;
    }
    this.createEmptyDatePicker();
  }

  ngOnInit() {
    this.minDate = this.minDate || new Date('1900/01/01');
    this.maxDate = this.maxDate || new Date('2117/12/31');
    if (!this.isInited) {
      this.initDatePicker(new Date());
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(ev: any) {
    if (!this.datePickerBox.nativeElement.contains(ev.target)) {
      if (!this.isHidden) {
        this.toggleCalendar(true);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedQuickDateBar']) this.hasSelectedBar = true;
    if (changes['initDate']) this.hasInitDate = true;

    if (changes['selectedQuickDateBar'] && changes['selectedQuickDateBar'].currentValue) {
      if (!this.hasInitDate && !this.isInited) {
        this.initDatePicker(new Date());
      }

      if (this.hasInitDate) {
        this.setAvailableDates(this.selectedQuickDateBar);
      } else {
        this.selectBar(this.selectedQuickDateBar);
      }
    }
    if (changes['maxDate'] && changes['maxDate'].currentValue) {
      this._maxDate = this.maxDate;
    }
    if (changes['minDate'] && changes['minDate'].currentValue) {
      this._minDate = this.minDate;
    }
    if (changes['availableDates'] && changes['availableDates'].currentValue) {
      this._availableDates = this.availableDates;
    }
    if (changes['disabledDates'] && changes['disabledDates'].currentValue) {
      this._disabledDates = this.disabledDates;
    }
    if (changes['daysOfWeekDisabled'] && changes['daysOfWeekDisabled'].currentValue) {
      this._daysOfWeekDisabled = this.daysOfWeekDisabled;
    }
    if (changes['initDate'] && changes['initDate'].currentValue) {
      this.changeDateFlag = true;
      let _initDate: Date = new Date(this.initDate);
      this.initDatePicker(_initDate);
      this.selectionEmitter(new Day(_initDate.getDate()));
    }
  }

  decreaseYear() {
    // 向前推年份
    this.yearArray = this.calcYear(this.yearArray[0] - 12);
  }

  increaseYear() {
    // 向后推年份
    this.yearArray = this.calcYear(this.yearArray[this.yearArray.length - 1] + 1);
  }

  selectMonth(ev: any, month: number) {
    this.titleMonth = month;
    this.showYearMonth = false;
    this.pickerTitle = this.renderTitle();
    this.calCalendar();
  }

  selectYear(ev: any, year: number) {
    this.titleYear = year;
    this.pickerTitle = this.renderTitle();
  }

  calcYear(minYear: number) {
    let tempArray: Array<number> = [minYear];
    for (let i = 0; i < 11; i++) {
      tempArray.push(minYear + i + 1);
    }
    return tempArray;
  }

  clearDate() {
    this.selectionEmitter(new Day(Date.now()), true);
  }

  selectYearMonth() {
    this.yearArray = this.calcYear(this.titleYear - 5);
    this.showYearMonth = !this.showYearMonth;
    // todo 设置年月
    // this.titleYear = 2017;
    // this.titleMonth = 7;
    //
    // this.pickerTitle = this.renderTitle();
    // this.calCalendar();
  }

  createEmptyDatePicker(): void {
    for (let i = 0; i < 6; i++) {
      this.dates.push([]);
      for (let j = 0; j < 7; j++) {
        this.dates[i].push();
      }
    }
  }

  initDatePicker(date: Date): void {
    let today: Date = date;
    this.titleYear = today.getFullYear();
    this.titleMonth = today.getMonth() + 1;

    this.pickerTitle = this.renderTitle();
    this.selectedDate = new SelectedDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
    this.calCalendar();
    this.initInput();

    if (!this.hasInitDate && !this.hasSelectedBar) {
      this.selectionEmitter(new Day(today.getDate()), true);
    }
    this.isInited = true;
  }

  clearDateByOther() {
    this.changeDateFlag = true;
    this.selectionEmitter(new Day(Date.now()), true);
  }

  selectionEmitter(d: Day, isInit?: boolean): void {
    this.isHidden = true;
    this.startDate = new Date(this.titleMonth + '/' + d.date + '/' + this.titleYear);
    this.endDate = null;
    this.selectedDate = new SelectedDate(this.titleYear, this.titleMonth, d.date);
    if (isInit) {
      this.displayDate = '';
    } else {
      /*this.displayDate = (this.displayDateType && this.selectedQuickDateBar ? this.selectedQuickDateBar.value : '')
        + (this.selectedDate.day < 10 ? ('0' + this.selectedDate.day) : this.selectedDate.day)
        + '-' + this.monthName[this.selectedDate.month - 1] + '-' + this.selectedDate.year;*/
      this.displayDate = (this.displayDateType && this.selectedQuickDateBar ? this.selectedQuickDateBar.value : '')
        + this.selectedDate.year + '-' + (this.selectedDate.month) + '-'
        + (this.selectedDate.day < 10 ? ('0' + this.selectedDate.day) : this.selectedDate.day);
    }

    this.outputEvent();
  }

  selectDate(d: Day): void {
    this.showYearMonth = false;
    if (!d.isDisabled) {
      if (d.num > 0) this.increaseMonth();
      if (d.num < 0) this.decreaseMonth();
      this.selectionEmitter(d);
    }
  }

  isDateSelected(d: Day): boolean {
    // const date: Date = new Date((this.titleMonth + (d.num | 0)) + '/' + d.date + '/' + this.titleYear);
    const date: Date = new Date((d.month + (d.num || 0)) + '/' + d.date + '/' + d.year);
    d.isSelected = (this.startDate && this.startDate.getTime() === date.getTime()) || (this.endDate && this.endDate.getTime() === date.getTime());
    d.isInRange = (this.startDate && this.startDate.getTime() < date.getTime()) && (this.endDate && this.endDate.getTime() > date.getTime());
    d.isDisabled = this.isDateDisbalbed(date);
    return d.isSelected;
  }

  isDateDisbalbed(date: Date): boolean {
    if (date.getTime() > this.maxDate.getTime() || date.getTime() < this.minDate.getTime()) {
      return true;
    }
    if (this.disabledDates && this.disabledDates.length > 0
      && this.disabledDates.filter((disabledDate: any) => date.getTime() === new Date(disabledDate).getTime()).length > 0) {
      return true;
    }
    if (this.availableDates && this.availableDates.length > 0
      && this.availableDates.filter((availableDate: any) => date.getTime() === new Date(availableDate).getTime()).length === 0) {
      return true;
    }
    if (this.daysOfWeekDisabled && this.daysOfWeekDisabled.length > 0
      && this.daysOfWeekDisabled.indexOf(date.getDay()) > -1) {
      return true;
    }
    return false;
  }

  /**
   * Formate displaying month to full name
   */
  renderTitle(): string {
    return this.titleYear + '年 ' + this.titleMonth + '月';
  }

  initInput(): void {
    this.maxYear = this.maxDate && this.maxDate.getFullYear();
    this.maxMonth = this.maxDate && this.maxDate.getMonth() + 1;
    this.minYear = this.minDate && this.minDate.getFullYear();
    this.minMonth = this.minDate && this.minDate.getMonth() + 1;
  }

  calCalendar(): void {
    this.clearCalendar();

    let startTime: Date = new Date(this.titleMonth + '/01/' + this.titleYear);
    let startDay: number = startTime.getDay();
    let monthDays: number = this.calMonthEndDay(this.titleYear, this.titleMonth, 0);

    for (let i = 0, k = 1, l = 1; i < 6; i++) {
      if (i === 0) {
        for (let j = 0; j < 7; j++) {
          let temp = null;
          if (j < startDay) {
            let lastMonthEndDay: number = this.calMonthEndDay(this.titleYear, this.titleMonth, -1);
            let lastDay: number = lastMonthEndDay - startDay + j + 1;
            temp = new Day(lastDay, -1, this.isHoliday(this.titleYear, this.titleMonth, lastDay, -1), false, this.isSelectedDay(this.titleYear, this.titleMonth, lastDay, -1));
            if (this.titleMonth == 1) {
              temp.year = this.titleYear - 1;
              temp.month = 12;
              temp.num = 0;
            } else {
              temp.year = this.titleYear;
              temp.month = this.titleMonth;
            }
            this.dates[i][j] = temp;
          } else {
            temp = new Day(k, 0, this.isHoliday(this.titleYear, this.titleMonth, k, 0), true, this.isSelectedDay(this.titleYear, this.titleMonth, k, 0));
            temp.year = this.titleYear;
            temp.month = this.titleMonth;
            this.dates[i][j] = temp;
            k++;
          }
        }
      } else {
        for (let j = 0; j < 7; j++ , k++) {
          let temp = null;
          if (k > monthDays) {
            temp = new Day(l, 1, this.isHoliday(this.titleYear, this.titleMonth, l, 1), false, this.isSelectedDay(this.titleYear, this.titleMonth, l, 1));
            if (this.titleMonth == 12) {
              temp.year = this.titleYear + 1;
              temp.month = 1;
              temp.num = 0;
            } else {
              temp.year = this.titleYear;
              temp.month = this.titleMonth;
            }
            this.dates[i][j] = temp;
            l++;
          } else {
            temp = new Day(k, 0, this.isHoliday(this.titleYear, this.titleMonth, k, 0), true, this.isSelectedDay(this.titleYear, this.titleMonth, k, 0));
            temp.year = this.titleYear;
            temp.month = this.titleMonth;
            this.dates[i][j] = temp;
          }
        }
      }
    }
  }

  increaseMonth(): void {
    this.titleMonth++;
    if (this.titleMonth === 13) {
      this.titleYear++;
      this.titleMonth = 1;
    }
    this.pickerTitle = this.renderTitle();
    this.calCalendar();
  }

  decreaseMonth(): void {
    this.titleMonth--;
    if (this.titleMonth === 0) {
      this.titleYear--;
      this.titleMonth = 12;
    }
    this.pickerTitle = this.renderTitle();
    this.calCalendar();
  }

  isSelectedDay(y: number, m: number, d: number, num: number): boolean {
    let year: number = y;
    let month: number = m + num;
    if (month === 0) {
      year--;
      month = 12;
    }
    if (month === 13) {
      year++;
      month = 1;
    }

    if (year !== this.selectedDate.year) return false;
    if (month !== this.selectedDate.month) return false;
    if (d !== this.selectedDate.day) return false;
    return true;
  }

  isHoliday(y: number, m: number, d: number, num: number): boolean {
    let year: number = y;
    let month: number = m + num;
    if (month === 0) {
      year--;
      month = 12;
    }
    if (month === 13) {
      year++;
      month = 1;
    }
    let day = new Date(month + '/' + d + '/' + year);
    if (day.getDay() === 0 || day.getDay() === 6) return true;
    return false;
  }

  calMonthEndDay(y: number, m: number, num: number): number {
    let year: number = y;
    let month: number = m + num;
    if (month === 0) {
      year--;
      month = 12;
    }
    if (month === 13) {
      year++;
      month = 1;
    }

    return (year % 4 === 0) && (month === 2) ? this.monthDays[month - 1] + 1 : this.monthDays[month - 1];
  }

  clearCalendar(): void {
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        this.dates[i][j] = null;
      }
    }
  }

  resetCalendar(year: number, month: number): void {
    this.titleMonth = month;
    this.titleYear = year;
    if (this.titleMonth === 12) {
      this.titleYear++;
      this.titleMonth = 1;
    }
    if (this.titleMonth === 0) {
      this.titleYear--;
      this.titleMonth = 12;
    }
    this.pickerTitle = this.renderTitle();
    this.calCalendar();
  }

  selectBar(bar: QuickDateBar): void {
    if (bar.startDate && bar.endDate) {
      this.startDate = bar.startDate;
      this.endDate = bar.endDate;
      this.displayDate = (this.displayDateType ? bar.value : '')
        + this.renderDisplayDate(this.startDate) + ' - ' + this.renderDisplayDate(this.endDate);
    } else {
      this.startDate = bar.date || bar.startDate || bar.endDate;
      this.endDate = null;
      this.displayDate = (this.displayDateType ? bar.value : '') + this.renderDisplayDate(this.startDate);
    }

    this.isHidden = true;
    this.resetCalendar(this.startDate.getFullYear(), this.startDate.getMonth() + 1);
    this.selectedQuickDateBar = bar;
    this.outputEvent();
  }

  setAvailableDates(bar: QuickDateBar): void {
    this.maxDate = (bar && bar.maxDate) ? bar.maxDate : this._maxDate;
    this.minDate = (bar && bar.minDate) ? bar.minDate : this._minDate;
    this.disabledDates = (bar && bar.disabledDates) ? bar.disabledDates : this._disabledDates;
    this.availableDates = (bar && bar.availableDates) ? bar.availableDates : this._availableDates;
    this._daysOfWeekDisabled = (bar && bar.daysOfWeekDisabled) ? bar.daysOfWeekDisabled : this._daysOfWeekDisabled;
    this.initInput();
  }

  isBarSelected(bar: QuickDateBar): boolean {
    return this.selectedQuickDateBar === bar;
  }

  renderDisplayDate(date: Date): string {
    if (date)
      return (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()) + '-' + this.monthName[date.getMonth()] + '-' + date.getFullYear();
  }

  toggleCalendar(isHidden?: boolean): void {
    if (this.showYearMonth) {
      this.showYearMonth = false;
    }
    this.isHidden = isHidden ? isHidden : !this.isHidden;
    if (this.isHidden && this.startDate && this.startDate.toString() !== 'Invalid Date') {
      this.resetCalendar(this.startDate.getFullYear(), this.startDate.getMonth() + 1);
    }
  }

  outputEvent(): void {
    this.outputDate = {
      date: this.startDate,
      startDate: this.startDate,
      endDate: this.endDate,
      dateType: this.selectedQuickDateBar
    };
    if (!this.changeDateFlag) {
      this.ngModelChange.emit(this.outputDate);
    }
    this.changeDateFlag = false;
  }
}

export class Day {
  constructor(public date: number,
              public num?: number,
              public isHoliday?: boolean,
              public isInMonth?: boolean,
              public isSelected?: boolean,
              public isInRange?: boolean,
              public isDisabled?: boolean,
              public year?: number,
              public month?: number) {
  }
}

export class SelectedDate {
  constructor(public year: number,
              public month: number,
              public day: number) {
  }
}

export interface QuickDateBar {
  date?: Date;
  startDate?: Date;
  endDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: (Date | string)[];
  availableDates?: (Date | string)[];
  daysOfWeekDisabled?: number[];
  label?: string;
  value?: string;
  monthly?: true;
  children?: QuickDateBar;
}

export interface OutputDate {
  date?: Date;
  startDate?: Date;
  endDate?: Date;
  dateType?: QuickDateBar;
}
