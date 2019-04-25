import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { HttpService } from '../../../plugin/http/http.service';


@Injectable()
export class OrgInterface {
  serverIpF;
  serverIpY;
  serverIpP;

  constructor(private http: HttpService) {
    this.serverIpY = 'http://192.168.94.166:8443';
    this.serverIpF = 'http://192.168.94.167:8443';
    this.serverIpP = 'http://192.168.94.168:8443';
  }

  // 获取组织树
  getOrgTreeData(search) {
    return this.http.getData({
      url: this.serverIpP + '/torg/queryLowOrgElementID',
      search: search
    });
  }

  // 添加组织
  addOrgElement(data) {
    return this.http.postData({
      url: this.serverIpY + '/torg/addOrgElement',
      data: data
    });
  }

  // 查询组织
  queryOrgElement(search) {
    return this.http.getData({
      url: this.serverIpY + '/torg/queryOrgElementId',
      search: search
    });
  }

  // 删除组织
  delOrgElement(data) {
    return this.http.postData({
      url: this.serverIpY + '/torg/deleteOrgElementByIds',
      data: data
    });
  }

  // 更新组织
  updateOrgElement(data) {
    return this.http.postData({
      url: this.serverIpY + '/torg/updateOrgElement',
      data: data
    });
  }
}
