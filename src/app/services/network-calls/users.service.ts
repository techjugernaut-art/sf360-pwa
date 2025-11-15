import { IChangePassword } from './../../models/setup/change-password';
import { IResetPIN } from './../../models/setup/reset-pin';
import { ICreateNewPIN } from './../../models/setup/create-new-pin';
import { Injectable } from '@angular/core';
import { ConstantValuesService } from '../constant-values.service';
import { DataProviderService } from '../data-provider.service';
import { NotificationsService } from '../notifications.service';
import { ICallback } from 'src/app/interfaces/callback.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private constantValues: ConstantValuesService,
    private dataProvider: DataProviderService,
    private notificationService: NotificationsService
  ) { }
  /**
   * Get a user's profile
   * @param callback ICallback function that returns an error or result
   */
  me(callback: ICallback) {
    this.dataProvider.httpGetAll(this.constantValues.USER_PROFILE_ENDPOINT).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
   /**
   * Check the existence of user's phone number
   * @param data data to submit to server for verification
   * @param callback ICallback function that returns an error or result
   */
  checkPhoneNumber(data, callback: ICallback) {
    this.dataProvider.createNoToken(this.constantValues.CHECK_PHONE_NUMBER, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * KudiGo Partner Login
   * @param data data to submit to server
   * @param callback ICallback function that returns an error or result
   */
  partnerLogin(data, callback: ICallback) {
    this.dataProvider.createNoToken(this.constantValues.PARTNER_LOGIN_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
 /**
   * Send verification code to user
   * @param data data to submit to server for verification
   * @param callback ICallback function that returns an error or result
   */
  sendVerificationCodeToUser(data, callback: ICallback) {
    this.dataProvider.createNoToken(this.constantValues.SEND_VERIFICATION_CODE, data).subscribe(result => {
      this.notificationService.snackBarMessage('Verification code sent successfully');
      callback(null, result);
    }, error => {
      if (error.response_code !== undefined && error.response_code !== null && error.response_code === '101') {
        callback(null, error);
      } else {
        callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
      }
    });
  }
  /**
   * Confirm User Sign Up
   * @param data data to submit to server for verification
   * @param callback ICallback function that returns an error or result
   */
  confirmUserSignUp(data, callback: ICallback) {
    this.dataProvider.createNoToken(this.constantValues.CONFIRM_SIGNUP_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Send verification code to user
   * @param data data to submit to server for verification
   * @param callback ICallback function that returns an error or result
   */
  resendOTP(data, callback: ICallback) {
    this.dataProvider.createNoToken(this.constantValues.RESEND_OTP_CODE_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
   /**
   * Create new user account
   * @param data data to submit to server
   * @param callback ICallback function that returns an error or result
   */
  newUserSignUp(data, callback: ICallback) {
    this.dataProvider.createNoToken(this.constantValues.NEW_USER_SIGNUP_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Reset user's PIN
   * @param data data to submit to server
   * @param callback ICallback function that returns an error or result
   */
  resetPIN(data: IResetPIN, callback: ICallback) {
    this.dataProvider.createNoToken(this.constantValues.RESET_PIN_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
   /**
   * Confirm PIN Reset
   * @param data data to submit to server
   * @param callback ICallback function that returns an error or result
   */
  resetPINConfirm(data: ICreateNewPIN, callback: ICallback) {
    this.dataProvider.createNoToken(this.constantValues.RESET_PIN_CONFIRM_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Create New PIN
   * @param data data to submit to server
   * @param callback ICallback function that returns an error or result
   */
  createNewPIN(data: ICreateNewPIN, callback: ICallback) {
    this.dataProvider.createNoToken(this.constantValues.SET_NEW_PASSWORD_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Change Password
   * @param data data to submit to server
   * @param callback ICallback function that returns an error or result
   */
  changePassword(data: IChangePassword, callback: ICallback) {
    this.dataProvider.create(this.constantValues.CHANGE_PASSWORD_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Upgrade Agent to give Discount
   * @param id Agent ID
   * @param canGiveDiscount Agent can/cannot give discount
   * @param callback ICallback function that returns an error or result
   */
  upgradeToGiveDiscount(id, canGiveDiscount: boolean, callback: ICallback) {
    this.constantValues.primaryKey = id;
    this.dataProvider.create(this.constantValues.CAN_GIVE_DISCOUNT_ENDPOINT, {can_give_discount: canGiveDiscount}).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Change Modify Order Permission for an agent
   * @param id Agent ID
   * @param canModifyOrderPrice Agent can/cannot modify price during sales
   * @param callback ICallback function that returns an error or result
   */
  changeModifyOrderPermission(id, canModifyOrderPrice: boolean, callback: ICallback) {
    this.constantValues.primaryKey = id;
    // tslint:disable-next-line: max-line-length
    this.dataProvider.create(this.constantValues.CHANGE_MODIFIER_ORDER_PERMISSION_ENDPOINT, {can_modify_order_price: canModifyOrderPrice})
    .subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Change Profit Visibility Permission for an agent
   * @param id Agent ID
   * @param canSeeProfit Agent can/cannot see profit information
   * @param callback ICallback function that returns an error or result
   */
  changeProfitVisibilityPermission(id, canSeeProfit: boolean, callback: ICallback) {
    this.constantValues.primaryKey = id;
    this.dataProvider.create(this.constantValues.CHANGE_PROFIT_VISIBILITY_PERMISSION_ENDPOINT, {can_see_profit_info: canSeeProfit})
    .subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Change Customer Visibility Permission for an agent
   * @param id Agent ID
   * @param canModifyOrderPrice Agent can/cannot customer informatioun
   * @param callback ICallback function that returns an error or result
   */
  changeCustomerVisibilityPermission(id, canSeeCustomerInfo: boolean, callback: ICallback) {
    this.constantValues.primaryKey = id;
    // tslint:disable-next-line: max-line-length
    this.dataProvider.create(this.constantValues.CHANGE_CUSTOMER_VISIBILITY_PERMISSION_ENDPOINT, {can_see_customer_info: canSeeCustomerInfo})
    .subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Change Backdate Orders Permission for an agent
   * @param id Agent ID
   * @param canBackdateOrders Agent can/cannot backdate orders
   * @param callback ICallback function that returns an error or result
   */
  changeBackdateOrdersPermission(id, canBackdateOrders: boolean, callback: ICallback) {
    this.constantValues.primaryKey = id;
    this.dataProvider.create(this.constantValues.CHANGE_BACKDATE_ORDERS_PERMISSION_ENDPOINT, {can_backdate_orders: canBackdateOrders})
    .subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Upgrade or Downgrade Agent to Shop Manager
   * @param id Agent ID
   * @param isUpgrade Whether agent to be upgraded to manager
   * @param callback ICallback function that returns an error or result
   */
  upgradeOrDowngradeAgentManagerPermission(id, isUpgrade: boolean, callback: ICallback) {
    this.constantValues.primaryKey = id;
    const endpoint = isUpgrade ? this.constantValues.UPGRADE_TO_MANAGER_ENDPOINT : this.constantValues.DOWNGRADE_TO_MANAGER_ENDPOINT;
    this.dataProvider.create(endpoint)
    .subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
}
