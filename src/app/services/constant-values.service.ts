import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConstantValuesService {
  primaryKey;
  constructor() { }
  get APP_NAME() { return 'KudiGo StoreFront 360'; }
  get REQ_SOURSE() { return 'WEB'; }
  get STOREFRONT_MALL_URL_PROTOCOL() { return environment.PROTOCOL; }
  get STOREFRONT_MALL_URL() { return environment.STOREFRONTMALL_URL; }
  get RECEIPT_BASE_URL() { return environment.RECEIPT_BASE_URL; }
  get FDK_API_KEY() { return environment.fdk; }
  get PAGA_URL() { return environment.PAGA_URL; }
  get PAGA_WEBSERVICES_URL() { return environment.PAGA_WEBSERVICES_URL; }
  get PAGA_API_KEY() { return environment.PAGA_API_KEY; }
  get PAGA_HASH_KEY() { return environment.PAGA_HASH_KEY; }
  // get PAGA_REFERENCE_NUMBER() { return environment.PAGA.REFERENC_NUMBER; }
  get DATE_TIME_FORMAT() { return 'DD/MM/YYYY, hh:mm:ss A'; }
  get RECURRING_DATE_TIME_FORMAT() { return 'DD/MM/YYYY, hh:mm:ss A'; }
  get PAGINATION_OPTIONS() { return [10, 25, 100, 150]; }
  get LOCAL_STORAGE_ERROR_MESSAGE() { return 'Error loading data'; }
  get SUCCESS_REPSONSE_CODE() { return '100'; }
  get LOCAL_STORAGE_SAVE_ERROR_MESSAGE() { return 'Error saving data'; }
  get SLASH_MM_DD_YYYY_DATE_FORMAT() {return 'MM/DD/YYYY'; }
  get EXPIRTY_DATE_FORMAT() { return 'MM-DD-YYYY'; }
  get DD_MM_YYYY_DATE_FORMAT() { return 'DD-MM-YYYY'; }
  get SLASH_DD_MM_YYYY_DATE_FORMAT() { return 'DD/MM/YYYY'; }
  get BASE_URL() { return environment.BASE_URL; }
  get FDK_BASE_URL() { return environment.FDK_BASE_URL; }
  get RESOURCES_BASE_URL() { return environment.RESOURCES_BASE_URL; }
  get USER_PROFILE_ENDPOINT () { return 'users/me/'; }
  get CHECK_PHONE_NUMBER() { return 'check_phone_number/'; }
  get SEND_VERIFICATION_CODE() { return 'send_verification_code/'; }
  get CONFIRM_SIGNUP_ENDPOINT() { return 'signup_confirm/'; }
  get NEW_USER_SIGNUP_ENDPOINT() { return 'new_user_signup/'; }
  get RESET_PIN_ENDPOINT() { return 'reset_password_initiate/'; }
  get RESET_PIN_CONFIRM_ENDPOINT() { return 'reset_password_confirm/'; }
  get SET_NEW_PASSWORD_ENDPOINT() { return 'set_new_password/'; }
  get CHANGE_PASSWORD_ENDPOINT() { return 'change_password/'; }
  get LOGIN_ENDPOINT() { return 'login/'; }
  get GET_VAT_VALUES() { return 'get_vat_values/'; }
  get PARTNER_LOGIN_ENDPOINT() { return 'partner_login/'; }
  get CONFIRM_LOGIN_ENDPOINT() { return 'confirm_login/'; }
  get CONFIRM_PARTNER_LOGIN_ENDPOINT() { return 'partner_confirm_login/'; }
  get GET_UNITS_ENDPOINT() { return 'units/'; }
  get CREATE_UNIT_OF_MEASUREMENT_ENDPOINT() { return 'units/create_unit/'; }
  get UPDATE_UNIT_OF_MEASUREMENT_ENDPOINT() { return 'units/' + this.primaryKey + '/'; }
  get RESEND_OTP_CODE_ENDPOINT() { return 'resend_sms/'; }
  get CREATE_SHOP_ENDPOINT() { return 'create_shop/'; }
  get NEW_PRODUCTS_ENDPOINT() { return 'new_products/'; }
  get VALIDATE_MALL_NAME_ENDPOINT() { return 'validate_storefrontmall_name/'; }
  get CREATE_MALL_NAME_ENDPOINT() { return 'create_storefrontmall_name/'; }
  get GET_SHOPS_ENDPOINT() { return 'fetch_shops/'; }
  get GET_SHOP_ENDPOINT() { return 'fetch_shop/'; }
  get GET_AGENTS_ENDPOINT() {return 'agents/'; }
  get GET_AGENT_SALES_ENDPOINT() { return 'agents/' + this.primaryKey + '/get_orders/'; }
  get GET_OVERVIEW_ENDPOINT() {return 'overview/'; }
  get GET_ORDER_ENDPOINT() {return 'get_order/'; }
  get GET_INTELLISIGHTS_ENDPOINT() {return 'intellisights/'; }
  get GET_SALES_SUMMARY_ENDPOINT() {return 'sales_summary/'; }
  get GET_SALES_MARGIN_ENDPOINT() {return 'sales_margin_report/'; }
  get FILTER_SALES_ORDERS_ENDPOINT() {return 'filter_orders/'; }
  get SEARCH_ORDERS_ENDPOINT() { return 'search_orders/'; }
  get GET_PRODUCTS_ENDPOINT() {return 'products/'; }
  get CREATE_PRODUCTS_ENDPOINT() {return 'new_products/add_product/'; }
  get SEARCH_PRODUCTS_ENDPOINT() {return 'new_search_product/'; }
  get GET_OWING_CUSTOMERS_ENDPOINT() { return 'owing_customers/'; }
  get SEARCH_OWING_CUSTOMER_ENDPOINT() { return 'search_owing_customers/'; }
  get SEARCH_CUSTOMER_ENDPOINT() { return 'search_customers/'; }
  get GET_CUSTOMERS_ENDPOINT() { return 'customers/'; }
  get ADD_CUSTOMER_ENDPOINT() { return 'add_customer/'; }
  get EDIT_CUSTOMER_ENDPOINT() { return 'edit_customer/'; }
  get GET_CUSTOMER_OWING_ORDERS_ENDPOINT() { return 'new_customer_owing_orders/'; }
  get GET_CUSTOMER_GROUPS_ENDPOINT() { return 'customer_groups/'; }
  get ADD_CUSTOMER_GROUP_ENDPOINT() { return 'customer_groups/add_customer_group/'; }
  get ASSIGN_CUSTOMERS_TO_GROUP_ENDPOINT() { return 'customer_groups/'  + this.primaryKey + '/assign_customers/'; }
  get REMOVE_CUSTOMERS_FROM_GROUP_ENDPOINT() { return 'customer_groups/'  + this.primaryKey + '/remove_customers/'; }
  get GET_CUSTOMERS_OF_A_GROUP_ENDPOINT() { return 'customer_groups/'  + this.primaryKey + '/get_customers/'; }
  get SEARCH_CUSTOMERS_FROM_GROUP_ENDPOINT() { return 'customer_groups/'  + this.primaryKey + '/search_customer/'; }
  get CUSTOMER_DISCOUNTS_ENDPOINT() { return 'customer_discounts/'; }
  get ADD_CUSTOMER_DISCOUNT_ENDPOINT() { return 'customer_discounts/add_discount/'; }
  get GET_SUPPLIERS_ENDPOINT() { return 'suppliers/'; }
  get GET_SUPPLIER_CATEGORIES_ENDPOINT() { return 'supplier_categories/'; }
  get CREATE_SUPPLIER_ENDPOINT() { return 'suppliers/add_supplier/'; }
  get FILTER_ORDER_GRAPH_ENDPOINT() { return 'filter_orders_graph/'; }
  get PRODUCT_UPLOAD_ENDPOINT() { return 'new_bulk_product_upload/'; }
  get GET_PRODUCT_ORDER_HISTORY_ENDPOINT() { return 'get_product_order_history/'; }
  get FILTER_TRANSACTIONS_ENDPOINT() { return 'filter_transactions/'; }
  get GET_UNPAGINATED_PRODUCT_ORDER_HISTORY_ENDPOINT() { return 'get_unpaginated_product_order_history/'; }
  get GET_BUSINESS_ALERTS_ENDPOINT() { return 'business_alerts/'; }
  get GET_COUNTRY_INFO_URL() {return 'https://ipapi.co/json/'; }
  get UDATE_NOTIFICATION_TOKEN_ENDPOINT() { return 'users/save_browser_token/'; }
  get UPLOAD_ALL_IMAGES_ENDPOINT () { return 'upload_image/'; }
  get SUBMIT_PAYMENT_REQUEST_ENDPOINT () { return 'submit_payment_request/'; }
  get UPDATE_PAYMENT_REQUEST_ENDPOINT () { return 'edit_payment_request/'; }
  get GET_PAYMENT_REQUESTS_ENDPOINT() { return 'get_payment_request/'; }
  get DECREASE_STOCK_ENDPOINT() { return 'decrease_stock/'; }
  get INCREASE_STOCK_ENDPOINT() { return 'increase_stock/'; }
  get UPDATE_PRODUCT_ENDPOINT() { return 'update_product/'; }
  get GET_TOP_PERFORMING_PRODUCT_ENDPOINT() { return 'top_performing_products/'; }
  get ADD_SHOP_AGENT_ENDPOINT() { return 'add_shop_agent/'; }
  get EXPENSE_CATEGORIES_ENDPOINT() { return 'expenses_category/'; }
  get SHOP_EXPENSE_CATEGORIES_ENDPOINT() { return 'expenses_category/shop_categories/'; }
  get EXPENSES_ENDPOINT() { return 'expenses/'; }
  get FILTER_EXPENSES_ENDPOINT() { return 'filter_expenses/'; }
  get SEARCH_EXPENSES_ENDPOINT() { return 'expenses/categories/'; }
  get EXPENSE_OVERVIEW_ENDPOINT() { return 'expense_overview/'; }
  get TOTAL_STOCK_VALUE_ENDPOINT() { return 'total_stock_value/'; }
  get FILTER_STOCK_RECORD_ENDPOINT() { return 'filter_stock_record/'; }
  get PAY_FOR_PREMIUM_ENDPOINT() { return 'pay_premium/'; }
  get GET_MALL_PREMIUM_PLANS_ENDPOINT() { return 'fetch_mall_plans/'; }
  get GET_PREMIUM_PLANS_ENDPOINT() { return 'fetch_storefront_plans/'; }
  get CHECK_DISCOUNT_ENDPOINT() { return 'check_discount_code/'; }
  get CHECK_MOMO_ENDPOINT() { return 'check_momo_status/'; }
  get CHECK_ORDER_MOMO_STATUS_ENDPOINT() { return 'check_order_momo_status/'; }
  get CHECK_TRANSACTION_ENDPOINT() { return 'check_transaction_status/'; }
  get UPDATE_MALL_ORDERS_ENDPOINT() { return 'update_mall_orders/'; }
  get PENDING_MALL_ORDERS_ENDPOINT() { return 'pending_mall_orders/'; }
  get GET_CURRENT_LOCATION() { return 'http://api.ipstack.com/154.160.19.136?access_key=' + environment.STACK_KEY; }
  get EDIT_SHOP_ENDPOINT() { return 'edit_shop/'; }
  get UPDATE_SHOP_ENDPOINT() { return 'update_shop_location/'; }
  get ADD_BANNER_ENDPOINT() { return 'add_slider/'; }
  get EDIT_BANNER_ENDPOINT() { return 'edit_slider/'; }
  get GET_BANNER_ENDPOINT() { return 'get_sliders/'; }
  get DELETE_BANNER_ENDPOINT() { return 'delete_slider/'; }
  get UPLOAD_BASE_64_ENDPOINT() { return 'upload_base64_image/'; }
  get GET_DUPLICATE_PRODUCTS_ENDPOINT() { return 'get_duplicate_products/'; }
  get MERGE_DUPLICATED_PRODUCTS_ENDPOINT() { return 'merge_duplicate_products/'; }
  get GET_TAGS_ENDPOINT() { return 'get_tags/'; }
  get PRODUCT_GROUPS_ENDPOINT() { return 'product_groups/'; }
  get CREATE_PRODUCT_GROUP_ENDPOINT() { return 'product_groups/create_product_group/'; }
  get PAY_CREDIT_ENDPOINT() { return 'pay_credit/'}
  get SEARCH_PRODUCTS_OF_PRODUCT_GROUP_ENDPOINT() { return 'product_groups/' + this.primaryKey + '/search_product/'; }
  get CHANGE_PRICE_LIST_FOR_PRODUCT_ENDPOINT() { return 'new_products/' + this.primaryKey + '/change_price/'; }
  get INCREASE_QUANTITY_FOR_PRODUCT_ENDPOINT() { return 'new_products/' + this.primaryKey + '/increase_quantity/'; }
  get DECREASE_QUANTITY_FOR_PRODUCT_ENDPOINT() { return 'new_products/' + this.primaryKey + '/decrease_quantity/'; }
  get EDIT_QUANTITY_FOR_PRODUCT_ENDPOINT() { return 'new_products/' + this.primaryKey + '/edit_quantity/'; }
  get ASSIGN_PRODUCTS_GROUP_ENDPOINT() { return 'product_groups/' + this.primaryKey + '/assign_products/'; }
  get REMOVE_PRODUCTS_FROM_PRODUCT_GROUP_ENDPOINT() { return 'product_groups/' + this.primaryKey + '/remove_product/'; }
  get GET_PRODUCTS_OF_GROUP_ENDPOINT() { return 'product_groups/' + this.primaryKey + '/get_products/'; }
  get CAN_GIVE_DISCOUNT_ENDPOINT() { return 'agent_permissions/' + this.primaryKey + '/change_discount_permission/'; }
  get CHANGE_MODIFIER_ORDER_PERMISSION_ENDPOINT() { return 'agent_permissions/' + this.primaryKey + '/change_modify_order_permission/'; }
  get CHANGE_PROFIT_VISIBILITY_PERMISSION_ENDPOINT() { return 'agent_permissions/' + this.primaryKey + '/change_profit_visibility_permission/'; }
  get CHANGE_CUSTOMER_VISIBILITY_PERMISSION_ENDPOINT() { return 'agent_permissions/' + this.primaryKey + '/change_customer_visibility_permission/'; }
  // tslint:disable-next-line: max-line-length
  get CHANGE_BACKDATE_ORDERS_PERMISSION_ENDPOINT() { return 'agent_permissions/' + this.primaryKey + '/change_backdate_orders_permission/'; }
  get UPGRADE_TO_MANAGER_ENDPOINT() { return 'agent_permissions/' + this.primaryKey + '/upgrade_to_manager/'; }
  get DOWNGRADE_TO_MANAGER_ENDPOINT() { return 'agent_permissions/' + this.primaryKey + '/downgrade_manager/'; }
  get FILTER_CAMPAIGNS_ENDPOINT() { return 'filter_customer_campaigns/'; }
  get SEND_CAMPAIGNS_ENDPOINT() { return 'customer_campaigns/add_campaign/'; }
  get KUDIGO_HELP_ENDPOINT() { return 'kudigo_help/'; }
  get TERMS_AND_CONDITIONS_ENDPOINT() { return 't_n_c/'; }
  get FETCH_SMS_PACKAGES_ENDPOINT() { return 'fetch_sms_packages/'; }
  get PURCHASE_SMS_PACKAGE_ENDPOINT() { return 'purchase_sms/'; }
  get ORDER_DEVICE_ENDPOINT() { return 'order_device/'; }
  get FETCH_SAGE_COMPANIES_ENDPOINT() { return 'fetch_sage_companies/'; }
  get ASSIGN_SAGE_COMPNAY_ID_ENDPOINT() { return 'assign_sage_company_id/'; }
  get ASSIGN_SAGE_BANK_ACCOUNT_ENDPOINT() { return 'assign_sage_bank_accounts/'; }
  get FETCH_SAGE_BANK_ACCOUNTS_ENDPOINT() { return 'fetch_sage_bank_accounts/'; }
  get ENABLE_WHATSAPP_COMMUNICATION_ENDPOINT() { return 'enable_whatsapp_communication/'; }
  get DISABLE_WHATSAPP_COMMUNICATION_ENDPOINT() { return 'disable_whatsapp_communication/'; }
  get VERIFY_WHATSAPP_NUMBER_ENDPOINT() { return 'verify_whatsapp_number/'; }
  get ADD_WHATSAPP_NUMBER_ENDPOINT() { return 'add_whatsapp_number/'; }
  get UPDATE_RETURN_POLICY_ENDPOINT() { return 'update_return_policy/'; }
  get ADD_EXTRA_PRODUCT_IMAGE_ENDPOINT() { return 'add_extra_product_image/'; }
  get REMOVE_EXTRA_PRODUCT_IMAGE_ENDPOINT() { return 'remove_extra_product_image/'; }
  get UPDATE_SHOP_LOGO_ENDPOINT() { return 'update_shop_logo/'; }
  get ORDERS_ENDPOINT() { return 'orders/create_order/'; }
  get UPLOAD_BULK_ORDERS_ENDPOINT() { return 'upload_bulk_orders/'; }
  get FILTER_ONLINE_SHOP_PROMOTIONS_ENDPOINT() { return 'promotions/'; }
  get CREATE_PROMOTIONS_ENDPOINT() { return 'promotions/create_promotion/'; }
  get ADD_PROMO_CODE_ENDPOINT() { return 'promotions/' + this.primaryKey + '/add_promo_code/'; }
  get GET_PROMO_CODES_OF_PROMTION_ENDPOINT() { return 'promotions/' + this.primaryKey + '/get_promo_codes/'; }
  get REMOVE_PROMO_CODE_OF_PROMTION_ENDPOINT() { return 'promotions/' + this.primaryKey + '/remove_promo_code/'; }
  get BULK_CUSTOMER_UPLOAD_ENDPOINT() { return 'bulk_customer_upload/'; }
  get FILTER_INVOICES_ENDPOINT() { return 'filter_invoices/'; }
  get CAMPAIGN_OVERVIEW() { return 'campaign_overview/'}
  get GET_AUTOMATION_TEMPLATES_ENDPOINT() {return 'automated_templates/'}
  get ADD_AUTOMATION_TEMPLATE_ENDPOINT() {return 'automated_templates/add_template/'}
  get UPDATE_SHOP_EMAIL_REPORTING() {return 'update_email_report_frequency/'}
  get FILTER_CUSTOMER_ORDERS_ENDPOINT() { return 'customer_orders/'; }
  get GET_INVOICE_REQUESTS_ENDPOINT() {return 'invoice_requests/'; }
  get CREATE_INVOICE_REQUEST_ENDPOINT() {return 'invoice_requests/add_invoice/'; }
  get GET_PURCHASE_ORDER_REQUESTS_ENDPOINT() {return 'puchase_orders/'; }
  get CREATE_PURCHASE_ORDER_ENDPOINT() {return 'puchase_orders/new_order/'; }
  get SEND_EMAIL_CUSTOMERS_RECEIPT_ENDPOINT() { return 'orders/email_customer_receipt/'; }
  get FDK_GET_CATEGORIES_ENDPOINT() { return 'solutions/categories';}
  get FDK_GET_CATEGORIES_FOLDERS_ENDPOINT() { return 'solutions/categories/' + this.primaryKey + '/folders'; }
  get FDK_GET_FOLDER_ARTICLES_ENDPOINT() { return 'solutions/folders/' + this.primaryKey + '/articles'; }
  get FDK_GET_ARTICLE_ENDPOINT() { return 'solutions/articles' }
  get USE_FREE_TRAIL() { return 'free_trial_upgrade/' }
  get FETCH_STOREFRONT_PLANS() { return 'fetch_storefront_plans/' }
  get INITIATE_EMAIL_VERIFICATION() { return 'initiate_email_verification/' }
  get VERIFY_EMAIL() { return 'verify_email/' }
  get GENERATE_PAGA_UNIQUE_CODE() { return 'generate_paga_unique_code/' }
  get GET_EXCHANGE_RATE_ENDPOINT() { return 'get_exchange_rate/'}
  get CREATE_PERSISTENT_PAYMENT_ACCOUNT() { return 'registerPersistentPaymentAccount' }
  get UPDATE_PERSISTENT_PAYMENT_ACCOUNT() { return 'updatePersistentPaymentAccount' }
  get GET_PERSISTENT_PAYMENT_ACCOUNT() { return 'getPersistentPaymentAccount' }
  get GET_PAGA_BANKS() { return 'banks' }
  get CREATE_PAYMENT_REQUEST() { return 'paymentRequest' }
  get RESEND_SHOP_REPORT_ENDPOINT() { return 'resend_daily_report/'; }



  get PAGA_MONEY_TRANSFER () { return 'oauth2/secure/moneyTransfer/referenceNumber/' }
  get PURCHASE_AIRTIME_FROM_PAGA () { return 'business-rest/secured/airtimePurchase' }
  get GET_PAGA_MOBILE_OPERATORS () { return 'business-rest/secured/getMobileOperators' }
  get GET_PAGA_ACCOUNT_BALANCE () { return 'business-rest/secured/accountBalance' }

}
