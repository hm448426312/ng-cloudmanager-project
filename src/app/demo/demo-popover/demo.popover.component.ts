import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-demo-popover',
  template: `
    <div style="margin: 50px;border: 1px solid #ccc;">
      <div style="margin: 20px; border: 1px solid #ccc;" dcPopover [dcTitle]="'aaa1'" [showDir]="'left'">我是带提示1的</div>
      <div style="width: 200px;margin: 20px; border: 1px solid #ccc;" dcPopover [dcTitle]="'aaa2'">我是带提示2的</div>
      <input dcPopover [dcTitle]="'xxx'" />
    </div>
  `,
  styles: [`
  `]
})
export class DemoPopoverComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
