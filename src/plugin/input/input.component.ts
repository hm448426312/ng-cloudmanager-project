import {
  Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnInit, Output,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'dc-input',
  template: `
    <div style="position: relative;" [style.width]="width">
      <input *ngIf="type == 'text' || type == 'password'" #dcInput class="dc-input-default" [disabled]="disabled" [readonly]="readonly"
             [maxlength]="maxLength" [(ngModel)]="value" [type]="type"
             (click)="clickEvent($event)" (ngModelChange)="modelChange($event)" [placeholder]="dcPlaceholder || ''"
             (blur)="blurEvent($event)" (focus)="focusEvent($event)" (keyup)="keyupEvent($event)" (keyup.enter)="keyenterEvent($event)"/>
      <textarea *ngIf="type == 'textarea'" #dcInput class="dc-input-default" [disabled]="disabled" [readonly]="readonly" [(ngModel)]="value"
                (click)="clickEvent($event)" (ngModelChange)="modelChange($event)" [placeholder]="dcPlaceholder || ''"
                (blur)="blurEvent($event)" (focus)="focusEvent($event)" (keyup)="keyupEvent($event)"
                [style.height]="height" [style.resize]="resize" [maxlength]="maxLength"></textarea>
      <i [hidden]="noClear || !(value && !disabled && !readonly && type !== 'textarea')" class="clear-input-value"
         (click)="clearValue()"></i>
      <div *ngIf="type=='textarea' && maxLength" class="numtip"><strong #numtip>{{canNum}}</strong>/<em>{{maxLength}}</em></div>
    </div>
  `,
  styles: [
      `
      .dc-input-default {
        height: 32px;
        line-height: 30px;
        padding: 0 30px 0 10px;
        border-radius: 4px;
        border: 1px solid #ccc;
        font-size: 14px;
        color: #333;
        width: 100%;
        box-shadow: none;
      }

      textarea.dc-input-default {
        height: 50px;
      }

      .clear-input-value {
        position: absolute;
        right: 8px;
        top: 0;
        cursor: pointer;
        width: 12px;
        height: 32px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAAOVJREFUKJF90DFKA1EQBuAvj2Cu8MBqe8FokedeQb2A6WzU0uN4gxTbxkM8CKKSfqvAXsAi2lj4dlkh5Icp5p9/Zv6ZSdM0Ck7whDucFW6LFV7wDdNSOMUac/9xVeIet9iFMvmQeIw5XjELeOzFdV2LMQ6qGKO6rvv0HA8By55p21ZKSYxRjFFKSdu2403LKS77rOs6OWcpJZBz1nXduOEiHPF9CD8Bb2PPKSU552HT+CZsg78/g6qqBhu9vaqqxg2rSdM0M+TyhWP4xCJgjxu8HxF/4Br7/ugdEp6xwVeJTeEWReMX1Y9FK/4RDOgAAAAASUVORK5CYII=) no-repeat center center transparent;
      }

      .clear-input-value:hover {
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAAOtJREFUKJF90b1NAzEcBfBfriCVm2vR3S2ABFXYAViADACUjMMGWQCGQIoQWJngrLTXWBSBIhRxooBCnuTCz++9/4dHMUYFJ3jALc4Kt8AMT/iCUTGc4hkXDuMdN1hWJfmYWHl7wbjC/VbcdZ0Qwk4VQtB13fZ6jrsK0y0zDIO2bYUQhBA0TWMYhv1K01GMcVXa2qW2bWu9XkspyTnvG1bVkb4P4bvC29/0vu+llDRN82smLCqbPYO6rvV9L+cs5yylpK7rfcNsFGMc47Vs4RgiJhVWuLb5nP/wgSt7Qy9xiUfM8VnOvHCTovEDCGVJpA/ldQoAAAAASUVORK5CYII=) no-repeat center center transparent;
      }

      input.dc-input-default::placeholder,
      textarea.dc-input-default::placeholder {
        color: #bbb;
        font-size: 12px;
      }

      .dc-input-default.dc-valid {
        border-color: #3FB992;
      }

      .dc-input-default.dc-invalid {
        border-color: #FF3B3B;
      }

      .dc-input-default:focus {
        border-radius: 4px;
        border-color: #2BB1FF;
        transition: none;
        background: none;
        outline: none;
      }

      .dc-input-default[readonly],
      .dc-input-default[disabled] {
        background-color: #F0F0F0;
      }

      .numtip {
        position: absolute;
        right: 8px;
        bottom: 8px;
        color: #666;
      }

      .numtip strong {
        color: #2bb1ff;
        font-weight: normal;
        margin-right: 2px;
      }

      .numtip em {
        font-style: normal;
        margin-left: 2px;
      }

      .numtip strong.tip {
        color: #f95f5b;
      }
    `
  ],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputComponent), multi: true}
  ]
})
export class InputComponent implements ControlValueAccessor, OnInit {

  @Input() autoFocus: boolean;
  @Input() type = 'text';
  @Input() disabled: boolean; // 是否可用
  @Input() readonly: boolean;
  @Input() dcPlaceholder: string;
  @Input() width: string;
  @Input() height: string;
  @Input() resize = 'none';
  @Input() maxLength: number;
  @Input() required: boolean;
  @Input() noClear: boolean;
  @Output() dcBlur: EventEmitter<any> = new EventEmitter<any>();
  @Output() dcFocus: EventEmitter<any> = new EventEmitter<any>();
  @Output() dcClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() dcKeyup: EventEmitter<any> = new EventEmitter<any>();
  @Output() dcKeyenter: EventEmitter<any> = new EventEmitter<any>();
  @Output() dcModelChange: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('dcInput') dcInput: ElementRef;
  @ViewChild('numtip') numtip: ElementRef;
  showValue: string;
  canNum = 0;
  isNum: number;
  // 双向绑定 --start
  private onTouchedCallback: () => void = () => {
  };
  private onChangeCallback: (_: any) => void = () => {
  };

  get value() {
    return this.showValue;
  }

  set value(v) {
    this.showValue = v;
    this.onChangeCallback(this.showValue);
    if (this.dcInput && this.autoFocus) {
      this.dcInput.nativeElement.focus();
    }
  }

  // 双向绑定 --end

  constructor() {
  }

  ngOnInit() {
  }

  setInputValue(val: any) {

  }

  setInputValid(valid?: boolean) {
    const classList = this.dcInput.nativeElement.classList;
    if (valid) {
      classList.add('dc-valid');
      classList.remove('dc-invalid');
    } else {
      classList.remove('dc-valid');
      classList.add('dc-invalid');
    }
  }

  // 双向绑定 --start
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  writeValue(val: any) {
    this.isNum = parseFloat(this.value);
    if (this.isNum || val == '0') {
      this.value = val || '0';
    } else {
      this.value = val || '';
    }
    if (this.type == 'textarea' && this.maxLength) {
      this.canNum = this.value.length;
    }
  }

  // 双向绑定 --end

  blurEvent(ev: any) {
    this.dcBlur.emit(ev);
  }

  focusEvent(ev: any) {
    this.dcFocus.emit(ev);
  }

  clickEvent(ev: any) {
    this.dcClick.emit(ev);
  }

  keyupEvent(ev: any) {
    if (this.type == 'textarea' && this.maxLength) {
      this.canNum = this.value.length;
      const numtip = this.numtip.nativeElement.classList;
      if (this.canNum >= this.maxLength) {
        numtip.add('tip');
      } else {
        numtip.remove('tip');
      }
    }
    this.dcKeyup.emit(ev);
  }

  modelChange(ev: any) {
    this.dcModelChange.emit(ev);
  }

  keyenterEvent(ev: any) {
    this.dcKeyenter.emit(ev);
  }

  clearValue() {
    this.value = '';
    this.dcModelChange.emit('');
    this.dcInput.nativeElement.focus();
  }
}
