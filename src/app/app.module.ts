import { MessagingService } from './services/messaging.service';
import { MaterialModule } from './modules/material/material.module';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrderDetailsComponent } from './components/main-features/order-details/order-details.component';
import { PageNotFoundComponent } from './components/common/page-not-found/page-not-found.component';
import { SentryErrorHandlerService } from './services/sentry-error-handler.service';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { MainNavComponent } from './components/common/main-nav/main-nav.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { ConfirmDialogComponent } from './components/common/dialogs/confirm-dialog/confirm-dialog.component';
import { LoginComponent } from './components/setup/login/login.component';
import { AngularBootstrapModule } from './modules/angular-bootstrap/angular-bootstrap.module';
import { ForgotPasswordComponent } from './components/setup/forgot-password/forgot-password.component';
import { NumberOnlyDirective } from './directives/number-only.directive';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CreatePinComponent } from './components/setup/create-pin/create-pin.component';
import { DashboardComponent } from './components/main-features/dashboard/dashboard.component';
import { BreadcrumbActionsComponent } from './components/common/breadcrumb-actions/breadcrumb-actions.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { InfoDialogComponent } from './components/common/dialogs/info-dialog/info-dialog.component';
import { IntelligentSpotlightComponent } from './components/main-features/intelligent-spotlight/intelligent-spotlight.component';
import { SalesOrdersReportComponent } from './components/main-features/reports/sales-orders-report/sales-orders-report.component';
import { SummaryReportComponent } from './components/main-features/reports/summary-report/summary-report.component';
import { SalesMarginReportComponent } from './components/main-features/reports/sales-margin-report/sales-margin-report.component';
import { SalesOrderDetailDialogComponent } from './components/common/dialogs/sales-order-detail/sales-order-detail.component';
import { ExportAsModule } from 'ngx-export-as';
import { ConfirmLoginComponent } from './components/setup/confirm-login/confirm-login.component';
import { ReportingComponent } from './components/main-features/reports/reporting/reporting.component';
// tslint:disable-next-line:max-line-length
import { SalesInventoryReportsComponent } from './components/main-features/reports/sales-inventory-reports/sales-inventory-reports.component';
import { AvatarModule } from 'ngx-avatar';
// import { NgxMatIntlTelInputModule } from 'ngx-mat-intl-tel-input';
import { PaginationComponent } from './components/common/pagination/pagination.component';
import { TableHeaderActionsComponent } from './components/common/table-header-actions/table-header-actions.component';
import { AgentsComponent } from './components/main-features/user-management/agents/agents.component';
import { AgentProfileComponent } from './components/main-features/user-management/agent-profile/agent-profile.component';
import { MyProductsComponent } from './components/main-features/products/my-products/my-products.component';
import { MyCustomersComponent } from './components/main-features/customers/my-customers/my-customers.component';
// import {BsDropdownModule} from 'ngx-bootstrap';
import { ImageUrlPipe } from './pipes/image-url.pipe';
import { IntlCountryCodesComponent } from './components/common/intl-country-codes/intl-country-codes.component';
import { ProductUploadComponent } from './components/main-features/products/product-upload/product-upload.component';
import { MySuppliersComponent } from './components/main-features/suppliers/my-suppliers/my-suppliers.component';
import { ProductDetailComponent } from './components/main-features/products/product-detail/product-detail.component';
import { ServiceWorkerModule, SwPush } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { TransactionReportsComponent } from './components/main-features/reports/transaction-reports/transaction-reports.component';
import { TruncateTextPipe } from './pipes/truncate-text.pipe';
import { EmptyRecordComponent } from './components/common/empty-record/empty-record.component';
import { PartnerLoginComponent } from './components/setup/partner-login/partner-login.component';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire';
import { NewPaymentRequestComponent } from './components/main-features/settings/new-payment-request/new-payment-request.component';
import { NgxGtagModule } from 'ngx-gtag';
import { EditStockDialogComponent } from './components/common/dialogs/edit-stock/edit-stock.component';
import { DecimalOnlyDirective } from './directives/decimal-only.directive';
import { AddAgentDialogComponent } from './components/main-features/user-management/add-agent-dialog/add-agent-dialog.component';
import { AllExpensesComponent } from './components/main-features/expenses/all-expenses/all-expenses.component';
import { NewExpenseComponent } from './components/main-features/expenses/new-expense/new-expense.component';
import { NewExpenseCategoryComponent } from './components/main-features/expenses/new-expense-category/new-expense-category.component';
import { NotificationActionsComponent } from './components/common/notification-actions/notification-actions.component';
import { ComfirmProductUploadComponent } from './components/main-features/products/comfirm-product-upload/comfirm-product-upload.component';
import { FooterComponent } from './components/common/footer/footer.component';
import { EditProductComponent } from './components/main-features/products/edit-product/edit-product.component';
import { GenerateProductBarcodesComponent } from './components/main-features/products/generate-product-barcodes/generate-product-barcodes.component';
import { GenerateProductBarcodesParamsComponent } from './components/main-features/products/generate-product-barcodes-params/generate-product-barcodes-params.component';
import { NgxBarcodeModule } from 'ngx-barcode';
// import {NgxPrintModule} from 'ngx-print';
import { SelectShopForProductDownloadsComponent } from './components/main-features/products/select-shop-for-product-downloads/select-shop-for-product-downloads.component';
import { ReleaseNotesComponent } from './components/common/release-notes/release-notes.component';
import { DocImagePreviewDirective } from './directives/doc-image-preview.directive';
import { DocImagePreviewPipe } from './pipes/doc-image-preview.pipe';
import { StepperContainerComponent } from './components/main-features/onboarding-stepper/stepper-container/stepper-container.component';
import { OnboardingBusinessInformationComponent } from './components/main-features/onboarding-stepper/steps/onboarding-business-information/onboarding-business-information.component';
import { OnboardingPersonalInformationComponent } from './components/main-features/onboarding-stepper/steps/onboarding-personal-information/onboarding-personal-information.component';
import { OnboardingIndustryInformationComponent } from './components/main-features/onboarding-stepper/steps/onboarding-industry-information/onboarding-industry-information.component';
import { OnboardingProductInformationComponent } from './components/main-features/onboarding-stepper/steps/onboarding-product-information/onboarding-product-information.component';
import { OnboardingMallTemplateInformationComponent } from './components/main-features/onboarding-stepper/steps/onboarding-mall-template-information/onboarding-mall-template-information.component';
import { OnboardingMallTemplatePreviewComponent } from './components/main-features/onboarding-stepper/steps/onboarding-mall-template-preview/onboarding-mall-template-preview.component';
import { OnboardingPaymentInformationComponent } from './components/main-features/onboarding-stepper/steps/onboarding-payment-information/onboarding-payment-information.component';
import { EnterPinComponent } from './components/setup/enter-pin/enter-pin.component';
import { SendVerificationCodeComponent } from './components/setup/send-verification-code/send-verification-code.component';
import { ConfirmSignUpComponent } from './components/setup/confirm-sign-up/confirm-sign-up.component';
import { AuthInterceptor } from './classes/auth-interceptor';
import { NewProductComponent } from './components/main-features/products/new-product/new-product.component';
import { NoSpecialCharacterDirective } from './directives/no-special-character.directive';
import { ReplaceWhiteSpacePipe } from './pipes/replace-white-space.pipe';
import { ConfirmPremiumPaymentComponent } from './components/main-features/premium-payments/confirm-premium-payment/confirm-premium-payment.component';
import { AlphabetsOnlyDirective } from './directives/alphabets-only.directive';
import { IframeDialogComponent } from './components/common/iframe-dialog/iframe-dialog.component';
import { CongratulationComponent } from './components/common/congratulation/congratulation.component';
import { ChangeMallOrderStatusDialogComponent } from './components/main-features/storefrontmall/change-mall-order-status-dialog/change-mall-order-status-dialog.component';
import { MallOrdersComponent } from './components/main-features/reports/mall-orders/mall-orders.component';
import { ShopSettingsComponent } from './components/main-features/settings/shop-settings/shop-settings.component';
import { MyMallComponent } from './components/main-features/storefrontmall/my-mall/my-mall.component';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MallBannerSettingsComponent } from './components/main-features/storefrontmall/mall-banner-settings/mall-banner-settings.component';
import { AddMallBannerDialogComponent } from './components/main-features/storefrontmall/add-mall-banner-dialog/add-mall-banner-dialog.component';
import { CreateNewPasswordComponent } from './components/setup/create-new-password/create-new-password.component';
import { ChangePasswordComponent } from './components/setup/change-password/change-password.component';
import { PremiumFeaturesComponent } from './components/setup/premium-features/premium-features.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { PayPremiumComponent } from './components/setup/pay-premium/pay-premium.component';
import { UploadProductImageComponent } from './components/main-features/products/upload-product-image/upload-product-image.component';
import { OnlineStoreNewPaymentRequestComponent } from './components/main-features/settings/online-store-new-payment-request/online-store-new-payment-request.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { SetFloatingClassOnPhoneInputDirective } from './directives/set-floating-class-on-phone-input.directive';
import { MergeProductsComponent } from './components/main-features/products/merge-products/merge-products.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from './utils/translate-loader-config';
import { ColorPickerDialogComponent } from './components/common/dialogs/color-picker-dialog/color-picker-dialog.component';
import { UnitOfMeasurementDisplayPipe } from './pipes/unit-of-measurement-display.pipe';
import { AddProductGroupComponent } from './components/main-features/products/add-product-group/add-product-group.component';
import { AddUnitOfMeasurementComponent } from './components/main-features/products/add-unit-of-measurement/add-unit-of-measurement.component';
import { AddSupplierComponent } from './components/main-features/suppliers/add-supplier/add-supplier.component';
import { UpdatePriceListComponent } from './components/main-features/products/update-price-list/update-price-list.component';
import { IncreaseAndDecreaseStockComponent } from './components/main-features/products/increase-and-decrease-stock/increase-and-decrease-stock.component';
import { MyUnitOfMeasurementsComponent } from './components/main-features/products/my-unit-of-measurements/my-unit-of-measurements.component';
import { MyProductCategoriesComponent } from './components/main-features/products/my-product-categories/my-product-categories.component';
import { RemoveUnderScorePipe } from './pipes/remove-under-score.pipe';
import { ProductsOfAGroupComponent } from './components/main-features/products/products-of-a-group/products-of-a-group.component';
import { CustomerDiscountsComponent } from './components/main-features/customers/customer-discounts/customer-discounts.component';
import { GetBaseUnitNamePipe } from './pipes/get-base-unit-name.pipe';
import { AssignProductsToAGroupComponent } from './components/main-features/products/assign-products-to-a-group/assign-products-to-a-group.component';
import { CustomerCategoriesComponent } from './components/main-features/customers/customer-categories/customer-categories.component';
import { AddCustomerCategoryComponent } from './components/main-features/customers/add-customer-category/add-customer-category.component';
import { AddCustomerDiscountComponent } from './components/main-features/customers/add-customer-discount/add-customer-discount.component';
import { AddCustomersToCategoryComponent } from './components/main-features/customers/add-customers-to-category/add-customers-to-category.component';
import { CustomerDetailsComponent } from './components/main-features/customers/customer-details/customer-details.component';
import { AddCustomerComponent } from './components/main-features/customers/add-customer/add-customer.component';
import { CustomerCampaignDetailComponent } from './components/main-features/customers/customer-campaign-detail/customer-campaign-detail.component';
import { FileUploadControlComponent } from './components/common/utils/file-upload-control/file-upload-control.component';
// import { HomeDashboardComponent } from './components/main-features/dashboard/home-dashboard/home-dashboard.component';
import { SelectShopComponent } from './components/common/dialogs/select-shop/select-shop.component';
import { NotificationsComponent } from './components/common/notifications/notifications.component';
import { OfflineShopPremiumPlansComponent } from './components/main-features/premium-payments/offline-shop-premium-plans/offline-shop-premium-plans.component';
import { OnlineShopPremiumPlansComponent } from './components/main-features/premium-payments/online-shop-premium-plans/online-shop-premium-plans.component';
import { PaymentsDialogComponent } from './components/main-features/premium-payments/payments-dialog/payments-dialog.component';
import { SubscriptionRenewalDateDirective } from './directives/subscription-renewal-date.directive';
import { SubscriptionRenewalDatePipe } from './pipes/subscription-renewal-date.pipe';
import { MallDeliveryOptionsSettingComponent } from './components/main-features/storefrontmall/mall-delivery-options-setting/mall-delivery-options-setting.component';
import { MultiSelectDropdownComponent } from './components/common/multi-select-dropdown/multi-select-dropdown.component';
import { MultiSelectFilterPipe } from './pipes/multi-select-filter.pipe';
import { SearchResultsComponent } from './components/common/search/search-results/search-results.component';
import { KudigoHelpComponent } from './components/common/kudigo-help/kudigo-help.component';
import { PurchaseSmsCreditComponent } from './components/main-features/customers/purchase-sms-credit/purchase-sms-credit.component';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { GeneralShopSettingsComponent } from './components/main-features/settings/general-shop-settings/general-shop-settings.component';
import { EnableDisableWhatsappCommunicationComponent } from './components/main-features/settings/dialog/enable-disable-whatsapp-communication/enable-disable-whatsapp-communication.component';
import { SageoneConnectComponent } from './components/main-features/settings/dialog/sageone-connect/sageone-connect.component';
import { DevicesComponent } from './components/main-features/settings/devices/devices.component';
import { SetReturnPolicyDialogComponent } from './components/common/dialogs/set-return-policy-dialog/set-return-policy-dialog.component';
import { ShopDataUpdateDilaogComponent } from './components/main-features/settings/dialog/shop-data-update-dilaog/shop-data-update-dilaog.component';
import { DynamicFormControlsComponent } from './components/common/form-controls/dynamic-form-controls/dynamic-form-controls.component';
import { DynamicFormControlsWithoutFormGroupComponent } from './components/common/form-controls/dynamic-form-controls-without-form-group/dynamic-form-controls-without-form-group.component';
// import { NewSalesOrderComponent } from './components/main-features/sales-orders/new-sales-order/new-sales-order.component';
import { NavbarItemsComponent } from './components/common/navbar-items/navbar-items.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { dbConfig } from './interfaces/local-db-stores/local-db-config';
import { ChangeShopLogoDialogComponent } from './components/main-features/settings/change-shop-logo-dialog/change-shop-logo-dialog.component';
import { CardPaymentStatusCheckComponent } from './components/main-features/premium-payments/card-payment-status-check/card-payment-status-check.component';
import { EmptyCartComponent } from './components/common/empty-cart/empty-cart.component';
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
import { CustomersListDialogComponent } from './components/main-features/customers/customers-list-dialog/customers-list-dialog.component';
// import { OrderPaymentComponent } from './components/main-features/sales-orders/order-payment/order-payment.component';
import { EnterMomoWalletNumberComponent } from './components/main-features/sales-orders/enter-momo-wallet-number/enter-momo-wallet-number.component';
import { SetActiveShopComponent } from './components/common/dialogs/set-active-shop/set-active-shop.component';
// import { ThermalPrintModule } from 'ng-thermal-print';
import { MyPromotionsComponent } from './components/main-features/promotions/my-promotions/my-promotions.component';
import { AddPromotionComponent } from './components/main-features/promotions/add-promotion/add-promotion.component';
import { PromotionDetailComponent } from './components/main-features/promotions/promotion-detail/promotion-detail.component';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { AddPromoCodeComponent } from './components/main-features/promotions/add-promo-code/add-promo-code.component';
import { HasExpiredPipe } from './pipes/has-expired.pipe';
import { AnQrcodeModule } from 'an-qrcode';
import { GenerateProductPromoCodeUrlQrCodeComponent } from './components/main-features/products/generate-product-promo-code-url-qr-code/generate-product-promo-code-url-qr-code.component';
import { AlphaNumericOnlyDirective } from './directives/alpha-numeric-only.directive';
import { BulkCustomerUploadComponent } from './components/main-features/customers/bulk-customer-upload/bulk-customer-upload.component';
// import { PlotlyViaCDNModule } from 'angular-plotly.js';
import { WhatsNewComponent } from './components/common/whats-new/whats-new.component';
// PlotlyViaCDNModule.setPlotlyVersion('1.57.1');
// PlotlyViaCDNModule.setPlotlyBundle(null);
import { ProductReleasesComponent } from './components/common/product-releases/product-releases.component';
import { AllInvoicesComponent } from './components/main-features/invoices/all-invoices/all-invoices.component';
import { ImageUploadGuidelineComponent } from './components/common/image-upload-guideline/image-upload-guideline.component';
import { InvoiceDetailComponent } from './components/main-features/invoices/invoice-detail/invoice-detail.component';
import { ScrollSpyDirective } from './directives/scroll-spy.directive';
import { SubscriptionDueDialogComponent } from './components/main-features/premium-payments/subscription-due-dialog/subscription-due-dialog.component';
import { MapPreviewComponent } from './components/common/dialogs/map-preview/map-preview.component';
import { MallOrderDetailsComponent } from './components/main-features/storefrontmall/mall-order-details/mall-order-details.component';
import { CustomerCampaignsComponent } from './components/main-features/customers/customer-campaigns/customer-campaigns.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { ReturnCustomerMessageComponent } from './components/main-features/customers/customer-messages/return-customer-message/return-customer-message.component';
import { CustomersMessagesComponent } from './components/main-features/customers/customer-messages/all-customers-messages/customers-messages.component';
import { CreateCustomerMessageComponent } from './components/main-features/customers/customer-messages/create-customer-message/create-customer-message.component';
import { CustomerMessageDetailsComponent } from './components/main-features/customers/customer-messages/customer-message-details/customer-message-details.component';
import { CreateCustomersCampaignComponent } from './components/main-features/customers/create-customers-campaign/create-customers-campaign.component';
import { PosReceiptComponent } from './components/main-features/sales-orders/pos-receipt/pos-receipt.component';
import { OptInOutEmailReportsComponent } from './components/main-features/settings/dialog/opt-in-out-email-reports/opt-in-out-email-reports.component';
// import { SalesNavbarItemComponent } from './components/common/sales-navbar-item/sales-navbar-item.component';
// import { AllPaymentsRequestsComponent } from './components/main-features/settings/all-payments-requests/all-payments-requests.component';
import { FirstLetterOfEachWordPipe } from './pipes/first-letter-of-each-word.pipe';
import { DecimalPipe } from '@angular/common';
import { NewInvoiceRequestComponent } from './components/main-features/invoice-requests/new-invoice-request/new-invoice-request.component';
import { InvoiceRequestsComponent } from './components/main-features/invoice-requests/invoice-requests/invoice-requests.component';
import { MaxValueDirective } from './directives/max-value.directive';
import { ProductsListDialogComponent } from './components/main-features/products/products-list-dialog/products-list-dialog.component';
// import { AfterSalesDialogComponent } from './components/main-features/sales-orders/after-sales-dialog/after-sales-dialog.component';
import { SmsTopupDialogComponent } from './components/main-features/customers/sms-topup-dialog/sms-topup-dialog.component';
import { ConfirmInvoiceTypeDialogComponent } from './components/main-features/invoice-requests/confirm-invoice-type-dialog/confirm-invoice-type-dialog.component';
import { NewPurchaseOrderComponent } from './components/main-features/suppliers/new-purchase-order/new-purchase-order.component';
import { ConfirmPurchaseOrderDialogComponent } from './components/main-features/suppliers/confirm-purchase-order-dialog/confirm-purchase-order-dialog.component';
import { SuppliersListDialogComponent } from './components/main-features/suppliers/suppliers-list-dialog/suppliers-list-dialog.component';
import { PurchaseOrdersComponent } from './components/main-features/suppliers/purchase-orders/purchase-orders.component';
import { NgxPrinterModule } from 'ngx-printer';
import { ConfigurationComponent } from './components/main-features/facebook-integration/configuration/configuration.component';
import { ProductCatalogComponent } from './components/main-features/facebook-integration/product-catalog/product-catalog.component';
import { DashboardOverviewComponent } from './components/main-features/facebook-integration/dashboard-overview/dashboard-overview.component';
import { FacebookLoginDialogComponent } from './components/main-features/facebook-integration/facebook-login-dialog/facebook-login-dialog.component';
import { FacebookLoginProvider, SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { NumberDirective } from './directives/numbers-only.directive';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { NgApexchartsModule } from 'ng-apexcharts';

import { ExpenseCategoriesComponent } from './components/main-features/expenses/expense-categories/expense-categories.component';
import { FreshdeskArticleDetailComponent } from './components/main-features/freshdesk-integration/freshdesk-article-detail/freshdesk-article-detail.component';
import { FreshdeskArticleListComponent } from './components/main-features/freshdesk-integration/freshdesk-article-list/freshdesk-article-list.component';
import { FreshdeskCategoriesFolders } from './components/main-features/freshdesk-integration/freshdesk-categoeries-folders/freshdesk-categories-folders.component';
import { NoDuplicateDirective } from './directives/no-duplicate-digit.directive';
import { AddPaymentRequestComponent } from './components/main-features/settings/add-payment-request/add-payment-request.component';
import { OnboardingCongratulationComponent } from './components/main-features/onboarding-stepper/steps/onboarding-congratulation/onboarding-congratulation.component';
import { ReadPaymentRequestRequirementsComponent } from './components/main-features/settings/dialog/read-payment-request-requirements/read-payment-request-requirements.component';
import { AfterSalesDialogComponent } from './components/main-features/sales-orders/after-sales-dialog/after-sales-dialog.component';
import { SalesNavbarItemComponent } from './components/common/sales-navbar-item/sales-navbar-item.component';
import { AllPaymentsRequestsComponent } from './components/main-features/settings/all-payments-requests/all-payments-requests.component';
import { HomeDashboardComponent } from './components/main-features/dashboard/home-dashboard/home-dashboard.component';
import { NewSalesOrderComponent } from './components/main-features/sales-orders/new-sales-order/new-sales-order.component';
import { OrderPaymentComponent } from './components/main-features/sales-orders/order-payment/order-payment.component';
import { SalesOrderListItemComponent } from './components/common/list-items/sales-order-list-item/sales-order-list-item.component';
import { PayCreditComponent } from './components/main-features/customers/pay-credit/pay-credit.component';
import { EditPaymentRequestDialogComponent } from './components/main-features/settings/dialog/edit-payment-request-dialog/edit-payment-request-dialog.component';
import { VerifyEmailComponent } from './components/setup/verify-email/verify-email.component';
import { VerifyEmailDialogComponent } from './components/main-features/settings/dialog/verify-email-dialog/verify-email-dialog.component';
import { SalesPaymentStatusCheckComponent } from './components/common/dialogs/sales-payment-status-check/sales-payment-status-check.component';
import { PaymentsDashboardComponent } from './components/main-features/paga-integration/payments-dashboard/payments-dashboard.component';
import { CreatePagaAccountComponent } from './components/main-features/paga-integration/create-paga-account/create-paga-account.component';
import { SubscriptionDialogComponent } from './components/main-features/premium-payments/subscription-dialog/subscription-dialog.component';
import { ResendDailyReportComponent } from './components/common/dialogs/resend-daily-report/resend-daily-report.component';
import { EnhancedLoginComponent } from './components/setup/enhanced-login/enhanced-login.component';
// import firebase from 'firebase';

@NgModule({
  declarations: [
    NumberDirective,
    AppComponent,
    EnhancedLoginComponent,
    OrderDetailsComponent,
    PageNotFoundComponent,
    MainNavComponent,
    ConfirmDialogComponent,
    LoginComponent,
    ForgotPasswordComponent,
    NumberOnlyDirective,
    CreatePinComponent,
    DashboardComponent,
    BreadcrumbActionsComponent,
    InfoDialogComponent,
    IntelligentSpotlightComponent,
    SalesOrdersReportComponent,
    SummaryReportComponent,
    SalesMarginReportComponent,
    SalesOrderDetailDialogComponent,
    ConfirmLoginComponent,
    ReportingComponent,
    SalesInventoryReportsComponent,
    PaginationComponent,
    TableHeaderActionsComponent,
    AgentsComponent,
    AgentProfileComponent,
    MyProductsComponent,
    MyCustomersComponent,
    ImageUrlPipe,
    IntlCountryCodesComponent,
    ProductUploadComponent,
    MySuppliersComponent,
    ProductDetailComponent,
    TransactionReportsComponent,
    TruncateTextPipe,
    EmptyRecordComponent,
    PartnerLoginComponent,
    NewPaymentRequestComponent,
    EditStockDialogComponent,
    DecimalOnlyDirective,
    AddAgentDialogComponent,
    AllExpensesComponent,
    NewExpenseComponent,
    NewExpenseCategoryComponent,
    NotificationActionsComponent,
    ComfirmProductUploadComponent,
    FooterComponent,
    EditProductComponent,
    GenerateProductBarcodesComponent,
    GenerateProductBarcodesParamsComponent,
    SelectShopForProductDownloadsComponent,
    ReleaseNotesComponent,
    DocImagePreviewDirective,
    DocImagePreviewPipe,
    StepperContainerComponent,
    OnboardingBusinessInformationComponent,
    OnboardingPersonalInformationComponent,
    OnboardingIndustryInformationComponent,
    OnboardingProductInformationComponent,
    OnboardingMallTemplateInformationComponent,
    OnboardingMallTemplatePreviewComponent,
    OnboardingPaymentInformationComponent,
    EnterPinComponent,
    SendVerificationCodeComponent,
    ConfirmSignUpComponent,
    NewProductComponent,
    NoSpecialCharacterDirective,
    ReplaceWhiteSpacePipe,
    ConfirmPremiumPaymentComponent,
    AlphabetsOnlyDirective,
    IframeDialogComponent,
    CongratulationComponent,
    ChangeMallOrderStatusDialogComponent,
    MallOrdersComponent,
    ShopSettingsComponent,
    MyMallComponent,
    MapPreviewComponent,
    MallBannerSettingsComponent,
    AddMallBannerDialogComponent,
    CreateNewPasswordComponent,
    ChangePasswordComponent,
    PremiumFeaturesComponent,
    PayPremiumComponent,
    UploadProductImageComponent,
    OnlineStoreNewPaymentRequestComponent,
    SetFloatingClassOnPhoneInputDirective,
    MergeProductsComponent,
    ColorPickerDialogComponent,
    UnitOfMeasurementDisplayPipe,
    AddProductGroupComponent,
    AddUnitOfMeasurementComponent,
    AddSupplierComponent,
    UpdatePriceListComponent,
    IncreaseAndDecreaseStockComponent,
    MyUnitOfMeasurementsComponent,
    MyProductCategoriesComponent,
    RemoveUnderScorePipe,
    ProductsOfAGroupComponent,
    CustomerDiscountsComponent,
    GetBaseUnitNamePipe,
    AssignProductsToAGroupComponent,
    CustomerCategoriesComponent,
    AddCustomerCategoryComponent,
    AddCustomerDiscountComponent,
    AddCustomersToCategoryComponent,
    CustomerDetailsComponent,
    AddCustomerComponent,
    CustomerCampaignsComponent,
    CustomerCampaignDetailComponent,
    FileUploadControlComponent,
    HomeDashboardComponent,
    SelectShopComponent,
    NotificationsComponent,
    OfflineShopPremiumPlansComponent,
    OnlineShopPremiumPlansComponent,
    PaymentsDialogComponent,
    SubscriptionRenewalDateDirective,
    SubscriptionRenewalDatePipe,
    MallDeliveryOptionsSettingComponent,
    MultiSelectDropdownComponent,
    MultiSelectFilterPipe,
    SearchResultsComponent,
    KudigoHelpComponent,
    PurchaseSmsCreditComponent,
    GeneralShopSettingsComponent,
    EnableDisableWhatsappCommunicationComponent,
    SageoneConnectComponent,
    DevicesComponent,
    SetReturnPolicyDialogComponent,
    ShopDataUpdateDilaogComponent,
    DynamicFormControlsComponent,
    DynamicFormControlsWithoutFormGroupComponent,
    NewSalesOrderComponent,
    NavbarItemsComponent,
    ChangeShopLogoDialogComponent,
    CardPaymentStatusCheckComponent,
    EmptyCartComponent,
    CustomersListDialogComponent,
    OrderPaymentComponent,
    EnterMomoWalletNumberComponent,
    SetActiveShopComponent,
    MyPromotionsComponent,
    AddPromotionComponent,
    PromotionDetailComponent,
    AddPromoCodeComponent,
    HasExpiredPipe,
    GenerateProductPromoCodeUrlQrCodeComponent,
    AlphaNumericOnlyDirective,
    BulkCustomerUploadComponent,
    WhatsNewComponent,
    ProductReleasesComponent,
    AllInvoicesComponent,
    ImageUploadGuidelineComponent,
    InvoiceDetailComponent,
    ScrollSpyDirective,
    SubscriptionDueDialogComponent,
    MallOrderDetailsComponent,
    ReturnCustomerMessageComponent,
    CustomersMessagesComponent,
    CreateCustomerMessageComponent,
    CustomerMessageDetailsComponent,
    CreateCustomersCampaignComponent,
    PosReceiptComponent,
    CreateCustomersCampaignComponent,
    OptInOutEmailReportsComponent,
    SalesNavbarItemComponent,
    AllPaymentsRequestsComponent,
    FirstLetterOfEachWordPipe,
    NewInvoiceRequestComponent,
    InvoiceRequestsComponent,
    MaxValueDirective,
    ProductsListDialogComponent,
    AfterSalesDialogComponent,
    SmsTopupDialogComponent,
    ConfirmInvoiceTypeDialogComponent,
    NewPurchaseOrderComponent,
    ConfirmPurchaseOrderDialogComponent,
    SuppliersListDialogComponent,
    PurchaseOrdersComponent,
    ConfigurationComponent,
    ProductCatalogComponent,
    DashboardOverviewComponent,
    FacebookLoginDialogComponent,
    ExpenseCategoriesComponent,
    FreshdeskCategoriesFolders,
    FreshdeskArticleListComponent,
    FreshdeskArticleDetailComponent,
    NoDuplicateDirective,
    AddPaymentRequestComponent,
    OnboardingCongratulationComponent,
    ReadPaymentRequestRequirementsComponent,
    SalesOrderListItemComponent,
    PayCreditComponent,
    EditPaymentRequestDialogComponent,
    VerifyEmailComponent,
    VerifyEmailDialogComponent,
    SalesPaymentStatusCheckComponent,
    PaymentsDashboardComponent,
    CreatePagaAccountComponent,
    SubscriptionDialogComponent,
    ResendDailyReportComponent,

  ],
  entryComponents: [
    ConfirmDialogComponent,
    InfoDialogComponent,
    EditStockDialogComponent,
    SalesOrderDetailDialogComponent,
    AddAgentDialogComponent,
    NewExpenseComponent,
    NewExpenseCategoryComponent,
    NotificationActionsComponent,
    ComfirmProductUploadComponent,
    EditProductComponent,
    GenerateProductBarcodesParamsComponent,
    SendVerificationCodeComponent,
    ConfirmPremiumPaymentComponent,
    CongratulationComponent,
    ChangeMallOrderStatusDialogComponent,
    MapPreviewComponent,
    AddMallBannerDialogComponent,
    ChangePasswordComponent,
    UploadProductImageComponent,
    MergeProductsComponent,
    ColorPickerDialogComponent,
    AddProductGroupComponent,
    AddUnitOfMeasurementComponent,
    AddSupplierComponent,
    UpdatePriceListComponent,
    IncreaseAndDecreaseStockComponent,
    ProductsOfAGroupComponent,
    AssignProductsToAGroupComponent,
    AddCustomerCategoryComponent,
    AddCustomerDiscountComponent,
    AddCustomersToCategoryComponent,
    AddCustomerComponent,
    CustomerCampaignDetailComponent,
    SelectShopComponent,
    NotificationsComponent,
    PaymentsDialogComponent,
    MultiSelectDropdownComponent,
    PosReceiptComponent
  ],
  imports: [
    NgApexchartsModule,
    SocialLoginModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxEchartsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    AngularBootstrapModule,
    ExportAsModule,
    AvatarModule,
    CarouselModule,
    // NgxMatIntlTelInputModule,
    // BsDropdownModule.forRoot(),
    // NgxIntlTelInputModule,
    NgxDaterangepickerMd.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireMessagingModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    NgxGtagModule.forRoot({trackingId: 'UA-107863219-2'}),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    NgxBarcodeModule,
    // NgxPrintModule,
    ImageCropperModule,
    NgxDropzoneModule,
    AppRoutingModule,
    KeyboardShortcutsModule.forRoot(),
    NgxPrinterModule.forRoot({printOpenWindow: false}),
    ShareButtonsModule.withConfig({
      debug: true
    }),
    ShareIconsModule,
    LazyLoadImageModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    AnQrcodeModule,
    // PlotlyViaCDNModule,
    AgmCoreModule.forRoot({
      apiKey: environment.API_KEY,
      libraries: ['places', 'geometry']
    }),
    AgmDirectionModule,
    LazyLoadImageModule,
    GoogleChartsModule,
    // ThermalPrintModule,
    NgCircleProgressModule.forRoot(),
    NgxIndexedDBModule.forRoot(dbConfig),
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
    }
    })
  ],
  providers: [
    Title,
    DecimalPipe,
    {provide: ErrorHandler, useClass: SentryErrorHandlerService},
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}},
    { provide: 'SocialAuthServiceConfig', useValue: { autoLogin: false,
      providers: [{
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('174301441341430')
          }]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {

}
