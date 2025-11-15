export enum RequestMethds {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT'
}
export enum TransactionStatusEnums {
  SUCCESS = 'SUCCESS',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}
export enum BusinessTypesEnums {
  SOLE_PROPRIETORSHIP = 'Sole Proprietorship',
  PARTNERSHIP = 'Partnership',
  NGO = 'Non profit organization',
  PUBLIC_LIMITED_LIABILITY = 'Public Limited Liability',
  PRIVATE_LIMITED_LIABILITY = 'Private Limited Liability'
}
export enum OnlineAddressStatusEnums {
  EXISTS = 'EXISTS',
  VALID = 'VALID'
}
export enum MallTemplatesEnums {
  DEFAULT = 'DEFAULT'
}
export enum CountriesEnums {
  NG = 'NG',
  GH = 'GH',
  KE = 'KE',
  ZA = 'ZA',
  UG = 'UG',
  TZ = 'TZ',
  RW = 'RW',
  CD = 'CD',
  CF = 'CF',
  CM = 'CM',
  GA = 'GA',
  NR = 'NR',
  SS = 'SS',
  BI = 'BI',
  ET = 'ET',
  SO = 'SO',
  DJ = 'DJ',
  US = 'US',
  GB = 'GB',
  MY = 'MY',
  BF = 'BF',
}
export enum PaymentRequestTypesEnums {
  PHYSICAL_STORE = 'PHYSICAL_STORE',
  ONLINE_STORE = 'ONLINE_STORE',
  SMS_PURCHASE = 'SMS_PURCHASE',
}
export enum LoginUserTypeEnum {
  PARTNER = 'partner'
}
export enum EditStockActionsEnums {
  INCREASE_STOCK = 'INCREASE_STOCK',
  DECREASE_STOCK = 'DECREASE_STOCK',
  EDIT_QUANTITY = 'EDIT_QUANTITY'
}
export enum CampaignTypesEnums {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  ALL = 'ALL'
}
export enum InvoiceTypesEnums {
  WHATSAPP = 'WHATSAPP',
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  ALL = 'ALL',
}
export enum TargetTypesEnums {
  CUSTOMER_GROUP = 'CUSTOMER_GROUP',
  SPECIFIC_CUSTOMERS = 'SPECIFIC_CUSTOMERS',
  CUSTOMER_NUMBER_OF_VISITS = 'CUSTOMER_NUMBER_OF_VISITS',
  CUSTOMER_DATE_RANGE_VISITS = 'CUSTOMER_DATE_RANGE_VISITS',
  ALL = 'ALL'
}
export enum NavigationItemsEnum {
  DASHBOARD = 'DASHBOARD',
  PRODUCTS = 'PRODUCTS',
  REPORTS = 'REPORTS',
  CUSTOMERS = 'CUSTOMERS',
  SETTINGS = 'SETTINGS'
}

export enum CustomerFilterByEnum {
  ALL = 'ALL',
  OWING = 'Owing'
}

export enum WhatsAppEnableOrDisableActions {
  NEW = 'NEW',
  REPLACE_NUMBER = 'REPLACE_NUMBER',
  VERIFY_NUMBER = 'VERIFY_NUMBER',
  ENABLE = 'ENABLE',
  DISABLE = 'DISABLE'
}
export enum ControlTypes {
  textbox = 'textbox',
  dropdown = 'dropdown',
  toggle = 'toggle'
}

export enum ShopEditingAction {
  partner_code = 'partner_code',
  currency = 'currency',
  allow_global_delivery = 'allow_global_delivery'
}

export enum PaymentMethodsForSettlementEnum {
  BANK = 'BANK',
  MOMO = 'MOMO'
}

export enum PaymentMethodsEnum {
  NG_USSD = 'NG_USSD',
  NG_QR_CODE = 'NG_QR_CODE',
  CASH = 'CASH',
  NG_PAY_CODE = 'NG_PAY_CODE',
  MTN = 'MTN',
  AIRTEL = 'AIRTEL',
  TIGO = 'TIGO',
  VODAFONE = 'VODAFONE',
  CARD = 'CARD',
  MOMO = 'MOMO',
  SPLIT_PAYMENT = 'SPLIT_PAYMENT',
  CREDIT_SALE = 'CREDIT_SALE',
  DOUBLE_CHECKOUT = 'DOUBLE_CHECKOUT',
  ALL = 'ALL',
  NONE = 'NONE',
  CUSTOMER_PAY_DIRECT = 'CUSTOMER_PAY_DIRECT',
  SPECIFIC_ORDER_PAY = 'SPECIFIC_ORDER_PAY',
  PAYMENT_LINK = 'PAYMENT_LINK'
}

export enum PromotionTypesEnum {
  DISCOUNTED_PRODUCTS = 'DISCOUNTED_PRODUCTS',
  FREE_SHIPPING_OR_DELIVERY = 'FREE_SHIPPING_OR_DELIVERY',
  FREE_RETURNS = 'FREE_RETURNS',
  FLASH_SALES = 'FLASH_SALES',
  BUY_MORE_SAVE_MORE = 'BUY_MORE_SAVE_MORE',
  PRODUCT_GIVEAWAYS = 'PRODUCT_GIVEAWAYS',
  BRAND_GIFT_GIVEAWAYS = 'BRAND_GIFT_GIVEAWAYS',
  LOYALTY_POINTS = 'LOYALTY_POINTS',
  COUPON_GIVEAWAYS = 'COUPON_GIVEAWAYS',
  COMPETITIONS = 'COMPETITIONS'
}
export enum PromoCodeUsageEnum {
  SINGLE = 'SINGLE',
  MULTIPLE = 'MULTIPLE',
}
export enum PromoTemplates {
  PRODUCTS_SPECIFIC_CODE = 'PRODUCTS_SPECIFIC_CODE',
  GENERAL_SHOP_CODE = 'GENERAL_SHOP_CODE'
}

export enum PromoCodeRateTypeEnum {
  FLAT = 'FLAT',
  PERCENTAGE = 'PERCENTAGE',
}
export enum BulkUploadTemplatesEnum {
  BULK_PRODUCT_UPLOAD_TEMPLATE = 'BULK_PRODUCT_UPLOAD_TEMPLATE',
  BULK_CUSTOMER_UPLOAD_TEMPLATE = 'BULK_CUSTOMER_UPLOAD_TEMPLATE',
}

export enum MessageTypeEnum{
  SEASONAL_MESSAGE = 'SEASONAL_MESSAGE',
  THANK_YOU_MESSAGE = 'THANK_YOU_MESSAGE',
  RETURN_CUSTOMERS_MESSAGE = 'RETURN_CUSTOMERS_MESSAGE',
  PRODUCT_ALERT_MESSAGE = 'PRODUCT_ALERT_MESSAGE',
}

export enum reportFrequencyEnum{
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY'
}