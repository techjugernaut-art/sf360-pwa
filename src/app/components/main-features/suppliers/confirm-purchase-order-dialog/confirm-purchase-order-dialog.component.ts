import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductsService } from 'src/app/services/network-calls/products.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { InvoiceTypesEnums } from 'src/app/utils/enums';

@Component({
  templateUrl: './confirm-purchase-order-dialog.component.html'
})
export class ConfirmPurchaseOrderDialogComponent implements OnInit {

  invoiceType = InvoiceTypesEnums;
  isProcessing = false;
  purchaseOrderFormGroup: FormGroup;
  shop_id;
  supplier_id;
  total_amount;
  arrayList;
  item_list: [];

  constructor(
    private productsService: ProductsService,
    private notificationService: NotificationsService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ConfirmPurchaseOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.shop_id = this.data?.shop_id;
    this.supplier_id = this.data?.supplier_id;
    this.total_amount = this.data?.order?.total_amount;
    if(this.data?.order?.item_list){
      this.arrayList = this.data?.order?.item_list;
    }
    this.purchaseOrderFormGroup = this.formBuilder.group({
      shop_id: [this.shop_id, [Validators.required]],
      invoice_type: [this.invoiceType.EMAIL, [Validators.required]],
      supplier_id: [this.supplier_id, [Validators.required]],
      total_amount: [this.total_amount, [Validators.required]],
      item_list: this.formBuilder.array(this.arrayList)
    });

   }

  ngOnInit() {

  }

    /**
  * Submit customer data
  * @param detail details for editing stock
  */
  onSubmit() {
    if (this.data !== null) {
      const detail = this.purchaseOrderFormGroup.value;
      console.log(detail, 'DATA TO SUBMIT')
      // this.isProcessing = true;
      // this.productsService.createPurchaseOrder(detail, (error, result) => {
      //   this.isProcessing = false;
      //   if (result !== null) {
      //     // this.notificationService.snackBarMessage('Invoice sent successfully');
      //   }
      // });
    }
  }
  onClose() {
    this.dialogRef.close(null);
  }
}
