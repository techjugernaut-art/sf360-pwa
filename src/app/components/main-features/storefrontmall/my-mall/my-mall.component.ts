import { ChangeShopLogoDialogComponent } from './../../settings/change-shop-logo-dialog/change-shop-logo-dialog.component';
import { AddMallBannerDialogComponent } from './../add-mall-banner-dialog/add-mall-banner-dialog.component';
import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { OnlineAddressStatusEnums, MallTemplatesEnums } from 'src/app/utils/enums';
import { MapsAPILoader } from '@agm/core';
import { AppUtilsService } from 'src/app/services/app-utils.service';
declare const swal;

@Component({
  selector: 'app-my-mall',
  templateUrl: './my-mall.component.html',
  styleUrls: ['./my-mall.component.scss']
})
export class MyMallComponent implements OnInit {

  pageHeaderOptions: IPageHeader;
  isProcessing = false;
  requestPayload = {};
  storeId: string;
  formGroup: FormGroup;
  shopLocationFormGroup: FormGroup;
  shopInfo;
  allIndustries = [];
  isValid = false;
  storefrontMallDomain = '';
  currentSubDomain = '';
  protocol = '';
  onlineAddressStatus: OnlineAddressStatusEnums;
  sliders = [];
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;
  position;

  @ViewChild('location', { static: false })
  public searchElementRef: ElementRef;

  constructor(
    private shopsService: ShopsService,
    private dialog: MatDialog,
    private notificationsService: NotificationsService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private constantValues: ConstantValuesService,
    private appUtilsService: AppUtilsService) { }

  ngOnInit() {
    this.appUtilsService.getPosition().then(pos=>{
      this.position = pos;
    });

    // tslint:disable-next-line:max-line-length
    this.pageHeaderOptions = { pageTitle: 'Online Shop Settings', hasShopsFilter: true, ignoreFilterByAllShops: true };
    this.storefrontMallDomain = this.constantValues.STOREFRONT_MALL_URL;
    this.protocol = this.constantValues.STOREFRONT_MALL_URL_PROTOCOL;
    this.formGroup = new FormGroup({
      shop_id: new FormControl(''),
      storefrontmall_name: new FormControl('', [Validators.required, Validators.pattern(RegExp(/^[\w\s]+$/))]),
      template_name: new FormControl(MallTemplatesEnums.DEFAULT),
      self_managed_delivery: new FormControl(false),
      business_name: new FormControl(''),
      location: new FormControl(''),
      business_registration_number: new FormControl(''),
      business_type: new FormControl(''),
      administration_name: new FormControl(''),
      vat_number: new FormControl(''),
      tax_number: new FormControl(''),
      contact_number: new FormControl(''),
      minimum_stock_threshold: new FormControl(''),
      logo: new FormControl(''),
      return_policy_days: new FormControl(''),
      referral_code: new FormControl(''),
      mall_short_name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]),
      has_slider: new FormControl(false)
    });
    this.shopLocationFormGroup = new FormGroup({
      shop_id: new FormControl(''),
      location: new FormControl('', [Validators.required]),
      latitude: new FormControl('', [Validators.required]),
      longitude: new FormControl('', [Validators.required])
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
      this.getAllSliders(this.storeId);
    }
  }
  /**
   * Get shop information by a particular shop id
   * @param data payload to submit to server
   */
  onSubmit(data) {
    data.shop_id = this.storeId;
    data.template_name = MallTemplatesEnums.DEFAULT;
    this.isProcessing = true;
    this.shopsService.editShop(data, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.status === 'success') {
        this.currentSubDomain = data.storefrontmall_name;
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
  onValidateStoreFrontName() {
    if (this.storefrontmall_name.value !== '' && this.storefrontmall_name.value !== null) {
      this.isProcessing = true;
      this.shopsService.validateStoreFrontMallName({ storefrontmall_name: this.storefrontmall_name.value }, (error, result) => {
        this.isProcessing = false;
        if (result !== null && result.response_code === '100') {
          this.onlineAddressStatus = OnlineAddressStatusEnums.EXISTS;
        }
        if (error !== null && error.response_code === '101') {
          this.isValid = true;
          this.onlineAddressStatus = OnlineAddressStatusEnums.VALID;
        }
      });
    }
  }
  prepopulateControls() {
    this.storefrontmall_name.setValue(this.shopInfo.storefrontmall_name);
    this.template_name.setValue(this.shopInfo.template_name);
    this.self_managed_delivery.setValue(this.shopInfo.self_managed_delivery);

    this.business_name.setValue(this.shopInfo.business_name);
    this.location_shop.setValue(this.shopInfo.location);
    this.business_type.setValue(this.shopInfo.business_type);
    this.business_registration_number.setValue(this.shopInfo.business_registration_number);
    this.administration_name.setValue(this.shopInfo.administration_name);
    this.tax_number.setValue(this.shopInfo.tax_number);
    this.minimum_stock_threshold.setValue(this.shopInfo.minimum_stock_threshold);
    this.referral_code.setValue(this.shopInfo.referral_code);
    this.return_policy_days.setValue(this.shopInfo.return_policy_days);
    this.logo.setValue(this.shopInfo.logo);
    this.mall_short_name.setValue(this.shopInfo.mall_short_name);
    this.has_slider.setValue(this.shopInfo.has_slider);

    this.currentSubDomain = this.shopInfo.storefrontmall_name;
    // this.currency.setValue(this.shopInfo.currency);


    if (this.shopInfo.latitude !== null && this.shopInfo.latitude !== '' && this.shopInfo.longitude !== null && this.shopInfo.longitude !== '') {
      // this.setupMa();

      this.mapsAPILoader.load().then(() => {
        const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
        autocomplete.addListener('place_changed', () => {
          this.ngZone.run(() => {
            // get the place result
            const place: google.maps.places.PlaceResult = autocomplete.getPlace();

            // verify result
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }

            // set latitude, longitude and zoom
            this.latitude = place.geometry.location.lat();
            this.longitude = place.geometry.location.lng();
            this.zoom = 15;
            this.latitude_ctrl.setValue(this.latitude);
            this.longitude_ctrl.setValue(this.longitude);
          });
        });
        this.latitude = +this.shopInfo.latitude;
        this.longitude = +this.shopInfo.longitude;
        this.zoom = 15;
        // tslint:disable-next-line: new-parens
        this.geoCoder = new google.maps.Geocoder;
        this.getAddress(+this.shopInfo.latitude, +this.shopInfo.longitude);
      });

    } else {
      this.setupMap();
    }
  }
  getAllSliders(storeId) {
    this.isProcessing = true;
    this.shopsService.getAllSliders(this.storeId, (error, result) => {
      this.isProcessing = false;
      if (result !== null) {
        this.sliders = result.results;
      }
    });
  }
  addBanner() {
    this.dialog.open(AddMallBannerDialogComponent, { data: { shop_id: this.storeId, banner: null}})
    .afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.getAllSliders(this.storeId);
      }
    });
  }
  deleteBanner(banner) {
    const self = this;
    swal({
      title: 'Are you sure?',
      text: 'This action will delete this banner',
      type: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      closeOnConfirm: false,
      showLoaderOnConfirm: true,
      html: true
    }, function (inputValue) {
      if (inputValue) {
        self.shopsService.deleteSlider({shop_id: self.storeId, slider_id: banner.id}, (error, result) => {
          if (result !== null) {
            swal('Delete Banner', 'Banner successfully deleted', 'success');
            self.getAllSliders(self.storeId);
          }
          if (error !== null) {
            swal('Delete Banner', error.detail, 'error');
          }
        });
      }
    });
  }
  onEditBanner(banner) {
    this.dialog.open(AddMallBannerDialogComponent, { data: { shop_id: this.storeId, banner: banner}})
    .afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.getAllSliders(this.storeId);
      }
    });
  }



  private setupMap() {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      // tslint:disable-next-line: new-parens
      this.geoCoder = new google.maps.Geocoder;

      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 15;
          this.address = this.searchElementRef.nativeElement.value;
          this.location.setValue(this.address);
          this.latitude_ctrl.setValue(this.latitude);
          this.longitude_ctrl.setValue(this.longitude);
        });
      });
    });
  }

   /**
   * Set current locaiton on map. This only happens when user allows location access in browser
   */
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 15;
        this.getAddress(position.coords.latitude, position.coords.longitude);
      });
    }
  }
  /**
   * On Map Marker dragged
   * @param $event marker drag end event data
   */
  markerDragEnd($event) {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }

  /**
 * Get road name (address) of a location by latitude and longitude
 * @param latitude latitude
 * @param longitude longitude
 */
  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
          this.location.setValue(this.address);
          this.latitude_ctrl.setValue(this.latitude);
          this.longitude_ctrl.setValue(this.longitude);
        } else {
          this.location.setValue('Unnamed Road');
          this.latitude_ctrl.setValue(this.latitude);
          this.longitude_ctrl.setValue(this.longitude);
        }
      } else {
        this.location.setValue('Unnamed Road');
        this.latitude_ctrl.setValue(this.latitude);
        this.longitude_ctrl.setValue(this.longitude);
      }

    });
  }
  /**
   * Update shop's location data
   * @param data location data
   */
  onUpdateShopLocaton(data) {
    if (this.shopLocationFormGroup.valid) {
      data.shop_id = this.storeId;
      this.isProcessing = true;
      this.shopsService.updateShopLocation(data, (error, result) => {
        this.isProcessing = false;
        if (result !== null && result.response_code === '100') {
          this.notificationsService.snackBarMessage('Shop Location successfully updated');
        }
      });
    }
  }


changeLogo() {
  this.dialog.open(ChangeShopLogoDialogComponent, {data: {shop: this.shopInfo}}).afterClosed().subscribe(shop => {
    if (shop !== null && shop !== undefined) {
      this.shopInfo = shop;
    }
  });
}


  get storefrontmall_name() { return this.formGroup.get('storefrontmall_name'); }
  get template_name() { return this.formGroup.get('template_name'); }
  get self_managed_delivery() { return this.formGroup.get('self_managed_delivery'); }

  get business_name() { return this.formGroup.get('business_name'); }
  get location_shop() { return this.formGroup.get('location'); }
  get business_type() { return this.formGroup.get('business_type'); }
  get business_registration_number() { return this.formGroup.get('business_registration_number'); }
  get administration_name() { return this.formGroup.get('administration_name'); }
  get tax_number() { return this.formGroup.get('tax_number'); }
  get contact_number() { return this.formGroup.get('contact_number'); }
  get minimum_stock_threshold() { return this.formGroup.get('minimum_stock_threshold'); }
  get logo() { return this.formGroup.get('logo'); }
  get referral_code() { return this.formGroup.get('referral_code'); }
  get return_policy_days() { return this.formGroup.get('return_policy_days'); }
  get mall_short_name() { return this.formGroup.get('mall_short_name'); }
  get has_slider() { return this.formGroup.get('has_slider'); }
  // get currency() { return this.formGroup.get('currency'); }


  get longitude_ctrl() { return this.shopLocationFormGroup.get('longitude'); }
  get latitude_ctrl() { return this.shopLocationFormGroup.get('latitude'); }
  get location() { return this.shopLocationFormGroup.get('location'); }
}
