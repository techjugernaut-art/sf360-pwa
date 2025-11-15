import { ProductsService } from 'src/app/services/network-calls/products.service';
import { Component, OnInit } from '@angular/core';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ITableHeaderActions } from 'src/app/interfaces/table-header-actions.interace';
import { datePickerLocales, datePickerRanges } from 'src/app/utils/const-values.utils';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { IFilterParams } from 'src/app/interfaces/filter-params.interface';
import { ActivatedRoute } from '@angular/router';
import { ExportDocumentsService } from 'src/app/services/export-documents.service';
import { DocTypes, DataExportUtilsService } from 'src/app/services/data-export-utils.service';
import { inOutAnimation } from 'src/app/utils/animations.animator';
import { MatDialog } from '@angular/material/dialog';
import { UploadProductImageComponent } from '../upload-product-image/upload-product-image.component';
declare const swal;

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  animations: [inOutAnimation]
})
export class ProductDetailComponent implements OnInit {

  pageHeaderOptions: IPageHeader;
  isProcessing = false;
  isProcessingStockRecord = false;
  shopProducts = [];
  stockRecords = [];
  totalPage = 0;
  nextPage = '';
  prevPage = '';
  requestPayload = {};
  tableHeaderOption: ITableHeaderActions;
  productDetail;
  salesOrders = [];
  saleOrderDetail;
  salesOrderItems = [];
  locale = datePickerLocales;
  ranges: any = datePickerRanges;
  selectedDate = { start_date: moment().subtract(12, 'months'), end_date: moment() };
  stockRecordSelectedDate = { start_date: moment().subtract(12, 'months'), end_date: moment() };
  productId = '';
  productName = '';
  totalAmount = 0;
  productRequestPayload = {};
  stockRecordRequestPayload = {};
  orderId = '';
  productOrders = [];
  stockRecordPrevPage = '';
  stockRecordNextPage = '';
  stockRecordTotalPage = 0;
  isProcessingSalesOrders: boolean;
  selectedUpdateActivity = '';
  extraImages = [];
  salesOrdersRequestPayload = {};

  constructor(
    private title: Title,
    private dataProvider: DataProviderService,
    private notificationService: NotificationsService,
    private constantValues: ConstantValuesService,
    private exportDocs: ExportDocumentsService,
    private dataExport: DataExportUtilsService,
    private productsService: ProductsService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.productId = this.route.snapshot.params['id'];
    this.productName = this.route.snapshot.params['name'];
    this.title.setTitle(this.productName + ' | ' + this.constantValues.APP_NAME);
    this.tableHeaderOption = { hasDateRangeFilter: true };
    this.pageHeaderOptions = { pageTitle: this.productName, hideFilterPanel: true };
    this.getMyProductById(this.productId);
  }
  /**
   * Update shared data
   * @param data ISharedData
   */
  onDataRefreshed(data: ISharedData) {
    if (data !== null && data !== undefined) {
      // tslint:disable-next-line:max-line-length
      this.requestPayload = { shop_id: data.shop_id };
      // tslint:disable-next-line:max-line-length
    }
  }
  /**
* Get a product detail by id
* @param productId Product Id
*/
  getMyProductById(productId) {
    this.isProcessing = true;
    this.productsService.getMyProductById(productId, (error, result) => {
      if (result !== null) {
        this.isProcessing = false;
        this.productDetail = result.results;
        this.extraImages = this.productDetail.extra_images;
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
    this.totalAmount = result.total_amount;
  }
  /**
   * Update shared data with selected date range when changed
   * @param dateRangeSelected date range selected
   */
  dateChanged(dateRangeSelected) {
    this.selectedDate = dateRangeSelected;
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
  * Get sales orders reports
  * @param filterData IFilterParams interface
  */
  getSalesOrders(filterData: IFilterParams) {
    filterData.start_date = moment(filterData.start_date).format(this.constantValues.DD_MM_YYYY_DATE_FORMAT);
    filterData.end_date = moment(filterData.end_date).format(this.constantValues.DD_MM_YYYY_DATE_FORMAT);
    this.salesOrdersRequestPayload = filterData;
    this.isProcessingSalesOrders = true;
    this.dataProvider.getAll(this.constantValues.GET_PRODUCT_ORDER_HISTORY_ENDPOINT, filterData)
      .subscribe(result => {
        this.isProcessingSalesOrders = false;
        if (result.response_code === '100') {
          this.salesOrders = result.results;
          this.prevPage = result.previous;
          this.nextPage = result.next;
          this.totalPage = result.count;
          this.totalAmount = result.total_amount;

        }

      }, error => {
        this.isProcessingSalesOrders = false;
        this.notificationService.snackBarMessage(error.detail);
      });
  }
  /**
   * Selected Stock History Date Range changed
   * @param selectedDateRange selected date range
   */
  onSelectStockHistoryDateRange(selectedDateRange) {
    // tslint:disable-next-line:max-line-length
    this.productRequestPayload = { start_date: selectedDateRange.start_date, end_date: selectedDateRange.end_date, product_id: this.productId };
    this.getSalesOrders(this.productRequestPayload);
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
  * Export sales order detail as PDF Document
  */
  exportAsPDF() {
    this.exportDocs.exportAsPDF('Sales Order: ' + this.saleOrderDetail.order_code, 'salesOrderModalBody');
  }
  /**
   * Export as excel
   */
  exportAsExcel() {
    this.getDataToDownload(this.productRequestPayload as IFilterParams, DocTypes.EXCEL);
  }
   /**
   * Export as excel
   */
    exportAllAsPDF() {
      this.getDataToDownload(this.productRequestPayload as IFilterParams, DocTypes.PDF);
    }
  /**
  * Get sales summary reports
  * @param fitlerData IDashboardFilterParams interface
  */
  getDataToDownload(filterData: IFilterParams, docType: DocTypes) {
    filterData.start_date = moment(filterData.start_date).format(this.constantValues.DD_MM_YYYY_DATE_FORMAT);
    filterData.end_date = moment(filterData.end_date).format(this.constantValues.DD_MM_YYYY_DATE_FORMAT);
    filterData.paginate = false;
    this.isProcessing = true;
    this.dataProvider.getAll(this.constantValues.GET_PRODUCT_ORDER_HISTORY_ENDPOINT, filterData)
      .subscribe(result => {
        this.isProcessing = false;
        if (result.response_code === '100') {
          const dataSet: any[] = result.results;
          if (docType === DocTypes.EXCEL) {
            this.dataExport.exportSalesOrdersAsCSV(dataSet);
          } else if (docType === DocTypes.PDF) {
            this.dataExport.exportStockHistoriesAsPDF(dataSet, this.productDetail?.myshop?.business_name, this.productName, this.productDetail?.product_group?.name, filterData.start_date + ' - ' + filterData.end_date);
          }
        }
      }, error => {
        this.isProcessing = false;
        this.notificationService.snackBarMessage(error.detail);
      });
  }
  /**
   * Filter stock records
   * @param filterParams Filter params
   */
  filterStockRecords(startDate, endDate, updateType) {
    // tslint:disable-next-line: max-line-length
    this.stockRecordRequestPayload = { start_date: startDate.format(this.constantValues.DD_MM_YYYY_DATE_FORMAT), end_date: endDate.format(this.constantValues.DD_MM_YYYY_DATE_FORMAT), product_id: this.productId, update_type: updateType };
    this.isProcessingStockRecord = true;
    this.productsService.filterStockRecord(this.stockRecordRequestPayload, (error, result) => {
      this.isProcessingStockRecord = false;
      if (result !== null && result !== undefined && result.response_code === '100') {
        this.stockRecords = result.results;
        this.stockRecordPrevPage = result.previous;
        this.stockRecordNextPage = result.next;
        this.stockRecordTotalPage = result.count;
      }

    });
  }
  /**
  * On page changed
  * @param result result after page changed
  */
  onStockRecordPageChanged(result) {
    this.stockRecords = result.results;
    this.stockRecordPrevPage = result.previous;
    this.stockRecordNextPage = result.next;
    this.stockRecordTotalPage = result.count;
  }
  /**
  * Update Activity changed
  * @param activity Update Activity
  */
  onUpdateActivityChanged(activity) {
    this.selectedUpdateActivity = activity;
    this.filterStockRecords(this.stockRecordSelectedDate.start_date, this.stockRecordSelectedDate.end_date, activity);
  }
  /**
    * Selected Stock Record Date Range changed
    * @param selectedDateRange selected date range
    */
  onSelectStockRecordDateRange(selectedDateRange) {
    this.filterStockRecords(selectedDateRange.start_date, selectedDateRange.end_date, this.selectedUpdateActivity);
  }
  uploadProductImage() {
    // tslint:disable-next-line: max-line-length
    this.dialog.open(UploadProductImageComponent, { data: { product: this.productDetail, isAddExtraImage: true }, autoFocus: false }).afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.getMyProductById(this.productId);
      }
    });
  }

  /**
   * Remove product image
   */
  onRemoveImage(id) {
    const self = this;
    swal({
      title: 'Are you sure?',
      text: 'This will remove this image',
      type: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it',
      closeOnConfirm: false,
      showLoaderOnConfirm: true,
      html: true
    }, function (inputValue) {
      if (inputValue) {
        self.productsService.removeExtraProductImage(id, self.productDetail.myshop.id, (error, result) => {
          if (result !== null) {
            swal('Remove Image', 'Image successfully removed', 'success');
            self.getMyProductById(self.productId);
          }
          if (error !== null) {
            swal('Remove Image', error.detail, 'error');
          }
        });
      }
    });
  }
}
