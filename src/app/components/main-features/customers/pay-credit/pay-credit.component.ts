import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { CustomerApiCallsService } from 'src/app/services/network-calls/customer-api-calls.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { PaymentMethodsEnum } from 'src/app/utils/enums';
import { CurrencyEnums } from 'src/app/utils/enums.util';
import * as moment from 'moment';

@Component({
  selector: 'app-pay-credit',
  templateUrl: './pay-credit.component.html'
})
export class PayCreditComponent implements OnInit {
  isProcessing = false;
  formGroup: FormGroup;
  orderInfo;
  modalTitle = 'Pay Customer Credit';
  networkName = '';
  currencyEnums = CurrencyEnums;
  paymentMethods = PaymentMethodsEnum;
  currency = '';
  paymentMethod = PaymentMethodsEnum.CASH;
  paymentNetwork = PaymentMethodsEnum.MTN;
  maxDate = new Date()
  constructor(
    private customerApiCallService: CustomerApiCallsService,
    private notificationService: NotificationsService,
    private dialogRef: MatDialogRef<PayCreditComponent>,
    private dialog: MatDialog,
    private constantValues: ConstantValuesService,
    @Inject(MAT_DIALOG_DATA) public data: any

    ) { this.orderInfo = data.order}
  ngOnInit() {
    console.log( this.orderInfo)
    this.formGroup = new FormGroup({
      frontend_payment_date: new FormControl('', [Validators.required]),
      shop_id: new FormControl(this.orderInfo.myshop.id),
      order_id: new FormControl(this.orderInfo.id),
      payment_method: new FormControl(this.paymentMethod),
      payment_network: new FormControl(''), 
      payment_response_code: new FormControl(''),
      payment_response_message: new FormControl(''),
      payment_reference: new FormControl(''),
      payment_status: new FormControl(this.orderInfo?.payment_status),
      payment_voucher_code: new FormControl(''),
      credit_amount_paid: new FormControl('', [Validators.required]),
      phone_number: new FormControl(''),
      payment_card_type: new FormControl(''),    
      customer_name: new FormControl(''),    
      customer_phone_number: new FormControl(''),    
    })
  }
  selectPaymentMethod(paymentMethod, paymentNetwork, networkFullName) {
    this.paymentMethod = paymentMethod;
    this.paymentNetwork = paymentNetwork;
    this.networkName = networkFullName;
    this.payment_method.setValue(this.paymentMethod);
    this.phone_number.clearValidators();
    this.payment_voucher_code.clearValidators();
    if (paymentMethod === PaymentMethodsEnum.MOMO) {
      // this.payment_network.setValue(this.paymentNetwork);
      this.phone_number.setValidators([Validators.required]);
      this.payment_network.setValidators([Validators.required]);
    } 
    else if( paymentMethod === PaymentMethodsEnum.PAYMENT_LINK || paymentMethod === PaymentMethodsEnum.MOMO ) {
      if(this.orderInfo.customer !== null && this.orderInfo.customer !== undefined) {
        this.customer_name.setValue( this.orderInfo.customer?.name);
        this.customer_phone_number.setValue( this.orderInfo.customer?.phone_number);
      }
    }
  }
  payCredit(data){
    data.frontend_payment_date = (data.frontend_payment_date !== null && data.frontend_payment_date !== '' && data.frontend_payment_date !== undefined) ? moment(data.frontend_payment_date).format(this.constantValues.RECURRING_DATE_TIME_FORMAT) : '';
    console.log(data)
    this.customerApiCallService.payCredit(data, (error, result) =>{
      // console.log(result)
      if(result != null && result.status == 'success'){
        this.notificationService.snackBarMessage('Credit amount paid submited successfully');
        this.dialogRef.close(true)
      }
    })

  }
  onClose(){
    this.dialogRef.close(true)
  }
  get shop_id() {return this.formGroup.get('shop_id') }
  get payment_method() {return this.formGroup.get('payment_method') }
  get customer_phone_number() {return this.formGroup.get('customer_phone_number') }
  get customer_name() {return this.formGroup.get('customer_name') }
  get payment_network() {return this.formGroup.get('payment_network') }
  get credit_amount_paid() {return this.formGroup.get('payment_method') }
  get phone_number() {return this.formGroup.get('payment_method') }
  get payment_voucher_code() {return this.formGroup.get('payment_method') }
  get frontend_payment_date() {return this.formGroup.get('frontend_payment_date') }
}