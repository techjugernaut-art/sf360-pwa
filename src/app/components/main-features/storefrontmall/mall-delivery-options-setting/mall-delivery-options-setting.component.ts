import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-mall-delivery-options-setting',
  templateUrl: './mall-delivery-options-setting.component.html',
  styleUrls: ['./mall-delivery-options-setting.component.scss']
})
export class MallDeliveryOptionsSettingComponent implements OnInit {

  pageHeaderOptions: IPageHeader;
  isProcessing = false;
  requestPayload = {};
  storeId: string;
  formGroup: FormGroup;
  deliveryOptionFormControl: FormControl = new FormControl(false);
  shopInfo;
  allIndustries = [];
  constructor(
    private shopsService: ShopsService,
    private notificationsService: NotificationsService,
  ) { }

  ngOnInit() {
    // tslint:disable-next-line:max-line-length
    this.pageHeaderOptions = { pageTitle: 'Delivery Options', hasShopsFilter: true, ignoreFilterByAllShops: true };

    this.formGroup = new FormGroup({
      shop_id: new FormControl(''),
      business_name: new FormControl(''),
      business_registration_number: new FormControl(''),
      business_type: new FormControl(''),
      administration_name: new FormControl(''),
      vat_number: new FormControl(''),
      tax_number: new FormControl(''),
      contact_number: new FormControl(''),
      minimum_stock_threshold: new FormControl(''),
      logo: new FormControl(''),
      return_policy_days: new FormControl(''),
      currency: new FormControl(''),
      referral_code: new FormControl(''),
      storefrontmall_name: new FormControl(''),
      self_managed_delivery: new FormControl(false),
      template_name: new FormControl(''),
      location: new FormControl(''),
      latitude: new FormControl(''),
      longitude: new FormControl('')
    });

  }
  /**
   * Update shared data
   * @param data ISharedData
   */
  onDataRefreshed(data: ISharedData) {
    if (data !== null && data !== undefined) {
      // tslint:disable-next-line:max-line-length
      this.requestPayload = { shop_id: data.shop_id };
      this.storeId = data.shop_id;
      this.getShopById(this.requestPayload as IDashboardFilterParams);
    }
  }
  /**
   * Get shop information by a particular shop id
   * @param data payload to submit to server
   */
  onSubmit(data) {
    data.shop_id = this.storeId;
    this.isProcessing = true;
    this.shopsService.editShop(data, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.status === 'success') {
        this.notificationsService.snackBarMessage('Delivery Option successfully updated');
      }

    });
  }
  /**
   * Get shop information by a particular shop id
   * @param filterParams filter param
   */
  getShopById(filterParams: IDashboardFilterParams) {
    this.isProcessing = true;
    this.shopsService.getMyShop(filterParams, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        this.shopInfo = result.results[0];
        this.prepopulateControls();
      }

    });
  }

  onChangeDeliveryOption(value) {
    this.self_managed_delivery.setValue(value);
    this.onSubmit(this.formGroup.value);
  }

  prepopulateControls() {
    this.business_name.setValue(this.shopInfo.business_name);
    this.location.setValue(this.shopInfo.location);
    this.business_type.setValue(this.shopInfo.business_type);
    this.business_registration_number.setValue(this.shopInfo.business_registration_number);
    this.administration_name.setValue(this.shopInfo.administration_name);
    this.tax_number.setValue(this.shopInfo.tax_number);
    this.minimum_stock_threshold.setValue(this.shopInfo.minimum_stock_threshold);
    this.referral_code.setValue(this.shopInfo.referral_code);
    this.return_policy_days.setValue(this.shopInfo.return_policy_days);
    this.currency.setValue(this.shopInfo.currency);
    this.logo.setValue(this.shopInfo.logo);

    this.storefrontmall_name.setValue(this.shopInfo.storefrontmall_name);
    this.template_name.setValue(this.shopInfo.template_name);
    this.self_managed_delivery.setValue(this.shopInfo.self_managed_delivery);
    this.deliveryOptionFormControl.setValue(this.shopInfo.self_managed_delivery);
  }


  get business_name() { return this.formGroup.get('business_name'); }
  get business_type() { return this.formGroup.get('business_type'); }
  get business_registration_number() { return this.formGroup.get('business_registration_number'); }
  get administration_name() { return this.formGroup.get('administration_name'); }
  get tax_number() { return this.formGroup.get('tax_number'); }
  get contact_number() { return this.formGroup.get('contact_number'); }
  get minimum_stock_threshold() { return this.formGroup.get('minimum_stock_threshold'); }
  get logo() { return this.formGroup.get('logo'); }
  get referral_code() { return this.formGroup.get('referral_code'); }
  get return_policy_days() { return this.formGroup.get('return_policy_days'); }
  get currency() { return this.formGroup.get('currency'); }

  get storefrontmall_name() { return this.formGroup.get('storefrontmall_name'); }
  get template_name() { return this.formGroup.get('template_name'); }
  get self_managed_delivery() { return this.formGroup.get('self_managed_delivery'); }

  get longitude_ctrl() { return this.formGroup.get('longitude'); }
  get latitude_ctrl() { return this.formGroup.get('latitude'); }
  get location() { return this.formGroup.get('location'); }

}
