import { CurrencyEnums } from 'src/app/utils/enums.util';
import { ShopEditingAction } from 'src/app/utils/enums';
import { DynamicFormBase, TextboxControl, DropdownControl, ToggleControl } from 'src/app/models/dynamic-form-base';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-shop-data-update-dilaog',
  templateUrl: './shop-data-update-dilaog.component.html',
  styleUrls: ['./shop-data-update-dilaog.component.scss']
})
export class ShopDataUpdateDilaogComponent implements OnInit {
  formGroup: FormGroup;
  isProcessing = false;
  shopInfo;
  imageUrl = '';
  editStockModalTitle = 'Edit Shop Settings';
  edithSHopControls: DynamicFormBase<any>[];
  editAction: ShopEditingAction;
  constructor(
    private notificationsService: NotificationsService,
    private dialogRef: MatDialogRef<ShopDataUpdateDilaogComponent>,
    private shopsService: ShopsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
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
      delivery_days: new FormControl(''),
      partner_code: new FormControl(''),
      allow_global_delivery: new FormControl(false),
      self_managed_delivery: new FormControl(false),
      template_name: new FormControl('')
    });
    if (this.data !== null && this.data !== undefined) {
      this.shopInfo = this.data.shop;
      this.shop_id.setValue(this.shopInfo.id);
      this.editAction = this.data.action;
      this.prepopulateControls();
      this.edithSHopControls = this.getShopControl();
    }
  }


/**
   * Get shop information by a particular shop id
   * @param data payload to submit to server
   */
  onSubmit(data) {
    data.shop_id = this.shopInfo.id;
    this.isProcessing = true;
    this.shopsService.editShop(data, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.status === 'success') {
        this.notificationsService.snackBarMessage('Shop successfully updated');
        this.dialogRef.close(result.results);
      }

    });
  }
  getShopControl() {
    let controls: DynamicFormBase<any>[] = [];
    if (this.editAction === ShopEditingAction.partner_code) {
      this.editStockModalTitle = 'Connect to a Partner';
      controls = [
        new TextboxControl({
          key: 'partner_code',
          label: 'Partner Code',
          value: this.shopInfo.partner_code,
          required: false,
          order: 1
        }),
      ];
    } else if (this.editAction === ShopEditingAction.currency) {
      this.editStockModalTitle = 'Update Currency to accept';
      controls = [
        new DropdownControl({
          key: 'currency',
          label: 'Currency',
          value: this.shopInfo.currency,
          required: true,
          order: 1,
          options: [
            {key: CurrencyEnums.GHS, value: CurrencyEnums.GHS},
            {key: CurrencyEnums.NGN, value: CurrencyEnums.NGN},
            {key: CurrencyEnums.USD, value: CurrencyEnums.USD}
          ]
        }),
      ];
    } else if (this.editAction === ShopEditingAction.allow_global_delivery) {
      this.editStockModalTitle = 'Allow Global Delivery';
      controls = [
        new ToggleControl({
          key: 'allow_global_delivery',
          label: 'Allow Global Delivery',
          value: this.shopInfo.allow_global_delivery,
          required: false,
          order: 1
        }),
      ];
    }
    return controls;
  }


  onClose() {
    this.dialogRef.close(null);
  }

  prepopulateControls() {
    this.business_name.setValue(this.shopInfo.business_name);
    this.business_type.setValue(this.shopInfo.business_type);
    this.business_registration_number.setValue(this.shopInfo.business_registration_number);
    this.administration_name.setValue(this.shopInfo.administration_name);
    this.tax_number.setValue(this.shopInfo.tax_number);
    this.minimum_stock_threshold.setValue(this.shopInfo.minimum_stock_threshold);
    this.referral_code.setValue(this.shopInfo.referral_code);
    this.return_policy_days.setValue(this.shopInfo.return_policy_days);
    this.currency.setValue(this.shopInfo.currency);
    this.logo.setValue(this.shopInfo.logo);
    this.imageUrl = this.shopInfo.logo;
    this.storefrontmall_name.setValue(this.shopInfo.storefrontmall_name);
    this.template_name.setValue(this.shopInfo.template_name);
    this.self_managed_delivery.setValue(this.shopInfo.self_managed_delivery);
    this.allow_global_delivery.setValue(this.shopInfo.allow_global_delivery);
    this.delivery_days.setValue(this.shopInfo.delivery_days);
    this.partner_code.setValue(this.shopInfo.partner_code);
    this.shop_id.setValue(this.shopInfo.shop_id);
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
  get allow_global_delivery() { return this.formGroup.get('allow_global_delivery'); }
  get partner_code() { return this.formGroup.get('partner_code'); }
  get delivery_days() { return this.formGroup.get('delivery_days'); }
  get shop_id() { return this.formGroup.get('shop_id'); }

}
