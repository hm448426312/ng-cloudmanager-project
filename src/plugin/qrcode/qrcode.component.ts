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
import {ShowQrcodeComponent} from './show.qrcode.component';

@Component({
  selector: 'dc-qrcode',
  template: `
    <div (click)="expandSize()" class="qrcode-container">
      <img *ngIf="showImg" [height]="size || 30" [width]="size || 30" [src]="showImg"/>
      <qr-code *ngIf="!showImg" [value]="data" [size]="size"></qr-code>
    </div>
  `,
  styles: [
      `
      .qrcode-container {
        cursor: pointer;
        display: inline-block;
      }
    `
  ]
})

export class QrcodeComponent implements OnInit {
  @Input() showImg: string;
  @Input() data: string;
  @Input() size: number;

  constructor(private el: ElementRef, private renderer: Renderer2, private modal: ModalService) {
  }

  ngOnInit() {

  }

  expandSize() {
    const data: any = {
      data: this.data
    };

    this.modal.open({
      title: '领取码',
      component: ShowQrcodeComponent,
      backdropCloseable: false,
      width: '340px',
      data: data
    });
  }

}
