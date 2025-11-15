import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { RequestMethod } from 'src/app/components/common/pagination/pagination.component';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { ITableHeaderActions } from 'src/app/interfaces/table-header-actions.interace';
import { AuthService } from 'src/app/services/auth.service';
import { DataExportUtilsService, DocTypes } from 'src/app/services/data-export-utils.service';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { ExportDocumentsService } from 'src/app/services/export-documents.service';
import { ExpensesService } from 'src/app/services/network-calls/expenses.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice-requests',
  templateUrl: './invoice-requests.component.html'
})
export class InvoiceRequestsComponent implements OnInit {
  pageHeaderOptions: IPageHeader;
  dateStep = 7;
  saleOrderDetail;
  salesOrderItems = [];
  businessOverviewObservable: Observable<any>;
  graphOverviewObservable: Observable<any>;
  isProcessing: boolean;
  businessOverview;
  selected;
  invoices = [];
  totalAmount = '';
  totalPage = 0;
  nextPage = '';
  prevPage = '';
  orderStatus = '';
  requestPayload = {};
  requestMethod: RequestMethod;
  tableHeaderOption: ITableHeaderActions;
  salesOrdersReports;
  orderId;
  productId = '';
  shopId = '';
  isPartner = false;

  constructor(
    private exportDocs: ExportDocumentsService,
    private dataExport: DataExportUtilsService,
    private expensesService: ExpensesService,
    private authService: AuthService,
    private matDialog: MatDialog,
    private router: Router,
    private notificationService: NotificationsService,
  ) { }

  ngOnInit() {
    this.tableHeaderOption = { hasSearch: true, searchPlaceholder: 'Search Invoice' };
    this.isPartner = this.authService.isPartner;
    // tslint:disable-next-line:max-line-length
    this.pageHeaderOptions = { pageTitle: 'Invoice Requests', hasDateRangeFilter: true, hasExpenseCategoryFilter: false, hasShopsFilter: true };
  }
  /**
   * Data refershed from IPageHeader
   * @param data ISharedData interface
   */
  onDataRefreshed(data: ISharedData) {
    if (data !== null && data !== undefined) {
      // tslint:disable-next-line:max-line-length
      this.requestPayload = { start_date: data.filter_date_range.start_date, end_date: data.filter_date_range.end_date, category_id: data.expense_category, shop_id: data.shop_id };
      this.shopId = data.shop_id;
      // tslint:disable-next-line:max-line-length
      this.getInvoices({ start_date: data.filter_date_range.start_date, end_date: data.filter_date_range.end_date, category_id: data.expense_category, shop_id: data.shop_id });
    }
  }
  /**
   * Fired when searching sales order
   * @param searchText searchText
   */
  onSearchOrder(searchText) {
    this.requestPayload = { search_text: searchText };
    this.isProcessing = true;
    this.expensesService.searchExpense(this.requestPayload, (error, result) => {

      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        this.invoices = result.results;
        this.prevPage = result.previous;
        this.nextPage = result.next;
        this.totalPage = result.count;
        this.totalAmount = result.total_amount;
        this.salesOrdersReports = result;
      }
    });
  }
  /**
  * Get sales orders reports
  * @param fitlerData IDashboardFilterParams interface
  */
  getInvoices(fitlerData: IDashboardFilterParams) {
    fitlerData.start_date = moment(fitlerData.start_date).format('YYYY-MM-DD');
    fitlerData.end_date = moment(fitlerData.end_date).format('YYYY-MM-DD');
    this.isProcessing = true;
    this.expensesService.getAll(this.requestPayload, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        this.invoices = result.results;
        this.prevPage = result.previous;
        this.nextPage = result.next;
        this.totalPage = result.count;
        this.totalAmount = result.total_amount;
        this.salesOrdersReports = result;
      }
    });
  }
  /**
   * On page changed
   * @param result result after page changed
   */
  onPageChanged(result) {
    this.invoices = result.results;
    this.prevPage = result.previous;
    this.nextPage = result.next;
    this.totalPage = result.count;
    this.totalAmount = result.total_amount;
  }
  newRequest(){
    this.router.navigate(['/invoices/new-request'])
  }
  /**
* Export order detail as PDF Document
*/
  exportAsPDF() {
    this.getDataToDownload(this.requestPayload as IDashboardFilterParams, DocTypes.PDF);
  }
  exportAsExcel() {
    this.getDataToDownload(this.requestPayload as IDashboardFilterParams, DocTypes.EXCEL);
  }
  /**
    * Get expenses summary reports
    * @param fitlerData IDashboardFilterParams interface
    */
  getDataToDownload(fitlerData: IDashboardFilterParams, docType: DocTypes) {
    fitlerData.start_date = moment(fitlerData.start_date).format('YYYY-MM-DD');
    fitlerData.end_date = moment(fitlerData.end_date).format('YYYY-MM-DD');
    this.isProcessing = true;
    this.expensesService.getAll(this.requestPayload, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        if (result.response_code === '100') {
          const salesSummary: any[] = result.results;
          if (docType === DocTypes.EXCEL) {
            this.dataExport.exportSummaryAsExcel('Sales_Summary', salesSummary);
          } else if (docType === DocTypes.PDF) {
            const reportHeader = ['SHOP', 'CATEGORY', 'AMOUNT', 'NOTE', 'IS RECURRING', 'RECURRING INTERVAL', 'TRANSACTION DATE', 'DATE CREATED'];
            const reportData = [];
            salesSummary.forEach(data => {
              // tslint:disable-next-line:max-line-length
              const row: any[] = [data.myShop.business_name, data.category.name, data.amount, data.note, data.is_recurring, data.recurring_interval, data.transaction_date, data.time_created];
              reportData.push(row);
            });
            this.downloadReportAsPDF(reportHeader, reportData, 'Sales Summary');
          }
        }
      };
    })
  }
  downloadReportAsPDF(heading: any[], dataset: any[], title: string) {

    const doc = new jsPDF();
    // doc.addImage(this.imageLogo, 'PNG', 100, 10);
    doc.setFont('helvetica');
    // doc.setFontStyle('normal');
    doc.setFontSize(16);
    doc.text('KudiGo', 105, 35, { align: 'center' });
    doc.setFontSize(12);
    doc.text(title, 105, 43, { align: 'center' });
    doc.setFontSize(12);
    // tslint:disable-next-line:max-line-length
    // doc.text(moment(this.startDate).format('DD-MM-YYYY') + ' to ' + moment(this.endDate).format('DD-MM-YYYY'), 105, 50, {align: 'center'});


    // doc.autoTable({
    //   startY: 70,
    //   head: [heading],
    //   body: dataset
    // });

    doc.save('Sales Summary.pdf');
  }
}
