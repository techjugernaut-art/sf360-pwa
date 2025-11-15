import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { ProductsService } from 'src/app/services/network-calls/products.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-add-product-group',
  templateUrl: './add-product-group.component.html',
  styleUrls: ['./add-product-group.component.scss']
})
export class AddProductGroupComponent implements OnInit {
  productGroupFormGroup: FormGroup;
  editStockModalTitle = 'Add Product Category';
  myShops = [];
  isProcessing: boolean;
  isEdit = false;
  productGroup;

  constructor(
    private productsService: ProductsService,
    private notificationService: NotificationsService,
    private dialogRef: MatDialogRef<AddProductGroupComponent>,
    private shopsService: ShopsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.productGroupFormGroup = new FormGroup({
      shop_id: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required])
    });
    this.getMyShops();
    if (this.data !== null && this.data !== undefined) {
      this.shop_id.setValue(this.data.shop_id);
      if (this.data.product_group !== null && this.data.product_group !== undefined) {
        this.productGroup = this.data.product_group;
        this.editStockModalTitle = 'Edit Product Category';
        this.isEdit = this.data.isEdit;
        this.shop_id.setValue(this.productGroup.myshop.id);
        this.name.setValue(this.productGroup.name);
      }
    }
  }
  /**
   * Submit product category data
   * @param detail details for editing stock
   */
  onSubmit(detail) {
    if (this.productGroupFormGroup.valid) {
      if (!this.isEdit) {
        this.isProcessing = true;
        this.productsService.createProductGroup(detail, (error, result) => {
          this.isProcessing = false;
          if (result !== null) {
            this.notificationService.snackBarMessage('Product Category successfully created');
            this.dialogRef.close(true);
          }
        });
      } else {
        this.isProcessing = true;
        this.productsService.updateProductGroup(this.productGroup.id, detail, (error, result) => {
          this.isProcessing = false;
          if (result !== null) {
            this.notificationService.snackBarMessage('Product Category successfully updated');
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
  get shop_id() { return this.productGroupFormGroup.get('shop_id'); }
  get name() { return this.productGroupFormGroup.get('name'); }

}
