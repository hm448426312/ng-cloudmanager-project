import {Component, ComponentRef, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-demo-tags-input',
  template: `
    <button (click)="getCheckedTags()">获取选中的标签</button>
    <dc-tags-input #dcTagsInput [options]="options" [tagDatas]="tagDatas"></dc-tags-input>
  `,
  styles: [`
  `]
})
export class DemoTagsInputComponent implements OnInit {
  options: any = {
    nameKey: 'name',
    checkKey: 'checked',
    width: '300px'
  };
  tagDatas: any = [
    {
      name: 'tag1',
      checked: false,
    }, {
      name: 'tag2',
      checked: true
    }, {
      name: 'xxx',
      checked: false
    }, {
      name: 'aaa',
      checked: false
    }, {
      name: 'aab',
      checked: false
    }
  ];
  @ViewChild('dcTagsInput') dcTagsInput;

  constructor() {
  }

  ngOnInit() {

  }

  getCheckedTags() {
    console.log('checked tags', this.dcTagsInput.getCheckedTags());
  }

}
