import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unitOfMeasurementDisplay'
})
export class UnitOfMeasurementDisplayPipe implements PipeTransform {

  transform(value: any, defaultValue: string = 'Unit'): any {
    return (value !== undefined && value !== '' && value !== null) ? value : defaultValue;
  }

}
