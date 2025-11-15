import { CurrencyEnums } from './../../../utils/enums.util';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { SharedDataApiCallsService } from 'src/app/services/network-calls/shared-data-api-calls.service';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { MatDialog } from '@angular/material/dialog';
import { PaymentMethods, ConstantVariables } from 'src/app/utils/enums.util';
import { ConfirmPremiumPaymentComponent } from '../../main-features/premium-payments/confirm-premium-payment/confirm-premium-payment.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PaymentRequestTypesEnums } from 'src/app/utils/enums';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pay-premium',
  templateUrl: './pay-premium.component.html',
  styleUrls: ['./pay-premium.component.scss']
})
export class PayPremiumComponent implements OnInit {


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
  isValidDiscount:Boolean;
  myShops = [];
  premiumPlans = [];
  mallPremiumPlans = [];
  isProcessingDiscountCheck: boolean;
  isProcessingShops: boolean;
  currency = '';
  currencies = CurrencyEnums;
  dispayCurrency = '';
  platformEnum = PaymentRequestTypesEnums;
  storePlatformFormControl = new FormControl(this.platformEnum.ONLINE_STORE);
  constructor(
    private sharedDataApiCallsService: SharedDataApiCallsService,
    private shopsService: ShopsService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      shop_id: new FormControl('', [Validators.required]),
      payment_method: new FormControl(''),
      discount_code: new FormControl(''),
      premium_plan_id: new FormControl('', [Validators.required]),
      platform: new FormControl(this.platformEnum.ONLINE_STORE, [Validators.required])
    });
    this.discount_code.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(code => {
      if (code !== '' && code !== null) {
        this.checkDiscount(code);
      }
    });
    this.getMyShops();
    this.getMallPremiumPlans();
    this.shop_id.valueChanges.subscribe(id => {
      this.currency = this.myShops.find(data => +data.id === +id).currency;
    });
    this.premium_plan_id.valueChanges.subscribe(id => {
      const plan = this.premiumPlans.find(data => +data.id === +id);
      this.premiumPlanAmount = plan?.amount_to_show_on_app;
      this.dispayCurrency = plan?.currency;
    });
    this.platform.valueChanges.subscribe(value => {
      if (value === PaymentRequestTypesEnums.ONLINE_STORE) {
        this.getMallPremiumPlans();
      } else if (value === PaymentRequestTypesEnums.PHYSICAL_STORE) {
        this.getPremiumPlans();
      }
    });
  }
  selectPaymentMethod(paymentMethod, paymentNetwork, networkFullName) {
    this.paymentMethod = paymentMethod;
    this.paymentNetwork = paymentNetwork;
    this.networkName = networkFullName;
    this.payment_method.setValue(paymentMethod);
  }
  showPaymentPrompt(data) {
  if (this.paymentMethod === PaymentMethods.CARD) {
    this.redirectUrl = '';
    this.isProcessing = true;
    // tslint:disable-next-line: max-line-length
    this.shopsService.payPremium(data, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '200') {
        this.redirectUrl = result.redirect_url;
      }
    });
  } else {
    this.dialog.open(ConfirmPremiumPaymentComponent,
      // tslint:disable-next-line: max-line-length
      {data: { payment_method: this.paymentMethod, payment_network: this.paymentNetwork, network_name: this.networkName, referral_code: this.discount_code.value, shop_id: this.shop_id.value, premium_plan_id: this.premium_plan_id.value, subscription_data: data}, disableClose: true})
    .afterClosed().subscribe();
  }
  }

  checkDiscount(discountCode) {
    this.isProcessingDiscountCheck = true;
    this.shopsService.checkDiscount({discount_code: discountCode}, (error, result) => {
      this.isProcessingDiscountCheck = false;
      if (result !== null && result.response_code === '100') {
        this.discountPercentage = (+result.discount_percentage / 100);
        if(this.discountPercentage !== null && this.discountPercentage !== undefined){
           this.isValidDiscount = true;
        }
      }
    });
  }
  getMyShops() {
    this.isProcessingShops = true;
    this.shopsService.getMyShop({}, (error, result) => {
      this.isProcessingShops = false;
      if (result !== null && result.status === 'success') {
        this.myShops = result.results;
      }
    });
  }
  getPremiumPlans() {
    this.isProcessingShops = true;
    this.shopsService.getPremiumPlans((error, result) => {
      this.isProcessingShops = false;
      if (result !== null && result.response_code === '100') {
        this.premiumPlans = result.results;
      }
    });
  }
  getMallPremiumPlans() {
    this.isProcessingShops = true;
    this.shopsService.getMallPremiumPlans((error, result) => {
      this.isProcessingShops = false;
      if (result !== null && result.response_code === '100') {
        this.premiumPlans = result.results;
      }
    });
  }
  goToDashboard(data){
    this.shopsService.payPremium(data, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '200') {
        this.router.navigate(['/dashboard'])
      }
    });
  }

  get shop_id() {return this.formGroup.get('shop_id'); }
  get payment_method() {return this.formGroup.get('payment_method'); }
  get discount_code() {return this.formGroup.get('discount_code'); }
  get platform() {return this.formGroup.get('platform'); }
  get premium_plan_id() {return this.formGroup.get('premium_plan_id'); }
}
