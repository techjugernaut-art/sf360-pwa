import { OrderPaymentComponent } from './../../sales-orders/order-payment/order-payment.component';
import { CustomerApiCallsService } from 'src/app/services/network-calls/customer-api-calls.service';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { CongratulationComponent } from 'src/app/components/common/congratulation/congratulation.component';
import { PagaPaymentMethods, PaymentMethods, PaymentNetworks } from 'src/app/utils/enums.util';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { PaymentRequestTypesEnums, TransactionStatusEnums } from 'src/app/utils/enums';
import { PagaApiCallsService } from 'src/app/services/network-calls/paga-api-calls.service';

@Component({
  selector: 'app-confirm-premium-payment',
  templateUrl: './confirm-premium-payment.component.html',
  styleUrls: ['./confirm-premium-payment.component.scss']
})
export class ConfirmPremiumPaymentComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  pagaFormGroup: FormGroup;
  transactionId = '';
  paymentMethod = '';
  pagapaymentMethods = PagaPaymentMethods;
  paymentNetwork = '';
  networkName = '';
  message = '';
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
  isProceedForDirectTransfer = true;
  redirectUrl = '';
  bankOrMoMoCtrl = new FormControl('BANK');
  IsTransactionStatusCheck = false;
  frontendOrderId = '';
  currency = '';
  customer;
  orderItems = [];
  order;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ConfirmPremiumPaymentComponent>,
    private dialog: MatDialog,
    private dataProvider: DataProviderService,
    private notificationService: NotificationsService,
    private constantValues: ConstantValuesService,
    private customerApiService: CustomerApiCallsService,
    private shopsService: ShopsService,
    private pagaService: PagaApiCallsService
  ) { console.log(data, 'PAGA DATA') }

  ngOnInit() {
    this.formGroup = new FormGroup({
      shop_id: new FormControl(''),
      phone_number: new FormControl(''),
      payment_network: new FormControl(''),
      payment_method: new FormControl(''),
      discount_code: new FormControl(''),
      premium_plan_id: new FormControl(''),
      sms_plan_id: new FormControl(''),
      payment_voucher_code: new FormControl(''),
      bank_reference_code: new FormControl(''),
      bank_name: new FormControl('')
    });
    this.pagaFormGroup = new FormGroup({
      referenceNumber: new FormControl(''),
      accountReference: new FormControl(''),
      paymentMethods: new FormControl(''),
      amount: new FormControl(''),
      currency: new FormControl(''),
      callBackUrl: new FormControl('http://localhost:4200/dashboard'),
    });
    {
      // "referenceNumber" : "2353464564565",
      // "amount" : 2000.0,
      // "currency" : "NGN",
      // "expiryDateTimeUTC" : "2021-04-15T00:00:00",
      // "isSuppressMessages" : false,
      // "payerCollectionFeeShare" : 1.0,
      // "payeeCollectionFeeShare" : 0.0,
      // "isAllowPartialPayments" : false,
      // "isAllowOverPayments":false,
      // "callBackUrl" : "http://localhost:9091/test-callback",
      // "paymentMethods" : ["BANK_TRANSFER","FUNDING_USSD","REQUEST_MONEY"],
      // "displayBankDetailToPayer": false

    }


    if (this.data.payment_method === PaymentMethods.PAGA) {
      if(this.data.sms_package !== null && this.data.sms_package !== undefined){
        this.amount.setValue(this.data.sms_package.amount)
        this.currencyP.setValue(this.data.sms_package.currency)
      }else {
        this.currencyP.setValue(this.data.subscription_data.currency)
        this.amount.setValue(this.data.subscription_data.amount_to_show_on_app)
      }  
      this.accountReference.setValue(this.data.shop_data?.paga_unique_code)
      this.referenceNumber.setValue(this.data.shop_data?.merchant_code)
    }
    if (this.data !== null) {
      if (this.data.IsTransactionStatusCheck) {
        this.IsTransactionStatusCheck = true;
        this.isProcessingTransaction = true;
        this.currency = this.data.currency;
        this.customer = this.data.customer;
        this.orderItems = this.data.order_items;
        this.order = this.data.order;
        this.paymentMethod = this.data.order.payment_method;
        this.paymentNetwork = this.data.order.payment_network;
        this.networkName = this.data.order.payment_network;
        this.frontendOrderId = this.data.order.frontend_order_id;
        this.checOrderkMoMoStatus(this.data.order.frontend_order_id);
      } else {
        this.shop_id.setValue(this.data.shop_id);
        this.paymentMethod = this.data.payment_method;
        this.payment_method.setValue(this.paymentMethod);
        this.discount_code.setValue(this.data.discount_code);
        this.premium_plan_id.setValue(this.data.premium_plan_id);
        this.sms_plan_id.setValue(this.data.sms_plan_id);
        if (this.data.payment_method === PaymentMethods.MOMO) {
          this.payment_network.setValue(this.data.payment_network);
          this.paymentNetwork = this.data.payment_network;
          this.networkName = this.data.network_name;
          this.phone_number.setValidators([Validators.required]);
          this.phone_number.updateValueAndValidity();
          // if (this.paymentNetwork === PaymentNetworks.VOD) {
          //   this.payment_voucher_code.setValidators([Validators.required]);
          //   this.payment_voucher_code.updateValueAndValidity();
          // }
        } else if (this.data.payment_method === PaymentMethods.DIRECT_TRANSFER) {
          this.isProceedForDirectTransfer = false;
          this.bank_reference_code.setValidators([Validators.required]);
          this.bank_reference_code.updateValueAndValidity();
        }
      }
    }
  }
  ngOnDestroy() {
    clearInterval(this.refreshInterval);
    if (this.momoTransactionStatusObservable !== null && this.momoTransactionStatusObservable !== undefined) {
      this.momoTransactionStatusObservable.subscribe().unsubscribe();
    }
  }
  onPagaSubmit(data){
    console.log(data, 'PAGA')
    this.pagaService.paymentRequest(data, (error, result) => {
      console.log(error, 'ERROR')
      console.log(result, 'RESULT')
    })
  }
  onSubmit(data) {
    if (this.formGroup.valid) {
      this.isProcessing = true;
      if (this.sms_plan_id.value !== undefined && this.sms_plan_id.value !== null && this.sms_plan_id.value !== '') {
        this.customerApiService.purchaseSMSCredit(data, (error, result) => {
          this.isProcessing = false;
          if (result !== null && result.transaction_id !== '') {
            this.transactionId = result.transaction_id;
            this.isProcessingTransaction = true;
            this.checkMoMoStatus(result.transaction_id);
          }
        });
      } else {
        this.shopsService.payPremium(data, (error, result) => {
          this.isProcessing = false;
          if (result !== null && result.transaction_id !== '') {
            this.transactionId = result.transaction_id;
            this.isProcessingTransaction = true;
            if (this.paymentMethod === PaymentMethods.DIRECT_TRANSFER) {

            } else {
              this.checkMoMoStatus(result.transaction_id);
            }
          }
        });
      }
    }
  }
  checkMoMoStatus(transactionId) {
    this.isProcessing = true;
    this.refreshInterval = setInterval(() => {
      // tslint:disable-next-line: max-line-length
      this.momoTransactionStatusObservable = this.dataProvider.getAll(this.constantValues.CHECK_MOMO_ENDPOINT, { transaction_id: transactionId });
      this.momoTransactionStatusObservable.subscribe(result => {
        this.pollingCount += 1;  
        if (result !== null && result.transaction_status === TransactionStatusEnums.SUCCESS) {
          let paymentPurpose = PaymentRequestTypesEnums.PHYSICAL_STORE;
          if (this.sms_plan_id.value !== null && this.sms_plan_id.value !== undefined && this.sms_plan_id.value !== '') {
            paymentPurpose = PaymentRequestTypesEnums.SMS_PURCHASE;
          }
          this.dialog.open(CongratulationComponent, { disableClose: true, data: { platform: paymentPurpose } });
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
        this.pollingCount = 0;
        this.isProcessing = false;
        this.isTransactionStatusDelayed = true;
        clearInterval(this.refreshInterval);
        if (this.momoTransactionStatusObservable !== null && this.momoTransactionStatusObservable !== undefined) {
          this.momoTransactionStatusObservable.subscribe().unsubscribe();
        }
      });
    }, 5000);
  }
 
  checOrderkMoMoStatus(frontend_order_id) {

    this.isProcessing = true;
    this.refreshInterval = setInterval(() => {
      // tslint:disable-next-line: max-line-length
      this.momoTransactionStatusObservable = this.dataProvider.getAll(this.constantValues.CHECK_ORDER_MOMO_STATUS_ENDPOINT, { frontend_order_id: frontend_order_id });
      this.momoTransactionStatusObservable.subscribe(result => {
        this.pollingCount += 1;
        if (result !== null && result.transaction_status === TransactionStatusEnums.SUCCESS) {
          this.notificationService.snackBarErrorMessage("Transcation successfully approved");
          this.dialogRef.close(true);
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
        this.pollingCount = 0;
        this.isProcessing = false;
        this.isTransactionStatusDelayed = true;
        clearInterval(this.refreshInterval);
        if (this.momoTransactionStatusObservable !== null && this.momoTransactionStatusObservable !== undefined) {
          this.momoTransactionStatusObservable.subscribe().unsubscribe();
        }
      });
    }, 5000);
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
          if (this.sms_plan_id.value !== null && this.sms_plan_id.value !== undefined && this.sms_plan_id.value !== '') {
            paymentPurpose = PaymentRequestTypesEnums.SMS_PURCHASE;
          }
          this.dialog.open(CongratulationComponent, { disableClose: true, data: { platform: paymentPurpose } });
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
  onFinish() {
    this.dialogRef.close(true);
  }
  onChangePaymentMethod() {
    this.dialog.open(OrderPaymentComponent, { data: { order: this.order, currency: this.currency, customer: this.customer, order_items: this.orderItems, isChangePaymentMethod: true } })
  }
  get shop_id() { return this.formGroup.get('shop_id'); }
  get phone_number() { return this.formGroup.get('phone_number'); }
  get payment_network() { return this.formGroup.get('payment_network'); }
  get payment_method() { return this.formGroup.get('payment_method'); }
  get payment_voucher_code() { return this.formGroup.get('payment_voucher_code'); }
  get discount_code() { return this.formGroup.get('discount_code'); }
  get premium_plan_id() { return this.formGroup.get('premium_plan_id'); }
  get sms_plan_id() { return this.formGroup.get('sms_plan_id'); }
  get bank_reference_code() { return this.formGroup.get('bank_reference_code'); }
  get bank_name() { return this.formGroup.get('bank_name'); }
  
  get referenceNumber() { return this.pagaFormGroup.get('referenceNumber'); }
  get accountReference() { return this.pagaFormGroup.get('accountReference'); }
  get paymentMethods() { return this.pagaFormGroup.get('paymentMethods'); }
  get amount() { return this.pagaFormGroup.get('amount'); }
  get currencyP() { return this.pagaFormGroup.get('currency'); }
}



