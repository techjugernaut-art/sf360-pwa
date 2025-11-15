import { SharedDataApiCallsService } from 'src/app/services/network-calls/shared-data-api-calls.service';
import { OnlineStatusService } from './../online-status.service';
import { ProductsLocalDbCallsService } from './../local-db-calls/products-local-db-calls.service';
import { IAddExtraProductImage } from './../../interfaces/add-extra-product-image.interfacel';

import { IFilterProductGroupsParams } from './../../interfaces/filter-product-groups';
import { Injectable } from '@angular/core';
import { ConstantValuesService } from '../constant-values.service';
import { DataProviderService } from '../data-provider.service';
import { NotificationsService } from '../notifications.service';
import { ICallback } from 'src/app/interfaces/callback.interface';
import { ResponseOjbect } from 'src/app/models/network-response-object.model';
import { ProductModel } from 'src/app/models/products/products.model';
import { RequestMethds } from 'src/app/utils/enums.util';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(
    private constantValues: ConstantValuesService,
    private dataProvider: DataProviderService,
    private productsLocalDb: ProductsLocalDbCallsService,
    private onlineStatus: OnlineStatusService,
    private sharedService: SharedDataApiCallsService,
    private notificationService: NotificationsService
  ) { }
  /**
 * Get all my products
 * @param filterParams Filter params
 * @param callback ICallback function that returns an error or result
 */
  getMyProducts(filterParams, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.GET_PRODUCTS_ENDPOINT, filterParams).subscribe(_result => {
      callback(null, _result);
    }, _error => {
      callback(_error, null);
      this.notificationService.snackBarErrorMessage(_error.detail);
    });
  }
  /**
 * Get all my products
 * @param filterParams Filter params
 * @param callback ICallback function that returns an error or result
 */
   getMyProductsFromRemoteOnly(filterParams, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.NEW_PRODUCTS_ENDPOINT, filterParams).subscribe(_result => {
      callback(null, _result);
    }, _error => {
      callback(_error, null);
      this.notificationService.snackBarErrorMessage(_error.detail);
    });
  }
  /**
  * Get a product detail by id
  * @param productId Product Id
  * @param callback ICallback function that returns an error or result
  */
  getMyProductById(productId, callback: ICallback) {
    this.dataProvider.httpGetAll(this.constantValues.NEW_PRODUCTS_ENDPOINT + productId + '/')
      .subscribe(result => {
        callback(null, result);
      }, error => {
        callback(error, null);
        this.notificationService.snackBarErrorMessage(error.detail);
      });
  }

  /**
  * Get all duplicate products
  * @param shopId Shop Id
  * @param callback ICallback function that returns an error or result
  */
  getDuplicateProducts(shopId, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.GET_DUPLICATE_PRODUCTS_ENDPOINT, { shop_id: shopId }).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
  /**
   * Merge all duplicated products of a shop
   * @param shopId Shop Id
   * @param callback ICallback function that returns an error or result
   */
  mergeDuplicatedProducts(shopId, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.MERGE_DUPLICATED_PRODUCTS_ENDPOINT, { shop_id: shopId }).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
  /**
 * Create Product
 * @param payload payload to submit to server
 * @param callback ICallback function that returns an error or result
 */
  createProduct(payload, callback: ICallback) {
    this.dataProvider.create(this.constantValues.CREATE_PRODUCTS_ENDPOINT, payload).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
  /**
  * Edit Product
  * @param payload payload to submit to server
  * @param callback ICallback function that returns an error or result
  */
  editProduct(payload, callback: ICallback) {
    this.dataProvider.create(this.constantValues.UPDATE_PRODUCT_ENDPOINT, payload).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
  /**
 * Get all my products
 * @param filterParams Filter params
 * @param callback ICallback function that returns an error or result
 */
  getMyProductsLocalFirstNewImplementation(filterParams, callback: ICallback) {
    let oldData = [];
    this.productsLocalDb.getProducts(filterParams.shop_id, (_error, _result) => {

      callback(_error, _result);
      if (this.onlineStatus.isOnline) {
        this.dataProvider.getAll<ResponseOjbect<ProductModel[]>>(this.constantValues.NEW_PRODUCTS_ENDPOINT, filterParams)
        .subscribe((result: ResponseOjbect<ProductModel[]>) => {
          if (result !== null && result.next !== null && result.next !== '') {
            this.sharedService.loadAllDataWithNextURL(result.next, RequestMethds.POST, filterParams, (err, res) => {
              if (res !== null) {
                const remoteData: any[] = res.results;
                oldData = oldData.concat(remoteData);
                if (res.next === null || res.next === undefined || res.next === '') {
                  this.productsLocalDb.clearProductsNewImplementation((er, rs) => {
                    oldData.forEach(productData => {
                      this.productsLocalDb.newPersistProdcts(productData, (e, r)=> { console.log('got here', e)});
                    });
                    this.productsLocalDb.getProducts(filterParams.shop_id, (finalError, finalResult) => {
                      callback(finalError, finalResult);
                    });
                  });
                }

              }
            });
          } else {
            oldData = result.results;
            this.productsLocalDb.clearProductsNewImplementation((er, rs) => {
              oldData.forEach(productData => {
                this.productsLocalDb.newPersistProdcts(productData, (e, r)=> {});
              });
              this.productsLocalDb.getProducts(filterParams.shop_id, (finalError, finalResult) => {
                callback(finalError, finalResult);
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
  * Get Total Stock Value
  * @param filterParams Filter params
  * @param callback ICallback function that returns an error or result
  */
  getTotalStockValue(filterParams, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.TOTAL_STOCK_VALUE_ENDPOINT, filterParams).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
  /**
  * Filter stock records
  * @param filterParams Filter params
  * @param callback ICallback function that returns an error or result
  */
  filterStockRecord(filterParams, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.FILTER_STOCK_RECORD_ENDPOINT, filterParams).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
  /**
  * Filter stock records
  * @param searchData search Data
  * @param callback ICallback function that returns an error or result
  */
  searchMyProducts(searchData, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.SEARCH_PRODUCTS_ENDPOINT, searchData).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
  /**
   * Get all units of measurment
   * @param storeId Store Id
   * @param callback ICallback function that returns an error or result
   */
  getUnitsOfMeasurement(storeId, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.GET_UNITS_ENDPOINT, { shop_id: storeId }).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
  /**
  * Create unit of measurment
  * @param data payload to submit to server
  * @param callback ICallback function that returns an error or result
  */
  createUnitOfMeasurement(data, callback: ICallback) {
    this.dataProvider.create(this.constantValues.CREATE_UNIT_OF_MEASUREMENT_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
  /**
   * Update unit of measurment
   * @param id Unit of Measurement ID
   * @param data payload to submit to server
   * @param callback ICallback function that returns an error or result
   */
  updateUnitOfMeasurement(id, data, callback: ICallback) {
    this.constantValues.primaryKey = id;
    this.dataProvider.update(this.constantValues.UPDATE_UNIT_OF_MEASUREMENT_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
  /**
 * Change price list
 * @param id Product ID
 * @param data payload to submit to server
 * @param callback ICallback function that returns an error or result
 */
  changePriceList(id, data, callback: ICallback) {
    this.constantValues.primaryKey = id;
    this.dataProvider.create(this.constantValues.CHANGE_PRICE_LIST_FOR_PRODUCT_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
  /**
  * Increase stock for a product
  * @param id Product ID
  * @param data payload to submit to server
  * @param callback ICallback function that returns an error or result
  */
  increaseStock(id, data, callback: ICallback) {
    this.constantValues.primaryKey = id;
    this.dataProvider.create(this.constantValues.INCREASE_QUANTITY_FOR_PRODUCT_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
  /**
   * Decrease stock for a product
   * @param id Product ID
   * @param data payload to submit to server
   * @param callback ICallback function that returns an error or result
   */
  decreaseStock(id, data, callback: ICallback) {
    this.constantValues.primaryKey = id;
    this.dataProvider.create(this.constantValues.DECREASE_QUANTITY_FOR_PRODUCT_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
  /**
   * Set new quantity for a product
   * @param id Product ID
   * @param data payload to submit to server
   * @param callback ICallback function that returns an error or result
   */
  setNewQuantity(id, data, callback: ICallback) {
    this.constantValues.primaryKey = id;
    this.dataProvider.create(this.constantValues.EDIT_QUANTITY_FOR_PRODUCT_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
  /**
  * Get all Product Groups of a shop
  * @param filterParams Filter params
  * @param callback ICallback function that returns an error or result
  */
getProductGroups(storeId, callback: ICallback) {

  this.productsLocalDb.getProdctGroups(storeId, (_error, _result) => {
    callback(_error, _result);
    if (this.onlineStatus.isOnline) {
      this.dataProvider.getAll(this.constantValues.PRODUCT_GROUPS_ENDPOINT, { shop_id: storeId })
      .subscribe((result) => {
        if (result !== null && result.next !== null && result.next !== '') {
          this.sharedService.loadAllDataWithNextURL(result.next, RequestMethds.POST, { shop_id: storeId }, (err, res) => {
            if (res !== null) {
              this.productsLocalDb.clearPersistedProductGroupsFromRemote((er, rs) => {
                this.productsLocalDb.persistProdctGroups(res.results, (_err, _res) => {
                  this.productsLocalDb.getProdctGroups(storeId, (finalError, finalResult) => {
                    callback(finalError, finalResult);
                  });
                });
              });
            }
          });
        } else {
          this.productsLocalDb.clearPersistedProductGroupsFromRemote((er, rs) => {
            this.productsLocalDb.persistProdctGroups(result.results, (_err, _res) => {
              this.productsLocalDb.getProdctGroups(storeId, (finalError, finalResult) => {
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
  * Get all Product Groups of a shop
  * @param filterParams Filter params
  * @param callback ICallback function that returns an error or result
  */
 getProductGroupsFromRemoteOnly(storeId, callback: ICallback) {
  this.dataProvider.getAll(this.constantValues.PRODUCT_GROUPS_ENDPOINT, { shop_id: storeId })
  .subscribe(result => {
    callback(null, result);
  }, error => {
    callback(error, null);
    this.notificationService.snackBarErrorMessage(error.detail);
  });

}
  /**
  * Get all Product Groups of a shop
  * @param data data to submit
  * @param callback ICallback function that returns an error or result
  */
  createProductGroup(data, callback: ICallback) {
    this.dataProvider.create(this.constantValues.CREATE_PRODUCT_GROUP_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
   /**
  * Get all Product Groups of a shop
  * @param data data to submit
  * @param callback ICallback function that returns an error or result
  */
 updateProductGroup(id, data, callback: ICallback) {
  this.dataProvider.update(this.constantValues.PRODUCT_GROUPS_ENDPOINT + id + '/', data).subscribe(result => {
    callback(null, result);
  }, error => {
    callback(error, null);
    this.notificationService.snackBarErrorMessage(error.detail);
  });
}
 /**
  * Remove Products from Product Groups of a shop
  * @param data data to submit
  * @param callback ICallback function that returns an error or result
  */
 removeProductsFromProductGroup(id, data, callback: ICallback) {
   this.constantValues.primaryKey = id;
  this.dataProvider.create(this.constantValues.REMOVE_PRODUCTS_FROM_PRODUCT_GROUP_ENDPOINT, data).subscribe(result => {
    callback(null, result);
  }, error => {
    callback(error, null);
    this.notificationService.snackBarErrorMessage(error.detail);
  });
}
 /**
  * Assign Products to Product Groups of a shop
  * @param data data to submit
  * @param callback ICallback function that returns an error or result
  */
 assignProductsToProductGroup(id, data, callback: ICallback) {
  this.constantValues.primaryKey = id;
 this.dataProvider.create(this.constantValues.ASSIGN_PRODUCTS_GROUP_ENDPOINT, data).subscribe(result => {
   callback(null, result);
 }, error => {
   callback(error, null);
   this.notificationService.snackBarErrorMessage(error.detail);
 });
}
  /**
   * Search products of a Product Group in a shop
   * @param productGroupId Product Group Id
   * @param callback ICallback function that returns an error or result
   */
  searchProuctsOfAProductGroup(productGroupId, filterParams: IFilterProductGroupsParams, callback: ICallback) {
    this.constantValues.primaryKey = productGroupId;
    this.dataProvider.getAll(this.constantValues.SEARCH_PRODUCTS_OF_PRODUCT_GROUP_ENDPOINT, filterParams).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
  /**
   * Gets products of a Product Group in a shop
   * @param productGroupId Product Group Id
   * @param callback ICallback function that returns an error or result
   */
  prouctsOfAProductGroup(productGroupId, shopId, callback: ICallback) {
    this.constantValues.primaryKey = productGroupId;
    this.dataProvider.getAll(this.constantValues.GET_PRODUCTS_OF_GROUP_ENDPOINT, { shop_id: shopId }).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
   /**
  * Add extra product image
  * @param data data to submit
  * @param callback ICallback function that returns an error or result
  */
 addExtraProductImasge(data: IAddExtraProductImage, callback: ICallback) {
  this.dataProvider.create(this.constantValues.ADD_EXTRA_PRODUCT_IMAGE_ENDPOINT, data).subscribe(result => {
    callback(null, result);
  }, error => {
    callback(error, null);
    this.notificationService.snackBarErrorMessage(error.detail);
  });
}
  /**
  * Remove extra product image
  * @param imageId Image Id
  * @param callback ICallback function that returns an error or result
  */
 removeExtraProductImage(imageId, shopId, callback: ICallback) {
  this.dataProvider.create(this.constantValues.REMOVE_EXTRA_PRODUCT_IMAGE_ENDPOINT, {image_id: imageId, shop_id: shopId})
  .subscribe(result => {
    callback(null, result);
  }, error => {
    callback(error, null);
    this.notificationService.snackBarErrorMessage(error.detail);
  });
}
  /**
  * Get all promo tags
  * @param callback ICallback function that returns an error or result
  */
  getPromoTags(callback: ICallback) {
    this.dataProvider.httpGetAll(this.constantValues.GET_TAGS_ENDPOINT).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
   /**
  * Get all vat values
  * @param callback ICallback function that returns an error or result
  */
 getVatValues(callback: ICallback) {
  this.dataProvider.httpGetAll(this.constantValues.GET_VAT_VALUES).subscribe(result => {
    callback(null, result);
  }, error => {
    callback(error, null);
    this.notificationService.snackBarErrorMessage(error.detail);
  });
}
  /**
  * Get Total Stock Value
  * @param filterParams Filter params
  * @param callback ICallback function that returns an error or result
  */
  getInvoiceRequests(filterParams, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.GET_INVOICE_REQUESTS_ENDPOINT, filterParams).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
   /**
  * Get all vat values
  * @param callback ICallback function that returns an error or result
  * @param payload payload object to submit to server
  */
  createInvoiceRequest(payload, callback: ICallback){
    this.dataProvider.create(this.constantValues.CREATE_INVOICE_REQUEST_ENDPOINT, payload).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
  /**
  * Get All purchase order requests
  * @param filterParams Filter params
  * @param callback ICallback function that returns an error or result
  */
  getPurchaseOrders(filterParams, callback: ICallback) {
    this.dataProvider.getAll(this.constantValues.GET_PURCHASE_ORDER_REQUESTS_ENDPOINT, filterParams).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
   /**
  * Get all vat values
  * @param callback ICallback function that returns an error or result
  * @param payload payload object to submit to server
  */
  createPurchaseOrder(payload, callback: ICallback){
    this.dataProvider.create(this.constantValues.CREATE_PURCHASE_ORDER_ENDPOINT, payload).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  }

}
