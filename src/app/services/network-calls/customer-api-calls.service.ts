import { SharedDataApiCallsService } from 'src/app/services/network-calls/shared-data-api-calls.service';
import { OnlineStatusService } from './../online-status.service';
import { CustomersLocalDbCallsService } from './../local-db-calls/customers-local-db-calls.service';
import { CustomerFilterByEnum, RequestMethds } from './../../utils/enums';
import { IFilterParams } from './../../interfaces/filter-params.interface';
import { IDashboardFilterParams } from './../../interfaces/dashboard-overview-filter.interface';
import { Injectable } from '@angular/core';
import { ConstantValuesService } from '../constant-values.service';
import { DataProviderService } from '../data-provider.service';
import { NotificationsService } from '../notifications.service';
import { ICallback } from 'src/app/interfaces/callback.interface';
import { IFilterProductGroupsParams } from 'src/app/interfaces/filter-product-groups';
import { toFormData } from 'src/app/utils/const-values.utils';

@Injectable({
  providedIn: 'root'
})
export class CustomerApiCallsService {

  constructor(
    private constantValues: ConstantValuesService,
    private dataProvider: DataProviderService,
    private customerLocalDbService: CustomersLocalDbCallsService,
    private onlineStatus: OnlineStatusService,
    private sharedService: SharedDataApiCallsService,
    private notificationService: NotificationsService
  ) { }

  /**
    * Gets customer
    * @param filterParams Filter params
    * @param callback ICallback function that returns an error or result
    */
  getCustomersApi(filterParams: IDashboardFilterParams, customerFilterType: CustomerFilterByEnum, callback: ICallback) {
    let endpoint = this.constantValues.GET_CUSTOMERS_ENDPOINT;
    if (customerFilterType === CustomerFilterByEnum.OWING) {
      endpoint = this.constantValues.GET_OWING_CUSTOMERS_ENDPOINT;
    }
    this.dataProvider.getAll(endpoint, filterParams).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
    * Gets customer
    * @param filterParams Filter params
    * @param callback ICallback function that returns an error or result
    */
  getCustomers(filterParams: IDashboardFilterParams, customerFilterType: CustomerFilterByEnum, callback: ICallback) {
    let endpoint = this.constantValues.GET_CUSTOMERS_ENDPOINT;
    if (customerFilterType === CustomerFilterByEnum.OWING) {
      endpoint = this.constantValues.GET_OWING_CUSTOMERS_ENDPOINT;
    }
    let oldData = [];
    this.customerLocalDbService.getCustomers(filterParams, (_error, _result) => {
      callback(_error, _result);
      if (this.onlineStatus.isOnline) {
        this.dataProvider.getAll(endpoint, filterParams)
          .subscribe((result) => {
            if (result !== null && result.next !== null && result.next !== '') {
              this.sharedService.loadAllDataWithNextURL(result.next, RequestMethds.POST, filterParams, (err, res) => {
                if (res !== null) {
                  const remoteData: any[] = res.results;
                  oldData = oldData.concat(remoteData);

                  if (res.next === null || res.next === undefined || res.next === '') {
                    this.customerLocalDbService.clearPersistedFromRemote((er, rs) => {
                      this.customerLocalDbService.persistCustomers(oldData, (_err, _res) => {
                        this.customerLocalDbService.getCustomers(filterParams, (finalError, finalResult) => {
                          callback(finalError, finalResult);
                        });
                      });
                    });
                  }
                }
              });
            } else {
              this.customerLocalDbService.clearPersistedFromRemote((er, rs) => {

                this.customerLocalDbService.persistCustomers(result.results, (_err, _res) => {
                  this.customerLocalDbService.getCustomers(filterParams, (finalError, finalResult) => {
                    callback(finalError, finalResult);
                  });
                });
              });
            }
          }, error => {
            callback(error, null);
            this.notificationService.snackBarErrorMessage(error.detail);
          });
      }
    });
  }
  /**
    * Gets customer categories
    * @param filterParams Filter params
    * @param callback ICallback function that returns an error or result
    */
  getCategories(filterParams: IDashboardFilterParams, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.GET_CUSTOMER_GROUPS_ENDPOINT, filterParams).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
  * Gets customer owing orders
  * @param filterParams Filter params
  * @param callback ICallback function that returns an error or result
  */
  getOwingOrders(filterParams: IDashboardFilterParams, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.GET_CUSTOMER_OWING_ORDERS_ENDPOINT, filterParams).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Add customer
   * @param data data to submit
   * @param callback ICallback function that returns an error or result
   */
  createCustomer(data, callback: ICallback) {
    this.dataProvider.create(this.constantValues.ADD_CUSTOMER_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
  * Update customer
  * @param data data to submit
  * @param callback ICallback function that returns an error or result
  */
  updateCustomer(id, data, callback: ICallback) {
    data.customer_id = id;
    this.dataProvider.create(this.constantValues.EDIT_CUSTOMER_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Search customers
   * @param filterParams Filter params
   * @param callback ICallback function that returns an error or result
   */
  searchCustomer(searchText, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.SEARCH_CUSTOMER_ENDPOINT, { search_text: searchText }).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Add customer category
   * @param data data to submit
   * @param callback ICallback function that returns an error or result
   */
  createCustomerGroup(data, callback: ICallback) {
    this.dataProvider.create(this.constantValues.ADD_CUSTOMER_GROUP_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Update customer category
   * @param data data to submit
   * @param callback ICallback function that returns an error or result
   */
  updateCustomerGroup(id, data, callback: ICallback) {
    this.dataProvider.update(this.constantValues.GET_CUSTOMER_GROUPS_ENDPOINT + id + '/', data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Gets customer discounts
   * @param filterParams Filter params
   * @param callback ICallback function that returns an error or result
   */
  getCustomerDiscounts(filterParams: IDashboardFilterParams, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.CUSTOMER_DISCOUNTS_ENDPOINT, filterParams).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Add customer discount
   * @param data data to submit
   * @param callback ICallback function that returns an error or result
   */
  createCustomerDiscount(data, callback: ICallback) {
    this.dataProvider.create(this.constantValues.ADD_CUSTOMER_DISCOUNT_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Update customer discount
   * @param data data to submit
   * @param callback ICallback function that returns an error or result
   */
  updateCustomerDiscount(id, data, callback: ICallback) {
    this.dataProvider.update(this.constantValues.CUSTOMER_DISCOUNTS_ENDPOINT + id + '/', data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
 * Assign Customers to Customer Group of a shop
 * @param data data to submit
 * @param callback ICallback function that returns an error or result
 */
  getCustomersOfCustomerGroup(id, data, callback: ICallback) {
    this.constantValues.primaryKey = id;
    this.dataProvider.create(this.constantValues.GET_CUSTOMERS_OF_A_GROUP_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
  /**
  * Remove Customers from Customer Groups of a shop
  * @param data data to submit
  * @param callback ICallback function that returns an error or result
  */
  removeCustomersFromCustomerGroup(id, data, callback: ICallback) {
    this.constantValues.primaryKey = id;
    this.dataProvider.create(this.constantValues.REMOVE_CUSTOMERS_FROM_GROUP_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
  /**
   * Assign Customers to Customer Group of a shop
   * @param data data to submit
   * @param callback ICallback function that returns an error or result
   */
  assignCustomersToCustomerGroup(id, data, callback: ICallback) {
    this.constantValues.primaryKey = id;
    this.dataProvider.create(this.constantValues.ASSIGN_CUSTOMERS_TO_GROUP_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
  /**
   * Search customers of a Customer Group in a shop
   * @param id Customer Group Id
   * @param callback ICallback function that returns an error or result
   */
  searchCustomersOfACustomerGroup(id, filterParams: IFilterProductGroupsParams, callback: ICallback) {
    this.constantValues.primaryKey = id;
    this.dataProvider.getAll(this.constantValues.SEARCH_CUSTOMERS_FROM_GROUP_ENDPOINT, filterParams).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
  /**
    * Filter customer categories
    * @param filterParams Filter params
    * @param callback ICallback function that returns an error or result
    */
  filterCampaigns(filterParams: IDashboardFilterParams, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.FILTER_CAMPAIGNS_ENDPOINT, filterParams).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
  * Create a customer campaign
  * @param data data to submit
  * @param callback ICallback function that returns an error or result
  */
  createCampaign(data, callback: ICallback) {
    this.dataProvider.createForFormData(this.constantValues.SEND_CAMPAIGNS_ENDPOINT, toFormData(data)).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
  /**
  * Get SMS packages
  * @param callback ICallback function that returns an error or result
  */
  getSMSPackages(shopId, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.FETCH_SMS_PACKAGES_ENDPOINT, { shop_id: shopId }).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
  /**
   * Purchase SMS Credit
   * @param data data to submit
   * @param callback ICallback function that returns an error or result
   */
  purchaseSMSCredit(data, callback: ICallback) {
    this.dataProvider.create(this.constantValues.PURCHASE_SMS_PACKAGE_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Filter online shop promotion
   * @param filterParams Filter params
   * @param callback ICallback function that returns an error or result
   */
  filterPromotions(filterParams: IDashboardFilterParams, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.FILTER_ONLINE_SHOP_PROMOTIONS_ENDPOINT, filterParams).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
 * Get online shop promotion by id
 * @param promoId Promotion ID
 * @param callback ICallback function that returns an error or result
 */
  getPromotionById(promoId, callback: ICallback) {
    this.dataProvider.httpGetAll(this.constantValues.FILTER_ONLINE_SHOP_PROMOTIONS_ENDPOINT + promoId + '/').subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
 * Create a promotion
 * @param data data to submit
 * @param callback ICallback function that returns an error or result
 */
  createPromotion(data, callback: ICallback) {
    this.dataProvider.create(this.constantValues.CREATE_PROMOTIONS_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
  /**
* Update a promotion
* @param data data to submit
* @param callback ICallback function that returns an error or result
*/
  updatePromotion(primarykey, data, callback: ICallback) {
    this.dataProvider.update(this.constantValues.FILTER_ONLINE_SHOP_PROMOTIONS_ENDPOINT + primarykey + '/', data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
  /**
 * Get promo codes
 * @param promoId Promotion Id
 * @param filterParams Filter parameters
 * @param callback ICallback function that returns an error or result
 */
  getPromoCodes(promoId, storeId, callback: ICallback) {
    this.constantValues.primaryKey = promoId;
    this.dataProvider.getAll(this.constantValues.GET_PROMO_CODES_OF_PROMTION_ENDPOINT, { shop_id: storeId }).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
  /**
* Create a promo code
* @param promoId Promotion Id
* @param data data to submit
* @param callback ICallback function that returns an error or result
*/
  createPromoCode(promoId, data, callback: ICallback) {
    this.constantValues.primaryKey = promoId;
    this.dataProvider.create(this.constantValues.ADD_PROMO_CODE_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
  /**
* Remove promo code
* @param promoId Promotion Id
* @param data data to submit
* @param callback ICallback function that returns an error or result
*/
  removePromoCode(promoCodeId, promoId, shopId, callback: ICallback) {
    this.constantValues.primaryKey = promoId;
    this.dataProvider.create(this.constantValues.REMOVE_PROMO_CODE_OF_PROMTION_ENDPOINT, { code_id: promoCodeId, shop_id: shopId })
      .subscribe(result => {
        callback(null, result);
      }, error => {
        callback(error, null);
        this.notificationService.snackBarErrorMessage(error.detail);
      });
  }
  /**
 * Bulk Customer Upload
 * @param promoId Promotion Id
 * @param data data to submit
 * @param callback ICallback function that returns an error or result
 */
  bulkCustomerUpload(data, callback: ICallback) {
    this.dataProvider.create(this.constantValues.BULK_CUSTOMER_UPLOAD_ENDPOINT, data)
      .subscribe(result => {
        callback(null, result);
      }, error => {
        callback(error, null);
        this.notificationService.snackBarErrorMessage(error.detail);
      });
  }
  /**
  * Get customer campaigns
  * @param filterParams Filter params
  * @param callback ICallback function that returns an error or result
  */
  getCampaignOverview(filterParams: IDashboardFilterParams, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.CAMPAIGN_OVERVIEW, filterParams).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Create a customer message
    * @param filterParams Filter params
    * @param callback ICallback function that returns an error or result
    */
  getAutomationTemplate(filterParams: IDashboardFilterParams, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.GET_AUTOMATION_TEMPLATES_ENDPOINT, filterParams).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
   * Create a customer message
   * @param data data to submit
   * @param callback ICallback function that returns an error or result
   */
  createAutomationTemplate(data, callback: ICallback) {
    this.dataProvider.create(this.constantValues.ADD_AUTOMATION_TEMPLATE_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }

  /**
* Filter customer orders
* @param filterParams Filter parameters
* @param callback ICallback function that returns an error or result
*/
  filterCustomerOrders(filterParams: IFilterParams, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.FILTER_CUSTOMER_ORDERS_ENDPOINT, filterParams).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }


  /**
*Send sales receipt to customer
* @param orderId order Id
* @param frontId frontendId
* @param callback ICallback function that returns an error or result
*/
sendCustomersSalesReceipt(frontId, email, callback: ICallback) {
  this.dataProvider.create(this.constantValues.SEND_EMAIL_CUSTOMERS_RECEIPT_ENDPOINT, {frontend_order_id: frontId, email: email}).subscribe(result => {
    // console.log(customerId, frontId, 'CUST AND FRONTID')
    callback(null, result);
  }, error => {
    callback(error, null);
    this.notificationService.snackBarErrorMessage(error.detail);
  });
}
  /**
* Pay customer credit
* @param callback ICallback function that returns an error or result
*/
payCredit(payload, callback: ICallback) {
  // this.constantValues.primaryKey = promoId;
  this.dataProvider.create(this.constantValues.PAY_CREDIT_ENDPOINT, payload)
    .subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
}

}
