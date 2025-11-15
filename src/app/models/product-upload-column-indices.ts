export class ProductUploadColumnIndices {
  product_name: number;
  quantity: number;
  price: number;
  supplier_price: number;
  low_stock_threshold: number;
  expiry_date: number;
  is_service: number;
  vat_value: number;
  vat_inclusive: number;
  supplier_name: number;
  supplier_phone_number: number;
  supplier_address: number;
  product_category: number;
  barcode: number;

  [key: string]: number;
}
