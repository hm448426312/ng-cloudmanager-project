import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class HttpService {
  passHeader = new Headers();

  constructor(private http: Http) {
    // this.passHeader.append('Access-Control-Allow-Credentials', 'true');
    // this.passHeader.append('Access-Control-Allow-Origin', '*');
    // this.passHeader.append('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,PATCH,OPTIONS');
    // this.passHeader.append('Content-Type', 'application/json;charset=utf-8');
  }

  getData(conf: any) {
    return this.requestFn('get', conf);
  }

  postData(conf: any) {
    return this.requestFn('post', conf);
  }

  deleteData(conf: any) {
    return this.requestFn('delete', conf);
  }

  patchData(conf: any) {
    return this.requestFn('patch', conf);
  }

  putData(conf: any) {
    return this.requestFn('put', conf);
  }

  getHeader(newHeader?: any) {
    if (newHeader) {
      for (const key of newHeader) {
        this.passHeader.append(key, newHeader[key]);
      }
    }
    if (localStorage.getItem('Authorization')) {
      this.passHeader.set('Authorization', localStorage.getItem('Authorization'));
    }
    // console.log('header:', this.passHeader);
    return this.passHeader;
  }

  setHttpMath(obj: any) {
    let temp = obj || {};
    temp['_time'] = Math.random().toString();
    return temp;
  }

  updateHeaderStorage(response: any) {
    if (response && response.headers.get('Authorization')) {
      localStorage.setItem('Authorization', response.headers.get('Authorization'));
    }
  }

  private requestFn(method: string, conf: any): Observable<Response> {
    let url = conf.url;
    let data: any = conf.data;
    let search = conf.search || {};
    let options: any = {
      headers: this.getHeader(conf.header || null),
      search: this.setHttpMath(search),
    };
    if (conf.responseType) {
      options['responseType'] = conf.responseType;
    }
    // if (!data) {
    //   data = options;
    //   options = null;
    // }
    const successReg = new RegExp(/^2\d\d$/);
    let _m: any;
    if (method.toLocaleLowerCase() !== 'get') {
      if (url.indexOf('?') === -1) {
        url += '?_time=' + Math.random().toString();
      } else {
        url += '&_time=' + Math.random().toString();
      }
    }
    switch (method.toLocaleLowerCase()) {
      case 'get':
        return this.http.get(url, options).map((response: any) => {
          this.updateHeaderStorage(response);
          if (response && successReg.test(response.status)) {
            if (response['_body']) {
              return response.json && response.json();
            } else {
              return response;
            }
          } else {
            throw response;
          }
        });
      case 'delete':
        return this.http.delete(url, options).map((response: any) => {
          this.updateHeaderStorage(response);
          if (response && successReg.test(response.status)) {
            if (response['_body']) {
              return response.json && response.json();
            } else {
              return response;
            }
          } else {
            throw response;
          }
        });
      case 'post':
        return this.http.post(url, data, options).map((response: any) => {
          this.updateHeaderStorage(response);
          if (response && successReg.test(response.status)) {
            if (response['_body']) {
              return response.json && response.json();
            } else {
              return response;
            }
          } else {
            throw response;
          }
        });
      case 'put':
        return this.http.put(url, data, options).map((response: any) => {
          this.updateHeaderStorage(response);
          if (response && successReg.test(response.status)) {
            if (response['_body']) {
              return response.json && response.json();
            } else {
              return response;
            }
          } else {
            throw response;
          }
        });
      case 'patch':
        return this.http.patch(url, data, options).map((response: any) => {
          this.updateHeaderStorage(response);
          if (response && successReg.test(response.status)) {
            if (response['_body']) {
              return response.json && response.json();
            } else {
              return response;
            }
          } else {
            throw response;
          }
        });
    }
    return null;
  }
}
