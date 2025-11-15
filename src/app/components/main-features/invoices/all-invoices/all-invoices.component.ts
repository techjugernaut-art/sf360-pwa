import { ExportDocumentsService } from 'src/app/services/export-documents.service';
import { AppUtilsService } from 'src/app/services/app-utils.service';
import { Component, OnInit } from '@angular/core';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import * as moment from 'moment';
import { ConfirmPremiumPaymentComponent } from '../../premium-payments/confirm-premium-payment/confirm-premium-payment.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-all-invoices',
  templateUrl: './all-invoices.component.html'
})
export class AllInvoicesComponent implements OnInit {

  pageHeaderOptions: IPageHeader;
  isProcessing = false;
  storeId: string;
  shopInfo;
  totalPage = 0;
  nextPage = '';
  prevPage = '';
  requestPayload = {};
  isProcessingShops: boolean;
  currentPremiumPlan: any;
  allInvoices = []
  invoiceDetail;
  redirectUrl = '';

  constructor(
    private dialog: MatDialog,
    private shopsService: ShopsService,
    private exportDocs: ExportDocumentsService,
    private appUtils: AppUtilsService,
    private constantValues: ConstantValuesService,
    ) { }

  ngOnInit() {
    // tslint:disable-next-line:max-line-length
    this.pageHeaderOptions = { pageTitle: 'Billing', hasShopsFilter: true, ignoreFilterByAllShops: true, hideFilterPanel: false };

  }
  /**
   * Update shared data
   * @param data ISharedData
   */
  onDataRefreshed(data: ISharedData) {
    if (data !== null && data !== undefined) {
      // tslint:disable-next-line:max-line-length
      this.requestPayload = { shop_id: data.shop_id };
      this.storeId = data.shop_id;
      this.getShopById(this.requestPayload as IDashboardFilterParams);
    }
  }

  /**
   * Get shop information by a particular shop id
   * @param filterParams filter param
   */
  getShopById(filterParams: IDashboardFilterParams) {
    this.isProcessing = true;
    this.shopsService.getMyShop(filterParams, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        this.shopInfo = result.results[0];
        this.currentPremiumPlan = this.shopInfo.premium_plan;
        this.getInvoices({ shop_id: this.shopInfo.id, start_date: moment().subtract(1, 'years').format(this.constantValues.DD_MM_YYYY_DATE_FORMAT), end_date: moment().format(this.constantValues.DD_MM_YYYY_DATE_FORMAT)});
      }

    });
  }
  /**
       * Get shop information by a particular shop id
       * @param filterParams filter param
       */
  getInvoices(filterParams: IDashboardFilterParams) {
    this.isProcessing = true;
    this.requestPayload = filterParams;
    this.shopsService.filterInvoices(filterParams, (error, result) => {
      this.isProcessing = false;
      // console.log(result)
      if (result !== null && result.response_code === '100') {
        this.allInvoices = result.results;
        this.prevPage = result.previous;
        this.nextPage = result.next;
        this.totalPage = result.count;
      }

    });
  }
  onPayBill(invoice){
    // console.log(invoice)
    this.dialog.open(ConfirmPremiumPaymentComponent,
      // tslint:disable-next-line: max-line-length
      { data: { payment_method: invoice.payment_method, payment_network: invoice?.payment_network, phone_number: invoice?.phone_number, shop_id: invoice.myshop.id, premium_plan_id: invoice.premium_plan.id }, disableClose: true })
      .afterClosed().subscribe((isSuccess: boolean) => {
        if (isSuccess) {
          this.getInvoices(this.requestPayload as IDashboardFilterParams)
        }
      });
  }  
  /**
   * On page changed
   * @param result result after page changed
   */
  onPageChanged(result) {
    this.allInvoices = result.results;
    this.prevPage = result.previous;
    this.nextPage = result.next;
    this.totalPage = result.count;
  }

  onViewInvoice(invoice) {
    this.invoiceDetail = invoice;
  }
  invoiceStatusCssClass(status) {
    return this.appUtils.replaceWhitespaceWithHyphen(status).toLowerCase();
  }
   /**
   * Export order detail as PDF Document
   */
  exportAsPDF() {
    this.exportDocs.exportAsPDF('Invoice ' + this.invoiceDetail.invoice_number, 'salesOrderModalBody');
  }
  onPayClicked() {
    this.redirectUrl = '';
    this.redirectUrl = this.invoiceDetail.payment_link;
  }
}
