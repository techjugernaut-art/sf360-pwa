import { Component, OnInit } from '@angular/core';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { Title } from '@angular/platform-browser';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import * as moment from 'moment';
import { RequestMethod } from 'src/app/components/common/pagination/pagination.component';
import { ITableHeaderActions } from 'src/app/interfaces/table-header-actions.interace';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { DocTypes, DataExportUtilsService } from 'src/app/services/data-export-utils.service';
import { ITransactionsFilterParams } from 'src/app/interfaces/transactions-filter.interface';
import { AppUtilsService } from 'src/app/services/app-utils.service';

@Component({
  selector: 'app-transaction-reports',
  templateUrl: './transaction-reports.component.html',
  styleUrls: ['./transaction-reports.component.scss']
})
export class TransactionReportsComponent implements OnInit {

  pageHeaderOptions: IPageHeader;
  dateStep = 7;
  isProcessing: boolean;
  businessOverview;
  selected;
  elements = [];
  totalAmount = '';
  totalPage = 0;
  nextPage = '';
  prevPage = '';
  orderStatus = '';
  requestPayload = {};
  requestMethod: RequestMethod;
  tableHeaderOption: ITableHeaderActions;
  salesOrdersReports;
  transactionDetail;

  constructor(
    private title: Title,
    private dataProvider: DataProviderService,
    private notificationService: NotificationsService,
    private dataExport: DataExportUtilsService,
    private constantValues: ConstantValuesService,
    public appUtil: AppUtilsService) { }

  ngOnInit() {
    // this.title.setTitle(this.constantValues.APP_NAME + ' | Transactions');
    this.tableHeaderOption = { hasSearch: true, searchPlaceholder: 'Search Transaction ID' };
    // tslint:disable-next-line:max-line-length
    this.pageHeaderOptions = {pageTitle: 'Transactions',  hasDateRangeFilter: true, hasTransactionSourceFilter: true, hasTransactionTypeFilter: true, hasPaymentStatusFilter: true, hasShopsFilter: true};
  }
  /**
   * Data refershed from IPageHeader
   * @param data ISharedData interface
   */
  onDataRefreshed(data: ISharedData) {
    if (data !== null && data !== undefined) {
      // tslint:disable-next-line:max-line-length
      this.requestPayload = { start_date: data.filter_date_range.start_date, end_date: data.filter_date_range.end_date, source: data.transaction_source, transaction_type: data.transaction_type, shop_id: data.shop_id, payment_status: data.payment_status, };
      // tslint:disable-next-line:max-line-length
      this.getTransactions(this.requestPayload as ITransactionsFilterParams);
    }
  }
  onSearchTransactionEvent(searchText) {
    this.onSearchTransaction(this.requestPayload as ITransactionsFilterParams, searchText);
  }
  /**
   * Fired when searching transactions by transaction id
   * @param searchText searchText
   */
  onSearchTransaction(searchPayload: ITransactionsFilterParams, searchText) {
    searchPayload.transaction_id = searchText;
    this.requestPayload  = searchPayload;
    this.isProcessing = true;
    this.dataProvider.getAll(this.constantValues.FILTER_TRANSACTIONS_ENDPOINT, this.requestPayload)
      .subscribe(result => {
        this.isProcessing =  false;
        if (result.response_code === '100') {
          this.elements = result.results;
          this.prevPage = result.previous;
          this.nextPage = result.next;
          this.totalPage = result.count;
          this.totalAmount = result.total_amount;
          this.salesOrdersReports = result;
        }
      }, error => {
        this.isProcessing =  false;
        this.notificationService.snackBarMessage(error.detail);
      });
  }
   /**
   * Get transaction report reports
   * @param fitlerData IDashboardFilterParams interface
   */
  getTransactions(fitlerData: ITransactionsFilterParams) {
    // fitlerData.start_date = moment(fitlerData.start_date).format('YYYY-MM-DD');
    // fitlerData.end_date = moment(fitlerData.end_date).format('YYYY-MM-DD');
    this.isProcessing = true;
    this.dataProvider.getAll(this.constantValues.FILTER_TRANSACTIONS_ENDPOINT, fitlerData)
      .subscribe(result => {
        this.isProcessing =  false;
        if (result.response_code === '100') {
          this.elements = result.results;
          this.prevPage = result.previous;
          this.nextPage = result.next;
          this.totalPage = result.count;
          this.totalAmount = result.total_amount;
          this.salesOrdersReports = result;
        }
      }, error => {
        this.isProcessing =  false;
        this.notificationService.snackBarMessage(error.detail);
      });
  }
  /**
   * On page changed
   * @param result result after page changed
   */
  onPageChanged(result) {
    this.elements = result.results;
          this.prevPage = result.previous;
          this.nextPage = result.next;
          this.totalPage = result.count;
          this.totalAmount = result.total_amount;
  }
  /**
   * View sales order details using sales orders dialog
   * @param transaction order obect
   */
  showTransactionDetails(transaction) {
    this.transactionDetail = transaction;
  }
   /**
   * Export order detail as PDF Document
   */
  exportAsPDF() {
    this.getDataToDownload(this.requestPayload as IDashboardFilterParams, DocTypes.PDF);
  }
  /**
   * Export as excel
   */
  exportAsExcel() {
    this.getDataToDownload(this.requestPayload as IDashboardFilterParams, DocTypes.EXCEL);
  }
   /**
   * Get sales summary reports
   * @param fitlerData IDashboardFilterParams interface
   */
  getDataToDownload(fitlerData: ITransactionsFilterParams, docType: DocTypes) {
    // fitlerData.start_date = moment(fitlerData.start_date).format('YYYY-MM-DD');
    // fitlerData.end_date = moment(fitlerData.end_date).format('YYYY-MM-DD');
    fitlerData.paginate = false;
    this.isProcessing = true;
    this.dataProvider.getAll(this.constantValues.FILTER_TRANSACTIONS_ENDPOINT, fitlerData)
      .subscribe(result => {
        this.isProcessing =  false;
        if (result.status === 'success') {
          const dataSet: any[] = result.results;
          if (docType === DocTypes.EXCEL) {
            this.dataExport.exportTransactionsAsExcel(dataSet);
          } else if (docType === DocTypes.PDF) {
            this.dataExport.exportTransactionsAsPDF(dataSet, fitlerData?.start_date + ' - ' + fitlerData?.end_date);
          }
        }
      }, error => {
        this.isProcessing =  false;
        this.notificationService.snackBarMessage(error.detail);
      });
  }
  /**
   * Download Report as PDF document
   * @param heading report heading
   * @param dataset dataSet
   * @param title report title
   */
  downloadReportAsPDF(heading: any[], dataset: any[], title: string) {

    const doc = new jsPDF();
    // doc.addImage(this.imageLogo, 'PNG', 100, 10);
    doc.setFont('helvetica');
    // doc.setFontStyle('normal');
    doc.setFontSize(16);
    doc.text('KudiGo', 105, 35, {align: 'center'});
    doc.setFontSize(12);
    doc.text(title, 105, 43, {align: 'center'});
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
  /**
   * Convert text to lower case
   * @param text text
   */
  toLowerCase(text: string) {
    if (text !== null && text !== undefined && text !== '') {
      return text.toLowerCase();
    }
    return '';
  }
}
