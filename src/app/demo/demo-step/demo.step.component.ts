import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-demo-step',
  template: `
    <!--<div style="width: 600px;">
      <dc-step [showKey]="showKey" [idKey]="idKey" [stepData]="stepData" [currentData]="defaultData"></dc-step>
    </div>-->
    <div style="width: 50%; margin-top: 20px; margin-bottom: 20px;">
      <dc-step [showKey]="showKey" [idKey]="idKey" [stepData]="stepData" [currentData]="defaultData" [newStep]="true"></dc-step>
    </div>
  `,
  styles: [`
  `]
})
export class DemoStepComponent implements OnInit {
  showKey = 'name'; // 每步显示的文本对应数据中的key值，默认为name
  idKey = 'id'; // 数据中进行比对的key值，默认为id
  stepData = [ // 步数据，id对应idKey，name对应showKey
    {
      id: 1,
      name: '第一步第一步第一步',
    }, {
      id: 2,
      name: '第二步第二步第二步',
    }, {
      id: 3,
      name: '第三步第三步第三步第三步',
    }, {
      id: 4,
      name: '第四步第四步第四步',
    }, {
      id: 5,
      name: '第五步第五步第五步',
    }, {
      id: 6,
      name: '第六步第六步第六步',
    }, {
      id: 7,
      name: '第7步第7步',
    }, {
      id: 8,
      name: '第7步第7步',
    }, {
      id: 9,
      name: '第7步第7步',
    }, {
      id: 10,
      name: '第7步第7步',
    }, {
      id: 11,
      name: '第7步第7步',
    }, {
      id: 12,
      name: '第7步第7步',
    }
  ];
  /*
    默认所在步的数据，根据idKey的值进行匹配
    1/不传：全部完成
    2/在stepData中根据idKey(id)找不到defaultData的数据：全部完成
    3/与stepData中的数据i匹配，i之前的为完成，i为进行中，i之后的为未启动
  */
  defaultData = {
    id: 2,
    name: ''
  };

  constructor() {
  }

  ngOnInit() {
  }
}
