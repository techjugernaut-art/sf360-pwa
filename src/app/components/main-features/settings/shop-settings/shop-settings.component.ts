import { SharedDataApiCallsService } from 'src/app/services/network-calls/shared-data-api-calls.service';
import { NotificationsService } from './../../../../services/notifications.service';
import { IDashboardFilterParams } from './../../../../interfaces/dashboard-overview-filter.interface';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { MapsAPILoader } from '@agm/core';
import { ChangeShopLogoDialogComponent } from '../change-shop-logo-dialog/change-shop-logo-dialog.component';

@Component({
  selector: 'app-shop-settings',
  templateUrl: './shop-settings.component.html',
  styleUrls: ['./shop-settings.component.scss']
})
export class ShopSettingsComponent implements OnInit {
  pageHeaderOptions: IPageHeader;
  isProcessing = false;
  requestPayload = {};
  storeId: string;
  formGroup: FormGroup;
  shopLocationFormGroup: FormGroup;
  shopInfo;
  allIndustries = [];
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;

  @ViewChild('location', { static: false })
  public searchElementRef: ElementRef;
  isProcessingImageUpload: boolean;
  imageUrl: any;
  constructor(
    private title: Title,
    private shopsService: ShopsService,
    private dialog: MatDialog,
    private notificationsService: NotificationsService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private sharedDataServiceApi: SharedDataApiCallsService,
    private constantValues: ConstantValuesService) { }

  ngOnInit() {
    this.title.setTitle(this.constantValues.APP_NAME + ' | Shop Settings');
    // tslint:disable-next-line:max-line-length
    this.pageHeaderOptions = { pageTitle: 'Shop Settings', hasShopsFilter: true, ignoreFilterByAllShops: true };

    this.formGroup = new FormGroup({
      shop_id: new FormControl(''),
      business_name: new FormControl('', [Validators.required]),
      business_registration_number: new FormControl(''),
      business_type: new FormControl(''),
      administration_name: new FormControl('', [Validators.required]),
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
      template_name: new FormControl('')
    });
    this.shopLocationFormGroup = new FormGroup({
      shop_id: new FormControl(''),
      location: new FormControl('', [Validators.required]),
      latitude: new FormControl('', [Validators.required]),
      longitude: new FormControl('', [Validators.required])
    });
    this.getIndustries();
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
        this.notificationsService.snackBarMessage('Shop successfully updated');
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

  /**
   * Get all industries
   */
  getIndustries() {
    this.isProcessing = true;
    this.shopsService.getIndustries((error, result) => {
      this.isProcessing = false;
      if (result !== null) {
        this.allIndustries = result;
      }
    });
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
    this.imageUrl = this.shopInfo.logo;
    this.storefrontmall_name.setValue(this.shopInfo.storefrontmall_name);
    this.template_name.setValue(this.shopInfo.template_name);
    this.self_managed_delivery.setValue(this.shopInfo.self_managed_delivery);
  }
  /**
     * Upload user avatar or company logo
     * @param fileBrowser Image File to upload
     * @param source Source of upload request (profile/logo)
     */
  uploadImages(fileBrowser) {
    if (fileBrowser.files.length > 0) {
      const file: File = fileBrowser.files[0];
      const formData = new FormData();

      formData.append('image', file);
      this.isProcessingImageUpload = true;
      this.sharedDataServiceApi.uploadImage(formData, (error, result) => {
        this.isProcessingImageUpload = false;
        if (result !== null) {
          this.imageUrl = result.image_url;
          this.logo.setValue(result.image_url);
        }
      });

    }
  }
  changeLogo() {
    this.dialog.open(ChangeShopLogoDialogComponent, { data: { shop: this.shopInfo } }).afterClosed().subscribe(shop => {
      if (shop !== null && shop !== undefined) {
        this.shopInfo = shop;
        this.logo.setValue(this.shopInfo.logo);
        this.imageUrl = this.shopInfo.logo;
      }
    });
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

  get longitude_ctrl() { return this.shopLocationFormGroup.get('longitude'); }
  get latitude_ctrl() { return this.shopLocationFormGroup.get('latitude'); }
  get location() { return this.shopLocationFormGroup.get('location'); }


}
