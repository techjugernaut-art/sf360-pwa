import { ActivatedRoute, Params } from '@angular/router';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { IFilterParams } from 'src/app/interfaces/filter-params.interface';
import { CustomerApiCallsService } from './../../../../services/network-calls/customer-api-calls.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { RequestMethod } from 'src/app/components/common/pagination/pagination.component';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { DataExportUtilsService, DocTypes } from 'src/app/services/data-export-utils.service';
import { ExportDocumentsService } from 'src/app/services/export-documents.service';
import { ITableHeaderActions } from 'src/app/interfaces/table-header-actions.interace';
import { inOutAnimation } from 'src/app/utils/animations.animator';
import moment from 'moment';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { PayCreditComponent } from '../pay-credit/pay-credit.component';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  animations: [inOutAnimation]
})
export class CustomerDetailsComponent implements OnInit {
  pageHeaderOptions: IPageHeader;
  isProcessing = false;
  customerDetail;
  salesOrders = [];
  totalPage = 0;
  nextPage = '';
  prevPage = '';
  requestPayload = {};
  requestMethod: RequestMethod;
  saleOrderDetail;
  salesOrderItems = [];
  orderId;
  customerId = '';
  tableHeaderOption: ITableHeaderActions;
  selectedDate = { start_date: moment().subtract(12, 'months'), end_date: moment() };
  customerName: '';

  constructor(
    private route: ActivatedRoute,
    private customersApiCalls: CustomerApiCallsService,
    private exportDocs: ExportDocumentsService,
    private dataExport: DataExportUtilsService,
    private constantValues: ConstantValuesService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.customerId = params.id;
      this.customerName = params.name;
      this.customerDetail = JSON.parse(localStorage.getItem('customer'));
      this.getOrders({customer_id: this.customerId, start_date: this.selectedDate.start_date.format(this.constantValues.DD_MM_YYYY_DATE_FORMAT), end_date: this.selectedDate.end_date.format(this.constantValues.DD_MM_YYYY_DATE_FORMAT)})
    })
    this.tableHeaderOption = { hasDateRangeFilter: true };
    this.pageHeaderOptions = { pageTitle: this.customerName, hasShopsFilter: true, hideFilterPanel: true };

  }

  getOrders(filterData: IFilterParams) {
    this.isProcessing = true;
    this.requestPayload = filterData;
    this.customersApiCalls.filterCustomerOrders(filterData, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        this.salesOrders = result.results;
        this.prevPage = result.previous;
        this.nextPage = result.next;
        this.totalPage = result.count;
      }
    });
  }
  /**
 * open pay credit dialog
 * @param result result after page changed
 */
  payCredit(order) {
    // console.log(order)
    this.dialog.open(PayCreditComponent, { data: { order: order } })
      .afterClosed().subscribe((isSuccess: boolean) => {
        if (isSuccess) {
          this.getOrders(this.requestPayload);
        }
      });
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
    this.getDataToDownload(this.requestPayload as IFilterParams, DocTypes.EXCEL);
  }
  /**
   * Export as PDF
   */
  exportAllAPDF() {
    this.getDataToDownload(this.requestPayload as IFilterParams, DocTypes.PDF);
  }
  /**
  * Get sales summary reports
  * @param fitlerData IDashboardFilterParams interface
  */
  getDataToDownload(fitlerData: IFilterParams, docType: DocTypes) {
    fitlerData.paginate = false;
    this.isProcessing = true;
    this.customersApiCalls.filterCustomerOrders(fitlerData, (error, result) => {
      this.isProcessing = false;
      if (result.status === 'success' && result !== null) {
        const dataSet: any[] = result.results;
        if (docType === DocTypes.EXCEL) {
          this.dataExport.exportSalesOrdersAsCSV(dataSet);
        } else if (docType === DocTypes.PDF) {
          this.dataExport.exportSalesOrdersAsPDF(dataSet, fitlerData?.start_date + ' - ' + fitlerData?.end_date);
        }
      }
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
  * Selected Stock History Date Range changed
  * @param selectedDateRange selected date range
  */
  onSelectStockHistoryDateRange(selectedDateRange) {
    // tslint:disable-next-line:max-line-length
    this.requestPayload = { start_date: moment(selectedDateRange.start_date).format(this.constantValues.DD_MM_YYYY_DATE_FORMAT), end_date: moment(selectedDateRange.end_date).format(this.constantValues.DD_MM_YYYY_DATE_FORMAT), customer_id: this.customerId };
    this.getOrders(this.requestPayload);
  }
}
