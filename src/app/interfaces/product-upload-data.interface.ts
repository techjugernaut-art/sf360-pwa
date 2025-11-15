export interface ProductUploadData {
  product_name: string;
  quantity: number;
  price: number;
  supplier_price: number;
  low_stock_threshold: number;
  expiry_date: string;
  is_service: boolean;
  vat_value: number;
  vat_inclusive: boolean;
  supplier_name: string;
  supplier_phone_number: string;
  supplier_address: string;
  product_category: string;
}
/**
 * Product Upload Columns mapping (server_name to client_name)
 */
export const productUploadColumnNames = [
  {server_name: 'product_name', client_name: 'Product Name'},
  {server_name: 'quantity', client_name: 'Quantity'},
  {server_name: 'price', client_name: 'Unit Price'},
  {server_name: 'supplier_price', client_name: 'Supplier Price'},
  {server_name: 'low_stock_threshold', client_name: 'Low Stock Threshold'},
  {server_name: 'expiry_date', client_name: 'Expiry Date'},
  {server_name: 'is_service', client_name: 'Is Service'},
  {server_name: 'vat_value', client_name: 'Vat Value'},
  {server_name: 'vat_inclusive', client_name: 'Vat Inclusive'},
  {server_name: 'supplier_name', client_name: 'Supplier Name'},
  {server_name: 'supplier_phone_number', client_name: 'Supplier Phone Number'},
  {server_name: 'supplier_address', client_name: 'Supplier Address'},
  {server_name: 'product_category', client_name: 'Product Category'},
  {server_name: 'barcode', client_name: 'Barcode'},
];
