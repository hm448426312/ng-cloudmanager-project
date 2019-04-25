import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeftMenuComponent } from './leftmenu/leftmenu.component';
import { DrawService } from './draw/draw.service';
import { DrawComponent } from './draw/draw.component';
import { PaginationComponent } from './pagination/pagination.component';
import { HeaderComponent } from './header/header.component';
import { HttpService } from './http/http.service';
import { HttpModule } from '@angular/http';
import { TabComponent } from './tab/tab.component';
import { TabContentDirective } from './tab/tab.directive';
import { AutoCompleteComponent } from './auto-component/auto.component.component';
import { PinyinService } from './pinyin.service';
import { SelectComponent } from './select/select.component';
import { ButtonComponent } from './button/button.component';
import { TreeComponent } from './tree/tree.component';
import { NodeComponent } from './tree/node.component';
import { DatePickerComponent } from './date-picker/date.picker.component';
import { TableComponent } from './table/table.component';
import { TableColumnComponent } from './table/column.component';
import { ModalTipComponent } from './modal-tip/modal.tip.component';
import { DocumentRef } from './document-ref/document-ref.service';
import { ModalService } from './modal/modal.service';
import { ModalComponent } from './modal/modal.component';
import { ModalContainerDirective } from './modal/modal.directive';
import { FileUploadModule } from 'ng2-file-upload';
import { FileUploadComponent } from './file-upload/file.upload.component';
import { TipService } from './tip/tip.service';
import { TipComponent } from './tip/tip.component';
import { ModalTipService } from './modal-tip/modal.tip.service';
import { TitleComponent } from './title/title.component';
import { NButtonComponent } from './nbutton/nbutton.component';
import { QRCodeModule } from 'angular2-qrcode';
import { QrcodeComponent } from './qrcode/qrcode.component';
import { ShowQrcodeComponent } from './qrcode/show.qrcode.component';
import { WrapEllipsisComponent } from './wrap-ellipsis/wrap-ellipsis.component';
import {FilterSearchPipe} from './pipe-filter/filter.search.pipe';
import {CheckboxComponent} from './checkbox/checkbox.component';
import {TagsInputComponent} from './tags-input/tags.input.component';
import {SearchComponent} from './search/search.component';
import {SearchSelectComponent} from './search-select/search.select.component';
import {TableNewComponent} from './table-new/table.new.component';
import {ColumnNewComponent} from './table-new/column.new.component';
import {NgDatepickerComponent} from './datepicker/ng-datepicker.component';
import {AsyncComponentComponent} from './async-component/async.component.component';
import {ProgressBarComponent} from './progress-bar/progress-bar.component';
import {ListShowComponent} from './list-show/list.show.component';
import {StepComponent} from './step/step.component';
import {RadioComponent} from './radio/radio.component';
import {PopoverDirective} from './popover/popover.directive';
import {InputComponent} from './input/input.component';
import {NgDatepickerNewComponent} from './datepicker/ng-datepicker-new.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpModule,
    FileUploadModule,
    QRCodeModule
  ],
  declarations: [
    AsyncComponentComponent,
    NgDatepickerComponent,
    NgDatepickerNewComponent,
    ColumnNewComponent,
    TableNewComponent,
    SearchSelectComponent,
    SearchComponent,
    LeftMenuComponent,
    DrawComponent,
    PaginationComponent,
    HeaderComponent,
    TabComponent,
    AutoCompleteComponent,
    TabComponent,
    TabContentDirective,
    SelectComponent,
    ButtonComponent,
    TreeComponent,
    DatePickerComponent,
    NodeComponent,
    TableComponent,
    TableColumnComponent,
    ModalTipComponent,
    ModalComponent,
    ModalContainerDirective,
    FileUploadComponent,
    TipComponent,
    TitleComponent,
    NButtonComponent,
    QrcodeComponent,
    ShowQrcodeComponent,
    WrapEllipsisComponent,
    FilterSearchPipe,
    CheckboxComponent,
    TagsInputComponent,
    ProgressBarComponent,
    ListShowComponent,
    StepComponent,
    RadioComponent,
    PopoverDirective,
    InputComponent,
  ],
  exports: [
    AsyncComponentComponent,
    NgDatepickerComponent,
    NgDatepickerNewComponent,
    ColumnNewComponent,
    TableNewComponent,
    SearchSelectComponent,
    SearchComponent,
    LeftMenuComponent,
    PaginationComponent,
    HeaderComponent,
    TabComponent,
    AutoCompleteComponent,
    TabComponent,
    SelectComponent,
    ButtonComponent,
    TreeComponent,
    DatePickerComponent,
    NodeComponent,
    TableComponent,
    TableColumnComponent,
    ModalTipComponent,
    ModalComponent,
    FileUploadComponent,
    TipComponent,
    TitleComponent,
    NButtonComponent,
    QrcodeComponent,
    ShowQrcodeComponent,
    DrawComponent,
    WrapEllipsisComponent,
    CheckboxComponent,
    TagsInputComponent,
    ProgressBarComponent,
    ListShowComponent,
    StepComponent,
    RadioComponent,
    PopoverDirective,
    InputComponent,
  ],
  providers: [
    DrawService,
    HttpService,
    PinyinService,
    ModalService,
    ModalTipService,
    DocumentRef,
    TipService,
  ],
  entryComponents: [
    DrawComponent,
    ModalTipComponent,
    ModalComponent,
    TipComponent,
    ShowQrcodeComponent
  ],
})
export class PluginModule { }
