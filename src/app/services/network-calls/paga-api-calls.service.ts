import { Injectable } from '@angular/core';
import { ICallback } from 'src/app/interfaces/callback.interface';
import { ConstantValuesService } from '../constant-values.service';
import { DataProviderService } from '../data-provider.service';
import { NotificationsService } from '../notifications.service';

@Injectable({
  providedIn: 'root'
})

export class PagaApiCallsService {

  constructor(
    private constantValues: ConstantValuesService,
    private dataProvider: DataProviderService,
    private notificationService: NotificationsService
  ) { }

    /**
  * Get Banks
  * @param param referenceNumber
  * @param callback ICallback function that returns an error or result
  */
  getPagaBanks(param, callback: ICallback) {
    this.dataProvider.pagaHttpPOST(this.constantValues.GET_PAGA_BANKS, param).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.message);
    });
  }
    /**
  * Get persistent account
  * @param params referenceNumber, accountIdentifier
  * @param callback ICallback function that returns an error or result
  */
  getPersistentPaymentAccount(param, callback: ICallback) {
    this.dataProvider.pagaHttpPOST(this.constantValues.GET_PERSISTENT_PAYMENT_ACCOUNT, param).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.message);
    });
  }
  /**
  * Get persistent account
  * @param payload payload
  * @param callback ICallback function that returns an error or result
  */
  createPersistentPaymentAccount(param, callback: ICallback) {
    this.dataProvider.pagaHttpPOST(this.constantValues.CREATE_PERSISTENT_PAYMENT_ACCOUNT, param).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.message);
    });
  }
  /**
   * Get persistent account
   * @param payload payload
   * @param callback ICallback function that returns an error or result
   */
  updatePersistentPaymentAccount(payload, callback: ICallback) {
    this.dataProvider.pagaHttpPOST(this.constantValues.UPDATE_PERSISTENT_PAYMENT_ACCOUNT, payload).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.message);
    });
  }
  /**
  * Create paymenst request
  * @param payload payload
  * @param callback ICallback function that returns an error or result
  */
  paymentRequest(param, callback: ICallback) {
    this.dataProvider.pagaHttpPOST(this.constantValues.CREATE_PAYMENT_REQUEST, param).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.message);
    });
  }
  /**
  * Check paga account balance
  * @param payload payload
  * @param callback ICallback function that returns an error or result
  */
  pagaAccountBalance(referenceNumber, callback: ICallback) {
    this.dataProvider.pagaHttpPOST(this.constantValues.GET_PAGA_ACCOUNT_BALANCE, referenceNumber).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.message);
    });
  }

  /**
  * GET paga mobile operations
  * @param payload payload {referenceNumber, locale}
  * @param callback ICallback function that returns an error or result
  */
  pagaGetMobileOperators(payload, callback: ICallback) {
    this.dataProvider.pagaHttpPOST(this.constantValues.GET_PAGA_MOBILE_OPERATORS, payload).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.message);
    });
  }

  /**
  * Automatically Money Tranfer on Behalf of Kudigo
  * @param payload {referenceNumber, amount, skipMessaging} 
  * @param callback ICallback function that returns an error or result
  */
  moneyTransfer(referenceNumber, amount, skipMessaging, callback: ICallback) {
    this.dataProvider.pagaHttpPOST(this.constantValues.PAGA_MONEY_TRANSFER + referenceNumber + '/amount/' + amount + '/skipMessaging/' + skipMessaging).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.message);
    });
  }

}
