import { CurrenciesMap } from './../../../../utils/const-values.utils';
import { CustomerApiCallsService } from 'src/app/services/network-calls/customer-api-calls.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { PaymentRequestTypesEnums } from 'src/app/utils/enums';
import { CurrencyEnums, PaymentMethods } from 'src/app/utils/enums.util';
import { ConfirmPremiumPaymentComponent } from '../confirm-premium-payment/confirm-premium-payment.component';

@Component({
  selector: 'app-payments-dialog',
  templateUrl: './payments-dialog.component.html',
  styleUrls: ['./payments-dialog.component.scss']
})
export class PaymentsDialogComponent implements OnInit {

  modalTitle = 'Make payments';
  formGroup: FormGroup;
  countryCode = '';
  paymentMethod = '';
  paymentNetwork = '';
  networkName = '';
  redirectUrl = '';
  discountPercentage = 0;
  discountAmount = 0;
  premiumPlanAmount = 0;
  isProcessing = false;
  isProcessingDiscountCheck: boolean;
  isProcessingShops: boolean;
  currency = '';
  shopCurrency = '';
  premiumPlan;
  shopInfo;
  currencies = CurrencyEnums;
  platformEnum = PaymentRequestTypesEnums;
  smsPackage: any;
  exchangeRateAmt = 0;
  exchangeRateDiscountAmt = 0;
  fxRate = 0;
  constructor(
    private shopsService: ShopsService,
    private customerApiService: CustomerApiCallsService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<PaymentsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      shop_id: new FormControl(''),
      payment_method: new FormControl(''),
      discount_code: new FormControl(''),
      sms_plan_id: new FormControl(''),
      premium_plan_id: new FormControl('')
    });
    this.discount_code.valueChanges.pipe(debounceTime(1000),
      distinctUntilChanged()).subscribe(code => {
      if (code !== '' && code !== null) {
        this.checkDiscount(code);
      }
    });
    if (this.data !== null && this.data !== undefined) {
      this.shopInfo = this.data.shop;
      this.currency = this.shopInfo.currency;
      this.shopCurrency = this.shopInfo.currency;
      this.shop_id.setValue(this.shopInfo.id);

      if (this.data.premium_plan !== null && this.data.premium_plan !== undefined) {
        this.premiumPlan = this.data.premium_plan;
        this.premium_plan_id.setValue(this.premiumPlan.id);
        this.premiumPlanAmount = +this.premiumPlan.amount_to_show_on_app;
        this.modalTitle = this.premiumPlan.name;
        this.currency =this.premiumPlan.currency;
      } else if (this.data.sms_package !== null && this.data.sms_package !== undefined) {
        this.smsPackage = this.data.sms_package;
        this.sms_plan_id.setValue(this.smsPackage.id);
        this.premiumPlanAmount = +this.smsPackage.amount;
        this.modalTitle = this.smsPackage.name;
      }
    }
    this.getExchangeRate();
  }
  selectPaymentMethod(paymentMethod, paymentNetwork, networkFullName) {
    this.paymentMethod = paymentMethod;
    this.paymentNetwork = paymentNetwork;
    this.networkName = networkFullName;
    this.payment_method.setValue(paymentMethod);
  }
  showPaymentPrompt(data) {
    if (this.paymentMethod === PaymentMethods.PAGA) {
      // this.redirectUrl = '';
      this.isProcessing = true;
        this.dialog.open(ConfirmPremiumPaymentComponent,
          // tslint:disable-next-line: max-line-length
          { data: { payment_method: this.paymentMethod, subscription_data: this.premiumPlan, sms_package: this.smsPackage, shop_data: this.shopInfo }, disableClose: true })
          .afterClosed().subscribe((isSuccess: boolean) => {
            if (isSuccess) {
              this.dialogRef.close(true);
            }
          });


        // this.customerApiService.purchaseSMSCredit(data, (error, result) => {
        //   this.isProcessing = false;
        //   if (result !== null && result.response_code === '200') {
        //     this.redirectUrl = result.redirect_url;
        //   }
        // });




    } else if (this.paymentMethod === PaymentMethods.CARD) {
      this.redirectUrl = '';
      this.isProcessing = true;
      if (this.smsPackage !== null && this.smsPackage !== undefined) {
        this.customerApiService.purchaseSMSCredit(data, (error, result) => {
          this.isProcessing = false;
          if (result !== null && result.response_code === '200') {
            this.redirectUrl = result.redirect_url;
          }
        });
      } else {
        this.shopsService.payPremium(data, (error, result) => {
          this.isProcessing = false;
          if (result !== null && result.response_code === '200') {
            this.redirectUrl = result.redirect_url;
          }
        });
      }
    } else {
      this.dialog.open(ConfirmPremiumPaymentComponent,
        // tslint:disable-next-line: max-line-length
        { data: { payment_method: this.paymentMethod, payment_network: this.paymentNetwork, network_name: this.networkName, discount_code: this.discount_code.value, shop_id: this.shop_id.value, premium_plan_id: this.premium_plan_id.value, subscription_data: data, sms_plan_id: this.sms_plan_id.value, sms_package: this.smsPackage }, disableClose: true })
        .afterClosed().subscribe((isSuccess: boolean) => {
          if (isSuccess) {
            this.dialogRef.close(true);
          }
        });
    }
  }

  checkDiscount(discountCode) {
    this.isProcessingDiscountCheck = true;
    this.shopsService.checkDiscount({ discount_code: discountCode }, (error, result) => {
      this.isProcessingDiscountCheck = false;
      if (result !== null && result.response_code === '100') {
        this.discountPercentage = (+result.discount_percentage / 100);
        this.exchangeRateDiscountAmt = (this.discountPercentage * this.premiumPlanAmount) * this.fxRate;
        this.exchangeRateAmt = (this.premiumPlanAmount - (this.discountPercentage * this.premiumPlanAmount)) * this.fxRate;
      }
    });
  }
  getExchangeRate() {
    this.shopsService.getExchangeRate((error, result) =>{
      if (result !== null && result !== undefined && result.response_code === '100') {
        const exchangeRates = result.results || {};
        const cur = CurrenciesMap[this.shopCurrency];
        const fxRate = exchangeRates[cur];
        this.fxRate = fxRate || 0;
        this.exchangeRateAmt = (this.premiumPlanAmount - (this.discountPercentage * this.premiumPlanAmount)) * this.fxRate;
        this.exchangeRateDiscountAmt = (this.discountPercentage * this.premiumPlanAmount) * this.fxRate;
        // console.log('hello', this.exchangeRateDiscountAmt);
      }
    });
  }
  get shop_id() { return this.formGroup.get('shop_id'); }
  get payment_method() { return this.formGroup.get('payment_method'); }
  get discount_code() { return this.formGroup.get('discount_code'); }
  get premium_plan_id() { return this.formGroup.get('premium_plan_id'); }
  get sms_plan_id() { return this.formGroup.get('sms_plan_id'); }
}
