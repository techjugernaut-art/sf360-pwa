import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getBaseUnitName'
})
export class GetBaseUnitNamePipe implements PipeTransform {

  transform(value: any[], defaultBaseUnitName: string): any {
    if (value !== null && value !== undefined && value.length > 0) {
      return (value.find(element => element.is_base_unit === true)).unit_name;
    }
    return defaultBaseUnitName;
  }

}
