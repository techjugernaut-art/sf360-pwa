import { toFormData } from 'src/app/utils/const-values.utils';
import { IShopLocation } from './../../models/shop/shop-location-update';
import { ICheckDiscount } from './../../models/setup/check-discount';
import { Injectable } from '@angular/core';
import { ConstantValuesService } from '../constant-values.service';
import { DataProviderService } from '../data-provider.service';
import { NotificationsService } from '../notifications.service';
import { ICallback } from 'src/app/interfaces/callback.interface';
import { interval, of } from 'rxjs';
import { startWith, switchMap, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShopsService {

  constructor(
    private constantValues: ConstantValuesService,
    private dataProvider: DataProviderService,
    private notificationService: NotificationsService
  ) { }
  /**
   * Create a  new Shop
   * @param data New Shop data to submit to server
   * @param callback ICallback function that returns an error or result
   */
  createShop(data, callback: ICallback) {
    this.dataProvider.create(this.constantValues.CREATE_SHOP_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
 * Create a  new Shop
 * @param data New Shop data to submit to server
 * @param callback ICallback function that returns an error or result
 */
  editShop(data, callback: ICallback) {
    this.dataProvider.create(this.constantValues.EDIT_SHOP_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
  * Update shop settings
  * @param data New Shop data to submit to server
  * @param callback ICallback function that returns an error or result
  */
  updateShopLogo(data, callback: ICallback) {
    this.dataProvider.createForFormData(this.constantValues.UPDATE_SHOP_LOGO_ENDPOINT, toFormData(data)).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Create StoreFrontMall Name
   * @param data New Shop data to submit to server
   * @param callback ICallback function that returns an error or result
   */
  createStoreFrontMallName(data, callback: ICallback) {
    this.dataProvider.create(this.constantValues.CREATE_MALL_NAME_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Add a slider
   * @param data Slider data
   * @param callback ICallback function that returns an error or result
   */
  addSlider(data, callback: ICallback) {
    this.dataProvider.create(this.constantValues.ADD_BANNER_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Edit a slider
   * @param data Slider data
   * @param callback ICallback function that returns an error or result
   */
  editSlider(data, callback: ICallback) {
    this.dataProvider.create(this.constantValues.EDIT_BANNER_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
  * Delete a slider
  * @param data Slider data
  * @param callback ICallback function that returns an error or result
  */
  deleteSlider(data, callback: ICallback) {
    this.dataProvider.create(this.constantValues.DELETE_BANNER_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Get sliders of shop
   * @param storeId Shop Id
   * @param callback ICallback function that returns an error or result
   */
  getAllSliders(storeId, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.GET_BANNER_ENDPOINT, { shop_id: storeId }).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Pay for premium subscription
   * @param data New Shop data to submit to server
   * @param callback ICallback function that returns an error or result
   */
  payPremium(data, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.PAY_FOR_PREMIUM_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
  * Get premium plans
  * @param callback ICallback function that returns an error or result
  */
  getPremiumPlans(callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.GET_PREMIUM_PLANS_ENDPOINT).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
  * Get premium plans
  * @param callback ICallback function that returns an error or result
  */
   getExchangeRate(callback: ICallback) {
    this.dataProvider.httpGetAll(this.constantValues.GET_EXCHANGE_RATE_ENDPOINT).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
 * Get premium plans
 * @param callback ICallback function that returns an error or result
 */
  getMallPremiumPlans(callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.GET_MALL_PREMIUM_PLANS_ENDPOINT).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Check for discount code
   * @param data New Shop data to submit to server
   * @param callback ICallback function that returns an error or result
   */
  checkDiscount(data: ICheckDiscount, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.CHECK_DISCOUNT_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Update shop location
   * @param data Shop location data to submit to server
   * @param callback ICallback function that returns an error or result
   */
  updateShopLocation(data: IShopLocation, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.UPDATE_SHOP_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Check for momo transaction status
   * @param transactionId Transaction ID
   * @param callback ICallback function that returns an error or result
   */
  checkMoMoStatus(transactionId, callback: ICallback) {
    this.dataProvider.transactionPolling(this.constantValues.CHECK_MOMO_ENDPOINT, { transaction_id: transactionId })
      .subscribe(result => {
      }, error => {
      });
  }

  /**
   * Validate StoreFrontMall Name
   * @param data New Shop data to submit to server
   * @param callback ICallback function that returns an error or result
   */
  validateStoreFrontMallName(data, callback: ICallback) {
    this.dataProvider.create(this.constantValues.VALIDATE_MALL_NAME_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      // this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
 * Get all my shops
 * @param callback ICallback function that returns an error or result
 */
  getMyShop(filterParams, callback: ICallback) {
    let singleShop = false;
    // tslint:disable-next-line: max-line-length
    if (filterParams !== null && filterParams !== undefined && filterParams.shop_id !== null && filterParams.shop_id !== undefined && filterParams.shop_id !== '') {
      singleShop = true;
    }
    this.dataProvider.getAll(this.constantValues.GET_SHOPS_ENDPOINT, filterParams).subscribe(result => {
      if (singleShop) {
        const results: any[] = result.results;
        const finalResult: any[] = results.filter(element => +element.id === +filterParams.shop_id);
        result.results = finalResult;
      }
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Get Payment Request submitted by a shop owner for a shop
   * @param shopId Shop Id
   * @param callback ICallback function that returns an error or result
   */
  getPaymentRequest(shopId, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.GET_PAYMENT_REQUESTS_ENDPOINT, { shop_id: shopId }).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Get Payment Request submitted by a shop owner for all shop
   */
  getPaymentRequests(callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.GET_PAYMENT_REQUESTS_ENDPOINT).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Submit Payment Request for a shop
   * @param payload Payment Request Payload
   * @param callback ICallback function that returns an error or result
   */
  submitPaymentRequest(payload, callback: ICallback) {
    this.dataProvider.create(this.constantValues.SUBMIT_PAYMENT_REQUEST_ENDPOINT, payload).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Update Payment Request submitted for a shop
   * @param payload Payment Request Payload
   * @param callback ICallback function that returns an error or result
   */
  updatePaymentRequest(payload, callback: ICallback) {
    this.dataProvider.create(this.constantValues.UPDATE_PAYMENT_REQUEST_ENDPOINT, payload).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
  * Verify whatsapp phone numbers to enable whatsapp communication
  * @param payload Payload to submit to server
  * @param callback ICallback function that returns an error or result
  */
  verifyWhatsAppPhoneNumber(payload, callback: ICallback) {
    this.dataProvider.create(this.constantValues.VERIFY_WHATSAPP_NUMBER_ENDPOINT, payload).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
  * Add whatsapp phone numbers to enable whatsapp communication
  * @param payload Payload to submit to server
  * @param callback ICallback function that returns an error or result
  */
  addWhatsAppPhoneNumber(payload, callback: ICallback) {
    this.dataProvider.create(this.constantValues.ADD_WHATSAPP_NUMBER_ENDPOINT, payload).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
* Enable whatsapp communication
* @param payload Payload to submit to server
* @param callback ICallback function that returns an error or result
*/
  enableWhatsAppCommunication(payload, callback: ICallback) {
    this.dataProvider.create(this.constantValues.ENABLE_WHATSAPP_COMMUNICATION_ENDPOINT, payload).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
  * Disable whatsapp communication
  * @param payload Payload to submit to server
  * @param callback ICallback function that returns an error or result
  */
  disableWhatsAppCommunication(payload, callback: ICallback) {
    this.dataProvider.create(this.constantValues.DISABLE_WHATSAPP_COMMUNICATION_ENDPOINT, payload).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
  * Fetch SageOne Company
  * @param payload Payload to submit to server
  * @param callback ICallback function that returns an error or result
  */
  fetchSageOneCompany(payload, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.FETCH_SAGE_COMPANIES_ENDPOINT, payload).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
  * Assign SageOne Company
  * @param payload Payload to submit to server
  * @param callback ICallback function that returns an error or result
  */
  assignSageOneCompany(payload, callback: ICallback) {
    this.dataProvider.create(this.constantValues.ASSIGN_SAGE_COMPNAY_ID_ENDPOINT, payload).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
  * Fetch SageOne Bank Account
  * @param payload Payload to submit to server
  * @param callback ICallback function that returns an error or result
  */
  fetchSageOneBankAccounts(payload, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.FETCH_SAGE_BANK_ACCOUNTS_ENDPOINT, payload).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
  * Assign SageOne Bank Account
  * @param payload Payload to submit to server
  * @param callback ICallback function that returns an error or result
  */
  assignSageOneBankAccount(payload, callback: ICallback) {
    this.dataProvider.create(this.constantValues.ASSIGN_SAGE_BANK_ACCOUNT_ENDPOINT, payload).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }

  /**
  * Update return policy days
  * @param payload Payload to submit to server
  * @param callback ICallback function that returns an error or result
  */
  updateReturnPolicy(payload, callback: ICallback) {
    this.dataProvider.create(this.constantValues.UPDATE_RETURN_POLICY_ENDPOINT, payload).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
  * Update receive reports settings
  * @param payload Payload to submit to server
  * @param callback ICallback function that returns an error or result
  */
  updateEmailReporting(payload, callback: ICallback) {
    this.dataProvider.create(this.constantValues.UPDATE_SHOP_EMAIL_REPORTING, payload).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
  * Verify Email
  * @param payload Payload to submit to server
  * @param callback ICallback function that returns an error or result
  */
   initiateEmailVerification(payload, callback: ICallback) {
    this.dataProvider.create(this.constantValues.INITIATE_EMAIL_VERIFICATION, payload).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
  * Verify Email
  * @param payload Payload to submit to server
  * @param callback ICallback function that returns an error or result
  */
   verifyEmail(payload, callback: ICallback) {
    this.dataProvider.create(this.constantValues.VERIFY_EMAIL, payload).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Filter invoices
   * @param filterParams Filter parameters
   * @param callback ICallback function that returns an error or result
   */
  filterInvoices(filterParams, callback: ICallback) {
    this.dataProvider.create(this.constantValues.FILTER_INVOICES_ENDPOINT, filterParams).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
* use free trial
* @param payload Payload to submit to server
* @param callback ICallback function that returns an error or result
*/
  useFreeTrail(shopId, callback: ICallback) {
    this.dataProvider.create(this.constantValues.USE_FREE_TRAIL, shopId).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Get storefront plans
   */
   fetchStorefrontPlans(callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.FETCH_STOREFRONT_PLANS).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
    /**
  * Generate unique paga code
  * @param callback ICallback function that returns an error or result
  */
     generatePagaUniqueCode(callback: ICallback) {
      this.dataProvider.create(this.constantValues.GENERATE_PAGA_UNIQUE_CODE).subscribe(result => {
        callback(null, result);
      }, error => {
        callback(error, null);
        this.notificationService.snackBarErrorMessage(error.message);
      });
    }
  /**
  * Update Payment Request submitted for a shop
  * @param callback ICallback function that returns an error or result
  */
  getIndustries(callback: ICallback) {
    const industries = [
      { name: 'Books & Stationary', icon: 'assets/img/icons/stationery.svg' },
      { name: 'Beauty & Cosmetics', icon: 'assets/img/icons/beauty_cosmetics.svg' },
      { name: 'Beverages & Liquor', icon: 'assets/img/icons/beverage_liqour.svg' },
      { name: 'Building Materials', icon: 'assets/img/icons/building_materials.svg' },
      { name: 'Electronics & Hardware', icon: 'assets/img/icons/electronics_hardware.svg' },
      { name: 'Cafe, Bars & Restaurants', icon: 'assets/img/icons/bar_restaurant.svg' },
      { name: 'Health & Wellness', icon: 'assets/img/icons/health_wellness.svg' },
      { name: 'Pharmaceuticals', icon: 'assets/img/icons/pharmaceutical.svg' },
      { name: 'Provision Store', icon: 'assets/img/icons/provisions.svg' },
      { name: 'Fashion & Clothing', icon: 'assets/img/icons/clothing_shoes.svg' },
      { name: 'Supermarket', icon: 'assets/img/icons/supermarket.svg' },
      { name: 'Travel & Holiday', icon: 'assets/img/icons/travel.svg' },
      { name: 'Furniture & Accessories', icon: 'assets/img/icons/furniture.svg' },
      { name: 'Frozen Foods', icon: 'assets/img/icons/food_and_drinks.svg' },
      { name: 'Media & Printing', icon: 'assets/img/icons/print_media.svg' },
      { name: 'Other', icon: 'assets/img/icons/others.svg' }
    ];
    callback(null, industries);
  }
}
