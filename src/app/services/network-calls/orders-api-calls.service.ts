import { AppUtilsService } from './../app-utils.service';
import { OrdersLocalDbCallsService } from './../local-db-calls/orders-local-db-calls.service';
import { IDashboardFilterParams } from './../../interfaces/dashboard-overview-filter.interface';
import { IMallOrderStatus } from './../../models/shop/order-status-update';
import { Injectable } from '@angular/core';
import { ConstantValuesService } from '../constant-values.service';
import { DataProviderService } from '../data-provider.service';
import { NotificationsService } from '../notifications.service';
import { ICallback } from 'src/app/interfaces/callback.interface';
import * as moment from 'moment';
import { OnlineStatusService } from '../online-status.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersApiCallsService {

  constructor(
    private constantValues: ConstantValuesService,
    private dataProvider: DataProviderService,
    private notificationService: NotificationsService,
    private onlineStatus: OnlineStatusService,
    private appUtils: AppUtilsService,
    private orderLocalDbService: OrdersLocalDbCallsService
  ) { }
  /**
 * Update mall order status
 * @param data Status payload
 * @param callback ICallback function that returns an error or result
 */
  updateMallOrderStatus(data: IMallOrderStatus, callback: ICallback) {
    this.dataProvider.create(this.constantValues.UPDATE_MALL_ORDERS_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
  * Get pending mall orders of a shop
  * @param filterParams Filter parameters
  * @param callback ICallback function that returns an error or result
  */
  getPendingMallOrderStatus(filterParams, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.PENDING_MALL_ORDERS_ENDPOINT, filterParams).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Place sales order
   * @param data data to submit to server/localstorage
   * @param callback ICallback function that returns an error or result
   */
  placeOrder(data, callback: ICallback) {
    const bcode = new Date().getTime();
    const millisecondDate = this.appUtils.padLeft(bcode.toString(), '0', 13);
    data.frontend_order_datetime = moment().format(this.constantValues.DATE_TIME_FORMAT);
    data.date_placed = moment().format(this.constantValues.DATE_TIME_FORMAT);
    data.frontend_order_id = millisecondDate;
    data.is_instant = false;
    this.orderLocalDbService.placeSalesOrders(data, (_error, _result) => {
      callback(_error, _result);
      if (_result !== null && this.onlineStatus.isOnline) {
        data.is_instant = true;
        this.dataProvider.create(this.constantValues.ORDERS_ENDPOINT, data).subscribe(result => {
          if (result !== null) {
            this.orderLocalDbService.deleteOrder(_result.id, (delError, delResult) => { });
          }
        }, error => {

        });
      }
    });
  }

  /**
 * Upload bulk orders
 * @param data Status payload
 * @param callback ICallback function that returns an error or result
 */
  uploadBulkOrders(data, callback: ICallback) {
    this.dataProvider.create(this.constantValues.UPLOAD_BULK_ORDERS_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
    });
  }
  resendDailyReport(data, callback: ICallback) {
    this.dataProvider.create(this.constantValues.RESEND_SHOP_REPORT_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
    });
  }
  /**
  * Filter sales orders of a shop
  * @param filterParams Filter parameters
  * @param callback ICallback function that returns an error or result
  */
  filterSalesOrders(filterParams: IDashboardFilterParams, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.FILTER_SALES_ORDERS_ENDPOINT, filterParams).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }

  // filter sales order of a shop by first loading from local storage if available before loading from dataProvider
  filterSalesOrdersFromLocalStorage(filterParams: IDashboardFilterParams, callback: ICallback) {
    this.orderLocalDbService.getOrders(filterParams, (error, result) => {
      if (result !== null) {
        callback(error, result);
      } else {
        this.filterSalesOrders(filterParams, callback);
      }
    });
  }

  syncSalesData(callback: ICallback) {
    this.orderLocalDbService.getLocalOrders((error, result: any[]) => {
      if (result !== null && result.length > 0) {
        const shopId = result[0].shop_id;
        const data = { shop_id: shopId, data: result };
        this.uploadBulkOrders(data, (er, res) => {
          if (res !== null && res.response_code === '100') {
            this.orderLocalDbService.clearSalesOrders((_error, _result) => {
              if (_result) {
                callback(er, res);
              }
            });
          }
        });
      }

    });
  }

}
