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
  AfterViewInit
} from '@angular/core';
import {Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RoutesRecognized} from '@angular/router';

export interface CanDraw {
  beforeLeave(): boolean | Promise<boolean>;

  beforeClose(): void;
}

@Component({
  selector: 'dc-tip',
  template: `
    <div class="tip-container" [style.top]="tipTop" [ngClass]="{'show':show}">
      <div class="message" [ngClass]="{'success':data.type=='success','error':data.type=='error','ask':data.type=='ask'}">
        <span>{{message}}</span>
      </div>
    </div>
  `,
  styles: [
      `
      .tip-container {
        top: 60px;
        left: 50%;
        z-index: 10001;
        position: fixed;
        display: flex;
        flex-direction: column;
        opacity: 0;
        transition: opacity 0.3s ease-in;
      }

      .message {
        width: 200px;
        min-height: 30px;
        padding: 10px 20px 10px 30px;
        font-size: 12px;
        font-weight: 400;
        border-radius: 3px;
        overflow: hidden;
      }

      .message.success {
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpGNUE4ODU3QTQzQjQxMUU4OTYwMENCNUE1RDZGQkEzQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpGNUE4ODU3QjQzQjQxMUU4OTYwMENCNUE1RDZGQkEzQyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkY1QTg4NTc4NDNCNDExRTg5NjAwQ0I1QTVENkZCQTNDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkY1QTg4NTc5NDNCNDExRTg5NjAwQ0I1QTVENkZCQTNDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+uUv0SgAAAXlJREFUeNpitD2zjAELcALicCgtBxV7BMT7gHgVEO9F18CCxtcA4ulA7IDFcBUoTgPiA0CcCcQ3YJJMSArtgfgUDkPQgQNUrT26QSCXbARiXgbiAS9UjwbMIEYgng/E/AykA36oXkaQQc5AbMFAPgDpdQYZFEasDgEWdoY+VUcGZU4BdKkwJmgUE2eImhODCZ8EQ46sEUZyARkkS6whKkCX3P3+gaHx3lF0JbIgg34ii8hz8DFMBGoSZOXAakjhrX0MH/78xLAMZNAzZIEiOVMGQ15xsGEKnPxEGQIET5igCQsOGu4fZXj44xODAgc/w0wNN2IMAYGjIIOWIou8//2DIe/WXrBhnEwsDJ///iJkCAgsARm0C4hPYDPs/OdXDNk39hAyBKR3NyM092tABUhN3R+B2BKIr8PyGigX+wPxZxIM+QzVcx099x8EYjN0b+LxjhlUD9byCOQyKyB2BeIQaD4EJdhfQPwYiA8D8RpQmADxf2SNAAEGANzZdwCj8spJAAAAAElFTkSuQmCC") #ffffff no-repeat 10px center;
        box-shadow: 0px 2px 15px 1px rgba(0, 0, 0, .2);
      }

      .message.error {
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5N0QwRkIyNDQzQjQxMUU4QkNCMkU3MkVBNzE3QjVGRCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5N0QwRkIyNTQzQjQxMUU4QkNCMkU3MkVBNzE3QjVGRCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjk3RDBGQjIyNDNCNDExRThCQ0IyRTcyRUE3MTdCNUZEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjk3RDBGQjIzNDNCNDExRThCQ0IyRTcyRUE3MTdCNUZEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+dUtj7gAAAQdJREFUeNqsk70OAUEUhWc2otvsE9DaJxA0hKg1QkFC64mUFKsRjZYQIhLxAqtG9KKi4Vy5kzDxM+ye5Msmd+85mb8rz42aeKE8qPI3zrUtmII+mOgGqQW5oA1y4rNmoAU2qmA9/MyCtUGI4J41e56CaCVDYAtz2exxVZAEHeC86o52vTtv5LBXUlABpMT/Im+BgioiuCoWX3FQ5SkoFkJQjILOIQTdb+0QQs4+wg8r8a7j0qybBC1pRb1PHV/ekZJHQSOwCrAt8o7V0LpccH4MOYI08NWs0RSXwOmHkBN7fH365yBpuM0V985VIaI10MoyoAjKPIf0YC9gBxZgQGcCro/GmwADAIlXNcK99vArAAAAAElFTkSuQmCC") #ffffff no-repeat 10px center;
        box-shadow: 0px 2px 15px 1px rgba(0, 0, 0, .2);
      }

      .message.ask {
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCNDk5NDQ0ODQzQjQxMUU4QTgwQkNFRjdBQjhBNkFBRCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCNDk5NDQ0OTQzQjQxMUU4QTgwQkNFRjdBQjhBNkFBRCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkI0OTk0NDQ2NDNCNDExRThBODBCQ0VGN0FCOEE2QUFEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkI0OTk0NDQ3NDNCNDExRThBODBCQ0VGN0FCOEE2QUFEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+uLzafQAAAVhJREFUeNpijFr1iwELcALicCgtBxV7BMT7gHgVEO9F18CCxtcA4ulA7IDFcBUoTgPiA0CcCcQ3YJJMSArtgfgUDkPQgQNUrT26QSCXbARiXgbiAS9UjwbMIEYgng/E/NhU1zuxMDQ6seAyjB+qlxFkkDMQWzCQD0B6nUFWheFT1bjvDzGGhTFBoxgr4ABaI83HyKAuwkjIILDnZbHJeKgyMXipMTEIczEyfPvNwJC64Tc+g2RBLvqJTWbH7X8MeVv/EB1QIIOeMVAOnjBBExZewMFC0KCjIIOWEnQ2wbBmWAKyaxcQn0BPS6CAtlNgYvgKzdM9HiwMTz/9Z5h5+i848JEASO9uRmju14AK8JMYNh+B2BKIr8PyGigX+wPxZxIM+QzVcx099x8EYjOoywiBE1C1B3GVRyCXWQGxKxCHQPMhKMGC/P8YiA8D8RpQmADxf2SNAAEGAIBcR0Zs4wkwAAAAAElFTkSuQmCC") #ffffff no-repeat 10px center;
        box-shadow: 0px 2px 15px 1px rgba(0, 0, 0, .2);
      }

      .message {
      }

      .show {
        opacity: 1;
      }
    `
  ]
})

export class TipComponent implements OnChanges, OnInit, DoCheck, AfterViewInit, OnDestroy {
  show: boolean;
  tipTop: string;
  message: string;
  title: string;
  data: any;
  type: string;
  closeResolve: any;

  constructor(private router: Router, private resolver: ComponentFactoryResolver,
              private elementRef: ElementRef, private injector: Injector, private applicationRef: ApplicationRef) {
  }

  ngOnInit() {
    // if (this.data.type === 'success') {
    //   this.title = '提示';
    // }
    // if (this.data.type === 'error') {
    //   this.title = '错误';
    // }
    let scrollTop = 60;
    if (window !== window.parent) {
      try {
        if (window.parent.scrollY) {
          scrollTop = scrollTop + window.parent.scrollY;
        } else if (window.parent.pageYOffset) {
          scrollTop = scrollTop + window.parent.pageYOffset;
        }
      } catch (e) {
      }
    }

    this.tipTop = scrollTop + 'px';
    this.message = this.data.title;
    this.show = false;

    setTimeout(() => {
      this.show = false;
    }, 3000);
  }

  ngOnDestroy(): void {
  }

  ngDoCheck(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.show = true;
    });
  }

  private closeComponent() {
    this.show = false;
    setTimeout(() => {
      this.closeResolve('close');
    }, 300);
  }

  ngOnChanges(changes: SimpleChanges): void {

  }
}
