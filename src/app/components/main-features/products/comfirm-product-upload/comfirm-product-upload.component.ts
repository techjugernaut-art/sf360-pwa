import { EventTrackerActions, EventTrackerCategories } from './../../../../utils/enums.util';
import { FormControl } from '@angular/forms';
import { ConstantValuesService } from './../../../../services/constant-values.service';
import { Component, OnInit, Inject } from '@angular/core';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppUtilsService } from 'src/app/services/app-utils.service';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { BulkUploadTemplatesEnum } from 'src/app/utils/enums';
declare const swal;

@Component({
  selector: 'app-comfirm-product-upload',
  templateUrl: './comfirm-product-upload.component.html',
  styleUrls: ['./comfirm-product-upload.component.scss']
})
export class ComfirmProductUploadComponent implements OnInit {
  myProductsToUpload = [];
  myShops = [];
  isProcessing = false;
  storeId: FormControl = new FormControl();
  bulkUploadTemplate: BulkUploadTemplatesEnum;
  modalTitle = 'Confirm Product Upload';
  constructor(
    private dataProvider: DataProviderService,
    private notificationService: NotificationsService,
    private dialogRef: MatDialogRef<ComfirmProductUploadComponent>,
    private appUtils: AppUtilsService,
    private constantValues: ConstantValuesService,
    private shopsService: ShopsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.getMyShops();
    if (this.data !== null && this.data !== undefined) {
      this.myProductsToUpload = this.data.dataSet;
      this.bulkUploadTemplate = this.data.bulk_upload_type;
      if (this.bulkUploadTemplate === BulkUploadTemplatesEnum.BULK_CUSTOMER_UPLOAD_TEMPLATE) {
        this.modalTitle = 'Confirm Customer Upload';
      }
    }
  }
/**
   * Upload product to server
   */
  uploadProducts() {
    if (this.storeId.value === '' || this.storeId.value === null || this.storeId.value === undefined) {
      this.notificationService.warning(this.constantValues.APP_NAME, 'Please select a Shop');
      return;
    }
    if (this.myProductsToUpload.length > 0) {
      let endpoint = this.constantValues.PRODUCT_UPLOAD_ENDPOINT;
      let successMessage = this.myProductsToUpload.length + ' product(s) successfully uploaded';
      let confirmDialogTitle = 'Product Upload';
      if (this.bulkUploadTemplate === BulkUploadTemplatesEnum.BULK_CUSTOMER_UPLOAD_TEMPLATE) {
        endpoint = this.constantValues.BULK_CUSTOMER_UPLOAD_ENDPOINT;
        successMessage = this.myProductsToUpload.length + ' customer(s) successfully uploaded';
        confirmDialogTitle = 'Customer Upload';
      } else {
        this.appUtils.trackUserEvents(EventTrackerActions.confirm_data_upload_to_server, EventTrackerCategories.product_upload);
      }
      this.isProcessing = true;
       // tslint:disable-next-line:max-line-length
       this.dataProvider.create(endpoint, { shop_id: this.storeId.value, data: this.myProductsToUpload })
       .subscribe( result => {
          this.isProcessing = false;
          if (result.response_code === '100') {
            swal(confirmDialogTitle, successMessage, 'success');
            this.dialogRef.close(true);
          }
        }, error => {
          this.isProcessing = false;
          this.notificationService.error(this.constantValues.APP_NAME, error.detail);
        });
    }
  }
 /**
   * Get shops of current loged in user
   */
  getMyShops() {
    this.isProcessing = true;
    this.shopsService.getMyShop({ shop_id: '' }, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.status === 'success') {
        this.myShops = result.results;
      }
    });
  }
}
