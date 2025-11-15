import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'hasExpired'
})
export class HasExpiredPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    let hasExpired = false;
    if (value && value !== '' && value !== null && value !== undefined && moment(value).isBefore(moment())) {
      hasExpired = true;
    }
     return hasExpired;
  }

}
