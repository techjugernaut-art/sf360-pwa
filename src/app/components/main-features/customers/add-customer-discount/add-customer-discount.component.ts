import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomerApiCallsService } from 'src/app/services/network-calls/customer-api-calls.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShopsService } from 'src/app/services/network-calls/shops.service';

@Component({
  selector: 'app-add-customer-discount',
  templateUrl: './add-customer-discount.component.html'
})
export class AddCustomerDiscountComponent implements OnInit {


  formGroup: FormGroup;
  editStockModalTitle = 'Add Customer Discount';
  discountId = '';
  isEdit = false;
  myShops = [];
  isProcessing: boolean;
  shopInfo: any;
  constructor(
    private customerApiCallsService: CustomerApiCallsService,
    private notificationService: NotificationsService,
    private dialogRef: MatDialogRef<AddCustomerDiscountComponent>,
    private shopsService: ShopsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      shop_id: new FormControl('', [Validators.required]),
      is_percentage: new FormControl(false),
      value: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required])
    });
    this.getMyShops();
    if (this.data !== null && this.data !== undefined) {
      this.isEdit = this.data.isEdit;
      if (this.isEdit) {
        this.editStockModalTitle = 'Update Customer Discount';
        this.discountId = this.data.category.id;
        this.shop_id.setValue(this.data.category.myshop.id);
        this.is_percentage.setValue(this.data.category.is_percentage);
        this.value.setValue(this.data.category.value);
        this.name.setValue(this.data.category.name);
        this.getShopByIdFromLocal(this.data.category.myshop.id);
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
        this.customerApiCallsService.createCustomerDiscount(detail, (error, result) => {
          this.isProcessing = false;
          if (result !== null) {
            this.notificationService.snackBarMessage('Customer Discount successfully created');
            this.dialogRef.close(true);
          }
        });
      }
    } else {
      if (this.formGroup.valid) {
        this.isProcessing = true;
        this.customerApiCallsService.updateCustomerDiscount(this.discountId, detail, (error, result) => {
          this.isProcessing = false;
          if (result !== null) {
            this.notificationService.snackBarMessage('Customer Discount successfully updated');
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
   *On shop changed
   * @param shopId Shop ID
   */
  onShopChanged(shopId) {
    this.shopInfo = this.getShopByIdFromLocal(shopId);
  }
  getShopByIdFromLocal(shopId) {
    return this.myShops.find(data => data.id === shopId);
  }
  get shop_id() { return this.formGroup.get('shop_id'); }
  get name() { return this.formGroup.get('name'); }
  get is_percentage() { return this.formGroup.get('is_percentage'); }
  get value() { return this.formGroup.get('value'); }

}
