import { PaymentRequestTypesEnums, CountriesEnums, PaymentMethodsForSettlementEnum } from './../../../../utils/enums';
import { Component, OnInit } from '@angular/core';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { GlobalDataService } from 'src/app/services/data-access/global-data.service';
import { AppUtilsService } from 'src/app/services/app-utils.service';
import { Router } from '@angular/router';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { EventTrackerActions, EventTrackerCategories } from 'src/app/utils/enums.util';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import * as moment from 'moment';
declare const swal;

@Component({
  selector: 'app-online-store-new-payment-request',
  templateUrl: './online-store-new-payment-request.component.html',
  styleUrls: ['./online-store-new-payment-request.component.scss']
})
export class OnlineStoreNewPaymentRequestComponent implements OnInit {
  pageHeaderOptions: IPageHeader;

  maxDate = new Date('12/31/' + moment().subtract(17, 'year').year());
  isProcessing = false;
  isProcessingSecondaryImageUpload = false;
  intellisights = [];
  banks = [];
  totalPage = 0;
  nextPage = '';
  prevPage = '';
  requestPayload = {};
  businessTypes = [];
  businessCategories = [];
  accountTypes = [];
  mobileMoneyNetworks = [];
  state = 'loading';
  businessInformationFormGroup: FormGroup;
  primaryContactInformationFormGroup: FormGroup;
  bankInformationFormGroup: FormGroup;
  buinessRegInformationFormGroup: FormGroup;
  isProcessingAvatarUpload: boolean;
  user_avatar_url: any;
  secondary_picture_url: any;
  isProcessingCertOfIncUpload: boolean;
  isProcessingCertOfCommUpload: boolean;
  isProcessingNationalID: boolean;
  primaryContactPhoneCode = '+233';
  secondaryContactPhoneCode = '+233';
  preferedPaymentMethods = PaymentMethodsForSettlementEnum;
  myShops = [];
  isEdit = false;
  paymentRequestData;
  constructor(
    private dataProvider: DataProviderService,
    private notificationService: NotificationsService,
    private globalData: GlobalDataService,
    private appUtils: AppUtilsService,
    private router: Router,
    private shopsService: ShopsService,
    private constantValues: ConstantValuesService) { }

  ngOnInit() {
    // tslint:disable-next-line:max-line-length
    this.businessTypes = this.globalData.getBusinessTypes;
    this.businessCategories = this.globalData.getBusinessCategories;
    this.accountTypes = this.globalData.getAccountTypes;
    this.mobileMoneyNetworks = this.globalData.getMobileMoneyNetworks;
    this.banks = this.globalData.getGhanaianBanks;
    this.pageHeaderOptions = { pageTitle: 'Online Store Payment Request', hideFilterPanel: true };

    this.businessInformationFormGroup = new FormGroup({
      shop_id: new FormControl('', [Validators.required]),
      business_name: new FormControl('', [Validators.required]),
      description_and_nature_of_business: new FormControl('', [Validators.required]),
      business_address: new FormControl('', [Validators.required]),
      country: new FormControl(CountriesEnums.GH, [Validators.required]),
      business_state_of_residence: new FormControl('', [Validators.required]),
      tin: new FormControl('', [Validators.required]),
      payment_request_type: new FormControl(PaymentRequestTypesEnums.ONLINE_STORE)
    });
    this.primaryContactInformationFormGroup = new FormGroup({
      primary_contact_name: new FormControl('', [Validators.required]),
      primary_contact_phone: new FormControl('', [Validators.required]),
      date_of_birth: new FormControl('', [Validators.required])
    });
    this.buinessRegInformationFormGroup = new FormGroup({
      certificate_of_incorporation: new FormControl(''),
      certificate_of_commencement: new FormControl(''),
      national_id_picture: new FormControl('', [Validators.required])
    });
    this.bankInformationFormGroup = new FormGroup({
      bank_account_name: new FormControl('', [Validators.required]),
      bank_account_number: new FormControl('', [Validators.required]),
      account_type: new FormControl('', [Validators.required]),
      bvn: new FormControl(''),
      bank_branch: new FormControl('', [Validators.required]),
      bank_name: new FormControl('', [Validators.required]),
      prefered_payment_method: new FormControl(PaymentMethodsForSettlementEnum.MOMO),
      mobile_money_number: new FormControl(''),
      mobile_money_network: new FormControl('')
    });
    this.country.valueChanges.subscribe(value => {
      this.preferedPaymentMethodForSettlementSetup();
    });
    this.prefered_payment_method.valueChanges.subscribe(value => {
      this.preferedPaymentMethodForSettlementSetup();
    });
    this.getMyShops();
  }
  preferedPaymentMethodForSettlementSetup()  {
    this.bvn.clearValidators();
      this.bvn.setValue('');
      this.mobile_money_number.setValue('');
      this.mobile_money_network.setValue('');
      this.bank_account_name.setValue('');
      this.bank_account_number.setValue('');
      this.account_type.setValue('');
      this.bank_branch.setValue('');
      this.bank_name.setValue('');
      this.mobile_money_number.clearValidators();
      this.mobile_money_number.updateValueAndValidity();
      this.mobile_money_network.clearValidators();
      this.mobile_money_network.updateValueAndValidity();
      if (this.country.value === CountriesEnums.NG) {
        this.banks = this.globalData.getNigerianBanks;
        this.bvn.setValidators([Validators.required]);
      } if (this.country.value === CountriesEnums.GH) {

        if (this.prefered_payment_method.value === PaymentMethodsForSettlementEnum.MOMO) {
          this.bank_account_name.clearValidators();
          this.bank_account_name.updateValueAndValidity();
          this.bank_account_number.clearValidators();
          this.bank_account_number.updateValueAndValidity();
          this.bank_branch.clearValidators();
          this.bank_branch.updateValueAndValidity();
          this.bank_name.clearValidators();
          this.bank_name.updateValueAndValidity();
          this.account_type.clearValidators();
          this.account_type.updateValueAndValidity();
          this.mobile_money_number.setValidators([Validators.required]);
          this.mobile_money_number.updateValueAndValidity();
          this.mobile_money_network.setValidators([Validators.required]);
          this.mobile_money_network.updateValueAndValidity();
        } else if (this.prefered_payment_method.value === PaymentMethodsForSettlementEnum.BANK) {
          this.bank_account_name.setValidators([Validators.required]);
          this.bank_account_name.updateValueAndValidity();
          this.bank_account_number.setValidators([Validators.required]);
          this.bank_account_number.updateValueAndValidity();
          this.bank_branch.setValidators([Validators.required]);
          this.bank_branch.updateValueAndValidity();
          this.bank_name.setValidators([Validators.required]);
          this.bank_name.updateValueAndValidity();
          this.account_type.setValidators([Validators.required]);
          this.account_type.updateValueAndValidity();
        }
      }
  }
  /**
  * Update shared data
  * @param data ISharedData
  */
  onDataRefreshed(data: ISharedData) {
    if (data !== null && data !== undefined) {
      // tslint:disable-next-line:max-line-length
      this.requestPayload = { shop_id: data.shop_id };
      // tslint:disable-next-line:max-line-length
    }
  }
  /**
   * On Primary Phone Number code selected
   * @param countryInfo counry information
   */
  onPhoneCodeCliked(countryInfo) {
    if (countryInfo !== undefined && countryInfo !== null) {
      this.primaryContactPhoneCode = '+' + (countryInfo.callingCodes[0] as string);
    }
  }
  /**
   * On Secondary Phone Number code selected
   * @param countryInfo counry information
   */
  onSecondaryPhoneCodeCliked(countryInfo) {
    if (countryInfo !== undefined && countryInfo !== null) {
      this.secondaryContactPhoneCode = '+' + (countryInfo.callingCodes[0] as string);
    }
  }
  /**
  * Get shops of current loged in user
  */
  getMyShops() {
    this.dataProvider.getAll(this.constantValues.GET_SHOPS_ENDPOINT, { shop_id: '' }).subscribe(result => {
      if (result.status === 'success') {
        this.myShops = result.results;
      }
    }, () => {
    });
  }
  /**
     * Submit payment request to KudiGo for processing
     */
  onSubmitPaymetRequest() {
    // tslint:disable-next-line: max-line-length
    this.appUtils.trackUserEvents(EventTrackerActions.payment_request_payment_method_and_final_submit_next, EventTrackerCategories.payment_request);
    this.primary_contact_phone.setValue(this.primaryContactPhoneCode + this.appUtils.removeFirstZero(this.primary_contact_phone.value));
    this.date_of_birth.setValue(moment(this.date_of_birth.value).format(this.constantValues.EXPIRTY_DATE_FORMAT));
    // tslint:disable-next-line:max-line-length
    const payload = JSON.parse('{' + this.appUtils.removeSpecialCharacters(JSON.stringify(this.businessInformationFormGroup.value) + ',' + JSON.stringify(this.primaryContactInformationFormGroup.value) + ',' + JSON.stringify(this.buinessRegInformationFormGroup.value) + ',' + JSON.stringify(this.bankInformationFormGroup.value)) + '}');
    let message = 'This action will submit this payment request to KudiGO Inc. Kindly note that our Customer Support Agents will call you for further clarfications as might be needed.';
    if (this.isEdit) {
      payload.payment_request_id = this.paymentRequestData.id;
    }
    const self = this;
    swal({
      title: 'Are you sure?',
      text: message,
      type: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit it',
      closeOnConfirm: false,
      showLoaderOnConfirm: true,
      html: true
    }, function (inputValue) {
      if (inputValue) {
        if (!self.isEdit) {
          self.shopsService.submitPaymentRequest(payload, (error, result) => {
            if (result !== null && result.status === 'success') {
              swal('Payment Request', result.results, 'success');
              self.router.navigate(['/dashboard']);
            }
            if (error !== null) {
              swal('Payment Request', error.detail, 'error');
            }
          });
        } else {
          self.shopsService.updatePaymentRequest(payload, (error, result) => {
            if (result !== null && result.response_code === '100') {
              swal('Payment Request', 'Payment Request successfully submitted', 'success');
              self.router.navigate(['/dashboard']);
            }
            if (error !== null) {
              swal('Payment Request', error.detail, 'error');
            }
          });
        }
      }
    });
  }
  /**
* Upload user avatar or company logo
* @param fileBrowser Image File to upload
* @param source Source of upload request (profile/logo)
*/
  uploadDocs(fileBrowser, formCtrl: AbstractControl, previewImageId: string) {
    if (fileBrowser.files.length > 0) {
      const file: File = fileBrowser.files[0];
      const formData = new FormData();

      formData.append('image', file);
      formCtrl.setValue(this.state);
      this.dataProvider.createForFormData(this.constantValues.UPLOAD_ALL_IMAGES_ENDPOINT, formData)
        .subscribe(result => {
          formCtrl.setValue('');
          formCtrl.setValue(result.image_url);
          document.getElementById(previewImageId).setAttribute('src', result.image_url);
        }, error => {
          formCtrl.setValue('');
          this.notificationService.snackBarErrorMessage(error.detail);
        });
    }
  }

  get shop_id() { return this.businessInformationFormGroup.get('shop_id'); }
  get business_name() { return this.businessInformationFormGroup.get('business_name'); }
  get tin() { return this.businessInformationFormGroup.get('tin'); }
  get business_registration_number() { return this.businessInformationFormGroup.get('business_registration_number'); }
  get description_and_nature_of_business() { return this.businessInformationFormGroup.get('description_and_nature_of_business'); }
  get business_address() { return this.businessInformationFormGroup.get('business_address'); }
  get country() { return this.businessInformationFormGroup.get('country'); }
  get business_state_of_residence() { return this.businessInformationFormGroup.get('business_state_of_residence'); }
  get primary_contact_name() { return this.primaryContactInformationFormGroup.get('primary_contact_name'); }
  get primary_contact_phone() { return this.primaryContactInformationFormGroup.get('primary_contact_phone'); }
  get date_of_birth() { return this.primaryContactInformationFormGroup.get('date_of_birth'); }
  get bank_account_name() { return this.bankInformationFormGroup.get('bank_account_name'); }
  get bank_account_number() { return this.bankInformationFormGroup.get('bank_account_number'); }
  get account_type() { return this.bankInformationFormGroup.get('account_type'); }
  get bank_name() { return this.bankInformationFormGroup.get('bank_name'); }
  get mobile_money_number() { return this.bankInformationFormGroup.get('mobile_money_number'); }
  get mobile_money_network() { return this.bankInformationFormGroup.get('mobile_money_network'); }
  get prefered_payment_method() { return this.bankInformationFormGroup.get('prefered_payment_method'); }
  get bvn() { return this.bankInformationFormGroup.get('bvn'); }
  get bank_branch() { return this.bankInformationFormGroup.get('bank_branch'); }
  get certificate_of_incorporation() { return this.buinessRegInformationFormGroup.get('certificate_of_incorporation'); }
  get certificate_of_commencement() { return this.buinessRegInformationFormGroup.get('certificate_of_commencement'); }
  get national_id_picture() { return this.buinessRegInformationFormGroup.get('national_id_picture'); }

}
