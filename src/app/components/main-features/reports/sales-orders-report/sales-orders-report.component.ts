import { Router } from '@angular/router';
import { inOutAnimation } from 'src/app/utils/animations.animator';
import { Component, OnInit } from '@angular/core';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { Title } from '@angular/platform-browser';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { ExportDocumentsService } from 'src/app/services/export-documents.service';
import { Observable } from 'rxjs';
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
import { OrdersApiCallsService } from 'src/app/services/network-calls/orders-api-calls.service';
import { OrdersLocalDbCallsService } from 'src/app/services/local-db-calls/orders-local-db-calls.service';
import { OnlineStatusService } from 'src/app/services/online-status.service';
import { ICallback } from 'src/app/interfaces/callback.interface';
import { localStoreNames } from 'src/app/interfaces/local-db-stores/local-db-store-names';

@Component({
  selector: 'app-sales-orders-report',
  templateUrl: './sales-orders-report.component.html',
  styleUrls: ['./sales-orders-report.component.scss'],
  animations: [inOutAnimation]
})
export class SalesOrdersReportComponent implements OnInit {
  pageHeaderOptions: IPageHeader;
  dateStep = 7;
  saleOrderDetail;
  salesOrderItems = [];
  businessOverviewObservable: Observable<any>;
  graphOverviewObservable: Observable<any>;
  isProcessing: boolean;
  businessOverview;
  selected;
  salesOrders = [];
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

  constructor(
    private title: Title,
    private exportDocs: ExportDocumentsService,
    private dataProvider: DataProviderService,
    private notificationService: NotificationsService,
    private dataExport: DataExportUtilsService,
    private router: Router,
    private constantValues: ConstantValuesService,
    private ordersApiCalls: OrdersApiCallsService,
    private ordersLocalDbCalls: OrdersLocalDbCallsService,
    private onlineStatus: OnlineStatusService,
    ) { }

  ngOnInit() {
    // this.title.setTitle(this.constantValues.APP_NAME + ' | Sales Orders Report');
    this.tableHeaderOption = { hasSearch: true, searchPlaceholder: 'Search sales order' };
    // tslint:disable-next-line:max-line-length
    this.pageHeaderOptions = {pageTitle: 'Sales Reports',  hasDateRangeFilter: true, hasPaymentMethodFilter: true, hasShopsFilter: true, hasOrderStatusFilter: true};
  }
  /**
   * Data refershed from IPageHeader
   * @param data ISharedData interface
   */
  onDataRefreshed(data: ISharedData) {
    if (data !== null && data !== undefined) {
      // tslint:disable-next-line:max-line-length
      this.requestPayload = { start_date: data.filter_date_range.start_date, end_date: data.filter_date_range.end_date, status: data.order_status, payment_method: data.payment_method, shop_id: data.shop_id};
      this.orderStatus = data.order_status;
      // tslint:disable-next-line:max-line-length
      this.getSalesOrders({ start_date: data.filter_date_range.start_date, end_date: data.filter_date_range.end_date, status: data.order_status, payment_method: data.payment_method, shop_id: data.shop_id});
    }
  }
  /**
   * Fired when searching sales order
   * @param searchText searchText
   */
  onSearchOrder(searchText) {
    this.requestPayload = {search_text: searchText};
    this.isProcessing = true;
    this.dataProvider.getAll(this.constantValues.SEARCH_ORDERS_ENDPOINT, this.requestPayload)
      .subscribe(result => {
        this.isProcessing =  false;
        if (result.response_code === '100') {
          this.salesOrders = result.results;
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
  // /**
  //  * Get sales orders reports
  //  * @param fitlerData IDashboardFilterParams interface
  //  */
  // getSalesOrders(fitlerData: IDashboardFilterParams) {
  //   // fitlerData.start_date = moment(fitlerData.start_date).format(this.constantValues.DD_MM_YYYY_DATE_FORMAT);
  //   // fitlerData.end_date = moment(fitlerData.end_date).format(this.constantValues.DD_MM_YYYY_DATE_FORMAT);
  //   fitlerData.shop_id = (fitlerData.shop_id !== '' && fitlerData.shop_id !== null && fitlerData.shop_id !== undefined) ? +fitlerData.shop_id : fitlerData.shop_id;
  //   this.isProcessing = true;
  //   this.dataProvider.getAll(this.constantValues.FILTER_SALES_ORDERS_ENDPOINT, fitlerData)
  //     .subscribe(result => {
  //       this.isProcessing =  false;
  //       if (result.response_code === '100') {
  //         this.salesOrders = result.results;
  //         this.prevPage = result.previous;
  //         this.nextPage = result.next;
  //         this.totalPage = result.count;
  //         this.totalAmount = result.total_amount;
  //         this.salesOrdersReports = result;
  //       }
  //     }, error => {
  //       this.isProcessing =  false;
  //       this.notificationService.snackBarMessage(error.detail);
  //     });
  // }
  
  /**
   * Get sales orders reports
   * @param fitlerData IDashboardFilterParams interface
   */
  getSalesOrders(fitlerData: IDashboardFilterParams) {
    if(this.onlineStatus.isOnline) {
      fitlerData.shop_id = (fitlerData.shop_id !== '' && fitlerData.shop_id !== null && fitlerData.shop_id !== undefined) ? +fitlerData.shop_id : fitlerData.shop_id;
      // console.log('online db shopid', fitlerData.shop_id);
      this.isProcessing = true;
      this.dataProvider.getAll(this.constantValues.FILTER_SALES_ORDERS_ENDPOINT, fitlerData)
      .subscribe(result => {
        this.isProcessing =  false;
        if (result.response_code === '100') {
          this.salesOrders = result.results;
          this.prevPage = result.previous;
          this.nextPage = result.next;
          this.totalPage = result.count;
          this.totalAmount = result.total_amount;
          this.salesOrdersReports = result;
          // console.log('online db orders:', result)
        }
      }, error => {
        this.isProcessing =  false;
        this.notificationService.snackBarMessage(error.detail);
      });
    } 
    if(this.onlineStatus.isOffline) {
      // get shop id from local storage
      const shopId = this.dataProvider.getAll(localStoreNames.persisted_sales_orders).subscribe(result => {
        // console.log(result);
        const data: any[] = (result !== null && result !== undefined) ? result[0].data : [];
        let queryResult = data;
        if (shopId !== null && shopId !== undefined) {
          queryResult = data.filter(el => +el.myshop.id === +shopId);
          // console.log('local db shopid', queryResult);
          this.isProcessing = true;
          this.dataProvider.getAll(localStoreNames.order, fitlerData).subscribe(result => {
            this.isProcessing =  false;
            if (result.response_code === '100') {
              this.salesOrders = result.results;
              this.prevPage = result.previous;
              this.nextPage = result.next;
              this.totalPage = result.count;
              this.totalAmount = result.total_amount;
              this.salesOrdersReports = result;
              // console.log('local db orders:', result)
            }
          });
        }
      });
    }
  } 


  /**
   * On page changed
   * @param result result after page changed
   */
  onPageChanged(result) {
    this.salesOrders = result.results;
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
    this.salesOrderItems = order.myitems;
  }
   /**
   * Export order detail as PDF Document
   */
  exportAsPDF() {
    this.exportDocs.exportAsPDF('Sales Order: ' + this.saleOrderDetail.order_code, 'salesOrderModalBody');
  }
  /**
   * Export as excel
   */
  exportAsExcel() {
    this.getDataToDownload(this.requestPayload as IDashboardFilterParams, DocTypes.EXCEL);
  }
  /**
   * Export as PDF
   */
   exportAllAPDF() {
    this.getDataToDownload(this.requestPayload as IDashboardFilterParams, DocTypes.PDF);
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
    this.dataProvider.getAll(this.constantValues.FILTER_SALES_ORDERS_ENDPOINT, fitlerData)
      .subscribe(result => {
        this.isProcessing =  false;
        if (result.response_code === '100') {
          const dataSet: any[] = result.results;
          if (docType === DocTypes.EXCEL) {
            this.dataExport.exportSalesOrdersAsCSV(dataSet);
          } else if (docType === DocTypes.PDF) {
            this.dataExport.exportSalesOrdersAsPDF(dataSet, fitlerData?.start_date + ' - ' + fitlerData?.end_date);
          }
        }
      }, error => {
        this.isProcessing =  false;
        this.notificationService.snackBarMessage(error.detail);
      });
  }
    /**
   * Collapse or Expand Order detail
   * @param order order detail
   */
  collapseOrderDetail(order) {
    if (order.id === this.orderId) {
      this.orderId = '';
      return;
    }
    this.orderId = order.id;
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
  onNewSale() {
    this.router.navigate(['/sales/new-order']);
  }
}
