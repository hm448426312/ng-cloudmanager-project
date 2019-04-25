import {Injectable} from '@angular/core';
import * as _ from 'lodash';

@Injectable()

export class TablePagingService {
  constructor() {
  }

  filterTableData(value: any, filter?: any, sort?: any) {
    filter = filter || null;
    sort = sort || null;
    value = _.cloneDeep(value);
    let result: any = [];
    if (value) {
      if (sort && sort.value) {
        value.sort((a: any, b: any) => {
          const res = sort.value === 'asc' ? a[sort.key] > b[sort.key] : b[sort.key] > a[sort.key];
          return res ? 1 : 0;
        });
      }
      if (filter && filter.key && filter.key.length > 0) {
        let keys = filter.key;
        let values = filter.value;
        let matchs = filter.match;
        if (keys.length > 0) {
          for (let j = 0; j < value.length; j++) {
            let list = value[j];
            let flag = true;
            for (let i = 0; i < keys.length; i++) {
              if (matchs[i] && matchs[i] == 'full') {
                if (list[keys[i]] != list[values[i]]) {
                  flag = false;
                  break;
                }
              } else {
                if (list[keys[i]].indexOf && list[keys[i]].indexOf(values[i]) === -1) {
                  flag = false;
                  break;
                }
              }
            }
            if (flag) {
              result.push(list);
            }
          }
        }
      } else {
        result = value;
      }
    }
    return result;
  }
}
