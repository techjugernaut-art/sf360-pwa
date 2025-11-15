import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotificationsService } from 'src/app/services/notifications.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { CustomerApiCallsService } from 'src/app/services/network-calls/customer-api-calls.service';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { AddCustomerDiscountComponent } from '../add-customer-discount/add-customer-discount.component';

@Component({
  selector: 'app-add-customer-category',
  templateUrl: './add-customer-category.component.html'
})
export class AddCustomerCategoryComponent implements OnInit {

  formGroup: FormGroup;
  editStockModalTitle = 'Add Customer Group';
  categoryId = '';
  isEdit = false;
  myShops = [];
  customerDiscounts = [];
  isProcessing: boolean;
  storeId: string;
  constructor(
    private customerApiCallsService: CustomerApiCallsService,
    private notificationService: NotificationsService,
    private dialogRef: MatDialogRef<AddCustomerCategoryComponent>,
    private shopsService: ShopsService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      shop_id: new FormControl('', [Validators.required]),
      discount_id: new FormControl(''),
      color_code: new FormControl(''),
      name: new FormControl('', [Validators.required])
    });
    this.getMyShops();
    if (this.data !== null && this.data !== undefined) {
      this.isEdit = this.data.isEdit;
      if (this.isEdit) {
        this.editStockModalTitle = 'Update Customer Group';
        this.categoryId = this.data.category.id;
        this.shop_id.setValue(this.data.category.myshop.id);
        this.name.setValue(this.data.category.name);
        this.getCustomerDiscounts({shop_id: this.data?.category?.myshop?.id});
        this.discount_id.setValue(this.data?.category?.discount?.id);
      }
    }
  }
  /**
   * Submit product category data
   * @param detail details for editing stock
   */
  onSubmit(detail) {
    if (!this.isEdit) {
      if (this.formGroup.valid) {
        this.isProcessing = true;
        this.customerApiCallsService.createCustomerGroup(detail, (error, result) => {
          this.isProcessing = false;
          if (result !== null) {
            this.notificationService.snackBarMessage('Customer Segment successfully created');
            this.dialogRef.close(true);
          }
        });
      }
    } else {
      if (this.formGroup.valid) {
        this.isProcessing = true;
        this.customerApiCallsService.updateCustomerGroup(this.categoryId, detail, (error, result) => {
          this.isProcessing = false;
          if (result !== null) {
            this.notificationService.snackBarMessage('Customer Segment successfully updated');
            this.dialogRef.close(true);
          }
        });
      }
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
  /**
  * Get customer categories
  * @param filterData IDashboardFilterParams interface
  */
 getCustomerDiscounts(filterData: IDashboardFilterParams) {
  this.isProcessing = true;
  this.customerApiCallsService.getCustomerDiscounts(filterData, (error, result) => {
    this.isProcessing = false;
    if (result !== null && result !== undefined && result.response_code === '100') {
      this.customerDiscounts = result.results;

    }
  });
}
/**
  * Create customer category
  */
 addCustomerDiscount() {
  this.dialog.open(AddCustomerDiscountComponent, { data: { shop_id: this.storeId } }).afterClosed()
    .subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.getCustomerDiscounts({ shop_id: this.storeId });
      }
    });
}
/**
   *On shop changed
   * @param shopId Shop ID
   */
  onShopChanged(shopId) {
    this.getCustomerDiscounts({shop_id: shopId});
  }
  get shop_id() { return this.formGroup.get('shop_id'); }
  get discount_id() { return this.formGroup.get('discount_id'); }
  get color_code() { return this.formGroup.get('color_code'); }
  get name() { return this.formGroup.get('name'); }


}
