import { Pipe, PipeTransform } from '@angular/core';
import { isNullOrUndefined } from 'util';

@Pipe({
  name: 'truncateText'
})
export class TruncateTextPipe implements PipeTransform {

  transform(value: String, maxLength?: number): any {
    if (value !== null && value !== undefined && value !== '') {
      // tslint:disable-next-line: deprecation
      const maxchar = (!isNullOrUndefined(maxLength)) ? maxLength : 10;
      if (value.length > maxchar) { return value.substring(0, maxchar) + '...'; }
      return value;
    }
    return null;
  }

}
