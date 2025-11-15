import { Component, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-file-upload-control',
  templateUrl: './file-upload-control.component.html',
  styleUrls: ['./file-upload-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileUploadControlComponent,
      multi: true
    }
  ]
})
export class FileUploadControlComponent implements ControlValueAccessor {
  imageUrl;
  onChange: Function;
  constructor() { }


  /**
   * Upload user avatar or company logo
   * @param fileBrowser Image File to upload
   * @param source Source of upload request (profile/logo)
   */
  uploadImages(fileBrowser) {
    if (fileBrowser.files.length > 0) {
      const file: File = fileBrowser.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = event => {
        this.imageUrl = reader.result;
      };
      this.onChange(file);
    }
  }

  writeValue(obj: any): void {
  }
  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
  }
  setDisabledState?(isDisabled: boolean): void {
  }


}
