import {Component, OnInit, ViewChild, ElementRef, HostListener, OnDestroy} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Observable} from 'rxjs';

@Component({
  template: `
    <div style="width: 100%; display: flex;">
      <iframe class="iframeBox" *ngIf="iframeUrl" [src]="iframeUrl" #frame></iframe>
    </div>
  `,
  styles: [`
    .iframeBox {
      border: none;
      margin: 0;
      padding: 0;
      width: 100%;
      min-height: calc(100vh - 130px);
    }

  `]
})
export class DemoIframeComponent implements OnInit, OnDestroy {
  constructor(private sanitizer: DomSanitizer) {

  }

  resizeInterval;
  iframeUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('http://localhost:4203/testui/#/iframe');
  @ViewChild('frame') frame: ElementRef;

  ngOnInit() {
    this.bindEvent();
  }

  bindEvent() {
    if (!this.frame) {
      setTimeout(() => {
        this.bindEvent();
      }, 10);
      return;
    }
    Observable.fromEvent(this.frame.nativeElement, 'load').subscribe(event => {
      let height;
      try {
        this.resizeInterval = setInterval(() => {
          if (this.frame.nativeElement.contentDocument) {
            height = this.frame.nativeElement.contentDocument.getElementsByTagName('html')[0].offsetHeight;
            this.frame.nativeElement.style.height = Math.floor(height) + 'px';
          } else {
            clearInterval(this.resizeInterval);
            this.resizeInterval = null;
          }
        }, 100);
      } catch (err) {
        if (this.resizeInterval) {
          clearInterval(this.resizeInterval);
          this.resizeInterval = null;
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.resizeInterval) {
      clearInterval(this.resizeInterval);
      this.resizeInterval = null;
    }
  }
}
