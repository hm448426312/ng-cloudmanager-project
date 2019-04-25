import { NgModule } from '@angular/core';
import { DemoTestDrawComponent } from './demo.test.drawer.component';
import { PluginModule } from '../../../plugin/plugin.module';

@NgModule({
  imports: [
    PluginModule
  ],
  providers: [],
  declarations: [
    DemoTestDrawComponent
  ],
  exports: [
    DemoTestDrawComponent
  ],
  entryComponents: [
    DemoTestDrawComponent
  ]
})
export class DemoDrawerModule {
}
