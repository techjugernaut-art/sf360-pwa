import { CustomerApiCallsService } from 'src/app/services/network-calls/customer-api-calls.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
declare const swal;

@Component({
  selector: 'app-add-customers-to-category',
  templateUrl: './add-customers-to-category.component.html'
})
export class AddCustomersToCategoryComponent implements OnInit {


  editStockModalTitle = 'Add Customers to Group';
  productGroups = [];
  isProcessing: boolean;
  isEdit = false;
  productGroup;
  storeId: string;
  productGroupId: FormControl = new FormControl('', [Validators.required]);
  selected = [];

  constructor(
    private customersService: CustomerApiCallsService,
    private dialogRef: MatDialogRef<AddCustomersToCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.getProductGroups();
    if (this.data !== null && this.data !== undefined) {
      this.storeId = this.data.shop_id;
      this.selected = this.data.selected;
    }
  }
  /**
   * Submit product category data
   * @param detail details for editing stock
   */
  onSubmit() {
    const self = this;
      const payload = {shop_id: self.storeId, customer_ids: this.selected.join() };
      swal({
        title: 'Are you sure?',
        text: 'This action will assign selected customers to group',
        type: 'info',
        showCancelButton: true,
        confirmButtonText: 'Yes, assign it',
        closeOnConfirm: false,
        showLoaderOnConfirm: true,
        html: true
      }, function (inputValue) {
        if (inputValue) {
          self.customersService.assignCustomersToCustomerGroup(self.productGroupId.value, payload, (error, result) => {
            if (result !== null && result.status === 'success') {
              swal('Customer Group', 'Customers successfully assigned', 'success');
              self.dialogRef.close(true);
            }
            if (error !== null) {
              swal('Customer Group', error.detail, 'error');
            }
          });
        }
      });
  }
getProductGroups() {
  this.isProcessing = true;
  this.customersService.getCategories({shop_id: this.storeId}, (error, result) => {
    this.isProcessing = false;
    if (result !== null) {
      this.productGroups = result.results;
    }
  });
}

}
