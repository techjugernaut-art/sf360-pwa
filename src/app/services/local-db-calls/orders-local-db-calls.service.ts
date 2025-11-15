import { Injectable } from '@angular/core';
import { ICallback } from 'src/app/interfaces/callback.interface';
import { localStoreNames } from 'src/app/interfaces/local-db-stores/local-db-store-names';
import { ConstantValuesService } from '../constant-values.service';
import { LocalDataProviderService } from '../local-data-provider.service';
import { NotificationsService } from '../notifications.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersLocalDbCallsService {
  

  constructor(
    private constantValues: ConstantValuesService,
    private dataProvider: LocalDataProviderService,
    private notificationService: NotificationsService
  ) { }
  /**
   * Get orders persisted
   * @param shopId shopid
   * @param callback ICallback function that returns an error or result
   */
  getOrders(shopId, callback: ICallback) {
    this.dataProvider.getAll(localStoreNames.persisted_sales_orders).subscribe(result => {
      // console.log(result);
      const data: any[] = (result !== null && result !== undefined) ? result[0].data : [];
      let queryResult = data;
      if (shopId !== null && shopId !== undefined && shopId !== '') {
        queryResult = data.filter(el => +el.myshop.id === +shopId);
      }
      callback(null, {results: queryResult, previous: '', next: '', count: queryResult.length, response_code: '100'});
    }, error => {
      callback(error, null);
    });
  }
  /**
   * Persist sales orders fetched from server locally
   * @param data data to store
   * @param callback ICallback function that returns an error or result
   */
  persistSalesOrders(data, callback: ICallback) {
    this.dataProvider.create(localStoreNames.persisted_sales_orders, {data: data}).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
    });
  }
  /**
   * Clear sales orders persisted in local storage from remote server
   * @param callback ICallback function that returns an error or result
   */
  clearPersistedFromRemote(callback: ICallback) {
    // tslint:disable-next-line: max-line-length
    return this.dataProvider.clear(localStoreNames.persisted_sales_orders).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.error(this.constantValues.APP_NAME, this.constantValues.LOCAL_STORAGE_SAVE_ERROR_MESSAGE);
    });
  }
  /**
   * Clear sales orders persisted in local storage
   * @param callback ICallback function that returns an error or result
   */
  clearSalesOrders(callback: ICallback) {
    // tslint:disable-next-line: max-line-length
    return this.dataProvider.clear(localStoreNames.order).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.error(this.constantValues.APP_NAME, this.constantValues.LOCAL_STORAGE_SAVE_ERROR_MESSAGE);
    });
  }
  /**
   * Persist sales order placed locally before submitting to server
   * @param data data to store
   * @param callback ICallback function that returns an error or result
   */
  placeSalesOrders(data, callback: ICallback) {
    this.dataProvider.create(localStoreNames.order, data).subscribe(result => {
      callback(null, {id: result, data: data});
    }, error => {
      callback(error, null);
    });
  }
    /**
   * Delete customer from local storage by primary key
   * @param primaryKey primary key
   * @param callback ICallback function that returns an error or result
   */
  deleteOrder(primaryKey, callback: ICallback) {
    this.dataProvider.delete(localStoreNames.order, primaryKey).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.error(this.constantValues.APP_NAME, this.constantValues.LOCAL_STORAGE_SAVE_ERROR_MESSAGE);
    });
  }

   /**
   * Getall all local orders persisted
   * @param callback ICallback function that returns an error or result
   */
  getLocalOrders(callback: ICallback) {
    this.dataProvider.getAll(localStoreNames.order).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.error(this.constantValues.APP_NAME, this.constantValues.LOCAL_STORAGE_SAVE_ERROR_MESSAGE);
    });
  }
}
