import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-root',
  moduleId: module.id,
  templateUrl: './app.component.html',
  styleUrls: [
    '../assets/css/angular-tree-component.css',
    '../assets/css/bootstrap.min.css',
    './app.component.css'
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = 'app';
}
