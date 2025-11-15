import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'subscriptionRenewalDate'
})
export class SubscriptionRenewalDatePipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string {
    if (value !== null && value !== undefined) {
      return moment().add(value, 'days').calendar();
    }
    return '';
  }

}
