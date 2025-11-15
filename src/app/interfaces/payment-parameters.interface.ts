export interface IPaymentParams {
  shop_id: string;
  phone_number?: string;
  payment_network?: string;
  payment_method?: string;
  discount_code?: string;
  premium_plan_id?: string;
  sms_plan_id?: string;
  payment_voucher_code?: string;
}
