import { EditStockActionsEnums } from './../../../../utils/enums';
import { ProductsService } from 'src/app/services/network-calls/products.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-increase-and-decrease-stock',
  templateUrl: './increase-and-decrease-stock.component.html',
  styleUrls: ['./increase-and-decrease-stock.component.scss']
})
export class IncreaseAndDecreaseStockComponent implements OnInit {
  formGroup: FormGroup;
  isProcessing = false;
  editStockAction;
  productDetail;
  unitsOfMeasurements = [];
  constructor(
    private notificationService: NotificationsService,
    private dialogRef: MatDialogRef<IncreaseAndDecreaseStockComponent>,
    private productsService: ProductsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    if (this.data !== null && this.data !== undefined) {
      this.productDetail = this.data.product;
      this.editStockAction = this.data.action;
      this.unitsOfMeasurements = this.productDetail.price_list;
    }
    this.formGroup = new FormGroup({
      shop_id: new FormControl(''),
      new_quantity: new FormControl(0, [Validators.required]),
      price_list_id: new FormControl('', [Validators.required])
    });
  }
  onSubmit(detail) {
    detail.shop_id = this.productDetail.myshop.id;
    this.isProcessing = true;
    if (this.editStockAction === EditStockActionsEnums.INCREASE_STOCK) {
      this.productsService.increaseStock(this.productDetail.id, detail, (error, result) => {
        this.isProcessing = false;
        if (result !== null) {
          this.notificationService.snackBarMessage('Stock successfully increased');
          this.dialogRef.close(true);
        }
      });
    } else if (this.editStockAction === EditStockActionsEnums.DECREASE_STOCK) {
      this.productsService.decreaseStock(this.productDetail.id, detail, (error, result) => {
        this.isProcessing = false;
        if (result !== null) {
          this.notificationService.snackBarMessage('Stock successfully decreased');
          this.dialogRef.close(true);
        }
      });
    } else if (this.editStockAction === EditStockActionsEnums.EDIT_QUANTITY) {
      this.productsService.setNewQuantity(this.productDetail.id, detail, (error, result) => {
        this.isProcessing = false;
        if (result !== null) {
          this.notificationService.snackBarMessage('Stock Quantity successfully set');
          this.dialogRef.close(true);
        }
      });
    }
  }
  get new_quantity() { return this.formGroup.get('new_quantity'); }
  get price_list_id() { return this.formGroup.get('price_list_id'); }
}
