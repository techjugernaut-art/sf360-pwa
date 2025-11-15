import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CongratulationComponent } from 'src/app/components/common/congratulation/congratulation.component';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { CustomerApiCallsService } from 'src/app/services/network-calls/customer-api-calls.service';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { TransactionStatusEnums, PaymentRequestTypesEnums } from 'src/app/utils/enums';

@Component({
  selector: 'app-card-payment-status-check',
  templateUrl: './card-payment-status-check.component.html',
  styleUrls: ['./card-payment-status-check.component.scss']
})
export class CardPaymentStatusCheckComponent implements OnInit {

  transactionId = '';
  paymentMethod = '';
  paymentNetwork = '';
  networkName = '';
  pollingCount = 0;
  isProcessing = false;
  isProcessingTransaction = false;
  momoTransactionStatusObservable: Observable<any>;
  refreshInterval;
  shopInfo;
  premiumPlan;
  smsPackage;
  isFailed: boolean;
  isTransactionStatusDelayed: boolean;
  redirectUrl = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CardPaymentStatusCheckComponent>,
    private dialog: MatDialog,
    private dataProvider: DataProviderService,
    private notificationService: NotificationsService,
    private constantValues: ConstantValuesService,
    private customerApiService: CustomerApiCallsService,
    private shopsService: ShopsService
  ) { }

  ngOnInit() {
  }

  checkTransacStatus(transactionId) {
    this.isProcessing = true;
    this.refreshInterval = setInterval(() => {
      // tslint:disable-next-line: max-line-length
      this.momoTransactionStatusObservable = this.dataProvider.getAll(this.constantValues.CHECK_TRANSACTION_ENDPOINT, { transaction_id: transactionId });
      this.momoTransactionStatusObservable.subscribe(result => {
        this.pollingCount += 1;
        if (result !== null && result.transaction_status === TransactionStatusEnums.SUCCESS) {
          let paymentPurpose = PaymentRequestTypesEnums.PHYSICAL_STORE;

          this.dialog.open(CongratulationComponent, { disableClose: true, data: {platform: paymentPurpose} });
          this.dialogRef.close(true);
        } else if (result !== null && result.transaction_status === TransactionStatusEnums.FAILED) {
          this.isProcessing = false;
          this.isFailed = true;
        } else {
          if (this.pollingCount >= 10) {
            this.pollingCount = 0;
            this.isProcessing = false;
            this.isTransactionStatusDelayed = true;
            clearInterval(this.refreshInterval);
            if (this.momoTransactionStatusObservable !== null && this.momoTransactionStatusObservable !== undefined) {
              this.momoTransactionStatusObservable.subscribe().unsubscribe();
            }
          }
        }
      }, error => {
        this.notificationService.snackBarErrorMessage(error.detail);
      });
    }, 5000);
  }
}
