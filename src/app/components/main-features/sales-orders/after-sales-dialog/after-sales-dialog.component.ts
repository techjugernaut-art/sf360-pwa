import { CustomerApiCallsService } from 'src/app/services/network-calls/customer-api-calls.service';
import { PosReceiptComponent } from './../pos-receipt/pos-receipt.component';
import { NotificationsService } from './../../../../services/notifications.service';
import { FormControl, Validators } from '@angular/forms';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { AppUtilsService } from 'src/app/services/app-utils.service';
import { NgxPrinterService } from 'ngx-printer';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-after-sales-dialog',
  templateUrl: './after-sales-dialog.component.html',
  styleUrls: ['./after-sales-dialog.component.scss']
})
export class AfterSalesDialogComponent implements OnInit {
salesOrder;
isProcessing = false;
url = '';
action = '';
currency = '';
orderItems = [];
countries = [];
countryCode = '';

@ViewChild(PosReceiptComponent, {read: ElementRef}) PrintComponent: ElementRef;
emailCtrl: FormControl = new FormControl('', [Validators.required, Validators.email]);
smsCtrl: FormControl = new FormControl('', [Validators.required]);
  constructor(
    private appUtils: AppUtilsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private printerService: NgxPrinterService,
    private notificationsService: NotificationsService,
    private customerApiCallsService: CustomerApiCallsService,
    private dialogRef: MatDialogRef<AfterSalesDialogComponent>
  ) { }

  ngOnInit() {
    if (this.data !== null && this.data !== undefined) {
      this.salesOrder = this.data.sales_order;
      this.orderItems = this.data.order_items;
      this.currency = this.data.currency;
      this.url = this.appUtils.generateReceiptUrl(this.salesOrder.shop_id, this.salesOrder.frontend_order_id);
      this.emailCtrl.setValue(this.salesOrder.customer_email);
      this.smsCtrl.setValue(this.salesOrder.customer_phone_number);
    }
  }

  onSendingEmail() {
    if(this.emailCtrl.value !== null && this.emailCtrl.value !== undefined && this.emailCtrl.value !== ''){
      this.isProcessing = true;
      this.customerApiCallsService.sendCustomersSalesReceipt(this.salesOrder.frontend_order_id, this.emailCtrl.value, (error, result) => {
        this.isProcessing = false;
        if(result !== null){
          this.notificationsService.snackBarMessage('Receipt successfully sent');
          this.dialogRef.close(true);
        }
      })
    }
  }

  onSendingSMS() {
    if (this.smsCtrl.valid) {
      this.notificationsService.snackBarMessage('Sending SMS receipt');
      this.dialogRef.close(true);
    }
  }
  onPrint() {
    this.action = '';
    this.printerService.printHTMLElement(this.PrintComponent.nativeElement);
  }
  onPerformNewSale() {
    this.action = '';
    this.dialogRef.close(true);
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
}
