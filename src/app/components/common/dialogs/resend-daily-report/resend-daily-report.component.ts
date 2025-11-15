import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { EditStockActionsEnums } from 'src/app/utils/enums';
import * as moment from 'moment';
import { OrdersApiCallsService } from 'src/app/services/network-calls/orders-api-calls.service';
declare const swal;

@Component({
  selector: 'app-resend-daily-report',
  templateUrl: './resend-daily-report.component.html',
  styleUrls: ['./resend-daily-report.component.scss']
})
export class ResendDailyReportComponent implements OnInit {

  increaseOrDecreaseStockFormGroup: FormGroup;
  editStockModalTitle =  '';
  myShops = [];
  stockEditAction = 'increase';
  isProcessingEditStock: boolean;
  constructor(
    private dataProvider: DataProviderService,
    private constantValues: ConstantValuesService,
    private dialogRef: MatDialogRef<ResendDailyReportComponent>,
    private notificationsService: NotificationsService,
    private ordersApiCallsService: OrdersApiCallsService
  ) { }

  ngOnInit() {
    this.increaseOrDecreaseStockFormGroup = new FormGroup({
      start_date: new FormControl('', [Validators.required]),
      end_date: new FormControl('', [Validators.required]),
      shop_id: new FormControl('', [Validators.required])
    });
    this.getMyShops();
  }

 /**
  * Increase/Decrease stock
  * @param detail details for editing stock
  */
 onResendReport(detail) {

  detail.start_date = moment(detail.start_date).format('DD-MM-YYYY');
  detail.end_date = moment(detail.end_date).format('DD-MM-YYYY');
  this.isProcessingEditStock = true;
  this.ordersApiCallsService.resendDailyReport(detail, (error, result) => {
    this.isProcessingEditStock = false;
      if (result !== null && result !== undefined) {
        this.notificationsService.snackBarMessage('Report succesfully sent');
        this.dialogRef.close(true);
      } else {
      this.isProcessingEditStock = false;
      swal('Daily Report', error.detail, 'error');
      }
  });
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
  get shop_id() { return this.increaseOrDecreaseStockFormGroup.get('shop_id'); }
  get start_date() { return this.increaseOrDecreaseStockFormGroup.get('start_date'); }
  get end_date() { return this.increaseOrDecreaseStockFormGroup.get('end_date'); }
}
