import { JsonProperty } from 'src/app/utils/json-property-decorator';
import { ShopModel } from '../shop/shop.model';
import { SupplierModel } from '../supplier.model';
import { PriceListModel } from './price-list.model';


export class ProductModel {
  @JsonProperty('id')
  id: number;
  @JsonProperty('apply_vat')
  apply_vat: boolean;
  @JsonProperty('base_unit_name')
  base_unit_name?: string;
  @JsonProperty('color_code')
  color_code?: string;
  @JsonProperty('compressed_image')
  compressed_image?: string;
  @JsonProperty('currency')
  currency: string;
  @JsonProperty('date_created')
  date_created: Date;
  @JsonProperty('description')
  description?: string;
  @JsonProperty('has_expired')
  has_expired: boolean;
  @JsonProperty('tags')
  tags?: string;
  @JsonProperty('myshop')
  myshop: ShopModel;
  @JsonProperty('my_supplier')
  my_supplier: SupplierModel;
  @JsonProperty('product_group')
  product_group?: ProductGroupModel;
  new_expiry_date: string;
  @JsonProperty('image')
  image?: string;
  @JsonProperty('is_service')
  is_service: boolean;
  @JsonProperty('vat_inclusive')
  vat_inclusive: boolean;
  purchases: string;
  @JsonProperty('serial_number')
  serial_number: string;
  @JsonProperty('low_stock_threshold')
  low_stock_threshold: number;
  @JsonProperty('new_low_stock_threshold')
  new_low_stock_threshold: string;
  @JsonProperty('quantity')
  quantity: number;
  @JsonProperty('last_restock_quantity')
  last_restock_quantity: number;
  @JsonProperty('selling_price')
  selling_price: string;
  @JsonProperty('supplier_price')
  supplier_price: string;
  @JsonProperty('purchases_amount')
  purchases_amount: string;
  @JsonProperty('new_quantity')
  new_quantity: string;
  @JsonProperty('new_last_restock_quantity')
  new_last_restock_quantity: string;
  @JsonProperty('vat_value')
  vat_value: string;
  @JsonProperty('price_list')
  price_list?: PriceListModel[];
  @JsonProperty('n')
  Name: string;
  @JsonProperty('recommended_retail_price')
  recommended_retail_price: string;
}






export class ProductGroupModel {
  @JsonProperty('id')
  id: number;
  @JsonProperty('name')
  name?: string;
  @JsonProperty('num_of_products')
  num_of_products: number;
}

