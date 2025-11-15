import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductsService } from 'src/app/services/network-calls/products.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShopsService } from 'src/app/services/network-calls/shops.service';

@Component({
  selector: 'app-add-unit-of-measurement',
  templateUrl: './add-unit-of-measurement.component.html',
  styleUrls: ['./add-unit-of-measurement.component.scss']
})
export class AddUnitOfMeasurementComponent implements OnInit {
  productGroupFormGroup: FormGroup;
  editStockModalTitle = 'Add Unit of Measurement';
  unitId = '';
  isEdit = false;
  myShops = [];
  isProcessing: boolean;
  constructor(
    private productsService: ProductsService,
    private notificationService: NotificationsService,
    private dialogRef: MatDialogRef<AddUnitOfMeasurementComponent>,
    private shopsService: ShopsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.productGroupFormGroup = new FormGroup({
      shop_id: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required])
    });
    this.getMyShops();
    if (this.data !== null && this.data !== undefined) {
      this.shop_id.setValue(this.data?.shop_id);
      this.isEdit = this.data?.isEdit;
      if (this.isEdit) {
        this.editStockModalTitle = 'Update Unit of Measurement';
        this.unitId = this.data?.unit.id;
        this.shop_id.setValue(this.data?.unit.myshop.id);
        this.name.setValue(this.data?.unit.name);
      }
    }
  }
  /**
   * Submit product category data
   * @param detail details for editing stock
   */
  onSubmit(detail) {
    if (!this.isEdit) {
      if (this.productGroupFormGroup.valid) {
        this.isProcessing = true;
        this.productsService.createUnitOfMeasurement(detail, (error, result) => {
          this.isProcessing = false;
          if (result !== null) {
            this.notificationService.snackBarMessage('Unit of Measurement successfully created');
            this.dialogRef.close(true);
          }
        });
      }
    } else {
      if (this.productGroupFormGroup.valid) {
        this.isProcessing = true;
        this.productsService.updateUnitOfMeasurement(this.unitId, detail, (error, result) => {
          this.isProcessing = false;
          if (result !== null) {
            this.notificationService.snackBarMessage('Unit of Measurement successfully updated');
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
