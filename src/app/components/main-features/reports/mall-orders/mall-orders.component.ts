import { AuthService } from 'src/app/services/auth.service';
import { ChangeMallOrderStatusDialogComponent } from '../../storefrontmall/change-mall-order-status-dialog/change-mall-order-status-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { OrdersApiCallsService } from 'src/app/services/network-calls/orders-api-calls.service';
import { Title } from '@angular/platform-browser';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { RequestMethod } from 'src/app/components/common/pagination/pagination.component';
import { ITableHeaderActions } from 'src/app/interfaces/table-header-actions.interace';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';
import { ExportDocumentsService } from 'src/app/services/export-documents.service';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { DataExportUtilsService, DocTypes } from 'src/app/services/data-export-utils.service';
import { MapPreviewComponent } from 'src/app/components/common/dialogs/map-preview/map-preview.component';

@Component({
  selector: 'app-mall-orders',
  templateUrl: './mall-orders.component.html',
  styleUrls: ['./mall-orders.component.scss']
})
export class MallOrdersComponent implements OnInit {
  isProcessing = false;
  isPartner = false;
  mallOrders = [];
  pageHeaderOptions: IPageHeader;
  totalAmount = '';
  totalPage = 0;
  nextPage = '';
  prevPage = '';
  requestPayload = {};
  requestMethod: RequestMethod;
  tableHeaderOption: ITableHeaderActions;
  orderStatus: string;
  salesOrdersReports: any;
  saleOrderDetail: any;
  salesOrderItems: any;
  mallOrderStatus: string;
  constructor(
    private ordersService: OrdersApiCallsService,
    private exportDocs: ExportDocumentsService,
    private title: Title,
    private dialog: MatDialog,
    private authService: AuthService,
    private dataExport: DataExportUtilsService,
    private constantValues: ConstantValuesService
  ) { }

  ngOnInit() {
    // this.title.setTitle(this.constantValues.APP_NAME + ' | Mall Orders');
    this.tableHeaderOption = { hasSearch: true, searchPlaceholder: 'Search mall orders' };
    this.isPartner = this.authService.isPartner;
    // tslint:disable-next-line:max-line-length
    this.pageHeaderOptions = { pageTitle: 'Mall Orders', hasDateRangeFilter: true, hasPaymentMethodFilter: true, hasShopsFilter: true, hasPaymentStatusFilter: true, hasMallOrderStatusFilter: true };
  }
  /**
   * Data refershed from IPageHeader
   * @param data ISharedData interface
   */
  onDataRefreshed(data: ISharedData) {
    if (data !== null && data !== undefined) {
      // tslint:disable-next-line:max-line-length
      this.requestPayload = { start_date: data.filter_date_range.start_date, end_date: data.filter_date_range.end_date, status: data.mall_order_status, payment_status: data.payment_status, payment_method: data.payment_method, shop_id: data.shop_id };
      this.orderStatus = data.order_status;
      this.mallOrderStatus = data.mall_order_status;
      // tslint:disable-next-line:max-line-length
      this.getPendingMallOrders({ start_date: data.filter_date_range.start_date, end_date: data.filter_date_range.end_date, status: data.mall_order_status, payment_status: data.payment_status, payment_method: data.payment_method, shop_id: data.shop_id });
    }
  }
  getPendingMallOrders(filterParams) {
    this.isProcessing = true;
    this.ordersService.getPendingMallOrderStatus(filterParams, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        this.mallOrders = result.results;
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
    this.mallOrders = result.results;
    this.prevPage = result.previous;
    this.nextPage = result.next;
    this.totalPage = result.count;
    this.totalAmount = result.total_amount;
    this.salesOrdersReports = result;
  }
  /**
   * View mall order details
   * @param order order obect
   */
  viewOrderDetails(order) {
    this.saleOrderDetail = order;
    this.salesOrderItems = order.shop_mall_items;
  }
  printOrder(order) {
    this.saleOrderDetail = order;
    this.salesOrderItems = order.shop_mall_items;
    setTimeout(() => {
      window.print();
    }, 1000);
  }
  /**
  * Export order detail as PDF Document
  */
  exportAsPDF() {
    this.exportDocs.exportAsPDF('Sales Order: ' + this.saleOrderDetail.order_code, 'salesOrderModalBody');
  }
  /**
   * Fired when searching sales order
   * @param searchText searchpText
   */
  onSearchOrder(searchText) {
    // this.requestPayload = {search_text: searchText};
    // this.isProcessing = true;

  }
    /**
   * View mall order details
   * @param order order obect
   */
  updateStatus(order) {
    this.dialog.open(ChangeMallOrderStatusDialogComponent, {data: {order: order}}).afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.getPendingMallOrders(this.requestPayload);
      }
    });
  }
  viewMap(order) {
    this.dialog.open(MapPreviewComponent, { data: {order: order}});
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
  getDataToDownload(fitlerData: IDashboardFilterParams, docType: DocTypes) {
    this.ordersService.getPendingMallOrderStatus(fitlerData, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        const dataSet: any[] = result.results;
        if (docType === DocTypes.EXCEL) {
          this.dataExport.exportMallOrdersAsCSV(dataSet);
        } else if (docType === DocTypes.PDF) {
        }
      }
    });
  }
}
