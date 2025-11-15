export interface IPageHeader {
  pageTitle?: string;
  hasDateRangeFilter?: boolean;
  hasExport?: boolean;
  hasShopsFilter?: boolean;
  hasPaymentMethodFilter?: boolean;
  hasOrderStatusFilter?: boolean;
  hasMallOrderStatusFilter?: boolean;
  hasCustomFilter?: boolean;
  hasPaymentStatusFilter?: boolean;
  hasTransactionSourceFilter?: boolean;
  hasTransactionTypeFilter?: boolean;
  hasExpenseCategoryFilter?: boolean;
  ignoreFilterByAllShops?: boolean;
  hideFilterPanel?: boolean;
}
