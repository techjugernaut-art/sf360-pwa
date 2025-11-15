import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { SharedDataApiCallsService } from 'src/app/services/network-calls/shared-data-api-calls.service';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { Component, OnInit, Inject } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-add-mall-banner-dialog',
  templateUrl: './add-mall-banner-dialog.component.html',
  styleUrls: ['./add-mall-banner-dialog.component.scss']
})
export class AddMallBannerDialogComponent implements OnInit {
  isProcessing = false;
  isEdit = false;
  btnText = 'UPDATE';
  imageUrl: any;
  shopId: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  bannerModalTitle = 'Add Banner';
  formGroup: FormGroup;

  constructor(
    private shopsService: ShopsService,
    private sharedDataApiService: SharedDataApiCallsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddMallBannerDialogComponent>
  ) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      image_url: new FormControl('', [Validators.required]),
      main_heading: new FormControl('', [Validators.required]),
      sub_heading: new FormControl('', [Validators.required]),
      shop_id: new FormControl(''),
      slider_id: new FormControl('')
    });
    if (this.data !== null) {
      this.shopId = this.data.shop_id;
      if (this.data.banner !== null) {
        this.isEdit = true;
        this.prepopulate(this.data.banner);
      }
    }
  }
  addSliders(data) {
    data.shop_id = this.shopId;
    this.shop_id.setValue(this.shopId);
    this.isProcessing = true;
   if (!this.isEdit) {
     data.slider_id = '';
    this.sharedDataApiService.uploadBase64Image(this.croppedImage, (imageUrlError, imageUrlResult) => {
      if (imageUrlResult !== null) {
        this.image_url.setValue(imageUrlResult.image_url);
        data.image_url = imageUrlResult.image_url;
        this.shopsService.addSlider(data, (error, result) => {
          this.isProcessing = false;
          if (result !== null) {
            this.dialogRef.close(true);
          }
        });
      }
    });
   } else if (this.isEdit && this.croppedImage !== '') {
    this.sharedDataApiService.uploadBase64Image(this.croppedImage, (imageUrlError, imageUrlResult) => {
      if (imageUrlResult !== null) {
        this.image_url.setValue(imageUrlResult.image_url);
        data.image_url = imageUrlResult.image_url;
        this.shopsService.editSlider(data, (error, result) => {
          this.isProcessing = false;
          if (result !== null) {
            this.dialogRef.close(true);
          }
        });
      }
    });
   }  else {
    this.shopsService.editSlider(data, (error, result) => {
      this.isProcessing = false;
      if (result !== null) {
        this.dialogRef.close(true);
      }

    });
   }
  }
  uploadImage() {
    this.isProcessing = true;
    this.sharedDataApiService.uploadBase64Image(this.croppedImage, (error, result) => {
      if (result !== null) {
      }
    });
  }
  prepopulate(banner) {
    this.image_url.setValue(banner.image);
    this.main_heading.setValue(banner.main_heading);
    this.sub_heading.setValue(banner.sub_heading);
    this.slider_id.setValue(banner.id);
    this.imageUrl = banner.image;
  }
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;

  }

  get image_url() { return this.formGroup.get('image_url'); }
  get main_heading() { return this.formGroup.get('main_heading'); }
  get sub_heading() { return this.formGroup.get('sub_heading'); }
  get shop_id() { return this.formGroup.get('shop_id'); }
  get slider_id() { return this.formGroup.get('slider_id'); }
}
