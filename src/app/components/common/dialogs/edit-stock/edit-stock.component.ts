import { NotificationsService } from 'src/app/services/notifications.service';
import { EditStockActionsEnums } from './../../../../utils/enums';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataProviderService } from '../../../../services/data-provider.service';
import { ConstantValuesService } from '../../../../services/constant-values.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditStockDialogData } from 'src/app/interfaces/edit-stock-dialog-data.interface';
declare const swal;

@Component({
  selector: 'app-edit-stock',
  templateUrl: './edit-stock.component.html',
  styleUrls: ['./edit-stock.component.scss']
})
export class EditStockDialogComponent implements OnInit {
  increaseOrDecreaseStockFormGroup: FormGroup;
  editStockModalTitle =  '';
  myShops = [];
  stockEditAction = 'increase';
  isProcessingEditStock: boolean;
  constructor(
    private dataProvider: DataProviderService,
    private constantValues: ConstantValuesService,
    private dialogRef: MatDialogRef<EditStockDialogComponent>,
    private notificationsService: NotificationsService,
    @Inject(MAT_DIALOG_DATA) public data: EditStockDialogData
  ) { }

  ngOnInit() {
    this.increaseOrDecreaseStockFormGroup = new FormGroup({
      shop_id: new FormControl(''),
      quantity: new FormControl('', [Validators.required]),
      product_id: new FormControl('')
    });
    if (this.data !== null && this.data !== undefined) {
      this.shop_id.setValue(this.data.product.myshop.id);
      this.product_id.setValue(this.data.product.id);
    }
  }

 /**
  * Increase/Decrease stock
  * @param detail details for editing stock
  */
 increaseOrDereaseStockForAProduct(detail) {
  if (this.increaseOrDecreaseStockFormGroup.valid) {
    let endpoint = this.constantValues.INCREASE_STOCK_ENDPOINT;
   if (this.data.action === EditStockActionsEnums.DECREASE_STOCK) {
     endpoint = this.constantValues.DECREASE_STOCK_ENDPOINT;
   } else if (this.data.action === EditStockActionsEnums.EDIT_QUANTITY) {
     // TODO: change the endpoint for set new quanity
     endpoint = this.constantValues.EDIT_QUANTITY_FOR_PRODUCT_ENDPOINT;
   }
   this.product_id.setValue(this.data.product.id);
  this.isProcessingEditStock = true;
  this.dataProvider.getAll(endpoint, detail)
    .subscribe(result => {
      this.isProcessingEditStock = false;
      if (result !== null && result !== undefined) {
        this.notificationsService.snackBarMessage('Stock successfully edited');
        this.dialogRef.close(true);
      }
    }, error => {
      this.isProcessingEditStock = false;
      swal('Edit Stock', error.detail, 'error');
    });
  }
}
  /**
   * Get shops of current loged in user
   */
  getMyShops() {
    this.dataProvider.getAll(this.constantValues.GET_SHOPS_ENDPOINT, { shop_id: '' }).subscribe(result => {
      if (result.status === 'success') {
        this.myShops = result.results;
      }
    }, () => {
    });
  }
  get shop_id() { return this.increaseOrDecreaseStockFormGroup.get('shop_id'); }
  get quantity() { return this.increaseOrDecreaseStockFormGroup.get('quantity'); }
  get product_id() { return this.increaseOrDecreaseStockFormGroup.get('product_id'); }
}
