import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { ModalService } from '../../../..';
@Component({
  moduleId: module.id,
  template: `
    <div>
      <dc-qrcode [data]="'this is a code for tes1t'" [showImg]="showImg" [size]="50"></dc-qrcode>
      <dc-qrcode [data]="'this is a code for test'" [size]="50"></dc-qrcode>
    </div>
  `,
  styles: [
    `

    
    `
  ]
})
export class DemoQrcodeComponent implements OnInit {
  showImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAYklEQVQokdWQUQrAIAxDU9m/O6XHn97A/awQ2w4s+1qgIA3h1UhrDaQB4ESsxSsA5jOsSTNoX3VfTOCN5rzDUCLVyLPEbSlRkjn3Ry6DS3MFfj5VJRvvkPijU1PEDuBK5voNJIwdJa4Jkp0AAAAASUVORK5CYII=';
  constructor() {
  }



  ngOnInit() {

  }


}
