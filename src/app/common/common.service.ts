import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Subject} from 'rxjs/Subject';
import { HttpService } from '../../plugin/http/http.service';

@Injectable()

export class CommonService {
  constructor(private http: HttpService) {
  }

  private testData: Subject<any> = new ReplaySubject(1);

  getTestData(): Subject<any> {
    return this.testData;
  }

  deepClone(initalObj, finalObj?) {
    let obj = finalObj || {};
    for (let i in initalObj) {
      var prop = initalObj[i];

      // 避免相互引用对象导致死循环，如initalObj.a = initalObj的情况
      if (prop === obj) {
        continue;
      }

      if (typeof prop === 'object') {
        obj[i] = (prop.constructor === Array) ? [] : Object.create(prop);
      } else {
        obj[i] = prop;
      }
    }
    return obj;
  }
}
