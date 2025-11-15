import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { reportFrequencyEnum } from 'src/app/utils/enums';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { Router } from '@angular/router';


@Component({
  selector: 'app-opt-in-out-email-reports',
  templateUrl: './opt-in-out-email-reports.component.html'
})
export class OptInOutEmailReportsComponent implements OnInit {

  emailOptFormGroup: FormGroup;
  optInOutTitle = 'Email Report Settings';
  storeId = '';
  isProcessing: boolean;
  reportFrequency = reportFrequencyEnum;
  shopInfo: any;
  requestPayload = {};
  myShops = [];

  constructor(
    private notificationService: NotificationsService,
    private dialogRef: MatDialogRef<OptInOutEmailReportsComponent>,
    private shopsService: ShopsService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.emailOptFormGroup = new FormGroup({
      shop_id: new FormControl(''),
      receive_reports: new FormControl(true, [Validators.required]),
      report_frequency: new FormControl(this.reportFrequency.DAILY, [Validators.required]),
      // frequency_date: new FormControl('', [Validators.required])
    });
    this.getShopById(this.requestPayload as IDashboardFilterParams);
    if (this.data !== null && this.data !== undefined) {
      this.storeId = this.data.shop_id;
      this.shop_id.setValue(this.data.shop_id);
      this.receive_reports.setValue(this.data.receive_reports);
      this.report_frequency.setValue(this.data.report_frequency);
      // this.frequency_date.setValue(this.data.frequency_date);
    }
  }
    /**
   * Get shop information by a particular shop id
   * @param filterParams filter param
   */
     getShopById(data: ISharedData) {
      this.isProcessing = true;
      this.shopsService.getMyShop(data, (error, result) => {
        this.isProcessing = false;
        if (result !== null && result.response_code === '100') {
          this.myShops = result.results
          this.shopInfo = result.results[0];
        }
  
      });
    }
     /**
   * Update shared data
   * @param data ISharedData
   */
    onShopChanged(data: ISharedData) {
    if (data !== null && data !== undefined) {
      // tslint:disable-next-line:max-line-length
      this.requestPayload = { shop_id: data.shop_id };
      this.storeId = data.shop_id;
    }
  }
  /**
   * update email reporting
   * @param detail repoting details
   */
  onSubmit(detail) {
    if (this.emailOptFormGroup.valid) {
      // detail.frequency_date = (detail.frequency_date !== null && detail.frequency_date !== '' && detail.frequency_date !== undefined) ? moment(detail.frequency_date).format(this.constantValues.RECURRING_DATE_TIME_FORMAT) : '';
      this.isProcessing = true;
      this.shopsService.updateEmailReporting(detail, (error, result) => {
        this.isProcessing = false;
        if (result !== null && result.response_code === '100') {
          this.notificationService.snackBarMessage('Receive Reports Updated Successfull');
          this.dialogRef.close(result.results);
        }
      });
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }

  get shop_id() { return this.emailOptFormGroup.get('shop_id'); }
  get receive_reports() { return this.emailOptFormGroup.get('receive_reports'); }
  get report_frequency() { return this.emailOptFormGroup.get('report_frequency'); }
  // get frequency_date() { return this.emailOptFormGroup.get('frequency_date'); }

}
