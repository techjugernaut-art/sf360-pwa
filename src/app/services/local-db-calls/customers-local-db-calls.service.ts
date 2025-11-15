import { IDashboardFilterParams } from './../../interfaces/dashboard-overview-filter.interface';
import { Injectable } from '@angular/core';
import { ICallback } from 'src/app/interfaces/callback.interface';
import { localStoreNames } from 'src/app/interfaces/local-db-stores/local-db-store-names';
import { ConstantValuesService } from '../constant-values.service';
import { LocalDataProviderService } from '../local-data-provider.service';
import { NotificationsService } from '../notifications.service';

@Injectable({
  providedIn: 'root'
})
export class CustomersLocalDbCallsService {

  shop_id_index = 'shop_id';
  constructor(
    private constantValues: ConstantValuesService,
    private dataProvider: LocalDataProviderService,
    private notificationService: NotificationsService
  ) { }

  /**
   * Get customers persisted in localstorage
   * @param shopId shopId
   * @param callback ICallback function that returns an error or result
   */
  getCustomers(filterParam: IDashboardFilterParams, callback: ICallback) {
    this.dataProvider.getAll(localStoreNames.persisted_customers).subscribe(result => {
      const data: any[] = (result[0] !== null && result[0] !== undefined) ? result[0].data : [];
      let queryResult = data;
      if (filterParam.shop_id !== null && filterParam.shop_id !== undefined && filterParam.shop_id !== '') {
        queryResult = data.filter(el => +el.shop.id === +filterParam.shop_id);
      }
      callback(null, {results: queryResult, previous: '', next: '', count: queryResult.length, response_code: '100'});
    }, error => {
      callback(error, null);
    });
  }
  /**
   * Persist customers fetched from remote to localstorage
   * @param data data
   * @param callback ICallback function that returns an error or result
   */
  persistCustomers(data, callback: ICallback) {
    this.dataProvider.create(localStoreNames.persisted_customers, {data: data}).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
    });
  }
  /**
   * Clear products persisted in local storage from remote server
   * @param callback ICallback function that returns an error or result
   */
  clearPersistedFromRemote(callback: ICallback) {
    // tslint:disable-next-line: max-line-length
    return this.dataProvider.clear(localStoreNames.persisted_customers).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(this.constantValues.LOCAL_STORAGE_SAVE_ERROR_MESSAGE);
    });
  }
}
