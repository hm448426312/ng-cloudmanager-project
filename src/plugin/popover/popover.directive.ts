import {Directive, ElementRef, HostListener, Input, Renderer} from '@angular/core';

@Directive({
  selector: '[dcPopover]',
})
export class PopoverDirective {
  @Input() dcPopover: string;
  @Input() dcTitle: string;
  @Input() showDir: string;

  titleBox: any;

  constructor(private el: ElementRef) {
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.showTitle();
    // console.log(this.el.nativeElement.getBoundingClientRect());
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.hideTitle();
  }

  showTitle() {
    if (!this.titleBox) {
      const ele = document.createElement('div');
      ele.className = 'dc-popover-tip';
      ele.style.position = 'absolute';


      this.titleBox = ele;
      this.titleBox.innerHTML = this.dcTitle;
      const rect = this.el.nativeElement.getBoundingClientRect();
      this.el.nativeElement.parentElement.appendChild(this.titleBox);
      //判断pop显示位置，默认为右边
      if(this.showDir){
        console.log("有设置");
      }else{
        console.log("没设置");
      }
      this.titleBox.style.left = rect.left + 'px';
      this.titleBox.style.top = rect.top - rect.height + 'px';
    }
    this.titleBox.innerHTML = this.dcTitle;
    this.titleBox.hidden = false;
  }

  hideTitle() {
    this.titleBox.hidden = true;
  }
}
