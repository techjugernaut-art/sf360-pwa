import { Component, OnInit } from '@angular/core';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { Title } from '@angular/platform-browser';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import * as moment from 'moment';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { Observable } from 'rxjs';
import { RequestMethod } from 'src/app/components/common/pagination/pagination.component';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { ITableHeaderActions } from 'src/app/interfaces/table-header-actions.interace';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { DocTypes, DataExportUtilsService } from 'src/app/services/data-export-utils.service';
import { MatDialog } from '@angular/material/dialog';
import { ResendDailyReportComponent } from 'src/app/components/common/dialogs/resend-daily-report/resend-daily-report.component';

@Component({
  selector: 'app-summary-report',
  templateUrl: './summary-report.component.html',
  styleUrls: ['./summary-report.component.scss']
})
export class SummaryReportComponent implements OnInit {

  pageHeaderOptions: IPageHeader;
  dateStep = 7;
  saleOrderDetail;
  salesOrderItems = [];
  businessOverviewObservable: Observable<any>;
  graphOverviewObservable: Observable<any>;
  isProcessing: boolean;
  businessOverview;
  dataSharingSubscription;
  // tslint:disable-next-line:max-line-length
  imageLogo = '';
  selected;
  elements = [];
  totalAmount = '';
  totalPage = 0;
  nextPage = '';
  prevPage = '';
  requestPayload = {};
  requestMethod: RequestMethod;
  tableHeaderOption: ITableHeaderActions;

  constructor(
    private title: Title,
    private dataProvider: DataProviderService,
    private notificationService: NotificationsService,
    private constantValues: ConstantValuesService,
    private dataExport: DataExportUtilsService,
    private dialog: MatDialog
    ) { }

  ngOnInit() {
    // this.title.setTitle(this.constantValues.APP_NAME + ' | Sales Summary');
    this.tableHeaderOption = { };
    // tslint:disable-next-line:max-line-length
    this.pageHeaderOptions = {pageTitle: 'Sales Summary',  hasDateRangeFilter: true, hasPaymentMethodFilter: true, hasOrderStatusFilter: true, hasShopsFilter: true};
  }

  onDataRefreshed(data: ISharedData) {
    if (data !== null && data !== undefined) {
      // tslint:disable-next-line:max-line-length
      this.requestPayload = { start_date: data.filter_date_range.start_date, end_date: data.filter_date_range.end_date, status: data.order_status, payment_method: data.payment_method, shop_id: (data.shop_id !== '' && data.shop_id !== undefined && data.shop_id !== null) ? +data.shop_id : data.shop_id};
      // tslint:disable-next-line:max-line-length
      this.getBusinessOverview(this.requestPayload as IDashboardFilterParams);
    }
  }
   /**
   * Get sales summary reports
   * @param fitlerData IDashboardFilterParams interface
   */
  getBusinessOverview(fitlerData: IDashboardFilterParams) {
    // fitlerData.start_date = moment(fitlerData.start_date).format(this.constantValues.DD_MM_YYYY_DATE_FORMAT);
    // fitlerData.end_date = moment(fitlerData.end_date).format(this.constantValues.DD_MM_YYYY_DATE_FORMAT);
    this.isProcessing = true;
    this.dataProvider.getAll(this.constantValues.GET_SALES_SUMMARY_ENDPOINT, fitlerData)
      .subscribe(result => {
        this.isProcessing =  false;
        if (result.response_code === '100') {
          this.elements = result.results;
          this.prevPage = result.previous;
          this.nextPage = result.next;
          this.totalPage = result.count;
          this.totalAmount = result.total_amount;
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
   * @param order order obect
   */
  viewOrderDetails(order) {
    this.saleOrderDetail = order;
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
   * Get sales summary reports
   * @param fitlerData IDashboardFilterParams interface
   */
  getDataToDownload(fitlerData: IDashboardFilterParams, docType: DocTypes) {
    // fitlerData.start_date = moment(fitlerData.start_date).format(this.constantValues.DD_MM_YYYY_DATE_FORMAT);
    // fitlerData.end_date = moment(fitlerData.end_date).format(this.constantValues.DD_MM_YYYY_DATE_FORMAT);
    fitlerData.paginate = false;
    this.isProcessing = true;
    this.dataProvider.getAll(this.constantValues.GET_SALES_SUMMARY_ENDPOINT, fitlerData)
      .subscribe(result => {
        this.isProcessing =  false;
        if (result.response_code === '100') {
          const salesSummary: any[] = result.results;
          if (docType === DocTypes.EXCEL) {
            this.dataExport.exportSummaryAsExcel('Sales_Summary', salesSummary);
          } else if (docType === DocTypes.PDF) {
            const reportHeader = ['PRODUCT', 'QTY IN STOCK', 'SUPPLIER PRICE', 'SELLING PRICE', 'QTY SOLD', 'AMT SOLD', 'SALES MARGIN'];
          const reportData = [];
          salesSummary.forEach(data => {
            // tslint:disable-next-line:max-line-length
            const row: any[] = [data.product_name, data.quantity_left, data.supplier_price, data.selling_price, data.quantity_sold, data.amount_sold, data.sales_margin];
            reportData.push(row);
          });
          this.downloadReportAsPDF(reportHeader, reportData, 'Sales Summary');
          }
        }
      }, error => {
        this.isProcessing =  false;
        this.notificationService.snackBarMessage(error.detail);
      });
  }
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
  onResendReport() {

    this.dialog.open(ResendDailyReportComponent);
  }
}
