import {Pipe, PipeTransform} from '@angular/core';
import * as _ from 'lodash';

@Pipe({name: 'arrFilter'})
export class FilterSearchPipe implements PipeTransform {
  transform(value: any, key?: string, val?: string, len?: number): any {
    const formatKey = key || '';
    const formatVal = val || '';
    let argValue = [];
    if (value) {
      argValue = _.cloneDeep(value);
    }
    let tempVal = [];
    if (formatKey && formatVal) {
      tempVal = _.filter(argValue, function (o) {
        if (o[formatKey].indexOf(val) != -1) {
          return o;
        }
      });
    } else {
      tempVal = argValue;
    }
    if (len && tempVal.length > len) {
      return tempVal.slice(0, len);
    }
    return tempVal;
  }
}
