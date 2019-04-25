import {
  Component,
  OnChanges,
  OnInit,
  DoCheck,
  OnDestroy,
  SimpleChanges,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
  HostListener,
  ElementRef,
  Injector,
  ComponentRef,
  ReflectiveInjector,
  ApplicationRef,
  AfterViewInit,
  Input,
  Renderer2
} from '@angular/core';
import {Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RoutesRecognized} from '@angular/router';
import {ModalService} from '../modal/modal.service';

@Component({
  template: `
    <div class="show-qrcode-container">
      <img height="300" width="300" [src]="data.src" *ngIf="data.src">
      <qr-code [value]="data.data" [size]="300" *ngIf="data.data"></qr-code>
    </div>
  `,
  styles: [
      `
      .show-qrcode-container {
        margin: 20px;
      }
    `
  ]
})

export class ShowQrcodeComponent implements OnInit {
  data: any;

  constructor() {
    this.data = {};
  }

  ngOnInit() {
  }


}
