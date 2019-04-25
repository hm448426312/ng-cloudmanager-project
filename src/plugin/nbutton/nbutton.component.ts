import {Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'dc-nbutton',
  template: `
    <div class="dc-nbutton-container">
      <div class="{{class}}" [ngClass]="{'disable':disable,'icon':icon?true:false, 'dcNButton':type===1, 'cancelNButton':type===2}"
           [ngStyle]="{'background-image':icon?'url('+icon+')':'none'}">{{text || '确定'}}
      </div>
    </div>
  `,
  styles: [
    `
      .dc-nbutton-container {
        display: inline-table;
        width: auto;
        height: 26px;
      }

      .dcNButton {
        padding: 0 20px;
        display: table-cell;
         min-width: 94px;
        font-size: 14px;
        height: 26px;
        line-height: 26px;
        border:0px;
        border-radius:15px;
        cursor: pointer;
        vertical-align: top;
        text-align: center;
      }

      .dcNButton:hover {
        background: #edf0f5;
        box-shadow: 0px 2px 15px 1px rgba(0, 0, 0, .2);
      }

      .dcNButton:active {
        box-shadow: none
      }

      .cancelNButton {
        padding: 0 20px;
        color: #333;
        display: table-cell;
         min-width: 94px;
        font-size: 14px;
        height: 26px;
        line-height: 26px;
        border:0px;
        border-radius:15px;
        cursor: pointer;
        vertical-align: top;
        text-align: center;
      }

      .cancelNButton:hover {
        color: #edf0f5;
        box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, .2);
      }

      .cancelNButton:active {
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, .2) inset;
      }

      .dcNButton.disable, .cancelNButton.disable {
        cursor: default;
        color: #999;
        background: #e2e2e2;
        box-shadow: none
      }

      .dcNButton.icon, .cancelNButton.icon {
        background-repeat: no-repeat;
        background-size: 16px;
        background-position: 10px 4px;
        padding-left: 36px;
      }`
  ]
})
export class NButtonComponent implements OnInit {
  @Input() icon: string;
  @Input() class: string;
  @Input() text: string;
  @Input() disable: boolean;
  @Input() type: number;

  constructor() {
    this.type = this.type || 1;
  }

  ngOnInit() {
  }
}
