import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-demo-progress-bar',
  template: `
    <div style="width: 500px; height: 100px; border: 1px solid #ccc; display: flex; flex-direction: row; align-items: center;">
      <div style="flex: 1">
        <dc-progress-bar [width]="'100%'" [option]="progressOption" [progress]="progress"></dc-progress-bar>
      </div>
    </div>
    <div style="width: 500px;">
      <dc-progress-bar [progress]="progress"></dc-progress-bar>
    </div>
  `,
  styles: [`
  `]
})
export class DemoProgressBarComponent implements OnInit {

  timer: any;
  progress = 0;
  progressOption = {
    showText: true
  };

  constructor() {
  }

  ngOnInit() {
    this.timer = setInterval(() => {
      if (this.progress === 100) {
        clearInterval(this.timer);
        this.timer = null;
      } else {
        this.progress += 10;
      }
    }, 1000);
  }
}
