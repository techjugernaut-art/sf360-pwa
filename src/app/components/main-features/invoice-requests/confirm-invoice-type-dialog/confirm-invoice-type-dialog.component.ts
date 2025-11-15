import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProductsService } from 'src/app/services/network-calls/products.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { InvoiceTypesEnums } from 'src/app/utils/enums';

@Component({
  selector: 'app-confirm-invoice-type-dialog',
  templateUrl: './confirm-invoice-type-dialog.component.html'
})
export class ConfirmInvoiceTypeDialogComponent implements OnInit {
  invoiceType = InvoiceTypesEnums;
  isProcessing = false;
  invoiceFormGroup: FormGroup;
  shop_id;
  customer_id;
  product_id;
  total_amount;
  arrayList;
  item_list: [];

  constructor(
    private productsService: ProductsService,
    private notificationService: NotificationsService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ConfirmInvoiceTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.shop_id = this.data?.shop_id;
    this.customer_id = this.data?.customer_id;
    this.total_amount = this.data?.newInvoice?.total_amount;
    if(this.data?.newInvoice?.item_list){
      this.arrayList = this.data?.newInvoice?.item_list;
    }
    this.invoiceFormGroup = this.formBuilder.group({
      shop_id: [this.shop_id, [Validators.required]],
      invoice_type: [this.invoiceType.EMAIL, [Validators.required]],
      customer_id: [this.customer_id, [Validators.required]],
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
      const detail = this.invoiceFormGroup.value;
      console.log(detail, 'DATA TO SUBMIT')
      // this.isProcessing = true;
      // this.productsService.createInvoiceRequest(invoiceFormGroup, (error, result) => {
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
