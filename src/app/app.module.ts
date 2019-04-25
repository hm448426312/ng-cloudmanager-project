import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { CommonService } from './common/common.service';
import { CommonServiceModule } from './common/common.service.module';
import { DemoDrawerModule } from './demo/demo-draw/demo.drawer.module';
import { DemoTestDrawComponent } from './demo/demo-draw/demo.test.drawer.component';
import { PluginModule } from '../plugin/plugin.module';
import { DrawComponent } from '../plugin/draw/draw.component';
import { UEditorModule } from 'ngx-ueditor';
import {DcEventService} from '../plugin/broadcast/broadcast.service';
import {TablePagingService} from '../plugin/table-paging/table.paging.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    DemoDrawerModule,
    FormsModule,
    CommonModule,
    CommonServiceModule,
    PluginModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, { useHash: true }),
  ],
  providers: [
    CommonService,
    DcEventService,
    TablePagingService,
  ],
  exports: [
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    DemoTestDrawComponent,
    //DrawComponent
  ]
})
export class AppModule { }
