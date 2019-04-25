import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';

@Component({
  selector: 'dc-table-column-new',
  template: `
    <div *ngIf="show" class="table-font"  [title]="(!header.hideTitle && data && data[field]) || ''">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .table-font {
      font-size: 14px;
      line-height: 50px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `]
})
export class ColumnNewComponent implements OnInit {
  @Input() header: any;
  @Input() data: any;
  @Input() width: any;
  @Input() field: string;
  show: boolean;

  constructor() {
  }

  ngOnInit(): void {
    if (this.header.field == this.field) {
      this.show = true;
    }
  }
}
