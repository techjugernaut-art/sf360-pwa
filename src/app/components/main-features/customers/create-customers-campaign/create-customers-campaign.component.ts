import { MatDialog } from '@angular/material/dialog';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { CustomerApiCallsService } from 'src/app/services/network-calls/customer-api-calls.service';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { CampaignTypesEnums, TargetTypesEnums, CustomerFilterByEnum } from 'src/app/utils/enums';
import * as moment from 'moment';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SmsTopupDialogComponent } from '../sms-topup-dialog/sms-topup-dialog.component';

@Component({
  selector: 'app-create-customers-campaign',
  templateUrl: './create-customers-campaign.component.html',
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})
export class CreateCustomersCampaignComponent implements OnInit {
  campaignTypes = CampaignTypesEnums;
  targetTypes = TargetTypesEnums;
  dropdownList = [];
  customerGroupDropdownList = [];
  dropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  formGroup: FormGroup;
  modalTitle = 'New Campaign';
  customerId = '';
  isEdit = false;
  isPartner = false;
  myShops = [];
  customerGroups = [];
  customers = [];
  selectedCustomerType = '';
  isProcessing: boolean;
  customerIds: any[];
  customerGroupIds: any[];
  customerValueList = [];
  customerGroupValueList = [];
  smsRemaining: any;
  requestPayload: IDashboardFilterParams;
  imageSource;
  public imagePath;
  shopName: any;
  topUpSMS: any;

  constructor(
    private formBuilder: FormBuilder,
    private customerApiCallsService: CustomerApiCallsService,
    private notificationService: NotificationsService,
    private shopsService: ShopsService,
    private router: Router,
    private constantValues: ConstantValuesService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
    // @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      shop_id: ['', [Validators.required]],
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
      campaign_type: [this.campaignTypes.ALL],
      target_type: [this.targetTypes.ALL],
      is_scheduled: [false],
      customer_ids: [''],
      scheduled_time: [''],
      image: [null],
      customer_group_ids: [''],
      visit_start_date: [''],
      visit_end_date: [''],
      customer_number_of_visits_at_most: [''],
      customer_number_of_visits_at_least: [''],
    });
    // this.image.valueChanges.subscribe(value =>{ console.log(value)});
    this.campaign_type.valueChanges.subscribe(value => {
      this.title.clearValidators()
      this.title.setValue('')
      // console.log(value)
      if (value === this.campaignTypes.ALL || value === this.campaignTypes.EMAIL) {
        this.title.setValidators([Validators.required]);
        this.title.updateValueAndValidity();
      } 
      // else if (value === this.campaignTypes.SMS || value === this.campaignTypes.EMAIL) {
      // this.title.clearValidators()
      // this.title.setValue('')
      //   this.title.setValidators([Validators.required, Validators.maxLength(160)]);
      //   this.title.updateValueAndValidity();
      // }
    })
    this.customer_ids.valueChanges.subscribe(values => {
      this.customerValueList = values
      if (values !== undefined && values !== null && values !== '') {
        this.customerIds = [];
        let array = [];
        array = values;
        array.forEach(data => {
          this.customerIds.push(data.item_id);
        });
      }
    });
    this.customer_group_ids.valueChanges.subscribe(values => {
      this.customerGroupValueList = values;
      if (values !== undefined && values !== null && values !== '') {
        this.customerGroupIds = [];
        let array = [];
        array = values;
        array.forEach(data => {
          this.customerGroupIds.push(data.item_id);
        });
      }
    });
    this.getMyShops();
    this.getCampaignsgraphOverview({shop_id: ''});


  }
  /**
   * Preview customer campaign image
   */
  previewCampaignImage(event) {
    const reader = new FileReader();
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSource = reader.result as string;
        this.formGroup.patchValue({
          fileSource: reader.result
        });
      };
    }
  }
  /**
   * Submit customer data
   * @param detail details for editing stock
   */
  onSubmit(detail) {
    if (this.formGroup.valid) {
      detail.scheduled_time = (detail.scheduled_time !== null && detail.scheduled_time !== '' && detail.scheduled_time !== undefined) ? moment(detail.scheduled_time).format(this.constantValues.RECURRING_DATE_TIME_FORMAT) : '';
      detail.customer_ids = (this.customerIds !== null && this.customerIds !== undefined) ? this.customerIds.join(',') : '';
      // tslint:disable-next-line: max-line-length
      detail.customer_group_ids = (this.customerGroupIds !== null && this.customerGroupIds !== undefined) ? this.customerGroupIds.join(',') : '';
      this.isProcessing = true;
      this.customerApiCallsService.createCampaign(detail, (error, result) => {
        this.isProcessing = false;
        if (result !== null) {
          this.notificationService.snackBarMessage('Customer Campaign successfully published');
          this.router.navigate(['/customers/campaigns']);
        }
      });
    }
  }
  /**
  * Get shops of current loged in user
  */
  getMyShops() {
    this.isProcessing = true;
    this.shopsService.getMyShop({ shop_id: '' }, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.status === 'success') {
        this.myShops = result.results;
      }
    });
  }
  getBusinessName() {
    this.shopName = this.myShops.find(data => data.id === this.shop_id.value)
     return this.shopName?.business_name;
  }
  getCampaignsgraphOverview(filterData: IDashboardFilterParams) {
    this.requestPayload = filterData;
    this.customerApiCallsService.getCampaignOverview(filterData, (error, result) => {
    this.isProcessing = false;
    if( result !== null && result.response_code === '100'){
      this.smsRemaining = result.sms_credit_remaining;
    }
    });
  }
  /**
  * Get customer categories
  * @param filterData IDashboardFilterParams interface
  */
 getCustomerGroups(storeId) {
  this.isProcessing = true;
  this.customerApiCallsService.getCategories({shop_id: storeId}, (error, result) => {
    this.isProcessing = false;
    if (result !== null) {
      this.customerGroups = [];
      this.customerGroups = result.results;
      this.customerGroupDropdownList = [];
      this.customerGroups.forEach(data => {
        this.customerGroupDropdownList.push({ item_id: data.id, item_text: data.name });
      });
    }
  });
}
/**
  * Get my customers
  * @param filterData IDashboardFilterParams interface
  */
 getMyCustomers(filterData: IDashboardFilterParams) {
   this.customers = [];
   const dropdownCustomers = [];
  this.isProcessing = true;
  this.customerApiCallsService.getCustomers(filterData, this.selectedCustomerType as CustomerFilterByEnum, (error, result) => {
    this.isProcessing = false;
    if (result.response_code === '100') {
      this.customers = result.results;
      this.dropdownList = [];
      this.customers.forEach(data => {
        this.dropdownList.push({ item_id: data.id, item_text: data.name });
      });
    }
  });
}
/**
   *On shop changed
   * @param shopId Shop ID
   */
  onShopChanged(shopId) {
    this.getCustomerGroups(shopId);
    this.getMyCustomers({shop_id: shopId});
  }
  /**
   * Search customer info
   * @param search_text search text
   */
  onFilterChange(search_text) {
    this.customers = [];
   const dropdownCustomers = [];
  this.isProcessing = true;
  this.customerApiCallsService.searchCustomer(search_text, (error, result) => {
    this.isProcessing = false;
    if (result.response_code === '100') {
      this.customers = result.results;
      this.dropdownList = [];
      this.customers.forEach(data => {
        this.dropdownList.push({ item_id: data.id, item_text: data.name });
      });
    }
  });
  }
  onFilterCucstomerGroup(event) {

  }
  onSMStopUp(){
      this.dialog.open(SmsTopupDialogComponent).afterClosed().subscribe((isSuccess: boolean) => {
        if (isSuccess) {
          this.getMyShops();
        }
      });
  }

  get shop_id() { return this.formGroup.get('shop_id'); }
  get content() { return this.formGroup.get('content'); }
  get customer_ids() { return this.formGroup.get('customer_ids'); }
  get is_scheduled() { return this.formGroup.get('is_scheduled'); }
  get customer_group_ids() { return this.formGroup.get('customer_group_ids'); }
  get title() { return this.formGroup.get('title'); }
  get image() { return this.formGroup.get('image'); }
  get campaign_type() { return this.formGroup.get('campaign_type'); }
  get target_type() { return this.formGroup.get('target_type'); }
  get visit_start_date() { return this.formGroup.get('visit_start_date'); }
  get visit_end_date() { return this.formGroup.get('visit_end_date'); }
  get customer_number_of_visits_at_most() { return this.formGroup.get('customer_number_of_visits_at_most'); }
  get customer_number_of_visits_at_least() { return this.formGroup.get('customer_number_of_visits_at_least'); }

}
