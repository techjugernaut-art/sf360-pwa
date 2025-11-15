import { IframeDialogComponent } from './../../../../common/iframe-dialog/iframe-dialog.component';
import { ConstantVariables, CurrencyEnums } from 'src/app/utils/enums.util';
import { PaymentMethods } from './../../../../../utils/enums.util';
import { ConfirmPremiumPaymentComponent } from './../../../premium-payments/confirm-premium-payment/confirm-premium-payment.component';
import { MatDialog } from '@angular/material/dialog';
import { SharedDataApiCallsService } from './../../../../../services/network-calls/shared-data-api-calls.service';
import { FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { CongratulationComponent } from 'src/app/components/common/congratulation/congratulation.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-onboarding-payment-information',
  templateUrl: './onboarding-payment-information.component.html',
  styleUrls: ['./onboarding-payment-information.component.scss']
})
export class OnboardingPaymentInformationComponent implements OnInit {
  referral_code = new FormControl('');
  premium_plan_id = new FormControl('', [Validators.required]);
  countryCode = '';
  paymentMethod = '';
  paymentNetwork = '';
  networkName = '';
  redirectUrl = '';
  isProcessing = false;
  isProcessingDiscountCheck: boolean;
  discountPercentage = 0;
  discountAmount = 0;
  premiumPlanAmount = 0;
  currencies = CurrencyEnums;
  currency = '';
  premiumPlans = [];
  mallPremiumPlans = [];
  canVisitDashboad = false;

  constructor(
    private sharedDataApiCallsService: SharedDataApiCallsService,
    private shopsService: ShopsService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    // this.getAmountVal();
    this.getCurrentLocationInfo();
    this.currency = localStorage.getItem(ConstantVariables.SHOP_CURRENCY);
    this.referral_code.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(code => {
      if (code !== '' && code !== null) {
        this.checkDiscount(code);
      }
    });
    this.premium_plan_id.valueChanges.subscribe(id => {
      this.premiumPlanAmount = this.premiumPlans.find(data => +data.id === +id).amount_to_show_on_app;
    });
    this.getMallPremiumPlans();
  }

  getCurrentLocationInfo() {
    this.sharedDataApiCallsService.getCurrentLocationInfo((error, result) => {
      if (result !== null) {
        this.countryCode = result.country_code;
      }
    });
  }
  selectPaymentMethod(paymentMethod, paymentNetwork, networkFullName) {
    this.paymentMethod = paymentMethod;
    this.paymentNetwork = paymentNetwork;
    this.networkName = networkFullName;
  }
  showPaymentPrompt() {
  if (this.paymentMethod === PaymentMethods.CARD) {
    this.redirectUrl = '';
    this.isProcessing = true;
    // tslint:disable-next-line: max-line-length
    this.shopsService.payPremium({shop_id: localStorage.getItem(ConstantVariables.SHOP_ID), payment_method: this.paymentMethod, referral_code: this.referral_code.value, premium_plan_id: this.premium_plan_id.value},
    (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '200') {
        this.redirectUrl = result.redirect_url;
      }
    });
  } else {
    this.dialog.open(ConfirmPremiumPaymentComponent,
      // tslint:disable-next-line: max-line-length
      {data: { payment_method: this.paymentMethod, payment_network: this.paymentNetwork, network_name: this.networkName, referral_code: this.referral_code.value, shop_id: localStorage.getItem(ConstantVariables.SHOP_ID), premium_plan_id: this.premium_plan_id.value}})
    .afterClosed().subscribe();
  }
  }
  onSkip() {
    this.dialog.open(CongratulationComponent);
  }
  checkDiscount(discountCode) {
    this.isProcessingDiscountCheck = true;
    this.shopsService.checkDiscount({discount_code: discountCode}, (error, result) => {
      this.isProcessingDiscountCheck = false;
      if (result !== null && result.response_code === '100') {
        this.discountPercentage = (+result.discount_percentage / 100);
      }
    });
  }
  getAmountVal() {
    if (this.discountPercentage === 1) {
      return true;
    } else {
      return false
    }
  }
  getMallPremiumPlans() {
    this.isProcessing = true;
    this.shopsService.getMallPremiumPlans((error, result) => {
      console.log(result, 'MALL PREMIUM')
      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        this.premiumPlans = result.results;
      }
    });
  }
  goToDashboard(){
    this.isProcessing = true;
    this.paymentMethod = 'DISCOUNT_CODE';
    // tslint:disable-next-line: max-line-length
    this.shopsService.payPremium({shop_id: localStorage.getItem(ConstantVariables.SHOP_ID), payment_method: this.paymentMethod, referral_code: this.referral_code.value, premium_plan_id: this.premium_plan_id.value},
    (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '200') {
        this.router.navigate(['/dashboard'])
      }
    });

  }
}
