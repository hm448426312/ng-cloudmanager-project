import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  template: `
    <button (click)="selectFirst()">选中第一个</button>
    <div>
      <dc-search-select #selectDom (checkEvent)="checkEvent($event)" [required]="true" [multiple]="false" [currentValue]="currentValue"
                        [source]="source" [width]="'100%'" [maxHeight]="'200px'"></dc-search-select>
      <dc-search-select (checkEvent)="checkEvent($event)" [multiple]="true" [currentValue]="currentValue" [source]="source"
                        [width]="'300px'" [maxHeight]="'200px'"></dc-search-select>
      <dc-search-select (checkEvent)="checkEvent($event)" [multiple]="true" [currentValue]="currentValue" [source]="source"
                        [width]="'300px'" [noSearch]="true" [maxHeight]="'200px'"></dc-search-select>
    </div>
    <!--<div>
      <dc-search-select (checkEvent)="checkEvent($event)" [multiple]="false" [currentValue]="currentValue2" [source]="source1"
                        [width]="'300px'" [maxHeight]="'200px'"></dc-search-select>
    </div>-->
  `,
  selector: 'app-demo-button',
  styles: [`
  `]
})
export class DemoSearchSelectComponent implements OnInit {
  @ViewChild('selectDom') selectDom: any;

  constructor() {
  }

  currentValue = [
    {
      name: 'List1',
      id: '1'
    }
  ];
  currentValue2 = [
    {
      name: 'List1',
      id: '1'
    }
  ];
  source = [
    {
      name: 'List1',
      id: '1'
    }, {
      name: 'List2',
      id: '2'
    }, {
      name: 'List3List3List3List3List3List3List3List3List3List3List3List3List3List3List3List3List3List3List3List3List3',
      id: '3'
    }, {
      name: 'List4',
      id: '4'
    }, {
      name: 'List5',
      id: '5'
    }, {
      name: 'List6',
      id: '6'
    }, {
      name: 'List7',
      id: '7'
    }, {
      name: 'List8',
      id: '8'
    }, {
      name: 'List9',
      id: '9'
    }, {
      name: 'List10',
      id: '10'
    }, {
      name: 'List11',
      id: '11'
    }
  ];
  source1 = [
    {
      name: 'List1',
      id: '1'
    }, {
      name: 'List2',
      id: '2'
    }, {
      name: 'List3List3List3List3List3List3List3List3List3List3List3List3List3List3List3List3List3List3List3List3List3',
      id: '3'
    }, {
      name: 'List4',
      id: '4'
    }, {
      name: 'List5',
      id: '5'
    }, {
      name: 'List6',
      id: '6'
    }, {
      name: 'List7',
      id: '7'
    }, {
      name: 'List8',
      id: '8'
    }, {
      name: 'List9',
      id: '9'
    }, {
      name: 'List10',
      id: '10'
    }, {
      name: 'List11',
      id: '11'
    }
  ];

  ngOnInit() {
  }

  checkEvent(ev: any) {
    console.log('checkEvent', ev);
  }

  selectFirst() {
    this.selectDom.selectValue({
      name: 'List2',
      id: '2'
    });
  }
}
