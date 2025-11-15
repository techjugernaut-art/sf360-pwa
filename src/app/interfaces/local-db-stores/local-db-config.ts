import { productsModelStoreSchema } from './stores/products-model-store';
import { networkResponseSchema } from './stores/network-response-store';
import { productGroupStoreSchema } from './stores/product-group-store';
import { DBConfig } from 'ngx-indexed-db';
import { localStoreNames } from './local-db-store-names';
import { orderStoreSchema } from './stores/order-store';
import { customerDiscountStoreSchema } from './stores/customer-discount-store';
import { productStoreSchema } from './stores/product-store';
import { supplierStoreSchema } from './stores/supplier-store';
import { supplierCategoryStoreSchema } from './stores/supplier-category-store';
import { unitOfMeasurementStoreSchema } from './stores/unit-of-measurement-store';
import { customerStoreSchema } from './stores/customer-store';
import { customerGroupStoreSchema } from './stores/customer-group-store';

export const dbName = 'StoreFront';
export const dbConfig: DBConfig = {
  name: dbName,
  version: 7,
  objectStoresMeta: [{
    store: localStoreNames.order,
    storeConfig: { keyPath: 'front_end_id', autoIncrement: true },
    storeSchema: orderStoreSchema
  }, {
    store: localStoreNames.product_group_store,
    storeConfig: { keyPath: 'front_end_id', autoIncrement: true },
    storeSchema: productGroupStoreSchema
  }, {
    store: localStoreNames.customer_discount_store,
    storeConfig: { keyPath: 'front_end_id', autoIncrement: true },
    storeSchema: customerDiscountStoreSchema
  }, {
    store: localStoreNames.product_store,
    storeConfig: { keyPath: 'front_end_id', autoIncrement: true },
    storeSchema: productStoreSchema
  }, {
    store: localStoreNames.presisted_product_store,
    storeConfig: { keyPath: 'front_end_id', autoIncrement: true },
    storeSchema: networkResponseSchema
  }, {
    store: localStoreNames.persisted_product_groups_store,
    storeConfig: { keyPath: 'front_end_id', autoIncrement: true },
    storeSchema: networkResponseSchema
  }, {
    store: localStoreNames.new_presisted_product_store,
    storeConfig: { keyPath: 'id', autoIncrement: false },
    storeSchema: productsModelStoreSchema
  }, {
    store: localStoreNames.supplier_store,
    storeConfig: { keyPath: 'front_end_id', autoIncrement: true },
    storeSchema: supplierStoreSchema
  }, {
    store: localStoreNames.supplier_category_store,
    storeConfig: { keyPath: 'front_end_id', autoIncrement: true },
    storeSchema: supplierCategoryStoreSchema
  }, {
    store: localStoreNames.unit_of_measurements,
    storeConfig: { keyPath: 'front_end_id', autoIncrement: true },
    storeSchema: unitOfMeasurementStoreSchema
  }, {
    store: localStoreNames.customer_store,
    storeConfig: { keyPath: 'front_end_id', autoIncrement: true },
    storeSchema: customerStoreSchema
  }, {
    store: localStoreNames.customer_group_store,
    storeConfig: { keyPath: 'front_end_id', autoIncrement: true },
    storeSchema: customerGroupStoreSchema
  }, {
    store: localStoreNames.persisted_customers,
    storeConfig: { keyPath: 'front_end_id', autoIncrement: true },
    storeSchema: networkResponseSchema
  }]};
