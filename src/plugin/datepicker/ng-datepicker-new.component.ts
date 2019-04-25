import {
  Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ChangeDetectionStrategy, OnChanges,
  HostListener, ViewChild, ElementRef, OnDestroy
} from '@angular/core';
import {Day} from './ng-datepicker.component';

@Component({
  selector: 'dc-ng-datepicker-new',
  template: `
    <div #DatePickerBox class="date-picker-box" [style.width]="width">
      <div class="date-picker-outer">
        <input type="text" class="date-picker-input" [placeholder]="placeholder || '请选择日期'" (click)="toggleCalendar()"
               readonly [value]="displayDate"/>
        <i *ngIf="displayDate && canClear" class="clear" title="清除日期" (click)="clearDate()"></i>
        <i class="show" [class.active]="!isHidden" (click)="toggleCalendar()"></i>
      </div>
      <div class="date-picker-drop" [class.showToday]="showTodayBtn" [class.offset-left]="offset == 'left'"
           [style.display]="!isHidden? 'block' : 'none'">
        <div class="control-bar">
          <span class="material-icon de-year" (click)="decreaseYear()"></span>
          <span class="material-icon de-month" [hidden]="showType === 'year' || showType === 'month'" (click)="decreaseMonth()"></span>
          <div class="control-title">
            <span class="title-icon title-year" (click)="toggleYearDrop()"
                  [class.has-icon]="type !== 'year'">{{showYear + '年'}}</span>
            <span class="title-icon title-month" *ngIf="type === 'day'" (click)="toggleMonthDrop()"
                  [class.has-icon]="type=='day'">{{(showMonth || '-') + '月'}}</span>
          </div>
          <span class="material-icon in-month" [hidden]="showType === 'year' || showType === 'month'" (click)="increaseMonth()"></span>
          <span class="material-icon in-year" (click)="increaseYear()"></span>
        </div>
        <div class="date-drop-content" [class.active]="showType === 'day'">
          <table class="table-day">
            <thead>
            <ng-template [ngIf]="!language || language === 'zh'">
              <th *ngFor="let d of weekTitleZh">{{d}}</th>
            </ng-template>
            <ng-template [ngIf]="language === 'en'">
              <th *ngFor="let d of weekTitleEn">{{d}}</th>
            </ng-template>
            </thead>
            <tbody>
            <tr *ngFor="let week of dates">
              <td *ngFor="let day of week">
                    <span class="date" *ngIf="day != null" [class.inMonth]="day?.isInMonth"
                          [class.active]="day?.isSelected" [class.disabled]="isDataDisabled(day)" (click)="selectDate(day)">
                      {{day.date}}
                    </span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="date-drop-content" [class.active]="showType === 'month'">
          <table class="table-month">
            <tbody>
            <tr *ngFor="let months of monthArray">
              <td *ngFor="let month of months">
                <span class="month" [class.disabled]="isDisabledMonth(month)"
                      [class.active]="month === showMonth && showYear === selectedDate?.year" (click)="selectMonth($event, month)">
                  {{month}} 月
                </span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="date-drop-content" [class.active]="showType === 'quarter'">
          <table class="table-quarter">
            <tbody>
            <tr *ngFor="let quarters of quarterArray">
              <td *ngFor="let quarter of quarters">
                <span class="quarter" [class.active]="quarter === showQuarter && showYear === selectedDate?.year"
                      (click)="selectQuarter(quarter)">
                  第 {{month}} 季度
                </span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="date-drop-content" [class.active]="showType === 'year'">
          <table class="table-year">
            <tbody>
            <tr *ngFor="let years of yearArray">
              <td *ngFor="let year of years">
                <span class="year" [class.disabled]="isDisabledYear(year)" [class.active]="year === showYear"
                      (click)="selectYear($event, year)">
                  {{year}} 年
                </span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .date-picker-box {
      position: relative;
      display: inline-block;
      width: 150px;
    }

    .date-picker-outer {
      display: flex;
      align-items: center;
      flex-direction: row;
      height: 32px;
      border: 1px solid #ccc;
      border-radius: 2px;
    }

    .date-picker-outer .date-picker-input {
      flex: 1;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      height: 32px;
      cursor: pointer;
    }

    .date-picker-outer .show {
      border: solid 4px transparent;
      border-top-width: 6px;
      border-top-color: #333;
      width: 0;
      height: 0;
      flex: none;
      cursor: pointer;
      margin-right: 8px;
      margin-top: 4px;
    }

    .date-picker-outer .show.active {
      border: solid 4px transparent;
      border-bottom-width: 6px;
      border-bottom-color: blue;
      border-top-width: 0;
      width: 0;
      height: 0;
      flex: none;
      margin-top: 0;
    }

    .date-picker-outer .clear {
      flex: none;
      cursor: pointer;
      width: 20px;
      height: 30px;
      margin-right: 4px;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAAOVJREFUKJF90DFKA1EQBuAvj2Cu8MBqe8FokedeQb2A6WzU0uN4gxTbxkM8CKKSfqvAXsAi2lj4dlkh5Icp5p9/Zv6ZSdM0Ck7whDucFW6LFV7wDdNSOMUac/9xVeIet9iFMvmQeIw5XjELeOzFdV2LMQ6qGKO6rvv0HA8By55p21ZKSYxRjFFKSdu2403LKS77rOs6OWcpJZBz1nXduOEiHPF9CD8Bb2PPKSU552HT+CZsg78/g6qqBhu9vaqqxg2rSdM0M+TyhWP4xCJgjxu8HxF/4Br7/ugdEp6xwVeJTeEWReMX1Y9FK/4RDOgAAAAASUVORK5CYII=) no-repeat center center transparent;
    }

    .date-picker-outer .clear:hover {
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAAOtJREFUKJF90b1NAzEcBfBfriCVm2vR3S2ABFXYAViADACUjMMGWQCGQIoQWJngrLTXWBSBIhRxooBCnuTCz++9/4dHMUYFJ3jALc4Kt8AMT/iCUTGc4hkXDuMdN1hWJfmYWHl7wbjC/VbcdZ0Qwk4VQtB13fZ6jrsK0y0zDIO2bYUQhBA0TWMYhv1K01GMcVXa2qW2bWu9XkspyTnvG1bVkb4P4bvC29/0vu+llDRN82smLCqbPYO6rvV9L+cs5yylpK7rfcNsFGMc47Vs4RgiJhVWuLb5nP/wgSt7Qy9xiUfM8VnOvHCTovEDCGVJpA/ldQoAAAAASUVORK5CYII=) no-repeat center center transparent;
    }

    .date-picker-drop {
      position: absolute;
      width: 280px;
      min-height: 254px;
      background-color: white;
      box-shadow: 0 0 5px gray;
      z-index: 1000;
      right: 0;
      user-select: none;
    }

    /*.date-picker-drop.showToday{
      
    }*/

    .date-picker-drop.offset-left {
      right: auto;
      left: 0;
    }

    .control-bar {
      display: flex;
      padding: 0 6px;
      height: 40px;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      border-bottom: 1px solid #eee;
    }

    .control-title {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
    }

    .title-icon {
      cursor: pointer;
      height: 40px;
      line-height: 40px;
      margin-right: 8px;
      font-weight: 500;
    }

    .title-icon.has-icon {
      background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAAXNSR0IArs4c6QAAAKtJREFUCB1jzM3NZX/37l3AkiVLVjEyMv5nQAINDQ0sd+7cCVVRUVnJ9P79e6H////PjoqKmgmkGWHqVq1axXzr1q3Ff//+nfLs2TNesERkZKQN0LQdQLxw6dKl2UCTmG7evLkQyPdhYmJyBtp2Dm5CTEyMw79//7YCTZwDxHxA0wOBilyBGk+DbIErBHGio6OdgQq2AJm/gaa5ARWdAIljBUDFpnFxcXrokgBsVUivS45SVAAAAABJRU5ErkJggg==') no-repeat right center transparent;
      padding-right: 11px;
    }

    .title-icon.has-icon.active {
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACtSURBVBhXY2ZAA3FxcXo6Ojpyly9ffgYVAgMmKA0G0dHRFn/+/Dny////Q0C2M1QYDOAKgRKm//792wFkrgXiWUDFm2JiYhzAkkAAVggUMAJK7AIyN6upqSUvW7Ysn5GRcQFQ45bIyEgbkBrGtLQ0/s+fP98DSuwKCAiICQsL+wuSAGpkjIqKmgkUj2BiYlJnkpKS+szMzJwDNCkWpggEgAr+A01OB9KpgoKC7wBJ9EC/L/4JsQAAAABJRU5ErkJggg==");
    }

    .material-icon {
      cursor: pointer;
      width: 20px;
      height: 40px;
      opacity: 0.8;
    }

    .material-icon:hover {
      opacity: 1;
    }

    .material-icon.de-year {
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAAXNSR0IArs4c6QAAALdJREFUKBWVkTsKAjEUReOvsHFAxN7WysLSwmamcgOWFm7WDfhFUQS3oDI4njdJTHxq4YVD3rkkhMkY82dqX/ZX6VLowhnevE4Rp4FM4A4L0E4V0mScwhgqoJ0qpMU4g6GrtIedTAnMoe9a7a62i3yQXC8p7PLhrraLvNIVdpCB+EH5BX/FP+uNZg0jaMMWVpGfmMv4AyI5yKYB9GADy8j3zEV8ADcPkJvkQAeOyuVH/ox/DL+h9Cf3pCF6rPdPKwAAAABJRU5ErkJggg==") no-repeat center transparent;
    }

    .material-icon.in-year {
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAAXNSR0IArs4c6QAAALFJREFUKBWdkT0KAkEMRkdF0MbWg1iIlYWgWNnbeUZv4QVE/K28w6qo72OSdTalgUfyspPZDZvSnzFhbg5tm49eX+sHdnS6sLIcvR7oWPUhn2AIYzjCvvAz9QuSD6hW3KAHM9ChQ+EX6ioO0Et3eMASNHQt3Xeg1wh9oqKVU4pu7ZxGpA0MrBvd2vm2KbaGPuj20tHfK7XLArTwFt7Bn3gj9KM04DtFbxyW+HL+ILr30xd6jB3xq0tEFgAAAABJRU5ErkJggg==") no-repeat center transparent;
    }

    .material-icon.de-month {
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAMCAYAAABfnvydAAAAAXNSR0IArs4c6QAAAIpJREFUGBljYCAAmHHIcwHFw4D4PTZ5fqBgEhAbYZMUAwqmAbE6Nkk5oGA6EINoDKAEFEkFYpAJKIAJymOE0v9RZIEcmC9Arn0LxL5A/AqIPwExGMAUgDgfgfgJEPsA8WcgBmmAmwBig8BXIL4LxO5ADLLuBbIJQD4Y/ACSN4HYHojfgUVwEGCHAwDJMBPs3WRuzQAAAABJRU5ErkJggg==") no-repeat center transparent;
    }

    .material-icon.in-month {
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAMCAYAAABfnvydAAAAAXNSR0IArs4c6QAAAIlJREFUGBljYCASWALVuQExE7p6mMApoAQrEPtDabg6ZijrP5C+A8TiQGwOxHeB+A8QM8AUgNgg8ACIOYDYGYjvAfFPdAVAMYZnQPwLiD2B+C7MDUA2CgBZCQKMEAqVNAZyE4GYD1UYotoeKBgFxJzokiC3eAFxEBCDvIsBQAHlDsS43ITdMSBjAGiLDyi3RK/8AAAAAElFTkSuQmCC") no-repeat center transparent;
    }

    .date-drop-content {
      align-items: center;
      justify-content: center;
      display: none;
      margin-top: 13px;
    }

    .date-drop-content.active {
      display: flex;
    }

    .date-drop-content table {
      border-spacing: 0;
      border: none;
    }

    .table-day {
    }

    .table-day th, td {
      text-align: center;
      position: relative;
      font-weight: normal;
    }

    .date {
      display: block;
      width: 24px;
      height: 24px;
      text-align: center;
      line-height: 24px;
      margin: 2px 6px;
      cursor: pointer;
      border-radius: 2px;
      background-color: #fff;
      opacity: 0.3;
    }

    .month {
      display: block;
      width: 45px;
      height: 24px;
      line-height: 24px;
      margin: 11px 18px;
      text-align: center;
      cursor: pointer;
      border-radius: 2px;
    }

    .year {
      display: block;
      width: 60px;
      height: 24px;
      line-height: 24px;
      margin: 11px 10px;
      text-align: center;
      cursor: pointer;
      border-radius: 2px;
    }

    .date.inMonth {
      opacity: 1;
    }

    .date:hover,
    .month:hover,
    .year:hover {
      background-color: #eeeeee;
    }

    .date.active,
    .month.active,
    .year.active {
      background-color: #1890ff;
      color: #fff;
    }

    .date.disabled {
      cursor: not-allowed;
      text-decoration: line-through;
    }

    .month.disabled {
      cursor: not-allowed;
      text-decoration: line-through;
    }

    .year.disabled {
      cursor: not-allowed;
      text-decoration: line-through;
    }

  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgDatepickerNewComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('DatePickerBox') DatePickerBox: ElementRef;
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() canClear = false;  // 是否有清除日期功能
  @Input() offset: string;  // 日期下拉定位，默认为右对齐
  @Input() displayDate = ''; // 显示的日期
  @Input() isHidden = true; // 下拉日期是否隐藏
  @Input() showTodayBtn: boolean; // 是否显示今日按钮
  @Input() placeholder: string; // 默认显示文本
  @Input() width: string; // 宽度
  _type: string;  // 日期选择类型，day,month,year
  @Input() set type(v) {
    this._type = v;
    this.showType = v;
  }

  get type() {
    return this._type;
  }

  _date: string;
  @Input() set date(v) {
    this._date = v;
    if (this._date) {
      const _initDate: Date = new Date(this._date);
      this.initDatePicker(_initDate);
      this.selectionEmitter({
        date: _initDate.getDate()
      }, true);
    } else {
      this.initDatePicker(new Date());
      this.selectionEmitter({
        date: ''
      }, true);
    }
  }

  get date() {
    return this._date;
  }

  @Input() language = 'zh';
  @Input() minDate: Date;
  @Input() maxDate: Date;


  // 自定义数据
  showType: string; // day | month | quarter | year
  maxYear: number;
  maxMonth: number;
  minYear: number;
  minMonth: number;
  weekTitleEn = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  weekTitleZh = ['日', '一', '二', '三', '四', '五', '六'];
  monthDays: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  dates: Array<any[]> = [[]];
  monthArray = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]];
  quarterArray = [[1, 2], [3, 4]];
  yearArray: Array<Array<number>> = [];

  actYear: number;
  actMonth: number;
  actDay: number;
  showYear: number;
  showMonth: number;
  showQuarter: number;
  showDay: number;
  selectedDate: any;

  constructor() {
    if (!this.type) {
      this.type = 'day';

    }
    this.showType = this.type || 'day';
    this.createEmptyDatePicker();
  }

  ngOnInit() {
    // this.minDate = this.minDate || new Date('1900/01/01');
    // this.maxDate = this.maxDate || new Date(Date.now());
    this.initDatePicker(this.date ? new Date(this.date) : new Date());
  }

  ngOnDestroy() {
  }

  ngOnChanges() {
  }


  clearDate() {
    this.selectionEmitter({date: ''}, true);
    this.outputEvent();
  }

  initDatePicker(date: Date): void {
    const today: Date = date;
    this.actYear = today.getFullYear();
    this.actMonth = today.getMonth() + 1;
    this.actDay = today.getDay();

    this.renderTitle();
    if (this.type === 'day') {
      this.selectedDate = {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
      };
    } else if (this.type === 'month') {
      this.selectedDate = {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
      };
    } else if (this.type === 'year') {
      this.createYearArray(today.getFullYear());
      this.selectedDate = {
        year: today.getFullYear(),
      };
    }
    this.calCalendar();
    this.initInput();
  }

  resetCalendar(year: number, month: number): void {
    this.actMonth = month;
    this.actYear = year;
    this.renderTitle();
    this.calCalendar();
  }

  calCalendar() {
    if (this.showType === 'day') {
      this.clearCalendar();
      const startTime: Date = new Date(this.actMonth + '/01/' + this.actYear);
      const startDay: number = startTime.getDay();
      const monthDays: number = this.calMonthEndDay(this.actYear, this.actMonth, 0);

      for (let i = 0, k = 1, l = 1; i < 6; i++) {
        if (i === 0) {
          for (let j = 0; j < 7; j++) {
            let temp: any = null;
            if (j < startDay) {
              const lastMonthEndDay: number = this.calMonthEndDay(this.actYear, this.actMonth, -1);
              const lastDay: number = lastMonthEndDay - startDay + j + 1;
              temp = {
                date: lastDay,
                isInMonth: false,
                isSelected: this.isSelectedDay(this.actYear, this.actMonth, lastDay, -1),
              };
              if (this.actMonth === 1) {
                temp['year'] = this.actYear - 1;
                temp['month'] = 12;
                temp['num'] = 0;
              } else {
                temp['num'] = -1;
                temp['year'] = this.actYear;
                temp['month'] = this.actMonth;
              }
              this.dates[i][j] = temp;
            } else {
              temp = {
                date: k,
                isInMonth: true,
                num: 0,
                isSelected: this.isSelectedDay(this.actYear, this.actMonth, k, 0),
                year: this.actYear,
                month: this.actMonth
              };
              this.dates[i][j] = temp;
              k++;
            }
          }
        } else {
          for (let j = 0; j < 7; j++ , k++) {
            let temp: any = null;
            if (k > monthDays) {
              temp = {
                date: l,
                isInMonth: false,
                isSelected: this.isSelectedDay(this.actYear, this.actMonth, l, 1),
              };
              if (this.actMonth === 12) {
                temp['year'] = this.actYear + 1;
                temp['month'] = 1;
                temp['num'] = 0;
              } else {
                temp['num'] = 1;
                temp['year'] = this.actYear;
                temp['month'] = this.actMonth;
              }
              this.dates[i][j] = temp;
              l++;
            } else {
              temp = {
                date: k,
                num: 0,
                isInMonth: true,
                isSelected: this.isSelectedDay(this.actYear, this.actMonth, k, 0),
                year: this.actYear,
                month: this.actMonth
              };
              this.dates[i][j] = temp;
            }
          }
        }
      }
    } else if (this.showType === 'year') {
      if (this.yearArray.length === 0) {
        this.createYearArray(this.actYear);
      } else {
        if (this.actYear < this.yearArray[0][0] || this.actYear > this.yearArray[3][2]) {
          this.clearYearArray();
          this.createYearArray(this.actYear);
        }
      }
    }
  }

  initInput(): void {
    this.maxYear = this.maxDate && this.maxDate.getFullYear();
    this.maxMonth = this.maxDate && this.maxDate.getMonth() + 1;
    this.minYear = this.minDate && this.minDate.getFullYear();
    this.minMonth = this.minDate && this.minDate.getMonth() + 1;
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

  clearCalendar() {
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        this.dates[i][j] = null;
      }
    }
  }

  renderTitle() {
    this.showYear = this.actYear;
    if (this.type !== 'year') {
      this.showMonth = this.actMonth;
    }
  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(ev: any) {
    if (!this.DatePickerBox.nativeElement.contains(ev.target)) {
      if (!this.isHidden) {
        this.toggleCalendar(true);
      }
    }
  }

  toggleCalendar(isHidden?: boolean) {
    this.isHidden = isHidden ? isHidden : !this.isHidden;
    this.showType = this.type;
    this.resetCalendar(this.showYear, this.showMonth);
  }

  toggleYearDrop() {
    // this.clearYearArray();
    if (this.yearArray.length === 0) {
      this.createYearArray(this.actYear);
    } else {
      if (this.actYear < this.yearArray[0][0] || this.actYear > this.yearArray[3][2]) {
        this.clearYearArray();
        this.createYearArray(this.actYear);
      }
    }
    if (this.type !== 'year') {
      if (this.showType !== 'year') {
        this.showType = 'year';
      } else {
        this.showType = this.type;
      }
    }
  }

  toggleMonthDrop() {
    if (this.type === 'day') {
      if (this.showType !== 'month') {
        this.showType = 'month';
      } else {
        this.showType = this.type;
      }
    }
  }

  selectYear(ev: any, year: number) {
    if (ev.target.classList.contains('disabled')) {
      return;
    }
    this.actYear = year;
    if (this.type === 'year') {
      this.selectionEmitter({
        year: this.actYear,
      });
    } else {
      this.showType = this.type;
    }
    this.renderTitle();
    this.calCalendar();
  }

  selectMonth(ev: any, month: number) {
    if (ev.target.classList.contains('disabled')) {
      return;
    }
    this.actMonth = month;
    if (this.type === 'month') {
      this.selectionEmitter({
        year: this.actYear,
        month: this.actMonth,
      });
    } else {
      this.showType = this.type;
    }
    this.renderTitle();
    this.calCalendar();
  }

  selectQuarter(quarter: number) {
    this.showQuarter = quarter;
    console.log('季度', quarter);
  }

  selectDate(d: any) {
    if (!d.isDisabled) {
      if (d.num > 0) {
        this.increaseMonth();
      }
      if (d.num < 0) {
        this.decreaseMonth();
      }
      this.selectionEmitter(d);
    }
  }

  increaseYear() {
    if (this.showType === 'day' || this.showType === 'month') {
      this.actYear++;
      this.renderTitle();
      this.calCalendar();
    } else if (this.showType === 'year') {
      let maxYear: number;
      if (this.yearArray.length > 0) {
        maxYear = this.yearArray[3][2];
      } else {
        maxYear = this.actYear + 5;
      }
      this.createYearArray(maxYear + 7);
    }
  }

  increaseMonth() {
    this.actMonth++;
    if (this.actMonth === 13) {
      this.actYear++;
      this.actMonth = 1;
    }
    this.renderTitle();
    this.calCalendar();
  }

  decreaseYear() {
    if (this.showType === 'day' || this.showType === 'month') {
      this.actYear--;
      this.renderTitle();
      this.calCalendar();
    } else if (this.showType === 'year') {
      let minYear: number;
      if (this.yearArray.length > 0) {
        minYear = this.yearArray[0][0];
      } else {
        minYear = this.actYear - 6;
      }
      this.createYearArray(minYear - 6);
    }
  }

  decreaseMonth() {
    this.actMonth--;
    if (this.actMonth === 0) {
      this.actYear--;
      this.actMonth = 12;
    }
    this.renderTitle();
    this.calCalendar();
  }

  selectionEmitter(d: any, isInit?: boolean): void {
    this.isHidden = true;
    if (this.type === 'day') {
      this.selectedDate = {
        year: this.actYear,
        month: this.actMonth,
        day: d.date || 1,
      };
      if (isInit && !d.date) {
        this.displayDate = '';
      } else {
        this.displayDate = `${this.selectedDate.year}-${this.selectedDate.month}`
          + `-${(this.selectedDate.day < 10 ? ('0' + this.selectedDate.day) : this.selectedDate.day)}`;
      }
    } else if (this.type === 'month') {
      this.selectedDate = {
        year: this.actYear,
        month: this.actMonth,
        day: 1,
      };
      if (isInit && !d.date) {
        this.displayDate = '';
      } else {
        this.displayDate = `${this.selectedDate.year}-${this.selectedDate.month}`;
      }
    } else if (this.type === 'year') {
      this.selectedDate = {
        year: this.actYear,
        month: 1,
        day: 1,
      };
      if (isInit && !d.date) {
        this.displayDate = '';
      } else {
        this.displayDate = `${this.selectedDate.year}`;
      }
    }
    this.renderTitle();
    if (!isInit) {
      this.outputEvent();
    }
  }

  outputEvent(): void {
    if (this.displayDate) {
      this.ngModelChange.emit(this.selectedDate);
    } else {
      this.ngModelChange.emit('');
    }
  }

  getCurrentDate() {
    return this.selectedDate;
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

    if (year !== this.selectedDate.year) {
      return false;
    }
    if (month !== this.selectedDate.month) {
      return false;
    }
    if (d !== this.selectedDate.day) {
      return false;
    }
    return true;
  }

  createEmptyDatePicker(): void {
    for (let i = 0; i < 6; i++) {
      this.dates.push([]);
      for (let j = 0; j < 7; j++) {
        this.dates[i].push();
      }
    }
  }

  clearYearArray() {
    this.yearArray = [];
  }

  createYearArray(year: number) {
    let minY = year - 6;
    const temp = [];
    for (let i = 0; i < 4; i++) {
      temp.push([]);
      for (let j = 0; j < 3; j++) {
        temp[i].push(minY);
        minY++;
      }
    }
    this.yearArray = temp;
  }

  isDataDisabled(date: any) {
    const theDate = new Date(`${date.year}/${date.month + (date.num || 0)}/${date.date}`);
    if (this.maxDate && (theDate.getTime() > this.maxDate.getTime()) || (this.minDate && theDate.getTime() < this.minDate.getTime())) {
      date.isDisabled = true;
      return true;
    }
    date.isDisabled = false;
    return false;
  }

  isDisabledMonth(month: number) {
    // 有最小日期
    if (this.minDate && this.minYear && this.minMonth) {
      if (this.showYear < this.minYear) {
        return true;
      } else if (this.showYear === this.minYear) {
        if (this.minMonth > month) {
          return true;
        }
      }
    }
    // 有最大日期
    if (this.maxDate && this.maxYear && this.maxMonth) {
      if (this.showYear > this.maxYear) {
        return true;
      } else if (this.showYear === this.maxYear) {
        if (this.maxMonth < month) {
          return true;
        }
      }
    }
    return false;
  }

  isDisabledYear(year: number) {
    // 有最小日期
    if (this.minDate && this.minYear) {
      if (year < this.minYear) {
        return true;
      }
    }
    // 有最大日期
    if (this.maxDate && this.maxYear) {
      if (year > this.maxYear) {
        return true;
      }
    }
    return false;
  }
}
