import { Component, OnInit, ViewChild, ElementRef, Input, Renderer, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'dc-wrap-ellipsis',
  template: `<div #wrapper class="wrapper" [ngStyle]="{'width':originData?.width,'height':originData?.height+'px','font-size':originData?.fontSize,'line-height':originData?.lineHeight}">
  <ng-content></ng-content>
</div>`,
  styles: [
    `.wrapper {
    word-wrap: break-word;
    white-space: normal;
    width: inherit;
    height: inherit;
    margin: 0;
    padding: 0;
    border: 0;
    overflow: hidden;
  }
  .wrap-ellipsis-div {
    position: fixed;
    left: -100%;
    bottom: -100%;
  }`],
  encapsulation: ViewEncapsulation.None
})

export class WrapEllipsisComponent implements OnInit {
  surplusContent: string; // 截取后剩余部分
  overContent: string; // 超出的部分
  hasOverSurplusContent = false; // 截取后剩余部分仍然超出可显示范围
  hasOverContent = false; // 当前内容大于可显示范围
  fontNum: number; // 单行文字数
  originData: any;
  container: any;
  style: any;
  _weContent: string;
  reg = new RegExp('[^\x00-\xff]');
  @ViewChild('wrapper') wrapper: ElementRef;
  @Input() weWidth: string;
  @Input() weHeight: string;
  @Input() weFontSize: string;
  @Input() weLineHeight: string;
  @Input() set weContent(text) {
    this._weContent = text;
    if (this.style) {
      this.originData = {
        content: this._weContent || this.container.innerText,
        width: this.weWidth || this.style['width'],
        height: this.getMaxHeight(),
        fontSize: this.weFontSize || this.style['fontSize'],
        lineHeight: this.weLineHeight || this.style['lineHeight']
      };
      this.fontNum = Math.ceil(parseFloat(this.originData.width) / parseFloat(this.originData.fontSize));
      this.setContent();
    }
  }
  get weContent() {
    return this._weContent;
  }

  constructor(private elm: ElementRef, private renderer: Renderer) { }

  ngOnInit() {
    this.container = this.wrapper.nativeElement;
    this.style = getComputedStyle(this.elm.nativeElement.parentNode);
    if (!this.originData) {
      this.originData = {
        content: this._weContent || this.container.innerText,
        width: this.weWidth || this.style['width'],
        height: this.getMaxHeight(),
        fontSize: this.weFontSize || this.style['fontSize'],
        lineHeight: this.weLineHeight || this.style['lineHeight']
      };
      this.fontNum = Math.ceil(parseFloat(this.originData.width) / parseFloat(this.originData.fontSize));
      this.setContent();
    }
  }

  setContent() {
    const tempDom = document.createElement('div');
    tempDom.style.width = this.originData.width;
    tempDom.style.fontSize = this.originData.fontSize;
    tempDom.style.lineHeight = this.originData.lineHeight;
    document.body.appendChild(tempDom);
    this.renderer.setElementClass(tempDom, 'wrap-ellipsis-div', true);
    this.getContent(tempDom);
  }

  getContent(dom: any) {
    dom.innerText = this.originData.content;
    const contentHeight = parseFloat(getComputedStyle(dom)['height']);
    if (contentHeight > this.originData.height) {
      const lineNum = (contentHeight - this.originData.height) / parseFloat(this.originData.lineHeight);
      const contentNum = this.originData.content.length - Math.ceil(this.fontNum * lineNum);
      if (!this.surplusContent) {
        this.surplusContent = this.originData.content.slice(0, contentNum);
      }
      if (!this.hasOverContent) {
        this.overContent = this.originData.content.slice(contentNum);
        this.hasOverContent = true;
      } else {
        if (lineNum >= 1 && this.overContent.length > this.fontNum) {
          this.overContent = this.overContent.slice(0, Math.ceil(this.overContent.length / 2));
        } else {
          this.overContent = this.overContent.slice(0, this.overContent.length - 1);
        }
      }
      this.originData.content = this.surplusContent + this.overContent;
      if (!this.hasOverSurplusContent) {
        this.getSurplusContent(dom);
      } else {
        this.getContent(dom);
      }
    } else {
      if (this.hasOverContent) {
        const pos = this.reg.test(this.originData.content.slice(-1)) ? -1 : -2;
        this.container.innerText = this.originData.content.slice(0, this.originData.content.length + pos) + '\u2026';
        document.body.removeChild(dom);
      } else {
        if (this._weContent) {
          this.container.innerText = this.originData.content;
        }
      }
    }
  }

  getSurplusContent(dom: any) {
    dom.innerText = this.surplusContent + '\u2026';
    const contentHeight = parseFloat(getComputedStyle(dom)['height']);
    if (contentHeight > this.originData.height) {
      this.hasOverSurplusContent = true;
      this.surplusContent = this.surplusContent.slice(0, this.surplusContent.length - 1);
      this.originData.content = this.surplusContent;
      this.getSurplusContent(dom);
    } else {
      if (this.hasOverSurplusContent) {
        const pos = this.reg.test(this.originData.content.slice(-1)) ? -1 : -2;
        this.container.innerText = this.originData.content.slice(0, this.originData.content.length + pos) + '\u2026';
        document.removeChild(dom);
      } else {
        this.hasOverSurplusContent = true;
        this.getContent(dom);
      }
    }
  }

  getMaxHeight() {
    const arrh = ['maxHeight', 'height'];
    const arrp = [];
    let hgh = 0;
    if (!this.weHeight) {
      let h: any;
      for (h of arrh) {
        const rh = getComputedStyle(this.container)[h];
        if (rh.indexOf('px') > 0) {
          hgh = parseFloat(rh);
          break;
        }
      }
    } else {
      hgh = parseFloat(this.weHeight);
    }

    switch (this.container.style.boxSizing) {
      case 'border-box':
        arrp.push('borderTopWidth');
        arrp.push('borderBottomWidth');
      // tslint:disable-next-line:no-switch-case-fall-through
      case 'padding-box':
        arrp.push('paddingTop');
        arrp.push('paddingBottom');
        break;
    }
    let p: any;
    for (p of arrp) {
      const rp = window.getComputedStyle(this.container)[p];
      if (rp.indexOf('px') > 0) {
        hgh -= parseFloat(rp);
        break;
      }
    }

    return Math.max(hgh, 0);
  }
}
