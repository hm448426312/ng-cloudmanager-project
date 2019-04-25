import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EsCommonService } from './escommon.service';
import { PluginModule } from '../../plugin/plugin.module';
@NgModule({
  imports: [
    CommonModule,
    PluginModule,
    FormsModule,
    RouterModule,
  ],
  declarations: [
  ],
  exports: [

  ],
  providers: [
    EsCommonService,
  ],
  entryComponents: [
  ],
})
export class CommonServiceModule { }
