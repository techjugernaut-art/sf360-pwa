import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageUrl'
})
export class ImageUrlPipe implements PipeTransform {

  transform(value: string, fallback: string = ''): any {
    let image = fallback;
    if (value && value !== '' && value !== null && value !== undefined) {
      image = value;
    }
     return image;
  }


}
