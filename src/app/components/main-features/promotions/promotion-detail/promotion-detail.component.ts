import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { OrdersApiCallsService } from 'src/app/services/network-calls/orders-api-calls.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PromoCodeUsageEnum, PromoCodeRateTypeEnum } from './../../../../utils/enums';
import { CustomerApiCallsService } from 'src/app/services/network-calls/customer-api-calls.service';
import { AddPromoCodeComponent } from './../add-promo-code/add-promo-code.component';
import { Component, OnInit } from '@angular/core';
import { datePickerLocales, datePickerRanges } from 'src/app/utils/const-values.utils';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { ITableHeaderActions } from 'src/app/interfaces/table-header-actions.interace';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { DataExportUtilsService } from 'src/app/services/data-export-utils.service';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { ExportDocumentsService } from 'src/app/services/export-documents.service';
import { NotificationsService } from 'src/app/services/notifications.service';
declare const swal;

@Component({
  selector: 'app-promotion-detail',
  templateUrl: './promotion-detail.component.html',
  styleUrls: ['./promotion-detail.component.scss']
})
export class PromotionDetailComponent implements OnInit {

  pageHeaderOptions: IPageHeader;
  isProcessing = false;
  isProcessingPromoCodes = false;
  isProcessingStockRecord = false;
  shopProducts = [];
  stockRecords = [];
  totalPage = 0;
  nextPage = '';
  prevPage = '';
  productId = '';
  requestPayload = {};
  tableHeaderOption: ITableHeaderActions;
  promoCodeFormGroup: FormGroup;
  productDetail;
  salesOrders = [];
  saleOrderDetail;
  salesOrderItems = [];
  locale = datePickerLocales;
  ranges: any = datePickerRanges;
  selectedDate = { start_date: moment().subtract(36, 'months'), end_date: moment() };
  stockRecordSelectedDate = { start_date: moment().subtract(36, 'months'), end_date: moment() };
  promoId = '';
  promoName = '';
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
  promoCodes = [];
  salesOrdersRequestPayload = {};
  promoCodeUsageTypes = PromoCodeUsageEnum;
  promoCodeRateTypes = PromoCodeRateTypeEnum;
  shopId = '';

  constructor(
    private title: Title,
    private constantValues: ConstantValuesService,
    private customerApiCalls: CustomerApiCallsService,
    private ordersApiCalls: OrdersApiCallsService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.promoId = this.route.snapshot.params['id'];
    this.promoName = this.route.snapshot.params['name'];
    this.shopId = this.route.snapshot.params['storeId'];
    this.title.setTitle(this.constantValues.APP_NAME + ' | ' + this.promoName);
    this.tableHeaderOption = { hasDateRangeFilter: false };
    this.pageHeaderOptions = { pageTitle: this.promoName, hideFilterPanel: true };
    this.promoCodeFormGroup = new FormGroup({
      code: new FormControl('', [Validators.required]),
      rate_type: new FormControl('', [Validators.required]),
      rate_value: new FormControl('', [Validators.required])
    });
    this.getPromotionsById(this.promoId);
    this.getPromoCodesOfAPromotion(this.promoId, this.shopId);
    // tslint:disable-next-line: max-line-length
    this.filterSalesOrders({ shop_id: this.shopId, promotion_id: this.promoId, start_date: this.selectedDate.start_date.toString(), end_date: this.selectedDate.end_date.toString() });
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
* Get promotion detail by id
* @param promoId Promo Id
*/
  getPromotionsById(promoId) {
    this.isProcessing = true;
    this.customerApiCalls.getPromotionById(promoId, (error, result) => {
      this.isProcessing = false;
      if (result !== null) {
        this.productDetail = result.results;
      }
    });
  }
  /**
* Get promotion detail by id
* @param promoId Promo Id
*/
  getPromoCodesOfAPromotion(promoId, storeId) {
    this.isProcessing = true;
    this.customerApiCalls.getPromoCodes(promoId, storeId, (error, result) => {
      this.isProcessing = false;
      if (result !== null) {
        this.promoCodes = result;
      }
    });
  }
  onAddPromoCode() {
    this.dialog.open(AddPromoCodeComponent, { data: { promoId: this.promoId, shopInfo: this.productDetail.myshop } })
      .afterClosed().subscribe((isSuccessful: boolean) => {
        if (isSuccessful) {
          this.getPromoCodesOfAPromotion(this.promoId, this.shopId);
        }
      });
  }
  /**
   * On page changed
   * @param result result after page changed
   */
  onPageChanged(result) {
    this.promoCodes = result.results;
    this.prevPage = result.previous;
    this.nextPage = result.next;
    this.totalPage = result.count;
    this.totalAmount = result.total_amount;
  }




  /**
   * Remove promo code
   */
  onRemovePromoCode(id) {
    const self = this;
    swal({
      title: 'Are you sure?',
      text: 'This action will remove this promo code',
      type: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it',
      closeOnConfirm: false,
      showLoaderOnConfirm: true,
      html: true
    }, function (inputValue) {
      if (inputValue) {
        self.customerApiCalls.removePromoCode(id, self.promoId, self.shopId, (error, result) => {
          if (result !== null) {
            swal('Remove Promo Code', 'Promo Code successfully removed', 'success');
            self.getPromoCodesOfAPromotion(self.promoId, self.shopId);
          }
          if (error !== null) {
            swal('Remove Promo Code', error.detail, 'error');
          }
        });
      }
    });
  }

  /**
* Get promotion detail by id
* @param promoId Promo Id
*/
  createPromoCode(detail) {
    this.isProcessing = true;
    this.customerApiCalls.createPromoCode(this.promoId, detail, (error, result) => {
      this.isProcessing = false;
      if (result !== null) {

      }
    });
  }

  filterSalesOrders(filterParams: IDashboardFilterParams) {
    filterParams.start_date = moment(filterParams.start_date).format('YYYY-MM-DD');
    filterParams.end_date = moment(filterParams.end_date).format('YYYY-MM-DD');
    this.salesOrdersRequestPayload = filterParams;
    this.isProcessingSalesOrders = true;
    this.ordersApiCalls.getPendingMallOrderStatus(filterParams, (error, result) => {
      this.isProcessingSalesOrders = false;
      if (result.status === 'success') {
        this.salesOrders = result.results;
        this.stockRecordPrevPage = result.previous;
        this.stockRecordNextPage = result.next;
        this.stockRecordTotalPage = result.count;
        this.totalAmount = result.total_amount;
      }
    });
  }
  /**
  * On page changed
  * @param result result after page changed
  */
  onSalesOrdersPageChanged(result) {
    this.salesOrders = result.results;
    this.stockRecordPrevPage = result.previous;
    this.stockRecordNextPage = result.next;
    this.stockRecordTotalPage = result.count;
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
   * Export sales order detail as PDF Document
   */
  exportAsPDF() {
    // this.exportDocs.exportAsPDF('Sales Order: ' + this.saleOrderDetail.order_code, 'salesOrderModalBody');
  }
}
