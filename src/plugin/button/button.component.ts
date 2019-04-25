import {Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'dc-button',
  template: `
    <div class="dc-button-container">
      <div class="{{class}}" [ngClass]="{'disable':disable,'icon':icon?true:false, 'dcButton':type===1, 'cancelButton':type===2}"
           [ngStyle]="{'background-image':icon?'url('+icon+')':'none'}">{{text || '确定'}}
      </div>
    </div>
  `,
  styles: [
      `
      .dc-button-container {
        display: inline-table;
        width: auto;
        height: 26px;
      }

      .dcButton {
        padding: 0 20px;
        color: #fff;
        display: table-cell;
        min-width: 94px;
        font-size: 14px;
        height: 26px;
        line-height: 26px;
        background: #0081cc;
        border-radius: 15px;
        /*box-shadow: 0px 0px 4px 0.1px rgba(0, 0, 0, .2);*/
        cursor: pointer;
        vertical-align: top;
        text-align: center;
      }

      .dcButton:hover {
        background: #0067a3;
        /*box-shadow: 0px 0px 4px 0.8px rgba(0, 0, 0, .2);*/
      }

      .dcButton:active {
        box-shadow: none
      }

      .cancelButton {
        padding: 0 20px;
        color: #333;
        display: table-cell;
        min-width: 94px;
        font-size: 14px;
        height: 26px;
        line-height: 24px;
        background: #fff;
        border-radius: 15px;
        box-shadow: 0px 0px 4px 0.1px rgba(0, 0, 0, .2);
        cursor: pointer;
        vertical-align: top;
        text-align: center;
      }

      .cancelButton:hover {
        color: #0067a3;
        box-shadow: 0px 0px 4px 0.8px rgba(0, 0, 0, .2);
      }

      .cancelButton:active {
        color: #0067a3;
        box-shadow: 0px 0px 4px 0.8px rgba(0, 0, 0, .2);
      }

      .dcButton.disable, .cancelButton.disable {
        cursor: not-allowed;
        color: #999;
        background: #e2e2e2;
        box-shadow: none
      }

      .dcButton.icon, .cancelButton.icon {
        background-repeat: no-repeat;
        background-size: 16px;
        background-position: 10px 4px;
        padding-left: 36px;
      }`
  ]
})
export class ButtonComponent implements OnInit {
  @Input() icon: string;
  @Input() class: string;
  @Input() text: string;
  @Input() disable: boolean;
  @Input() type: number;
  @Input() hideTitle: boolean; // 根据业务需求，所有按钮不需要title，该配置无用，考虑到已用的，不移除

  constructor() {
    this.type = this.type || 1;
  }

  ngOnInit() {
  }
}
