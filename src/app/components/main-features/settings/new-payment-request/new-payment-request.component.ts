import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EventTrackerActions, EventTrackerCategories } from 'src/app/utils/enums.util';
import { Component, OnInit } from '@angular/core';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { Title } from '@angular/platform-browser';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { GlobalDataService } from 'src/app/services/data-access/global-data.service';
import { AppUtilsService } from 'src/app/services/app-utils.service';
import { BusinessTypesEnums, CountriesEnums, PaymentMethodsForSettlementEnum, PaymentRequestTypesEnums } from 'src/app/utils/enums';
declare const swal;

@Component({
  selector: 'app-new-payment-request',
  templateUrl: './new-payment-request.component.html',
  styleUrls: ['./new-payment-request.component.scss']
})
export class NewPaymentRequestComponent implements OnInit {

  pageHeaderOptions: IPageHeader;
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
  companyDocumentationFormGroup: FormGroup;
  isProcessingAvatarUpload: boolean;
  user_avatar_url: any;
  secondary_picture_url: any;
  isProcessingCertOfIncUpload: boolean;
  isProcessingCertOfCommUpload: boolean;
  isProcessingNationalID: boolean;
  primaryContactPhoneCode = '+233';
  secondaryContactPhoneCode = '+233';
  myShops = [];
  isEdit = false;
  requestId;
  data;
  paymentRequestData;
  preferedPaymentMethods = PaymentMethodsForSettlementEnum;
  country = new FormControl('GH', [Validators.required])
  business = new FormControl('SoleProprietorship', [Validators.required])


  constructor(
    private dataProvider: DataProviderService,
    private notificationService: NotificationsService,
    private globalData: GlobalDataService,
    private appUtils: AppUtilsService,
    private router: Router,
    private shopsService: ShopsService,
    private constantValues: ConstantValuesService,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
    // tslint:disable-next-line:max-line-length
    this.pageHeaderOptions = { pageTitle: 'Payment Request', hideFilterPanel: true };
    this.businessInformationFormGroup = new FormGroup({
      shop_id: new FormControl('', [Validators.required]),
      business_name: new FormControl('', [Validators.required]),
      business_registration_number: new FormControl('', [Validators.required]),
      business_type: new FormControl('', [Validators.required]),
      trading_name: new FormControl('', [Validators.required]),
      business_address: new FormControl('', [Validators.required]),
      business_category: new FormControl('', [Validators.required]),
      // country: new FormControl('GH', [Validators.required]),
      business_state_of_residence: new FormControl('', [Validators.required]),
      tin: new FormControl(''),
      reseller_code: new FormControl(''),
      payment_request_type: new FormControl(PaymentRequestTypesEnums.PHYSICAL_STORE)
    });
    this.primaryContactInformationFormGroup = new FormGroup({
      primary_contact_name: new FormControl('', [Validators.required]),
      primary_contact_phone: new FormControl('', [Validators.required]),
      primary_contact_picture: new FormControl('', [Validators.required]),
      primary_contact_email: new FormControl('', [Validators.required, Validators.email]),
      secondary_contact_name: new FormControl('', [Validators.required]),
      secondary_contact_phone: new FormControl('', [Validators.required]),
      secondary_contact_picture: new FormControl('', [Validators.required]),
      secondary_contact_email: new FormControl('', [Validators.required, Validators.email])
    });
    this.bankInformationFormGroup = new FormGroup({
      bank_account_name: new FormControl('', [Validators.required]),
      bank_account_number: new FormControl('', [Validators.required]),
      account_type: new FormControl('', [Validators.required]),
      bvn: new FormControl(''),
      bank_branch: new FormControl('', [Validators.required]),
      bank_name: new FormControl('', [Validators.required]),
      mobile_money_number: new FormControl(''),
      prefered_payment_method: new FormControl(PaymentMethodsForSettlementEnum.MOMO),
      mobile_money_network: new FormControl('')
    });
    this.buinessRegInformationFormGroup = new FormGroup({
      certificate_of_incorporation: new FormControl(''),
      certificate_of_commencement: new FormControl(''),
      national_id_picture: new FormControl('', [Validators.required]),
      recent_utility_bill: new FormControl('', [Validators.required])
    });
    this.companyDocumentationFormGroup = new FormGroup({
      certificate_of_registration: new FormControl(''),
      cac_bn: new FormControl(''),
      partnership_agreement: new FormControl(''),
      valid_registered_proprietors_or_partnerships_id_doc: new FormControl(''),
      scuml_certificate: new FormControl(''),
      ngo_reg_certificate: new FormControl(''),
      cooperative_registration_certificate: new FormControl(''),
      certified_copies_of_association_constitution: new FormControl(''),
      resolution_authorizing_business_establishment: new FormControl(''),
      requisite_government_approval_or_gazette: new FormControl(''),
      memorandum_and_articles_of_association: new FormControl(''),
      form_cac_7: new FormControl(''),
      form_cac_2: new FormControl(''),
      form_cac_1_1: new FormControl(''),
      board_resolution: new FormControl(''),
      shareholders_valid_id: new FormControl(''),
      operating_license: new FormControl(''),
      evidence_of_listing_on_the_stock_exchange: new FormControl('')
    });
    this.businessTypes = this.globalData.getBusinessTypes;
    this.businessCategories = this.globalData.getBusinessCategories;
    this.accountTypes = this.globalData.getAccountTypes;
    this.mobileMoneyNetworks = this.globalData.getMobileMoneyNetworks;
    this.banks = this.globalData.getGhanaianBanks;
    this.country.valueChanges.subscribe(value => {
      this.bvn.clearValidators();
      this.bvn.setValue('');
      this.certificate_of_registration.clearValidators();
      this.certificate_of_registration.setValue('');
      this.cac_bn.clearValidators();
      this.cac_bn.setValue('');
      this.partnership_agreement.clearValidators();
      this.partnership_agreement.setValue('');
      this.valid_registered_proprietors_or_partnerships_id_doc.clearValidators();
      this.valid_registered_proprietors_or_partnerships_id_doc.setValue('');
      this.scuml_certificate.clearValidators();
      this.scuml_certificate.setValue('');
      this.ngo_reg_certificate.clearValidators();
      this.ngo_reg_certificate.setValue('');
      this.cooperative_registration_certificate.clearValidators();
      this.cooperative_registration_certificate.setValue('');
      this.certified_copies_of_association_constitution.clearValidators();
      this.certified_copies_of_association_constitution.setValue('');
      this.resolution_authorizing_business_establishment.clearValidators();
      this.resolution_authorizing_business_establishment.setValue('');
      this.requisite_government_approval_or_gazette.clearValidators();
      this.requisite_government_approval_or_gazette.setValue('');
      this.memorandum_and_articles_of_association.clearValidators();
      this.memorandum_and_articles_of_association.setValue('');
      this.board_resolution.clearValidators();
      this.board_resolution.setValue('');
      this.shareholders_valid_id.clearValidators();
      this.shareholders_valid_id.setValue('');
      this.form_cac_7.clearValidators();
      this.form_cac_7.setValue('');
      this.form_cac_2.clearValidators();
      this.form_cac_2.setValue('');
      this.form_cac_1_1.clearValidators();
      this.form_cac_1_1.setValue('');
      this.operating_license.clearValidators();
      this.operating_license.setValue('');
      this.evidence_of_listing_on_the_stock_exchange.clearValidators();
      this.evidence_of_listing_on_the_stock_exchange.setValue('');
      this.companyDocumentationFormGroup.updateValueAndValidity();
      this.banks = this.globalData.getGhanaianBanks;

      if (value === CountriesEnums.NG) {
        this.banks = this.globalData.getNigerianBanks;
        this.bvn.setValidators([Validators.required]);
        // tslint:disable-next-line: max-line-length
        if (this.business_type.value === BusinessTypesEnums.SOLE_PROPRIETORSHIP || this.business_type.value === BusinessTypesEnums.PARTNERSHIP) {
          this.certificate_of_registration.setValidators([Validators.required]);
          this.cac_bn.setValidators([Validators.required]);
          this.partnership_agreement.setValidators([Validators.required]);
          this.valid_registered_proprietors_or_partnerships_id_doc.setValidators([Validators.required]);
          this.scuml_certificate.setValidators([Validators.required]);
        } else if (this.business_type.value === BusinessTypesEnums.NGO) {
          this.scuml_certificate.setValidators([Validators.required]);
          this.ngo_reg_certificate.setValidators([Validators.required]);
          this.cooperative_registration_certificate.setValidators([Validators.required]);
          this.certified_copies_of_association_constitution.setValidators([Validators.required]);
          this.resolution_authorizing_business_establishment.setValidators([Validators.required]);
          this.requisite_government_approval_or_gazette.setValidators([Validators.required]);
        } else if (this.business_type.value === BusinessTypesEnums.PUBLIC_LIMITED_LIABILITY) {
          this.memorandum_and_articles_of_association.setValidators([Validators.required]);
          this.board_resolution.setValidators([Validators.required]);
          this.shareholders_valid_id.setValidators([Validators.required]);
          this.operating_license.setValidators([Validators.required]);
          this.evidence_of_listing_on_the_stock_exchange.setValidators([Validators.required]);
        } else if (this.business_type.value === BusinessTypesEnums.PRIVATE_LIMITED_LIABILITY) {
          this.memorandum_and_articles_of_association.setValidators([Validators.required]);
          this.board_resolution.setValidators([Validators.required]);
          this.shareholders_valid_id.setValidators([Validators.required]);
          this.form_cac_7.setValidators([Validators.required]);
          this.form_cac_1_1.setValidators([Validators.required]);
          this.operating_license.setValidators([Validators.required]);
        }
        this.companyDocumentationFormGroup.updateValueAndValidity();
      }
      this.preferedPaymentMethodForSettlementSetup();
    });
    this.prefered_payment_method.valueChanges.subscribe(value => {
      this.preferedPaymentMethodForSettlementSetup();
    });
    this.getMyShops();
    this.requestId = this.route.snapshot.params['id'];
    if (this.requestId) {
      this.isProcessing = true;
      this.shopsService.getPaymentRequest(this.requestId, (error, result) => {
        this.isProcessing = false;
        const data = result.results[0];
        this.prePopulateControlsToEdit(data);
      });
    }
  }
  preferedPaymentMethodForSettlementSetup() {
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
   * Submit payment request to KudiGo for processing
   */
  onSubmitPaymetRequest() {
    // tslint:disable-next-line: max-line-length
    this.appUtils.trackUserEvents(EventTrackerActions.payment_request_payment_method_and_final_submit_next, EventTrackerCategories.payment_request);
    this.primary_contact_phone.setValue(this.primaryContactPhoneCode + this.appUtils.removeFirstZero(this.primary_contact_phone.value));
    // tslint:disable-next-line:max-line-length
    this.secondary_contact_phone.setValue(this.secondaryContactPhoneCode + this.appUtils.removeFirstZero(this.secondary_contact_phone.value));
    // tslint:disable-next-line:max-line-length
    const payload = JSON.parse('{' + this.appUtils.removeSpecialCharacters(JSON.stringify(this.businessInformationFormGroup.value) + ',' + JSON.stringify(this.primaryContactInformationFormGroup.value) + ',' + JSON.stringify(this.buinessRegInformationFormGroup.value) + ',' + JSON.stringify(this.bankInformationFormGroup.value) + ',' + JSON.stringify(this.companyDocumentationFormGroup.value)) + '}');
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
  uploadImages(fileBrowser, source) {
    if (fileBrowser.files.length > 0) {
      const file: File = fileBrowser.files[0];
      const formData = new FormData();

      formData.append('image', file);

      if (source === ImageOrigin.PRIMARY) {
        this.isProcessingAvatarUpload = true;
      } else if (source === ImageOrigin.SECONDARY) {
        this.isProcessingSecondaryImageUpload = true;
      } else if (source === ImageOrigin.CERT_OF_INC) {
        this.isProcessingCertOfIncUpload = true;
      } else if (source === ImageOrigin.CERT_OF_COMM) {
        this.isProcessingCertOfCommUpload = true;
      } else if (source === ImageOrigin.NATIONAL_ID_PIC) {
        this.isProcessingNationalID = true;
      }
      this.dataProvider.createForFormData(this.constantValues.UPLOAD_ALL_IMAGES_ENDPOINT, formData)
        .subscribe(result => {
          this.previewImage(source, result.image_url);
          if (source === ImageOrigin.PRIMARY) {
            this.isProcessingAvatarUpload = false;
            this.primary_contact_picture.setValue(result.image_url);
            this.notificationService.snackBarMessage('Primary Image successfully uploaded');
          } else if (source === ImageOrigin.SECONDARY) {
            this.isProcessingSecondaryImageUpload = false;
            this.secondary_contact_picture.setValue(result.image_url);
            this.notificationService.snackBarMessage('Secondary Image successfully uploaded');
          } else if (source === ImageOrigin.CERT_OF_INC) {
            this.isProcessingCertOfIncUpload = false;
            this.certificate_of_incorporation.setValue(result.image_url);
            this.notificationService.snackBarMessage('Certificate of Incorporation successfully uploaded');
          } else if (source === ImageOrigin.CERT_OF_COMM) {
            this.isProcessingCertOfCommUpload = false;
            this.certificate_of_commencement.setValue(result.image_url);
            this.notificationService.snackBarMessage('Certificate of Commencement successfully uploaded');
          } else if (source === ImageOrigin.NATIONAL_ID_PIC) {
            this.isProcessingNationalID = false;
            this.national_id_picture.setValue(result.image_url);
            this.notificationService.snackBarMessage('National ID successfully uploaded');
          }
        }, error => {
          if (source === ImageOrigin.PRIMARY) {
            this.isProcessingAvatarUpload = false;
          } else if (source === ImageOrigin.SECONDARY) {
            this.isProcessingSecondaryImageUpload = false;
          } else if (source === ImageOrigin.CERT_OF_INC) {
            this.isProcessingCertOfIncUpload = false;
          } else if (source === ImageOrigin.CERT_OF_COMM) {
            this.isProcessingCertOfCommUpload = false;
          } else if (source === ImageOrigin.NATIONAL_ID_PIC) {
            this.isProcessingNationalID = false;
          }
          this.notificationService.snackBarErrorMessage(error.detail);
        });
    }
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
  previewImage(source: ImageOrigin, imageUrl) {
    if (source === ImageOrigin.PRIMARY) {
      document.getElementById('previewPrimaryPicture').setAttribute('src', imageUrl);
    } else if (source === ImageOrigin.SECONDARY) {
      document.getElementById('previewSecondaryPicture').setAttribute('src', imageUrl);
    } else if (source === ImageOrigin.CERT_OF_INC) {
      document.getElementById('previewCertificateOfIncorporation').setAttribute('src', imageUrl);
    } else if (source === ImageOrigin.CERT_OF_COMM) {
      document.getElementById('previewCertificateOfCommencement').setAttribute('src', imageUrl);
    } else if (source === ImageOrigin.NATIONAL_ID_PIC) {
      // document.getElementById('previewNationalIdPicture').setAttribute('src', imageUrl);
    } else if (source === ImageOrigin.UTILITY_BILL) {
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
  getPaymentRequests(shopId) {
    this.isProcessing = true;
    this.shopsService.getPaymentRequest(shopId, (error, result) => {
      this.isProcessing = false;
      let requests = [];
      if (result !== null && result !== undefined) {
        requests = result.results;
        if (requests.length > 0) {
          this.prePopulateControlsToEdit(requests[0]);
        }
      }
    });
  }
  prePopulateControlsToEdit(data) {
    this.paymentRequestData = data;
    this.isEdit = true;
    // this.shop_id.setValue(data.shop_id);
    this.reseller_code.setValue(data.reseller_code);
    this.business_name.setValue(data.business_name);
    this.tin.setValue(data.tin);
    this.business_registration_number.setValue(data.business_registration_number);
    this.trading_name.setValue(data.trading_name);
    this.business_type.setValue(data.business_type);
    this.business_category.setValue(data.business_category);
    this.business_address.setValue(data.business_address);
    this.primary_contact_name.setValue(data.primary_contact_name);
    this.business_state_of_residence.setValue(data.business_state_of_residence);
    this.primary_contact_phone.setValue(data.primary_contact_phone);
    this.primary_contact_email.setValue(data.primary_contact_email);
    this.primary_contact_picture.setValue(data.primary_contact_picture);
    this.secondary_contact_name.setValue(data.secondary_contact_name);
    this.secondary_contact_phone.setValue(data.secondary_contact_phone);
    this.secondary_contact_picture.setValue(data.secondary_contact_picture);
    this.secondary_contact_email.setValue(data.secondary_contact_email);
    this.mobile_money_number.setValue(data.mobile_money_number);
    this.bank_name.setValue(data.bank_name);
    this.bank_account_name.setValue(data.bank_account_name);
    this.bank_account_number.setValue(data.bank_account_number);
    this.bvn.setValue(data.bvn);
    this.account_type.setValue(data.account_type);
    this.bank_branch.setValue(data.bank_branch);
    this.certificate_of_incorporation.setValue(data.certificate_of_incorporation);
    this.certificate_of_commencement.setValue(data.certificate_of_commencement);
    this.national_id_picture.setValue(data.national_id_picture);
    this.mobile_money_network.setValue(data.mobile_money_network);
    this.ngo_reg_certificate.setValue(data.ngo_reg_certificate);
    this.cac_bn.setValue(data.cac_bn);
    this.partnership_agreement.setValue(data.partnership_agreement);
    this.valid_registered_proprietors_or_partnerships_id_doc.setValue(data.valid_registered_proprietors_or_partnerships_id_doc);
    this.scuml_certificate.setValue(data.scuml_certificate);
    this.scuml_certificate.setValue(data.scuml_certificate);
    this.cooperative_registration_certificate.setValue(data.cooperative_registration_certificate);
    this.certified_copies_of_association_constitution.setValue(data.certified_copies_of_association_constitution);
    this.resolution_authorizing_business_establishment.setValue(data.resolution_authorizing_business_establishment);
    this.requisite_government_approval_or_gazette.setValue(data.requisite_government_approval_or_gazette);
    this.memorandum_and_articles_of_association.setValue(data.memorandum_and_articles_of_association);
    this.form_cac_7.setValue(data.form_cac_7);
    this.form_cac_2.setValue(data.form_cac_2);
    this.form_cac_1_1.setValue(data.form_cac_1_1);
    this.board_resolution.setValue(data.board_resolution);
    this.shareholders_valid_id.setValue(data.shareholders_valid_id);
    this.operating_license.setValue(data.operating_license);
    this.evidence_of_listing_on_the_stock_exchange.setValue(data.evidence_of_listing_on_the_stock_exchange);
    this.recent_utility_bill.setValue(data.recent_utility_bill);
    document.getElementById('previewPrimaryPicture').setAttribute('src', data.primary_contact_picture);
    document.getElementById('previewSecondaryPicture').setAttribute('src', data.secondary_contact_picture);
    document.getElementById('previewCertificateOfIncorporation').setAttribute('src', data.certificate_of_incorporation);
    document.getElementById('previewCertificateOfCommencement').setAttribute('src', data.certificate_of_commencement);
    // document.getElementById('previewNationalIdPicture').setAttribute('src', data.national_id_picture);
    document.getElementById('previewUtilityBill').setAttribute('src', data.recent_utility_bill);
    document.getElementById('previewCertificateOfRegistration').setAttribute('src', data.certificate_of_registration);
    document.getElementById('previewCACBN').setAttribute('src', data.cac_bn);
    document.getElementById('previewPartnershipAgreement').setAttribute('src', data.partnership_agreement);
    // tslint:disable-next-line: max-line-length
    document.getElementById('previewValidRegisteredProprietorsOrPartnershipsIdDoc').setAttribute('src', data.valid_registered_proprietors_or_partnerships_id_doc);
    document.getElementById('previewScumlCertificate').setAttribute('src', data.scuml_certificate);
    document.getElementById('previewNgoRCertificate').setAttribute('src', data.ngo_reg_certificate);
    document.getElementById('previewCooperativeRegistrationCertificate').setAttribute('src', data.cooperative_registration_certificate);
    // tslint:disable-next-line: max-line-length
    document.getElementById('previewCertifiedCopiesOfAssociationConstitution').setAttribute('src', data.certified_copies_of_association_constitution);
    // tslint:disable-next-line: max-line-length
    document.getElementById('previewResolutionAuthorizingBusinessEstablishment').setAttribute('src', data.resolution_authorizing_business_establishment);
    // tslint:disable-next-line: max-line-length
    document.getElementById('previewRequisiteGovernmentApprovalOrGazette').setAttribute('src', data.requisite_government_approval_or_gazette);
    document.getElementById('previewMemorandumAndArticlesOfAssociation').setAttribute('src', data.memorandum_and_articles_of_association);
    document.getElementById('previewBoardResolution').setAttribute('src', data.board_resolution);
    document.getElementById('previewShareholdersValidID').setAttribute('src', data.shareholders_valid_id);
    document.getElementById('previewFormCAC7').setAttribute('src', data.form_cac_7);
    document.getElementById('previewFormCAC2').setAttribute('src', data.form_cac_2);
    document.getElementById('previewFormCAC11').setAttribute('src', data.form_cac_1_1);
    // tslint:disable-next-line: max-line-length
    document.getElementById('previewEvidenceOfListingOnTheStockExchange').setAttribute('src', data.evidence_of_listing_on_the_stock_exchange);
    this.country.setValue(data.myshop.payment_country);
  }
  get shop_id() { return this.businessInformationFormGroup.get('shop_id'); }
  get reseller_code() { return this.businessInformationFormGroup.get('reseller_code'); }
  get business_name() { return this.businessInformationFormGroup.get('business_name'); }
  get tin() { return this.businessInformationFormGroup.get('tin'); }
  get business_registration_number() { return this.businessInformationFormGroup.get('business_registration_number'); }
  get business_type() { return this.businessInformationFormGroup.get('business_type'); }
  get trading_name() { return this.businessInformationFormGroup.get('trading_name'); }
  get business_address() { return this.businessInformationFormGroup.get('business_address'); }
  get business_category() { return this.businessInformationFormGroup.get('business_category'); }
  // get country() { return this.businessInformationFormGroup.get('country'); }
  get business_state_of_residence() { return this.businessInformationFormGroup.get('business_state_of_residence'); }
  get primary_contact_name() { return this.primaryContactInformationFormGroup.get('primary_contact_name'); }
  get primary_contact_phone() { return this.primaryContactInformationFormGroup.get('primary_contact_phone'); }
  get primary_contact_email() { return this.primaryContactInformationFormGroup.get('primary_contact_email'); }
  get primary_contact_picture() { return this.primaryContactInformationFormGroup.get('primary_contact_picture'); }
  get secondary_contact_name() { return this.primaryContactInformationFormGroup.get('secondary_contact_name'); }
  get secondary_contact_phone() { return this.primaryContactInformationFormGroup.get('secondary_contact_phone'); }
  get secondary_contact_picture() { return this.primaryContactInformationFormGroup.get('secondary_contact_picture'); }
  get secondary_contact_email() { return this.primaryContactInformationFormGroup.get('secondary_contact_email'); }
  get bank_account_name() { return this.bankInformationFormGroup.get('bank_account_name'); }
  get bank_account_number() { return this.bankInformationFormGroup.get('bank_account_number'); }
  get account_type() { return this.bankInformationFormGroup.get('account_type'); }
  get bank_name() { return this.bankInformationFormGroup.get('bank_name'); }
  get mobile_money_number() { return this.bankInformationFormGroup.get('mobile_money_number'); }
  get mobile_money_network() { return this.bankInformationFormGroup.get('mobile_money_network'); }
  get bvn() { return this.bankInformationFormGroup.get('bvn'); }
  get bank_branch() { return this.bankInformationFormGroup.get('bank_branch'); }
  get prefered_payment_method() { return this.bankInformationFormGroup.get('prefered_payment_method'); }
  get certificate_of_incorporation() { return this.buinessRegInformationFormGroup.get('certificate_of_incorporation'); }
  get certificate_of_commencement() { return this.buinessRegInformationFormGroup.get('certificate_of_commencement'); }
  get national_id_picture() { return this.buinessRegInformationFormGroup.get('national_id_picture'); }
  get recent_utility_bill() { return this.buinessRegInformationFormGroup.get('recent_utility_bill'); }
  get certificate_of_registration() { return this.companyDocumentationFormGroup.get('certificate_of_registration'); }
  get cac_bn() { return this.companyDocumentationFormGroup.get('cac_bn'); }
  get partnership_agreement() { return this.companyDocumentationFormGroup.get('partnership_agreement'); }
  get valid_registered_proprietors_or_partnerships_id_doc() { return this.companyDocumentationFormGroup.get('valid_registered_proprietors_or_partnerships_id_doc'); }
  get scuml_certificate() { return this.companyDocumentationFormGroup.get('scuml_certificate'); }
  get ngo_reg_certificate() { return this.companyDocumentationFormGroup.get('ngo_reg_certificate'); }
  get cooperative_registration_certificate() { return this.companyDocumentationFormGroup.get('cooperative_registration_certificate'); }
  get certified_copies_of_association_constitution() { return this.companyDocumentationFormGroup.get('certified_copies_of_association_constitution'); }
  get resolution_authorizing_business_establishment() { return this.companyDocumentationFormGroup.get('resolution_authorizing_business_establishment'); }
  // tslint:disable-next-line:max-line-length
  get requisite_government_approval_or_gazette() { return this.companyDocumentationFormGroup.get('requisite_government_approval_or_gazette'); }
  get memorandum_and_articles_of_association() { return this.companyDocumentationFormGroup.get('memorandum_and_articles_of_association'); }
  get form_cac_7() { return this.companyDocumentationFormGroup.get('form_cac_7'); }
  get form_cac_2() { return this.companyDocumentationFormGroup.get('form_cac_2'); }
  get form_cac_1_1() { return this.companyDocumentationFormGroup.get('form_cac_1_1'); }
  get board_resolution() { return this.companyDocumentationFormGroup.get('board_resolution'); }
  get shareholders_valid_id() { return this.companyDocumentationFormGroup.get('shareholders_valid_id'); }
  get operating_license() { return this.companyDocumentationFormGroup.get('operating_license'); }
  get evidence_of_listing_on_the_stock_exchange() { return this.companyDocumentationFormGroup.get('evidence_of_listing_on_the_stock_exchange'); }
}
enum ImageOrigin {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  CERT_OF_INC = 'certificate_of_incorporation',
  CERT_OF_COMM = 'certificate_of_commencement',
  NATIONAL_ID_PIC = 'national_id_picture',
  UTILITY_BILL = 'recent_utility_bill'
}
