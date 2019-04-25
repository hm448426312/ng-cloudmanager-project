import {NgModule} from '@angular/core';
import {HomeComponent} from './home.component';
import {RouterModule} from '@angular/router';
import {CommonServiceModule} from '../common/common.service.module';
import {FormsModule} from '@angular/forms';
import {PluginModule} from '../../plugin/plugin.module';
import {CommonModule} from '@angular/common';
import {DemoIframeInnerComponent} from '../demo/demo-iframe/demo.iframe.inner.component';

@NgModule({
  imports: [
    CommonServiceModule,
    FormsModule,
    CommonModule,
    PluginModule,
    RouterModule.forChild([
      {
        path: 'home',
        component: HomeComponent,
        children: [
          {
            path: 'demo',
            loadChildren: './demo/demo.module#DemoModule',
          }
        ]
      },
      {
        path: 'iframe',
        component: DemoIframeInnerComponent,
      },
      {
        path: '',
        redirectTo: '/home/demo',
        pathMatch: 'full'
      },
    ])
  ],
  providers: [],
  declarations: [
    DemoIframeInnerComponent,
    HomeComponent,
  ],
  exports: [
    HomeComponent
  ],
})
export class HomeModule {
}
