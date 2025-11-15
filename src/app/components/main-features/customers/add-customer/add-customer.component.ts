import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomerApiCallsService } from 'src/app/services/network-calls/customer-api-calls.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { AddCustomerCategoryComponent } from '../add-customer-category/add-customer-category.component';
import { AppUtilsService } from 'src/app/services/app-utils.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html'
})
export class AddCustomerComponent implements OnInit {


  formGroup: FormGroup;
  editStockModalTitle = 'Add Customer';
  customerId = '';
  isEdit = false;
  myShops = [];
  productGroups = [];
  isProcessing: boolean;
  storeId;
  countries = [];
  countryCode = '';

  constructor(
    private customerApiCallsService: CustomerApiCallsService,
    private notificationService: NotificationsService,
    private dialogRef: MatDialogRef<AddCustomerComponent>,
    private shopsService: ShopsService,
    private appUtils: AppUtilsService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      shop_id: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email]),
      phone_number: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      customer_group_id: new FormControl(''),
      name: new FormControl('', [Validators.required])
    });
    this.getMyShops();
    if (this.data !== null && this.data !== undefined) {
      this.isEdit = this.data.isEdit;
      if (this.isEdit) {
        this.editStockModalTitle = 'Update Customer';
        this.customerId = this.data.customer.id;
        this.shop_id.setValue(this.data.customer.shop.id);
        this.name.setValue(this.data.customer.name);
        this.address.setValue(this.data.customer.address);
        this.phone_number.setValue(this.data.customer.phone_number);
        this.email.setValue(this.data.customer.email);
        this.getCustomerGroups(this.data.customer.shop.id);
        // tslint:disable-next-line: max-line-length
        this.customer_group_id.setValue((this.data.customer.customer_group !== null && this.data.customer.customer_group !== undefined) ? this.data.customer.customer_group.id : '');
      }
    }
  }
  /**
   * Submit customer data
   * @param detail details for editing stock
   */
  onSubmit(detail) {
    if (!this.isEdit) {
      if (this.formGroup.valid) {
        detail.phone_number = this.countryCode + this.appUtils.removeFirstZero(this.phone_number.value);
        this.isProcessing = true;
        this.customerApiCallsService.createCustomer(detail, (error, result) => {
          this.isProcessing = false;
          if (result !== null) {
            this.notificationService.snackBarMessage('Customer successfully created');
            this.dialogRef.close(true);
          }
        });
      }
    } else {
      if (this.formGroup.valid) {
        this.isProcessing = true;
        this.customerApiCallsService.updateCustomer(this.customerId, detail, (error, result) => {
          this.isProcessing = false;
          if (result !== null) {
            this.notificationService.snackBarMessage('Customer successfully updated');
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
 getCustomerGroups(storeId) {
  this.isProcessing = true;
  this.isProcessing = true;
  this.customerApiCallsService.getCategories({shop_id: storeId}, (error, result) => {
    this.isProcessing = false;
    if (result !== null) {
      this.productGroups = result.results;
    }
  });
}
/**
  * Create customer category
  */
addCustomerGroup() {
  this.dialog.open(AddCustomerCategoryComponent, { data: { shop_id: this.storeId } }).afterClosed()
    .subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.getCustomerGroups({ shop_id: this.storeId });
      }
    });
}
/**
   *On shop changed
   * @param shopId Shop ID
   */
  onShopChanged(shopId) {
    this.getCustomerGroups(shopId);
  }
    /**
   * Country code selected
   * @param countryInfo country info
   */
     onCountry(countryInfo) {
      if (countryInfo !== undefined && countryInfo !== null) {
        this.countryCode = '+' + (countryInfo.callingCodes[0] as string);
      }
    }
  get shop_id() { return this.formGroup.get('shop_id'); }
  get email() { return this.formGroup.get('email'); }
  get phone_number() { return this.formGroup.get('phone_number'); }
  get address() { return this.formGroup.get('address'); }
  get customer_group_id() { return this.formGroup.get('customer_group_id'); }
  get name() { return this.formGroup.get('name'); }

}
