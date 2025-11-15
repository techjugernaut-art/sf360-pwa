export enum RequestMethds {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT'
}
export enum NotificationActions {
  BULK_UPLOAD_TEMPLATE = 'BULK_UPLOAD_TEMPLATE'
}
export enum EventTrackerCategories {
  product_upload = 'product_upload',
  customer_upload = 'customer_upload',
  payment_request = 'payment_request'
}
export enum EventTrackerActions {
  upload_template_file = 'upload_template_file',
  validate_template_data = 'validate_template_data',
  upload_data_to_server = 'upload_data_to_server',
  confirm_data_upload_to_server = 'confirm_data_upload_to_server',
  download_template_file = 'download_template_file',
  payment_request_proceed = 'payment_request_proceed',
  payment_request_business_info_next = 'payment_request_business_info_next',
  payment_request_contact_info_next = 'payment_request_contact_info_next',
  payment_request_business_reg_info_next = 'payment_request_business_reg_info_next',
  payment_request_company_doc_info_next = 'payment_request_company_doc_info_next',
  payment_request_payment_method_and_final_submit_next = 'payment_request_payment_method_and_final_submit_next',
  customer_template_uploaded_file = 'customer_template_uploaded_file',
  customer_template_validated_data = 'customer_template_validated_data',
  customer_uploa_data_to_server = 'customer_uploa_data_to_server',
  customer_template_confirm_data_upload_to_server = 'customer_template_confirm_data_upload_to_server',
  customer_template_download_template_file = 'customer_template_download_template_file'
}
export enum ConstantVariables {
  PHONE_NUMBER_TO_CONFIRM_TEXT = 'phoneNumberToConfirm',
  PREFIX_TEXT = 'prefix',
  INDUSTRY_TEXT = 'INDUSTRY_SELECTED',
  SHOP_ID = 'SHOP_ID',
  SHOP_NAME = 'SHOP_NAME',
  SHOP_CURRENCY = 'SHOP_CURRENCY',
  ONLINE_STORE_ADDRESS = 'ONLINE_STORE_ADDRESS'
}
export enum PaymentMethods {
  MOMO = 'MOMO',
  CARD = 'CARD',
  DIRECT_TRANSFER = 'DIRECT_TRANSFER',
  PAGA = 'PAGA'
}
export enum PagaPaymentMethods {
  BANK_TRANSFER = 'BANK_TRANSFER',
  FUNDING_USSD = 'FUNDING_USSD',
  REQUEST_MONEY = 'REQUEST_MONEY',
}
export enum PaymentNetworks {
  AIR = 'AIR',
  VOD = 'VOD',
  MTN = 'MTN'
}
export enum CurrencyEnums {
  GHS = 'GHS',
  NGN = 'NGN',
  USD = 'USD'
}


export const asyncLocalStorage = {
  setItem: function (key, value) {
      return Promise.resolve().then(function () {
          localStorage.setItem(key, value);
      });
  },
  getItem: function (key) {
      return Promise.resolve().then(function () {
          return localStorage.getItem(key);
      });
  }
};
