import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../../plugin/http/http.service';

@Component({
  selector: 'app-demo-http',
  template: `
    <div>{{httpStatus}}:</div>
    <div>{{jsonData | json}}</div>
  `,
  styleUrls: []
})
export class DemoHttpComponent implements OnInit {
  constructor(private http: HttpService) {
  }

  httpStatus;
  jsonData;

  ngOnInit() {
    this.getTestJsonData().subscribe(res => {
      this.httpStatus = 'success';
      this.jsonData = res;
    }, err => {
      this.httpStatus = 'error';
      this.jsonData = err.json();
    });
  }

  getTestJsonData() {
    return this.http.getData({
      url: 'http://114.116.78.44:8808/api/v2/dashboards/lines/month/2018',
      search: {}
    });
  }
}
