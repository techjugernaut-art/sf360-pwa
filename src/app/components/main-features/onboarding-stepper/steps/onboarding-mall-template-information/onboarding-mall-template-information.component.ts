import { NotificationsService } from './../../../../../services/notifications.service';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { ConstantVariables } from 'src/app/utils/enums.util';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { OnlineAddressStatusEnums, MallTemplatesEnums } from 'src/app/utils/enums';

@Component({
  selector: 'app-onboarding-mall-template-information',
  templateUrl: './onboarding-mall-template-information.component.html',
  styleUrls: ['./onboarding-mall-template-information.component.scss']
})
export class OnboardingMallTemplateInformationComponent implements OnInit {
  isProcessing = false;
  isValid = false;
  onlineAddressStatus: OnlineAddressStatusEnums;
  storefrontMallDomain = '';
  formGroup: FormGroup;
  constructor(
    private shopsService: ShopsService,
    private router: Router,
    private notificationsService: NotificationsService,
    private constantValue: ConstantValuesService) { }

  ngOnInit() {
    // tslint:disable-next-line: max-line-length
    const sfName = (localStorage.getItem(ConstantVariables.SHOP_NAME) !== null && localStorage.getItem(ConstantVariables.SHOP_NAME) !== undefined) ? (localStorage.getItem(ConstantVariables.SHOP_NAME) as string) : '';
    this.storefrontMallDomain = this.constantValue.STOREFRONT_MALL_URL;
    this.formGroup = new FormGroup({
      storefrontmall_name: new FormControl('', [Validators.required, Validators.pattern(RegExp(/^[\w\s]+$/))]),
      self_managed_delivery: new FormControl(false),
      shop_id: new FormControl(localStorage.getItem(ConstantVariables.SHOP_ID)),
      template_name: new FormControl(MallTemplatesEnums.DEFAULT),
      mall_short_name: new FormControl(''),
      has_slider: new FormControl(false)
    });
    this.storefrontmall_name.setValue(sfName.toLowerCase().replace(/\s+/g, ''));
    // this.onValidateStoreFrontName();
  }
  onSubmit(data) {
    this.isProcessing = true;
    if (this.storefrontmall_name.value !== '' && this.storefrontmall_name.value !== null) {
      data.shop_id = localStorage.getItem(ConstantVariables.SHOP_ID);
      data.template_name = MallTemplatesEnums.DEFAULT;
      this.isProcessing = true;
      this.shopsService.validateStoreFrontMallName({ storefrontmall_name: this.storefrontmall_name.value }, (_error, _result) => {
        this.isProcessing = false;
        if (_result !== null && _result.response_code === '100') {
          this.onlineAddressStatus = OnlineAddressStatusEnums.EXISTS;
          this.notificationsService.snackBarMessage('This storefront online address already exists. Kindly try another name');
        }
        if (_error !== null && _error.response_code === '101') {
          this.isProcessing = true;
          this.isValid = true;
          this.onlineAddressStatus = OnlineAddressStatusEnums.VALID;
          // tslint:disable-next-line: max-line-length
          this.shopsService.createStoreFrontMallName(data,
            (error, result) => {
              this.isProcessing = false;
              if (result !== null && result.response_code === '100') {
                localStorage.setItem(ConstantVariables.ONLINE_STORE_ADDRESS, data);
                this.router.navigate(['/onboarding/subscription-payment'], { queryParams: { step: 5 } });
              }
            });
        }
      });
    }

  }
  onValidateStoreFrontName() {
    if (this.storefrontmall_name.value !== '' && this.storefrontmall_name.value !== null) {
      this.isProcessing = true;

    }
  }
  onSkip() {
    this.router.navigate(['/onboarding/subscription-payment'], { queryParams: { step: 5 } });
  }
  get storefrontmall_name() { return this.formGroup.get('storefrontmall_name'); }
  get self_managed_delivery() { return this.formGroup.get('self_managed_delivery'); }
  get mall_short_name() { return this.formGroup.get('mall_short_name'); }
  get has_slider() { return this.formGroup.get('has_slider'); }
}
