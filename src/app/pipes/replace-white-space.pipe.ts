import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceWhiteSpace'
})
export class ReplaceWhiteSpacePipe implements PipeTransform {

  transform(text: any, ...args: any[]): any {
    if (text !== undefined && text !== null && text !== '') { return text.replace(/\s+/g, ''); }
    return '';
  }

}
