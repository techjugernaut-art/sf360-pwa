import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'docImagePreview'
})
export class DocImagePreviewPipe implements PipeTransform {

  transform(value: string, fallback: string = '/assets/img/icons/add.svg'): any {
    let image = fallback;
    if (value && value !== '' && value !== null && value !== undefined && value !== 'loading') {
      image = value;
    }
     return image;
  }

}
