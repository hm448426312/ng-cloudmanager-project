import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-demo-button',
  template: `
    <dc-button [text]="'清除内容'" (click)="setSearchText(searchComponent)"></dc-button>
    <dc-search #searchComponent [placeholder]="xxx" (search)="searchMe($event)"></dc-search>
  `,
  styles: [`
  `]
})
export class DemoSearchComponent implements OnInit {
  @ViewChild('searchComponent') searchComponent;

  constructor() {
  }

  ngOnInit() {
  }

  searchMe(ev) {
    console.log('search me ', ev);
  }

  setSearchText(obj) {
    obj.setSearchText(); // 清除方式1
    setTimeout(() => {
      this.searchComponent.setSearchText('default'); // 清除方式2
    }, 1000);
  }
}
