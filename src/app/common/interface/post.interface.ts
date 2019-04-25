import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { HttpService } from '../../../plugin/http/http.service';

@Injectable()
export class PostInterface {
  serverIpF;
  serverIpY;
  serverIpP;

  constructor(private http: HttpService) {
    this.serverIpY = 'http://192.168.94.166:8443';
    this.serverIpF = 'http://192.168.94.167:8443';
    this.serverIpP = 'http://192.168.94.168:8443';
  }

  // 查询组织下的岗位信息
  getPostDetail(search) {
    return this.http.getData({
      url: this.serverIpF + '',
      search: search
    });
  }
}
