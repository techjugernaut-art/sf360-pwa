import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstLetterOfEachWord'
})
export class FirstLetterOfEachWordPipe implements PipeTransform {

  transform(value: string, ...args: any[]): any {
    let str = value;
      const matches = value.match(/\b(\w)/g);
      str = (matches !== null && matches !== undefined) ? matches.join('') : '';
    return str;
  }

}
