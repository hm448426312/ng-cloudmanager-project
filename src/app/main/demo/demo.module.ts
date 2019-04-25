import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonServiceModule} from '../../common/common.service.module';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {PluginModule} from '../../../plugin/plugin.module';
import {DemoComponent} from '../../demo/demo.component';
import {DemoTreeComponent} from '../../demo/demo-tree/demo.tree.component';
import {DemoButtonComponent} from '../../demo/demo-button/demo.button.component';
import {DemoModalComponent} from '../../demo/demo-modal/demo.modal.component';
import {DemoPaginationComponent} from '../../demo/demo-pagination/demo.pagination.component';
import {DemoSelectComponent} from '../../demo/demo-select/demo.select.component';
import {DemoTabComponent} from '../../demo/demo-tab/demo.tab.component';
import {DemoTableComponent} from '../../demo/demo-table/demo.table.component';
import {DemoHttpComponent} from '../../demo/demo-http/demo.http.component';
import {DemoModalDetailComponent} from '../../demo/demo-modal/demo.modal.detail.component';
import {DemoTabDetail1Component} from '../../demo/demo-tab/demo.tab.detail1.component';
import {DemoTabDetail2Component} from '../../demo/demo-tab/demo.tab.detail2.component';
import {DemoFileUploadComponent} from '../../demo/demo-file-upload/demo.file.upload.component';
import {DemoDrawerComponent} from '../../demo/demo-draw/demo.drawer.component';
import {DemoDrawerModule} from '../../demo/demo-draw/demo.drawer.module';
import {DemoDatePickerComponent} from '../../demo/demo-date-picker/demo.date.picker.component';
import {DemoTipComponent} from '../../demo/demo-tip/demo.tip.component';
import {DemoModalTipComponent} from '../../demo/demo-modal-tip/demo.modal.tip.component';
import {DemoTitleComponent} from '../../demo/demo-title/demo.title.component';
import {DemoNButtonComponent} from '../../demo/demo-nbutton/demo.nbutton.component';
import {DemoAutoCompleteComponent} from '../../demo/demo-auto-complete/demo.auto.complete.component';
import {DemoQrcodeComponent} from '../../demo/demo-qrcode/demo.qrcode.component';
import {DemoUeditorComponent} from '../../demo/demo-ueditor/demo.ueditor.component';
import {UEditorModule} from 'ngx-ueditor';
import {DemoIframeComponent} from '../../demo/demo-iframe/demo.iframe.component';
import {DemoWrapEllipsisComponent} from '../../demo/demo-wrap-ellipsis/demo.wrap-ellipsis.component';
import {DemoCheckboxComponent} from '../../demo/demo-checkbox/demo.checkbox.component';
import {DemoTagsInputComponent} from '../../demo/demo-tags-input/demo.tags.input.component';
import {DemoSearchComponent} from '../../demo/demo-search/demo.search.component';
import {DemoSearchSelectComponent} from '../../demo/demo-search-select/demo.search.select.component';
import {DemoTableNewComponent} from '../../demo/demo-table-new/demo.table.new.component';
import {DemoAsyncCompleteComponent} from '../../demo/demo-async-compelte/demo.async.complete.component';
import {DemoProgressBarComponent} from '../../demo/demo-progress-bar/demo.progress.bar.component';
import {DemoListShowComponent} from '../../demo/demo-list-show/demo.list.show.component';
import {DemoStepComponent} from '../../demo/demo-step/demo.step.component';
import {DemoRadioComponent} from '../../demo/demo-radio/demo.radio.component';
import {DemoAsyncCompleteApiComponent} from '../../demo/demo-async-compelte/demo.async.complete.api.component';
import {DemoAutoCompleteApiComponent} from '../../demo/demo-auto-complete/demo.auto.complete.api.component';
import {DemoButtonApiComponent} from '../../demo/demo-button/demo.button.api.component';
import {DemoPopoverComponent} from '../../demo/demo-popover/demo.popover.component';
import {DemoInputComponent} from '../../demo/demo-input/demo.input.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PluginModule,
    DemoDrawerModule,
    CommonServiceModule,
    UEditorModule.forRoot({
      // 指定ueditor.js路径目录
      path: '/testui/assets/ueditor/',
      // 默认全局配置项
      options: {
        themePath: '/testui/assets/ueditor/themes/'
      }
    }),
    RouterModule.forChild([
      {
        path: '',
        component: DemoComponent,
        children: [
          {
            path: 'asyncComplete',
            component: DemoAsyncCompleteComponent
          }, {
            path: 'button',
            component: DemoButtonComponent
          }, {
            path: 'searchSelect',
            component: DemoSearchSelectComponent
          }, {
            path: 'http',
            component: DemoHttpComponent
          }, {
            path: 'modal',
            component: DemoModalComponent
          }, {
            path: 'pagination',
            component: DemoPaginationComponent
          }, {
            path: 'select',
            component: DemoSelectComponent
          }, {
            path: 'listShow',
            component: DemoListShowComponent
          }, {
            path: 'step',
            component: DemoStepComponent
          }, {
            path: 'tab',
            component: DemoTabComponent
          }, {
            path: 'table',
            component: DemoTableComponent
          }, {
            path: 'tableNew',
            component: DemoTableNewComponent
          }, {
            path: 'tree',
            component: DemoTreeComponent
          },
          {
            path: 'fileupload',
            component: DemoFileUploadComponent
          },
          {
            path: 'input',
            component: DemoInputComponent
          },
          {
            path: 'progressBar',
            component: DemoProgressBarComponent
          },
          {
            path: 'drawer',
            component: DemoDrawerComponent
          },
          {
            path: 'popover',
            component: DemoPopoverComponent
          },
          {
            path: 'datepicker',
            component: DemoDatePickerComponent,
          },
          {
            path: 'tip',
            component: DemoTipComponent,
          },
          {
            path: 'modalTip',
            component: DemoModalTipComponent,
          },
          {
            path: 'title',
            component: DemoTitleComponent,
          },
          {
            path: 'nbutton',
            component: DemoNButtonComponent,
          },
          {
            path: 'autocomplete',
            component: DemoAutoCompleteComponent,
          },
          {
            path: 'qrcode',
            component: DemoQrcodeComponent,
          },
          {
            path: 'ueditor',
            component: DemoUeditorComponent,
          },
          {
            path: 'iframe',
            component: DemoIframeComponent,
          },
          {
            path: 'wrapEllipsis',
            component: DemoWrapEllipsisComponent
          }, {
            path: 'checkbox',
            component: DemoCheckboxComponent
          }, {
            path: 'tags-input',
            component: DemoTagsInputComponent
          }, {
            path: 'search',
            component: DemoSearchComponent
          }, {
            path: 'radio',
            component: DemoRadioComponent
          }, {
            path: '',
            redirectTo: 'asyncComplete'
          }, {
            path: '**',
            redirectTo: 'asyncComplete'
          }
        ]
      },
    ])
  ],
  providers: [],
  declarations: [
    DemoAsyncCompleteComponent,
    DemoTableNewComponent,
    DemoSearchSelectComponent,
    DemoSearchComponent,
    DemoComponent,
    DemoButtonComponent,
    DemoModalComponent,
    DemoPaginationComponent,
    DemoSelectComponent,
    DemoTabComponent,
    DemoTableComponent,
    DemoTreeComponent,
    DemoHttpComponent,
    DemoModalDetailComponent,
    DemoTabDetail1Component,
    DemoTabDetail2Component,
    DemoFileUploadComponent,
    DemoDrawerComponent,
    DemoDatePickerComponent,
    DemoTipComponent,
    DemoModalTipComponent,
    DemoTitleComponent,
    DemoNButtonComponent,
    DemoAutoCompleteComponent,
    DemoQrcodeComponent,
    DemoUeditorComponent,
    DemoIframeComponent,
    DemoWrapEllipsisComponent,
    DemoCheckboxComponent,
    DemoTagsInputComponent,
    DemoProgressBarComponent,
    DemoListShowComponent,
    DemoStepComponent,
    DemoRadioComponent,
    DemoAsyncCompleteApiComponent,
    DemoAutoCompleteApiComponent,
    DemoButtonApiComponent,
    DemoPopoverComponent,
    DemoInputComponent,
  ],
  exports: [
    DemoComponent,
  ],
  entryComponents: [
    DemoModalDetailComponent,
    DemoTabDetail1Component,
    DemoTabDetail2Component,
  ]
})
export class DemoModule {
}
