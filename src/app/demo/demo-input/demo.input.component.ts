import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-demo-input',
  template: `
    <div>原始值: {{inputValue}}</div>
    <div>
      <button (click)="setValue('xxx')">设值xxx</button>
    </div>
    <div style="width: 400px; margin: 0 auto;">
      <dc-input #dcPopoverInput (dcModelChange)="modelChange($event)" [dcPlaceholder]="'请输入'" [noClear]="true"
                (dcBlur)="setValid(dcPopoverInput, inputValue)" (dcKeyup)="keyup($event)" (dcClick)="clickEvent($event)"
                [(ngModel)]="inputValue" [width]="'200px'" [maxLength]="5"></dc-input>
    </div>
    <div>原始值: {{inputValue1}}</div>
    <dc-input [(ngModel)]="inputValue1" [readonly]="true"></dc-input>
    <dc-input [(ngModel)]="inputValue" [disabled]="true"></dc-input>
    <div style="width: 500px; margin: 0 auto;">
      <dc-input #dcTextarea [(ngModel)]="inputValue3" [dcPlaceholder]="'请输入'" (dcBlur)="setValid(dcTextarea, inputValue3)"
                (dcKeyup)="keyup($event)" (dcClick)="clickEvent($event)" [type]="'textarea'" [height]="'100px'"></dc-input>
    </div>
  `,
  styles: [`
  `]
})
export class DemoInputComponent implements OnInit {
  inputValue = 'xxx';
  inputValue1 = 'xxx2';
  inputValue3 = 'xxx3';

  @ViewChild('dcPopoverInput') dcPopoverInput;

  constructor() {
  }

  ngOnInit() {
  }

  // blur时校验并给输入框赋值样式（是否校验通过）
  setValid(dom: any, val: any) {
    if (val) {
      dom.setInputValid(true);
    } else {
      dom.setInputValid(false);
    }
  }

  setValue(val: string) {
    this.inputValue = val;
  }

  modelChange(ev) {
    console.log(ev);
  }

  keyup(ev) {
    console.log('keyup', ev);
  }

  clickEvent(ev) {
    console.log('click', ev);
  }
}
