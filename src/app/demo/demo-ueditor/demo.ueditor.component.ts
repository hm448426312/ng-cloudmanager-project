import {Component, OnInit, ViewChild, ElementRef, AfterContentInit, AfterViewInit, HostListener, ChangeDetectorRef} from '@angular/core';
import {TipService} from '../../../plugin/tip/tip.service';
import {UEditorComponent} from 'ngx-ueditor';
import {Observable} from '../../../../node_modules/rxjs';
import * as _ from 'lodash';

@Component({
  template: `
    <div>
      <ueditor *ngIf="showUEditor" [(ngModel)]="full_source" [config]="uEditorConfig" #full></ueditor>
    </div>
    <button (click)="getText()">save</button>
    <button (click)="editUeditor()">Edit</button>
    <button (click)="cancelUeditor()">Cancel</button>
  `,
  styleUrls: []
})
export class DemoUeditorComponent implements OnInit, AfterViewInit {
  // ueditor的API，参考网址：http://fex.baidu.com/ueditor/#start-config
  showUEditor = false;
  uEditorReadonly = true;
  full_source: any = `你大爷`;
  toolbars: any = [[
    'undo', 'redo', '|',
    'bold',
    'italic',
    'underline',
    'fontborder',
    'strikethrough',
    'superscript',
    'subscript',
    'removeformat',
    'formatmatch',
    'autotypeset',
    'blockquote',
    'pasteplain',
    '|',
    'forecolor',
    'backcolor',
    'insertorderedlist',
    'insertunorderedlist',
    'selectall',
    'cleardoc',
    '|',
    'rowspacingtop',
    'rowspacingbottom',
    'lineheight',
    '|',
    'customstyle',
    'paragraph',
    'fontfamily',
    'fontsize',
    '|',
    'directionalityltr',
    'directionalityrtl',
    'indent',
    '|',
    'justifyleft',
    'justifycenter',
    'justifyright',
    'justifyjustify',
    '|',
    'touppercase',
    'tolowercase',
    '|',
    //'link',
    //'unlink',
    //'anchor',
    //'|',
    //'imagenone',
    //'imageleft',
    //'imageright',
    //'imagecenter',
    //'|',
    //'simpleupload',
    //'insertimage',
    //'emotion',
    //'scrawl',
    //'insertvideo',
    //'music',
    //'attachment',
    //'map',
    //'gmap',
    'insertframe',
    'insertcode',
    //'webapp',
    'pagebreak',
    //'template',
    //'background',
    '|',
    'horizontal',
    'date',
    'time',
    //'spechars',
    //'snapscreen',
    //'wordimage',
    '|',
    'inserttable',
    'deletetable',
    'insertparagraphbeforetable',
    'insertrow',
    'deleterow',
    'insertcol',
    'deletecol',
    'mergecells',
    'mergeright',
    'mergedown',
    'splittocells',
    'splittorows',
    'splittocols',
    //'charts',
    //'|',
    //'print',
    //'preview',
    //'searchreplace',
    //'drafts',
    //'help'
  ]];
  ueditClickEvent: any;
  uEditorConfig: any = { // 所有的配置项参考ueditor.all.js，内容注释的为默认值
    readonly: this.uEditorReadonly,
    toolbars: [],
    initialFrameHeight: 500,
    autoHeightEnabled: false,
    wordCount: false,
    insertorderedlist: {
      //自定的样式
      // 'num': '1,2,3...',
      // 'num1': '1),2),3)...',
      // 'num2': '(1),(2),(3)...',
      // 'cn': '一,二,三....',
      // 'cn1': '一),二),三)....',
      // 'cn2': '(一),(二),(三)....',
      //系统自带
      'decimal': '',         //'1,2,3...'
      'lower-alpha': '',    // 'a,b,c...'
      'lower-roman': '',    //'i,ii,iii...'
      'upper-alpha': '',    //'A,B,C'
      'upper-roman': ''      //'I,II,III...'
    }
  };
  @ViewChild('full') full: UEditorComponent;

  constructor(private tipService: TipService, private el: ElementRef,
              private change: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.showUEditor = true;
    // this.full.setDisabledState(false);
  }

  ngAfterViewInit() {
    this.setUeditorClickEvent();
  }

  setUeditorClickEvent() {
    let timeInterval = setInterval(() => {
      console.log('timeInterval');
      if (this.full) {
        clearInterval(timeInterval);
        timeInterval = null;
        const thisFull = this.full;
        /*setTimeout(() => {
          this.editUeditor();
        }, 2000);*/
        this.ueditClickEvent = Observable.fromEvent(thisFull.Instance.document, 'click').subscribe(event => {
          this.ueditClickEvent = null;
          console.log('click', this.uEditorReadonly);
          if (this.uEditorReadonly) {
            setTimeout(() => {
              this.editUeditor();
            }, 10);
          }
        });
      }
    }, 500);
  }

  getText() {
    window['ueditor'] = this.full;
    // ueditor.instance.getContent()
  }

  editUeditor() {
    if (!this.uEditorReadonly) {
      return;
    }
    console.log('editUeditor');
    this.showUEditor = false;
    this.uEditorReadonly = false;
    this.uEditorConfig.toolbars = _.cloneDeep(this.toolbars);
    this.uEditorConfig.readonly = this.uEditorReadonly;
    this.change.detectChanges();
    setTimeout(() => {
      this.showUEditor = true;
      this.change.detectChanges();
      let setEnabledUeditor = setInterval(() => {
        if (this.full) {
          clearInterval(setEnabledUeditor);
          setEnabledUeditor = null;
          this.change.detectChanges();
          this.setUeditorClickEvent();
        }
      }, 500);
    }, 100);
  }

  cancelUeditor() {
    if (this.uEditorReadonly) {
      return;
    }
    this.showUEditor = false;
    this.uEditorReadonly = true;
    this.uEditorConfig.toolbars = [];
    this.uEditorConfig.readonly = this.uEditorReadonly;
    setTimeout(() => {
      this.showUEditor = true;
      let setEnabledUeditor = setInterval(() => {
        if (this.full) {
          clearInterval(setEnabledUeditor);
          setEnabledUeditor = null;
          this.setUeditorClickEvent();
        }
      }, 500);
    }, 100);
  }

  /**
   * this.full.Instance.setEnabled(); // 设置为可用
   * this.full.Instance.setDisabled(); //设置为不可用
   */
}
