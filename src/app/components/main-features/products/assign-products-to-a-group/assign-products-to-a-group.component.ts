import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ProductsService } from 'src/app/services/network-calls/products.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
declare const swal;

@Component({
  selector: 'app-assign-products-to-a-group',
  templateUrl: './assign-products-to-a-group.component.html',
  styleUrls: ['./assign-products-to-a-group.component.scss']
})
export class AssignProductsToAGroupComponent implements OnInit {

  editStockModalTitle = 'Add Products to Category';
  productGroups = [];
  isProcessing: boolean;
  isEdit = false;
  productGroup;
  storeId: string;
  productGroupId: FormControl = new FormControl('', [Validators.required]);
  selected = [];

  constructor(
    private productsService: ProductsService,
    private dialogRef: MatDialogRef<AssignProductsToAGroupComponent>,
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
      const payload = {shop_id: self.storeId, product_ids: this.selected.join() };
      swal({
        title: 'Are you sure?',
        text: 'This action will assign selected products to category',
        type: 'info',
        showCancelButton: true,
        confirmButtonText: 'Yes, assign it',
        closeOnConfirm: false,
        showLoaderOnConfirm: true,
        html: true
      }, function (inputValue) {
        if (inputValue) {
          self.productsService.assignProductsToProductGroup(self.productGroupId.value, payload, (error, result) => {
            if (result !== null && result.status === 'success') {
              swal('Product Category', 'Products successfully assigned', 'success');
              self.dialogRef.close(true);
            }
            if (error !== null) {
              swal('Product Category', error.detail, 'error');
            }
          });
        }
      });
  }
getProductGroups() {
  this.isProcessing = true;
  this.productsService.getProductGroupsFromRemoteOnly(this.storeId, (error, result) => {
    this.isProcessing = false;
    if (result !== null) {
      this.productGroups = result.results;
    }
  });
}
}
