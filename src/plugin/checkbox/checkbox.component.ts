import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'dc-checkbox',
  template: `
    <div class="dc-checkbox" *ngIf="checkModel" [style.width]="options?.width" [style.max-width]="options?.maxWidth">
      <div class="dc-checkbox-inner">
        <input #labelInput class="dc-checkbox-input" [id]="'checkBox'+checkboxId" [name]="'checkBox'+checkboxId"
               [disabled]="options?.disabled" type="checkbox"
               [(ngModel)]="checkModel[options?.key || 'checked']" (ngModelChange)="checkModelChange($event)"/>
        <label (click)="$event.stopPropagation()" [for]="'checkBox'+checkboxId" class="dc-checkbox-label"></label>
        <label (click)="$event.stopPropagation()" [for]="'checkBox'+checkboxId" *ngIf="options?.text" class="dc-checkbox-text"
               [title]="options?.text">{{options?.text}}</label>
      </div>
    </div>
  `,
  styles: [`
    .dc-checkbox {
      position: relative;
      display: inline-block;
      min-width: 20px;
    }

    .dc-checkbox-inner {
      display: flex;
      align-items: center;
      height: 25px;
      line-height: 25px;
    }

    .dc-checkbox-input {
      visibility: hidden;
      position: absolute;
      width: 1px !important;
      height: 1px !important;
      overflow: hidden;
    }

    .dc-checkbox-label {
      position: relative;
      cursor: pointer;
      width: 16px;
      height: 16px;
      background: #fff;
      border: 1px solid #c8c8c8;
      border-radius: 3px; /* W3C syntax */
      margin: 0;
      flex: 0 0 auto;
    }

    .dc-checkbox-label:not(disabled):hover {
      background: #0081CC;
    }

    .dc-checkbox-input:disabled:hover + label:hover {
      background: transparent;
    }

    .dc-checkbox-label:after {
      opacity: 0;
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      width: 9px;
      height: 5px;
      background: transparent;
      border: 2px solid #fff;
      border-top: none;
      border-right: none;
      -webkit-transform: rotate(-45deg);
      -moz-transform: rotate(-45deg);
      -o-transform: rotate(-45deg);
      -ms-transform: rotate(-45deg);
      transform: rotate(-45deg);
    }

    .dc-checkbox-label:hover:after {
      opacity: 0.6;
    }

    .dc-checkbox-input:disabled,
    .dc-checkbox-input:disabled + label {
      cursor: not-allowed;
      background-color: #f5f5f5;
      opacity: 0.4;
    }

    .dc-checkbox-input:disabled {
      background: #ffffff;
    }

    .dc-checkbox-input:checked + label {
      background: #0081CC;
    }

    .dc-checkbox-input:checked + label:after {
      opacity: 1.0;
    }

    .dc-checkbox-text {
      cursor: pointer;
      padding: 0 5px;
      margin: 0 0 0 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1 1 auto;
    }

    .dc-checkbox-text:hover {
      background-color: #edf0f5;
      /*color: #fff;*/
    }
  `]
})
export class CheckboxComponent implements OnInit {
  checkboxId: string = Math.random().toString().slice(2);
  @Input() options: {
    key?: string,
    text?: string,
    disabled?: boolean,
    width?: string
  };
  _checkModel: {
    checked: boolean
  };
  @Input() set checkModel(v) {
    this._checkModel = v;
  }

  get checkModel() {
    return this._checkModel;
  }

  @ViewChild('labelInput') labelInput: ElementRef;

  @Output() checkboxChangeEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  checkModelChange(ev: any) {
    if (this.options && this.options.disabled) {
      return;
    }
    this.checkboxChangeEvent.emit(this.checkModel);
  }
}
