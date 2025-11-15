import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { ITableHeaderActions } from 'src/app/interfaces/table-header-actions.interace';
import { AuthService } from 'src/app/services/auth.service';
import { ProductsService } from 'src/app/services/network-calls/products.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-purchase-orders',
  templateUrl: './purchase-orders.component.html'
})
export class PurchaseOrdersComponent implements OnInit {

  pageHeaderOptions: IPageHeader;
  dateStep = 7;
  saleOrderDetail;
  salesOrderItems = [];
  isProcessing: boolean;
  businessOverview;
  purchaseOrders = [];
  totalPage = 0;
  nextPage = '';
  prevPage = '';
  orderStatus = '';
  requestPayload = {};
  tableHeaderOption: ITableHeaderActions;
  salesOrdersReports;
  orderId;
  productId = '';
  shopId = '';
  isPartner = false;

  constructor(
    private productsService: ProductsService,
    private authService: AuthService,
    private matDialog: MatDialog,
    private router: Router,
    private notificationService: NotificationsService,
  ) { }

  ngOnInit() {
    this.tableHeaderOption = { hasSearch: true, searchPlaceholder: 'Search Order' };
    this.isPartner = this.authService.isPartner;
    // tslint:disable-next-line:max-line-length
    this.pageHeaderOptions = { pageTitle: 'Purchase Orders', hasDateRangeFilter: true, hasExpenseCategoryFilter: false, hasShopsFilter: true };
  }
  /**
   * Data refershed from IPageHeader
   * @param data ISharedData interface
   */
  onDataRefreshed(data: ISharedData) {
    if (data !== null && data !== undefined) {
      // tslint:disable-next-line:max-line-length
      this.requestPayload = { start_date: data.filter_date_range.start_date, end_date: data.filter_date_range.end_date, shop_id: data.shop_id };
      this.shopId = data.shop_id;
      // tslint:disable-next-line:max-line-length
      this.getPurchaseOrders({ start_date: data.filter_date_range.start_date, end_date: data.filter_date_range.end_date, shop_id: data.shop_id });
    }
  }
  /**
   * Fired when searching sales order
   * @param searchText searchText
   */
  // onSearchOrder(searchText) {
  //   this.requestPayload = { search_text: searchText };
  //   this.isProcessing = true;
  //   this.productsService.searchPurchaseOrder(this.requestPayload, (error, result) => {

  //     this.isProcessing = false;
  //     if (result !== null && result.response_code === '100') {
  //       this.purchaseOrders = result.results;
  //       this.prevPage = result.previous;
  //       this.nextPage = result.next;
  //       this.totalPage = result.count;
  //     }
  //   });
  // }
  /**
  * Get sales orders reports
  * @param fitlerData IDashboardFilterParams interface
  */
  getPurchaseOrders(fitlerData: IDashboardFilterParams) {
    fitlerData.start_date = moment(fitlerData.start_date).format('YYYY-MM-DD');
    fitlerData.end_date = moment(fitlerData.end_date).format('YYYY-MM-DD');
    this.isProcessing = true;
    this.productsService.getPurchaseOrders(this.requestPayload, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        this.purchaseOrders = result.results;
        this.prevPage = result.previous;
        this.nextPage = result.next;
        this.totalPage = result.count;
      }
    });
  }
  /**
   * On page changed
   * @param result result after page changed
   */
  onPageChanged(result) {
    this.purchaseOrders = result.results;
    this.prevPage = result.previous;
    this.nextPage = result.next;
    this.totalPage = result.count;
  }
  newRequest(){
    this.router.navigate(['/purchase-orders/new-order'])
  }
}
