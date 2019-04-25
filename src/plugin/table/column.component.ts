import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';

@Component({
  selector: 'dc-table-column',
  template: `
    <div *ngIf="show" class="table-font" [style.width]="width" [ngStyle]="setTdCenter(isTdCenter)"
         [title]="(!header.hideTitle && data && data[field]) || ''">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    '.table-font {' +
    'font-size: 12px;' +
    'line-height: 18px;' +
    'white-space: nowrap;' +
    'overflow: hidden;' +
    'text-overflow: ellipsis;}',
  ]
})
export class TableColumnComponent implements OnInit {
  @Input() header: any;
  @Input() data: any;
  @Input() width: any;
  @Input() field: string;
  @Input() isTdCenter: boolean;
  show: boolean;

  constructor() {
  }

  ngOnInit(): void {
    if (this.header.field == this.field) {
      this.show = true;
    }
  }

  setTdCenter(isCenter: boolean) {
    let center: any;
    if (isCenter) {
      center = {
        'display': 'flex',
        'justify-content': 'center'
      };
    }
    return center;
  }
}
