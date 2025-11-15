export const supplierStoreSchema = [
  { name: 'id', keypath: 'id', options: { unique: false } },
  { name: 'shop_id', keypath: 'shop_id', options: { unique: false } },
  { name: 'name', keypath: 'name', options: { unique: false } },
  { name: 'phone_number', keypath: 'phone_number', options: { unique: false } },
  { name: 'physical_address', keypath: 'physical_address', options: { unique: false } },
  { name: 'category_id', keypath: 'category_id', options: { unique: false } },
  { name: 'supplier_code', keypath: 'supplier_code', options: { unique: false } },
  { name: 'foresight_supplier_id', keypath: 'foresight_supplier_id', options: { unique: false } },
  { name: 'frontend_date_created', keypath: 'frontend_date_created', options: { unique: false } }
];
