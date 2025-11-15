import { Injectable } from '@angular/core';
import { ICallback } from 'src/app/interfaces/callback.interface';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { ConstantValuesService } from '../constant-values.service';
import { DataProviderService } from '../data-provider.service';
import { NotificationsService } from '../notifications.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardApiCallsService {

  constructor(
    private constantValues: ConstantValuesService,
    private dataProvider: DataProviderService,
    private notificationService: NotificationsService
  ) { }

  /**
   * Get business alerts
   * @param filterParams Filter parameters
   * @param callback ICallback function that returns an error or result
   */
  getBusinessAlerts(filterParams: IDashboardFilterParams, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.GET_BUSINESS_ALERTS_ENDPOINT, filterParams).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Get top performing products
   * @param filterParams Filter parameters
   * @param callback ICallback function that returns an error or result
   */
  getTopPerformingProducts(filterParams: IDashboardFilterParams, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.GET_TOP_PERFORMING_PRODUCT_ENDPOINT, filterParams).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
}
