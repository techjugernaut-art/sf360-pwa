import { ICallback } from './../../interfaces/callback.interface';
import { LocalDataProviderService } from './../local-data-provider.service';
import { Injectable } from '@angular/core';
import { ConstantValuesService } from '../constant-values.service';
import { NotificationsService } from '../notifications.service';
import { localStoreNames } from 'src/app/interfaces/local-db-stores/local-db-store-names';

@Injectable({
  providedIn: 'root'
})
export class ProductsLocalDbCallsService {
  shop_id_index = 'shop_id';
  constructor(
    private constantValues: ConstantValuesService,
    private dataProvider: LocalDataProviderService,
    private notificationService: NotificationsService
  ) { }

  /**
   * Get products persisted in localstorage
   * @param shopId shopId
   * @param callback ICallback function that returns an error or result
   */
  getProducts(shopId, callback: ICallback) {

    this.dataProvider.getAll(localStoreNames.new_presisted_product_store).subscribe(result => {
      // const data: any[] = (result[0] !== null && result[0] !== undefined) ? result[0].data : [];
      const data: any[] = result;
      let queryResult = data;
      if (shopId !== null && shopId !== undefined && shopId !== '') {
        queryResult = data.filter(el => +el.myshop.id === +shopId);
        // console.log(queryResult);
      }
      callback(null, {results: queryResult, previous: '', next: '', count: queryResult.length, response_code: '100'});
    }, error => {
      callback(error, null);
    });
  }
    /**
   * Get products persisted in localstorage
   * @param shopId shopId
   * @param callback ICallback function that returns an error or result
   */
     getProductsNewImplementation(shopId, callback: ICallback) {

      this.dataProvider.getAll(localStoreNames.new_presisted_product_store).subscribe(result => {
        const data: any[] = result;
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
   * Persist products fetched from remote to localstorage
   * @param data data
   * @param callback ICallback function that returns an error or result
   */
  persistProdcts(data, callback: ICallback) {
    this.dataProvider.create(localStoreNames.presisted_product_store, {data: data}).subscribe(result => {
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
    return this.dataProvider.clear(localStoreNames.presisted_product_store).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.error(this.constantValues.APP_NAME, this.constantValues.LOCAL_STORAGE_SAVE_ERROR_MESSAGE);
    });
  }
  /**
   * Clear products persisted in local storage
   * @param callback ICallback function that returns an error or result
   */
  clearProducts(callback: ICallback) {
    // tslint:disable-next-line: max-line-length
    return this.dataProvider.clear(localStoreNames.product_store).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.error(this.constantValues.APP_NAME, this.constantValues.LOCAL_STORAGE_SAVE_ERROR_MESSAGE);
    });
  }
  /**
   * Clear products persisted in local storage
   * @param callback ICallback function that returns an error or result
   */
   clearProductsNewImplementation(callback: ICallback) {
    // tslint:disable-next-line: max-line-length
    return this.dataProvider.clear(localStoreNames.new_presisted_product_store).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.error(this.constantValues.APP_NAME, this.constantValues.LOCAL_STORAGE_SAVE_ERROR_MESSAGE);
    });
  }
  /**
   * Persist products fetched from remote to localstorage
   * @param data data
   * @param callback ICallback function that returns an error or result
   */
   newPersistProdcts(data, callback: ICallback) {
    this.dataProvider.create(localStoreNames.new_presisted_product_store, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
    });
  }
   /**
   * Update Persisted products fetched from remote to localstorage
   * @param data data
   * @param callback ICallback function that returns an error or result
   */
    updatePersistedProducts(data, callback: ICallback) {
      this.dataProvider.updateWithoutKey(localStoreNames.new_presisted_product_store, data).subscribe(result => {
        callback(null, result);
      }, error => {
        callback(error, null);
      });
    }
   /**
   * Get products group persisted in localstorage
   * @param shopId shopId
   * @param callback ICallback function that returns an error or result
   */
  getProdctGroups(shopId, callback: ICallback) {
    this.dataProvider.getAll(localStoreNames.persisted_product_groups_store).subscribe(result => {
      const data: any[] = (result[0] !== null && result[0] !== undefined) ? result[0].data : [];
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
   * Clear product groups persisted in local storage from remote server
   * @param callback ICallback function that returns an error or result
   */
  clearPersistedProductGroupsFromRemote(callback: ICallback) {
    // tslint:disable-next-line: max-line-length
    return this.dataProvider.clear(localStoreNames.persisted_product_groups_store).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.error(this.constantValues.APP_NAME, this.constantValues.LOCAL_STORAGE_SAVE_ERROR_MESSAGE);
    });
  }
  /**
   * Persist product groups fetched from remote to localstorage
   * @param data data
   * @param callback ICallback function that returns an error or result
   */
  persistProdctGroups(data, callback: ICallback) {
    this.dataProvider.create(localStoreNames.persisted_product_groups_store, {data: data}).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
    });
  }
}
