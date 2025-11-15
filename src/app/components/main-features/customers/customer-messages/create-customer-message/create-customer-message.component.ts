import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { CustomerApiCallsService } from 'src/app/services/network-calls/customer-api-calls.service';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { CustomerFilterByEnum, MessageTypeEnum, CampaignTypesEnums } from 'src/app/utils/enums';
import * as moment from 'moment';


@Component({
  selector: 'app-create-customer-message',
  templateUrl: './create-customer-message.component.html'
})
export class CreateCustomerMessageComponent implements OnInit {
  templateTypes = MessageTypeEnum;
  messageTypes = CampaignTypesEnums;
  automationFormGroup: FormGroup;
  modalTitle = 'New Message Automation';
  isEdit = false;
  myShops = [];
  isProcessing: boolean;
  selectedTemplateType: CustomerFilterByEnum;
  customerMessages = [];
  requestPayload: IDashboardFilterParams;
  smsRemaining;
  shopName;

  constructor(
    private formBuilder: FormBuilder,
    private customerApiCallsService: CustomerApiCallsService,
    private notificationService: NotificationsService,
    private dialogRef: MatDialogRef<CreateCustomerMessageComponent>,
    private shopsService: ShopsService,
    private router: Router,
    private constantValues: ConstantValuesService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.automationFormGroup = this.formBuilder.group({
      shop_id: ['', [Validators.required]],
      message_type: [this.messageTypes.ALL, [Validators.required]],
      template_type: ['', [Validators.required]],
      title: ['', [Validators.required]],
      message: ['', [Validators.required]],
      is_recurring: [false],
      recurring_interval: [''],
      recurring_date: ['']
    });
    this.message_type.valueChanges.subscribe((value) => {
      this.message.clearValidators();
      this.message.setValue('');
      this.message.updateValueAndValidity();
      if (value === this.messageTypes.SMS) {
        this.message.setValidators(Validators.maxLength(160));
        this.message.updateValueAndValidity();
        this.title.setValidators(null);
        this.title.updateValueAndValidity();
      }
    });
    this.is_recurring.valueChanges.subscribe((isRecurring: boolean) => {
      this.recurring_interval.clearValidators();
      this.recurring_interval.setValue('');
      this.recurring_interval.updateValueAndValidity();
      if (isRecurring === true) {
        this.recurring_interval.setValidators([Validators.required]);
        this.recurring_interval.updateValueAndValidity();
        this.recurring_date.setValidators([Validators.required]);
        this.recurring_date.updateValueAndValidity();
      }
    });
    this.getMyShops();
  }
  /**
   * Submit customer data
   * @param detail details for editing stock
   */
  onSubmit(detail) {
    if (this.automationFormGroup.valid) {
      detail.recurring_date = (detail.recurring_date !== null && detail.recurring_date !== '' && detail.recurring_date !== undefined) ? moment(detail.recurring_date).format(this.constantValues.RECURRING_DATE_TIME_FORMAT) : '';
      this.isProcessing = true;
      this.customerApiCallsService.createAutomationTemplate(detail, (error, result) => {
      this.isProcessing = false;
        if (result !== null ) {
          this.notificationService.snackBarMessage('Customer Message successfully sent');
          this.dialogRef.close(true);
          this.router.navigate(['/customers/automation-templates']);
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
        // console.log(this.myShops, 'shop ing' )
        // this.smsRemaining = result.results.sms_remaining;
      }
    });
  }
  /**
  * Get customer categories
  * @param filterData IDashboardFilterParams interface
  */
   getAutomationTemplate(filterData: IDashboardFilterParams) {
    this.isProcessing = true;
    this.customerApiCallsService.getAutomationTemplate(filterData, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result !== undefined ) {
        this.customerMessages = result.results;
  
      }
    });
  }
  getBusinessName() {
    this.shopName = this.myShops.find(data => data.id === this.shop_id.value)
     return this.shopName?.business_name;
  }
/**
   *On shop changed
   * @param shopId Shop ID
   */
   onShopChanged(shopId) {
    this.getAutomationTemplate({shop_id: shopId});
  }
  onCloseDialog(){
    this.dialogRef.close()
  }

  get shop_id() { return this.automationFormGroup.get('shop_id'); }
  get message() { return this.automationFormGroup.get('message'); }
  get title() { return this.automationFormGroup.get('title'); }
  get image() { return this.automationFormGroup.get('image'); }
  get message_type() { return this.automationFormGroup.get('message_type'); }
  get template_type() { return this.automationFormGroup.get('template_type'); }
  get is_seasonal() { return this.automationFormGroup.get('seasonal_message_type'); }
  get is_recurring() { return this.automationFormGroup.get('is_recurring'); }
  get recurring_interval() { return this.automationFormGroup.get('recurring_interval'); }
  get recurring_date() { return this.automationFormGroup.get('recurring_date'); }
}
