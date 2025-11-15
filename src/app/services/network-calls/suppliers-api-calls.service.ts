import { Injectable } from '@angular/core';
import { ConstantValuesService } from '../constant-values.service';
import { DataProviderService } from '../data-provider.service';
import { NotificationsService } from '../notifications.service';
import { ICallback } from 'src/app/interfaces/callback.interface';

@Injectable({
  providedIn: 'root'
})
export class SuppliersApiCallsService {

  constructor(
    private constantValues: ConstantValuesService,
    private dataProvider: DataProviderService,
    private notificationService: NotificationsService
  ) { }

  /**
   * Get Suppliers
   * @param data New Shop data to submit to server
   * @param callback ICallback function that returns an error or result
   */
  getSuppliers(filterData, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.GET_SUPPLIERS_ENDPOINT, filterData)
      .subscribe(result => {
        callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
      });
  }
  /**
   * Get Supplier Categories
   * @param callback ICallback function that returns an error or result
   */
  getSupplierCategories(callback: ICallback) {
    this.dataProvider.httpGetAll(this.constantValues.GET_SUPPLIER_CATEGORIES_ENDPOINT)
      .subscribe(result => {
        callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
      });
  }
  /**
   * Search my suppliers
   * @param searchText search term
   * @param callback ICallback function that returns an error or result
   */
  searchMySuppliers(searchText, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.SEARCH_PRODUCTS_ENDPOINT, {search_text: searchText})
      .subscribe(result => {
        callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
      });
  }
  /**
   * Create Supplier
   * @param data New Shop data to submit to server
   * @param callback ICallback function that returns an error or result
   */
  createSupplier(data, callback: ICallback) {
    this.dataProvider.create(this.constantValues.CREATE_SUPPLIER_ENDPOINT, data)
      .subscribe(result => {
        callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
      });
  }
  /**
   * Update Supplier
   * @param id Suppier id
   * @param data New Shop data to submit to server
   * @param callback ICallback function that returns an error or result
   */
  updateSupplier(id, data, callback: ICallback) {
    this.dataProvider.update(this.constantValues.GET_SUPPLIERS_ENDPOINT + id + '/', data)
      .subscribe(result => {
        callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
      });
  }
}
