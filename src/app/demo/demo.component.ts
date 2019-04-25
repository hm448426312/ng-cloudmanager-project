import {
  Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, OnDestroy, OnInit, Type, ViewChild, ViewContainerRef
} from '@angular/core';
import {Router} from '@angular/router';
import {DemoButtonComponent} from './demo-button/demo.button.component';
import {DemoCheckboxComponent} from './demo-checkbox/demo.checkbox.component';
import {DemoSearchComponent} from './demo-search/demo.search.component';
import {DemoSearchSelectComponent} from './demo-search-select/demo.search.select.component';
import {DemoTagsInputComponent} from './demo-tags-input/demo.tags.input.component';
import {DemoNButtonComponent} from './demo-nbutton/demo.nbutton.component';
import {DemoHttpComponent} from './demo-http/demo.http.component';
import {DemoModalComponent} from './demo-modal/demo.modal.component';
import {DemoModalTipComponent} from './demo-modal-tip/demo.modal.tip.component';
import {DemoSelectComponent} from './demo-select/demo.select.component';
import {DemoListShowComponent} from './demo-list-show/demo.list.show.component';
import {DemoStepComponent} from './demo-step/demo.step.component';
import {DemoPaginationComponent} from './demo-pagination/demo.pagination.component';
import {DemoTabComponent} from './demo-tab/demo.tab.component';
import {DemoTableComponent} from './demo-table/demo.table.component';
import {DemoTableNewComponent} from './demo-table-new/demo.table.new.component';
import {DemoTreeComponent} from './demo-tree/demo.tree.component';
import {DemoFileUploadComponent} from './demo-file-upload/demo.file.upload.component';
import {DemoProgressBarComponent} from './demo-progress-bar/demo.progress.bar.component';
import {DemoDrawerComponent} from './demo-draw/demo.drawer.component';
import {DemoDatePickerComponent} from './demo-date-picker/demo.date.picker.component';
import {DemoTipComponent} from './demo-tip/demo.tip.component';
import {DemoTitleComponent} from './demo-title/demo.title.component';
import {DemoAutoCompleteComponent} from './demo-auto-complete/demo.auto.complete.component';
import {DemoAsyncCompleteComponent} from './demo-async-compelte/demo.async.complete.component';
import {DemoQrcodeComponent} from './demo-qrcode/demo.qrcode.component';
import {DemoUeditorComponent} from './demo-ueditor/demo.ueditor.component';
import {DemoIframeComponent} from './demo-iframe/demo.iframe.component';
import {DemoWrapEllipsisComponent} from './demo-wrap-ellipsis/demo.wrap-ellipsis.component';
import {DemoRadioComponent} from './demo-radio/demo.radio.component';
import {DemoPopoverComponent} from './demo-popover/demo.popover.component';
import {DemoInputComponent} from './demo-input/demo.input.component';

@Component({
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit, OnDestroy {
  constructor(private router: Router,
              private resolver: ComponentFactoryResolver) {

  }

  @ViewChild('demoContainer', {read: ViewContainerRef}) container: ViewContainerRef;
  currentComponent: ComponentType | null = null;
  components: Array<ComponentType> = [
    {
      name: 'AsyncComplete',
      route: '/home/demo/asyncComplete',
      component: DemoAsyncCompleteComponent
    }, {
      name: 'AutoComplete',
      route: '/home/demo/autocomplete',
      component: DemoAutoCompleteComponent
    }, {
      name: 'Button',
      route: '/home/demo/button',
      component: DemoButtonComponent
    }, {
      name: 'CheckBox',
      route: '/home/demo/checkbox',
      component: DemoCheckboxComponent
    }, {
      name: 'Datepicker',
      route: '/home/demo/datepicker',
      component: DemoDatePickerComponent
    }, {
      name: 'Drawer',
      route: '/home/demo/drawer',
      component: DemoDrawerComponent
    }, {
      name: 'FileUpload',
      route: '/home/demo/fileupload',
      component: DemoFileUploadComponent
    }, {
      name: 'Http',
      route: '/home/demo/http',
      component: DemoHttpComponent
    }, {
      name: 'Iframe',
      route: '/home/demo/iframe',
      component: DemoIframeComponent
    }, {
      name: 'Input',
      route: '/home/demo/input',
      component: DemoInputComponent
    }, {
      name: 'ListShow',
      route: '/home/demo/listShow',
      component: DemoListShowComponent
    }, {
      name: 'Modal',
      route: '/home/demo/modal',
      component: DemoModalComponent
    }, {
      name: 'ModalTip',
      route: '/home/demo/modalTip',
      component: DemoModalTipComponent
    }, {
      name: 'NButton',
      route: '/home/demo/nbutton',
      component: DemoNButtonComponent
    }, {
      name: 'Pagination',
      route: '/home/demo/pagination',
      component: DemoPaginationComponent
    }, {
      name: 'Popover',
      route: '/home/demo/popover',
      component: DemoPopoverComponent
    }, {
      name: 'ProgressBar',
      route: '/home/demo/progressBar',
      component: DemoProgressBarComponent
    }, {
      name: 'Qrcode',
      route: '/home/demo/qrcode',
      component: DemoQrcodeComponent
    }, {
      name: 'Radio',
      route: '/home/demo/radio',
      component: DemoRadioComponent
    }, {
      name: 'Search',
      route: '/home/demo/search',
      component: DemoSearchComponent
    }, {
      name: 'SearchSelect',
      route: '/home/demo/searchSelect',
      component: DemoSearchSelectComponent
    }, {
      name: 'Select',
      route: '/home/demo/select',
      component: DemoSelectComponent
    }, {
      name: 'Step',
      route: '/home/demo/step',
      component: DemoStepComponent
    }, {
      name: 'Tab',
      route: '/home/demo/tab',
      component: DemoTabComponent
    }, {
      name: 'Table',
      route: '/home/demo/table',
      component: DemoTableComponent
    }, {
      name: 'TableNew',
      route: '/home/demo/tableNew',
      component: DemoTableNewComponent
    }, {
      name: 'TagsInput',
      route: '/home/demo/tags-input',
      component: DemoTagsInputComponent
    }, {
      name: 'Tip',
      route: '/home/demo/tip',
      component: DemoTipComponent
    }, {
      name: 'Title',
      route: '/home/demo/title',
      component: DemoTitleComponent
    }, {
      name: 'Tree',
      route: '/home/demo/tree',
      component: DemoTreeComponent
    }, {
      name: 'Ueditor',
      route: '/home/demo/ueditor',
      component: DemoUeditorComponent
    }, {
      name: 'WrapEllipsis',
      route: '/home/demo/wrapEllipsis',
      component: DemoWrapEllipsisComponent
    }
  ];
  componentRef: any;

  ngOnInit() {
    this.initCurrentComponent();
  }

  ngOnDestroy() {
    // this.componentRef.destroy();
  }

  initCurrentComponent(component?: ComponentType) {
    let route = this.router.url;
    if (component) {
      route = component.route;
    }
    for (let i = 0; i < this.components.length; i++) {
      if (this.components[i].route === route) {
        this.currentComponent = this.components[i];
        break;
      }
    }
    if (!this.currentComponent) {
      this.currentComponent = this.components[0];
      this.router.navigateByUrl(this.components[0].route);
    }
    this.initCurrentComponentDetail();
  }

  initCurrentComponentDetail() {
    if (!this.currentComponent) {
      return;
    }
    this.container.clear(); // 重置
    const factory = this.resolver.resolveComponentFactory(this.currentComponent.component);
    this.componentRef = this.container.createComponent(factory);
    // this.componentRef.instance.type = type; // 插入组件需要的input数据
    // this.componentRef.instance.output.subscribe((msg: string) => console.log(msg)); // 订阅组件的输出事件
  }
}

export interface ComponentType {
  name: string;
  route: string;
  component: Type<any>;
}
