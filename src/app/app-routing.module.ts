import { ExpenseCategoriesComponent } from './components/main-features/expenses/expense-categories/expense-categories.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewSalesOrderComponent } from './components/main-features/sales-orders/new-sales-order/new-sales-order.component';
import { AllInvoicesComponent } from './components/main-features/invoices/all-invoices/all-invoices.component';
import { ProductReleasesComponent } from './components/common/product-releases/product-releases.component';
import { BulkCustomerUploadComponent } from './components/main-features/customers/bulk-customer-upload/bulk-customer-upload.component';
import { PromotionDetailComponent } from './components/main-features/promotions/promotion-detail/promotion-detail.component';
import { MyPromotionsComponent } from './components/main-features/promotions/my-promotions/my-promotions.component';
import { GeneralShopSettingsComponent } from './components/main-features/settings/general-shop-settings/general-shop-settings.component';
import { KudigoHelpComponent } from './components/common/kudigo-help/kudigo-help.component';
import { SearchResultsComponent } from './components/common/search/search-results/search-results.component';
import { PurchaseSmsCreditComponent } from './components/main-features/customers/purchase-sms-credit/purchase-sms-credit.component';
import { MallDeliveryOptionsSettingComponent } from './components/main-features/storefrontmall/mall-delivery-options-setting/mall-delivery-options-setting.component';
import { OnlineShopPremiumPlansComponent } from './components/main-features/premium-payments/online-shop-premium-plans/online-shop-premium-plans.component';
import { OfflineShopPremiumPlansComponent } from './components/main-features/premium-payments/offline-shop-premium-plans/offline-shop-premium-plans.component';
import { HomeDashboardComponent } from './components/main-features/dashboard/home-dashboard/home-dashboard.component';
import { CustomerCampaignsComponent } from './components/main-features/customers/customer-campaigns/customer-campaigns.component';
import { CustomerDetailsComponent } from './components/main-features/customers/customer-details/customer-details.component';
import { CustomerDiscountsComponent } from './components/main-features/customers/customer-discounts/customer-discounts.component';
import { CustomerCategoriesComponent } from './components/main-features/customers/customer-categories/customer-categories.component';
import { MyProductCategoriesComponent } from './components/main-features/products/my-product-categories/my-product-categories.component';
import { MyUnitOfMeasurementsComponent } from './components/main-features/products/my-unit-of-measurements/my-unit-of-measurements.component';
import { PayPremiumComponent } from './components/setup/pay-premium/pay-premium.component';
import { PremiumFeaturesComponent } from './components/setup/premium-features/premium-features.component';
import { CreateNewPasswordComponent } from './components/setup/create-new-password/create-new-password.component';
import { MyMallComponent } from './components/main-features/storefrontmall/my-mall/my-mall.component';
import { ShopSettingsComponent } from './components/main-features/settings/shop-settings/shop-settings.component';
import { MallOrdersComponent } from './components/main-features/reports/mall-orders/mall-orders.component';
import { ConfirmSignUpComponent } from './components/setup/confirm-sign-up/confirm-sign-up.component';
import { OnboardingPaymentInformationComponent } from './components/main-features/onboarding-stepper/steps/onboarding-payment-information/onboarding-payment-information.component';
import { OnboardingMallTemplatePreviewComponent } from './components/main-features/onboarding-stepper/steps/onboarding-mall-template-preview/onboarding-mall-template-preview.component';
import { OnboardingMallTemplateInformationComponent } from './components/main-features/onboarding-stepper/steps/onboarding-mall-template-information/onboarding-mall-template-information.component';
import { OnboardingProductInformationComponent } from './components/main-features/onboarding-stepper/steps/onboarding-product-information/onboarding-product-information.component';
import { OnboardingBusinessInformationComponent } from './components/main-features/onboarding-stepper/steps/onboarding-business-information/onboarding-business-information.component';
import { OnboardingPersonalInformationComponent } from './components/main-features/onboarding-stepper/steps/onboarding-personal-information/onboarding-personal-information.component';
import { OnboardingIndustryInformationComponent } from './components/main-features/onboarding-stepper/steps/onboarding-industry-information/onboarding-industry-information.component';
import { EnterPinComponent } from './components/setup/enter-pin/enter-pin.component';
import { StepperContainerComponent } from './components/main-features/onboarding-stepper/stepper-container/stepper-container.component';
import { GenerateProductBarcodesComponent } from './components/main-features/products/generate-product-barcodes/generate-product-barcodes.component';
import { AllExpensesComponent } from './components/main-features/expenses/all-expenses/all-expenses.component';
import { PageNotFoundComponent } from './components/common/page-not-found/page-not-found.component';
import { OrderDetailsComponent } from './components/main-features/order-details/order-details.component';
import { LoginComponent } from './components/setup/login/login.component';
import { ForgotPasswordComponent } from './components/setup/forgot-password/forgot-password.component';
import { CreatePinComponent } from './components/setup/create-pin/create-pin.component';
import { IntelligentSpotlightComponent } from './components/main-features/intelligent-spotlight/intelligent-spotlight.component';
import { SalesOrdersReportComponent } from './components/main-features/reports/sales-orders-report/sales-orders-report.component';
import { SummaryReportComponent } from './components/main-features/reports/summary-report/summary-report.component';
import { ConfirmLoginComponent } from './components/setup/confirm-login/confirm-login.component';
import { SalesMarginReportComponent } from './components/main-features/reports/sales-margin-report/sales-margin-report.component';
// tslint:disable-next-line:max-line-length
import { SalesInventoryReportsComponent } from './components/main-features/reports/sales-inventory-reports/sales-inventory-reports.component';
import { AuthGuard } from './guards/auth.guard';
import { AgentsComponent } from './components/main-features/user-management/agents/agents.component';
import { AgentProfileComponent } from './components/main-features/user-management/agent-profile/agent-profile.component';
import { MyProductsComponent } from './components/main-features/products/my-products/my-products.component';
import { MyCustomersComponent } from './components/main-features/customers/my-customers/my-customers.component';
import { ProductUploadComponent } from './components/main-features/products/product-upload/product-upload.component';
import { MySuppliersComponent } from './components/main-features/suppliers/my-suppliers/my-suppliers.component';
import { ProductDetailComponent } from './components/main-features/products/product-detail/product-detail.component';
import { TransactionReportsComponent } from './components/main-features/reports/transaction-reports/transaction-reports.component';
import { PartnerLoginComponent } from './components/setup/partner-login/partner-login.component';
import { NewProductComponent } from './components/main-features/products/new-product/new-product.component';
import { MallOrderDetailsComponent } from './components/main-features/storefrontmall/mall-order-details/mall-order-details.component';
import { CustomersMessagesComponent } from './components/main-features/customers/customer-messages/all-customers-messages/customers-messages.component';
import { CreateCustomersCampaignComponent } from './components/main-features/customers/create-customers-campaign/create-customers-campaign.component';
import { PosReceiptComponent } from './components/main-features/sales-orders/pos-receipt/pos-receipt.component';
import { AllPaymentsRequestsComponent } from './components/main-features/settings/all-payments-requests/all-payments-requests.component';
import { NewInvoiceRequestComponent } from './components/main-features/invoice-requests/new-invoice-request/new-invoice-request.component';
import { InvoiceRequestsComponent } from './components/main-features/invoice-requests/invoice-requests/invoice-requests.component';
import { NewPurchaseOrderComponent } from './components/main-features/suppliers/new-purchase-order/new-purchase-order.component';
import { PurchaseOrdersComponent } from './components/main-features/suppliers/purchase-orders/purchase-orders.component';
import { ConfigurationComponent } from './components/main-features/facebook-integration/configuration/configuration.component';
import { ProductCatalogComponent } from './components/main-features/facebook-integration/product-catalog/product-catalog.component';
import { DashboardOverviewComponent } from './components/main-features/facebook-integration/dashboard-overview/dashboard-overview.component';
import { FreshdeskCategoriesFolders } from './components/main-features/freshdesk-integration/freshdesk-categoeries-folders/freshdesk-categories-folders.component';
import { FreshdeskArticleListComponent } from './components/main-features/freshdesk-integration/freshdesk-article-list/freshdesk-article-list.component';
import { FreshdeskArticleDetailComponent } from './components/main-features/freshdesk-integration/freshdesk-article-detail/freshdesk-article-detail.component';
import { AddPaymentRequestComponent } from './components/main-features/settings/add-payment-request/add-payment-request.component';
import { VerifyEmailComponent } from './components/setup/verify-email/verify-email.component';
import { PaymentsDashboardComponent } from './components/main-features/paga-integration/payments-dashboard/payments-dashboard.component';
import { CreatePagaAccountComponent } from './components/main-features/paga-integration/create-paga-account/create-paga-account.component';

const routes: Routes = [
  { path: '', component: LoginComponent, data: { title: 'Login'} },
  { path: 'login', component: LoginComponent, data: { title: 'Login'} },
  { path: 'enter-pin', component: EnterPinComponent, data: { title: 'Enter PIN'} },
  { path: 'partner-login', component: PartnerLoginComponent, data: { title: 'Partner Login' } },
  { path: 'confirm-login', component: ConfirmLoginComponent, data: { title: 'Confirm Login'} },
  { path: 'confirm-signup', component: ConfirmSignUpComponent, data: { title: 'Confirm Signup'} },
  { path: 'forgot-pin', component: ForgotPasswordComponent, data: { title: 'Forgot PIN'} },
  { path: 'create-pin', component: CreatePinComponent, data: { title: 'Create PIN'} },
  { path: 'create-new-pin', component: CreateNewPasswordComponent, data: { title: 'Create New PIN'} },
  { path: 'orders', component: OrderDetailsComponent },
  { path: 'verify-email', component: VerifyEmailComponent, data: { title: 'Verify Email'} },
  { path: 'onboarding', component: StepperContainerComponent, children: [
      {path: '', component: OnboardingPersonalInformationComponent, data: { title: 'Personal Information'}},
      {path: 'personal-info', component: OnboardingPersonalInformationComponent, data: { title: 'Personal Information'}},
      {path: 'industry', component: OnboardingIndustryInformationComponent, data: { title: 'Industry Information'}},
      {path: 'business-info', canActivate: [AuthGuard], component: OnboardingBusinessInformationComponent, data: { title: 'Business Information'}},
      {path: 'products', canActivate: [AuthGuard], component: OnboardingProductInformationComponent, data: { title: 'Product Information'}},
      {path: 'mall-template', canActivate: [AuthGuard], component: OnboardingMallTemplateInformationComponent, data: { title: 'Mall Information'}},
      {path: 'mall-template-preview', canActivate: [AuthGuard], component: OnboardingMallTemplatePreviewComponent, data: { title: 'Mall Preview'}},
      {path: 'subscription-payment', component: OnboardingPaymentInformationComponent, data: { title: 'Subscription Payment'}}
    ]
  },
  { path: 'facebook-shop/dashboard', component: DashboardOverviewComponent, canActivate: [AuthGuard], data: {title: 'Facebook Dashboard'} },
  { path: 'facebook-shop/products', component: ProductCatalogComponent, canActivate: [AuthGuard], data: {title: 'Facebook Products'} },
  { path: 'facebook-shop/integration', component: ConfigurationComponent, canActivate: [AuthGuard], data: {title: 'Facebook Integration'} },
  { path: 'premium-features', component: PremiumFeaturesComponent, canActivate: [AuthGuard], data: {title: 'Premium Features'} },
  { path: 'service-payment', component: PayPremiumComponent, canActivate: [AuthGuard], data: {title: 'Subscription Payments'} },
  // { path: 'premium-subscriptions/offline-store', component: OfflineShopPremiumPlansComponent, canActivate: [AuthGuard], data: {title: 'Offline Shop Subscriptions'} },
  // { path: 'premium-subscriptions/online-store', component: OnlineShopPremiumPlansComponent, canActivate: [AuthGuard], data: {title: 'Online Shop Subscriptions'} },
  { path: 'premium-subscriptions/storefront-plans', component: OnlineShopPremiumPlansComponent, canActivate: [AuthGuard], data: {title: 'Storefront Subscriptions'} },
  { path: 'premium-subscriptions/billing', component: AllInvoicesComponent, canActivate: [AuthGuard], data: {title: 'Billing'} },
  { path: 'home', component: HomeDashboardComponent, canActivate: [AuthGuard], data: { title: 'Dashboard'} },
  { path: 'dashboard', component: HomeDashboardComponent, canActivate: [AuthGuard], data: { title: 'Dashboard'} },
  { path: 'intellisights', component: IntelligentSpotlightComponent, canActivate: [AuthGuard], data: {title: 'Intelisights'} },
  { path: 'reports', component: SummaryReportComponent, canActivate: [AuthGuard], data: {title: 'Sales Summary'} },
  { path: 'reports/sales-summary', component: SummaryReportComponent, canActivate: [AuthGuard], data: {title: 'Sales Summary'} },
  { path: 'reports/sales-margin', component: SalesMarginReportComponent, canActivate: [AuthGuard], data: { title: 'Sales Margin'} },
  { path: 'reports/sales-orders', component: SalesOrdersReportComponent, canActivate: [AuthGuard], data: { title: 'Sales Orders'} },
  { path: 'reports/mall-orders', component: MallOrdersComponent, canActivate: [AuthGuard], data: { title: 'Mall Orders'} },
  { path: 'reports/inventory', component: SalesInventoryReportsComponent, canActivate: [AuthGuard], data: { title: 'Inventory'} },
  { path: 'reports/transactions', component: TransactionReportsComponent, canActivate: [AuthGuard], data: { title: 'Transactions' } },
  { path: 'settings', component: ShopSettingsComponent, canActivate: [AuthGuard], data: { title: 'Settings' } },
  { path: 'settings/online-store', component: MyMallComponent, canActivate: [AuthGuard], data: {title: 'Online Shop Settings'} },
  { path: 'settings/online-store/delivery-options', component: MallDeliveryOptionsSettingComponent, canActivate: [AuthGuard], data: {title: 'Delivery Options'} },
  { path: 'settings/online-store/promotions', component: MyPromotionsComponent, canActivate: [AuthGuard], data: {title: 'Promotions'} },
  { path: 'settings/online-store/promotions/:id/:storeId/:name', component: PromotionDetailComponent, canActivate: [AuthGuard] },
  { path: 'settings/general', component: GeneralShopSettingsComponent, canActivate: [AuthGuard], data: {title: 'General Shop Settings'} },
  { path: 'settings/payment-transactions', component: TransactionReportsComponent, canActivate: [AuthGuard], data: {title: 'Transactions'} },
  { path: 'settings/payment-request', component: AddPaymentRequestComponent, canActivate: [AuthGuard], data: {title: 'Payment Request'} },
  { path: 'settings/payment-request/:id', component: AddPaymentRequestComponent, canActivate: [AuthGuard], data: {title: 'Payment Request'} },
  { path: 'settings/my-payment-requests', component: AllPaymentsRequestsComponent, canActivate: [AuthGuard], data: {title: 'My Requests'} },
  { path: 'settings/non-cash-transactions', component: PaymentsDashboardComponent, canActivate: [AuthGuard], data: {title: 'Non Cash Transactions'} },
  { path: 'settings/create-paga-account', component: CreatePagaAccountComponent, canActivate: [AuthGuard], data: {title: 'Create Paga Account'} },

  { path: 'settings/payment-accounts', component: AllPaymentsRequestsComponent, canActivate: [AuthGuard], data: {title: 'Accounts'} },
  { path: 'settings/settlements', component: AllPaymentsRequestsComponent, canActivate: [AuthGuard], data: {title: 'Settlements'} },

  { path: 'sales', component: SalesOrdersReportComponent, canActivate: [AuthGuard], data: {title: 'Sales' } },
  { path: 'sales/new-order', component: NewSalesOrderComponent, canActivate: [AuthGuard], data: {title: 'New Sales Order' } },
  { path: 'sales/new-order/pos-receipt', component: PosReceiptComponent, canActivate: [AuthGuard], data: {title: 'POS Receipt' } },
  { path: 'expenses', component: AllExpensesComponent, canActivate: [AuthGuard], data: {title: 'Expenses'} },
  { path: 'expenses/categories', component: ExpenseCategoriesComponent, canActivate: [AuthGuard], data: {title: 'Expense Categories'} },
  { path: 'agents', component: AgentsComponent, canActivate: [AuthGuard], data: {title: 'Agents' } },
  { path: 'agents/:id', component: AgentProfileComponent, canActivate: [AuthGuard] },
  { path: 'products', component: MyProductsComponent, canActivate: [AuthGuard], data: {title: 'Products' } },
  { path: 'products/upload', component: ProductUploadComponent, canActivate: [AuthGuard], data: {title: 'Upload Product' } },
  { path: 'products/create', component: NewProductComponent, canActivate: [AuthGuard], data: {title: 'Add Product' } },
  { path: 'products/edit/:id/:name', component: NewProductComponent, canActivate: [AuthGuard] },
  { path: 'products/generate-barcodes', component: GenerateProductBarcodesComponent, canActivate: [AuthGuard], data: {title: 'Generate Product Barcode' } },
  { path: 'products/:id/:name', component: ProductDetailComponent, canActivate: [AuthGuard] },
  { path: 'products/units-of-measurements', component: MyUnitOfMeasurementsComponent, canActivate: [AuthGuard], data: {title: 'Units of Measurement' } },
  { path: 'products/categories', component: MyProductCategoriesComponent, canActivate: [AuthGuard], data: {title: 'Product Categories' }  },
  { path: 'invoices', component: InvoiceRequestsComponent, canActivate: [AuthGuard], data: {title: 'Invoices'} },
  { path: 'invoices/new-request', component: NewInvoiceRequestComponent, canActivate: [AuthGuard], data: {title: 'New Invoice'} },
  { path: 'purchase-orders', component: PurchaseOrdersComponent, canActivate: [AuthGuard], data: {title: 'Purchase Orders'} },
  { path: 'purchase-orders/new-order', component: NewPurchaseOrderComponent, canActivate: [AuthGuard], data: {title: 'New Purchase Order'} },
  { path: 'customers', component: MyCustomersComponent, canActivate: [AuthGuard], data: {title: 'Customers'} },
  { path: 'customers/:id/:name', component: CustomerDetailsComponent, canActivate: [AuthGuard], data: {title: 'Customer Detail'} },
  { path: 'customers/categories', component: CustomerCategoriesComponent, canActivate: [AuthGuard], data: {title: 'Customer Groups'} },
  { path: 'customers/discounts', component: CustomerDiscountsComponent, canActivate: [AuthGuard], data: {title: 'Customer Discounts'} },
  { path: 'customers/campaigns', component: CustomerCampaignsComponent, canActivate: [AuthGuard], data: {title: 'Customer Campaigns'} },
  { path: 'customers/new-campaign', component: CreateCustomersCampaignComponent, canActivate: [AuthGuard], data: {title: 'New Campaign'} },
  { path: 'customers/sms-credit', component: PurchaseSmsCreditComponent, canActivate: [AuthGuard], data: {title: 'Purchase SMS-Credit'} },
  { path: 'customers/upload', component: BulkCustomerUploadComponent, canActivate: [AuthGuard], data: {title: 'Bulk Upload'} },
  { path: 'customers/automation-templates', component: CustomersMessagesComponent, canActivate: [AuthGuard], data: {title: 'Automation Messages'} },
  { path: 'suppliers', component: MySuppliersComponent, canActivate: [AuthGuard], data: {title: 'Suppliers'} },
  { path: 'search', component: SearchResultsComponent, canActivate: [AuthGuard] },
  { path: 'product-releases', component: KudigoHelpComponent },
  { path: 'my-mall', component: MyMallComponent, data: {title: 'My Mall'} },
  { path: 'my-mall/orders/details/:id', component: MallOrderDetailsComponent, data: {title: 'Mall Order Details'} },
  { path: 'my-mall/orders', component: MallOrdersComponent, data: {title: 'Mall Orders'} },
  { path: 'help', component: KudigoHelpComponent, canActivate: [AuthGuard], data: {title: 'Help'} },
  { path: 'help/product-releases', component: ProductReleasesComponent, data: {title: 'Product Releases'} },
  { path: 'knowledge-base', component: FreshdeskCategoriesFolders, data: {title: 'Knowledge Base'} },
  { path: 'knowledge-base/solutions/:id/:name', component: FreshdeskArticleListComponent, data: {title: 'Solutions - Knowledge Base'} },
  { path: 'knowledge-base/articles/:id/:title', component: FreshdeskArticleDetailComponent, data: {title: 'Article Detail'} },
  // { path: 'my-mall', component: MyMallComponent, canActivate: [AuthGuard]},
  // { path: 'my-mall/orders', component: MallOrdersComponent, canActivate: [AuthGuard] },
  { path: 'page-not-found', component: PageNotFoundComponent, data: {title: 'Page Not Page'} },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
  })],

  exports: [RouterModule]
})
export class AppRoutingModule { }
