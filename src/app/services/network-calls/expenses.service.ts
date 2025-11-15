import { Injectable } from '@angular/core';
import { ConstantValuesService } from '../constant-values.service';
import { DataProviderService } from '../data-provider.service';
import { NotificationsService } from '../notifications.service';
import { ICallback } from 'src/app/interfaces/callback.interface';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  constructor(
    private constantValues: ConstantValuesService,
    private dataProvider: DataProviderService,
    private notificationService: NotificationsService
  ) { }
  /**
   * Gets expense categories
   * @param callback ICallback function that returns an error or result
   */
  getCategories(callback: ICallback) {
    this.dataProvider.httpGetAll(this.constantValues.EXPENSE_CATEGORIES_ENDPOINT).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Get all expenses
   * @param callback ICallback function that returns an error or result
   */
  getAll(filterParams, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.FILTER_EXPENSES_ENDPOINT, filterParams).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }

  /**
   * Search expenses
   * @param searchTerms Search terms
   * @param callback ICallback function that returns an error or result
   */
  searchExpense(searchTerms, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.SEARCH_EXPENSES_ENDPOINT, searchTerms).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Creates expense
   * @param data Expense data
   * @param callback ICallback function that returns an error or result
   */
  createExpense(data, callback: ICallback) {
    this.dataProvider.create(this.constantValues.EXPENSES_ENDPOINT, data).subscribe(result => {
      this.notificationService.snackBarMessage('Expense successfully created');
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Updates expense
   * @param id expense id
   * @param data Expense data
   * @param callback ICallback function that returns an error or result
   */
  updateExpense(id, data, callback: ICallback) {
    this.dataProvider.update(this.constantValues.EXPENSES_ENDPOINT + id + '/', data).subscribe(result => {
      this.notificationService.snackBarMessage('Expense successfully updated');
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Create expense category
   * @param data Expense Category data
   * @param callback ICallback function that returns an error or result
   */
  createExpenseCategory(data, callback: ICallback) {
    this.dataProvider.create(this.constantValues.EXPENSE_CATEGORIES_ENDPOINT, data).subscribe(result => {
      this.notificationService.snackBarMessage('Expense Category successfully created');
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Update expense category
   * @param data Expense Category data
   * @param callback ICallback function that returns an error or result
   */
  updateExpenseCategory(id, data, callback: ICallback) {
    this.dataProvider.update(this.constantValues.EXPENSE_CATEGORIES_ENDPOINT + id + '/', data).subscribe(result => {
      this.notificationService.snackBarMessage('Expense Category successfully updated');
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  getExpensesByShopId(shopId, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.SHOP_EXPENSE_CATEGORIES_ENDPOINT, {shop_id: shopId}).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
}
