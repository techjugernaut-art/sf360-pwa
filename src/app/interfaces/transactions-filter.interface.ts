export interface ITransactionsFilterParams {
  start_date?: string;
  end_date?: string;
  status?: string;
  payment_method?: string;
  payment_status?: string;
  shop_id: string;
  source?: string;
  destination?: string;
  transaction_type?: string;
  sender_wallet_number?: string;
  recipient_wallet_number?: string;
  transaction_id?: string;
  paginate?: boolean;
}
