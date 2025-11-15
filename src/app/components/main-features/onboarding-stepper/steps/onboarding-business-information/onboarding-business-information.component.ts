import { AppUtilsService } from 'src/app/services/app-utils.service';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { Router } from '@angular/router';
import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConstantVariables } from 'src/app/utils/enums.util';
import { MapsAPILoader } from '@agm/core';
import { MatDialog } from '@angular/material/dialog';
import { OnboardingCongratulationComponent } from '../onboarding-congratulation/onboarding-congratulation.component';

@Component({
  selector: 'app-onboarding-business-information',
  templateUrl: './onboarding-business-information.component.html'
})
export class OnboardingBusinessInformationComponent implements OnInit {
  formGroup: FormGroup;
  hide = true;
  hideConfirmPIN = true;
  isProcessing = false;
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;

  @ViewChild('location', {static: false})
  public searchElementRef: ElementRef;
  position: any;
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private shopsService: ShopsService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
  ) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      business_name: new FormControl('', [Validators.required]),
      location: new FormControl('',),
      business_registration_number: new FormControl(''),
      business_type: new FormControl(localStorage.getItem(ConstantVariables.INDUSTRY_TEXT)),
      administration_name: new FormControl(''),
      vat_number: new FormControl(''),
      tax_number: new FormControl(''),
      referral_code: new FormControl(''),
      latitude: new FormControl(''),
      longitude: new FormControl('')
    });

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
          this.zoom = 12;
          this.address = this.searchElementRef.nativeElement.value;
          this.location.setValue(this.address);
          this.latitude_ctrl.setValue(this.latitude);
          this.longitude_ctrl.setValue(this.longitude);
        });
      });
    });
    this.setCurrentLocation();
  }
  onSubmit(data) {
    if (this.formGroup.valid) {
      this.isProcessing = true;
      this.shopsService.createShop(data, (error, result) => {
        this.isProcessing = false;
        if (result !== null && result.status === 'success') {
          localStorage.setItem(ConstantVariables.SHOP_ID, result.results.id);
          localStorage.setItem(ConstantVariables.SHOP_NAME, result.results.business_name);
          localStorage.setItem(ConstantVariables.SHOP_CURRENCY, result.results.currency);
          this.dialog.open(OnboardingCongratulationComponent);
        }
      });
    }
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
  get business_name() { return this.formGroup.get('business_name'); }
  get location() { return this.formGroup.get('location'); }
  get business_type() { return this.formGroup.get('business_type'); }
  get business_registration_number() { return this.formGroup.get('business_registration_number'); }
  get administration_name() { return this.formGroup.get('administration_name'); }
  get tax_number() { return this.formGroup.get('tax_number'); }
  get referral_code() { return this.formGroup.get('referral_code'); }

  get longitude_ctrl() { return this.formGroup.get('longitude'); }
  get latitude_ctrl() { return this.formGroup.get('latitude'); }
}
