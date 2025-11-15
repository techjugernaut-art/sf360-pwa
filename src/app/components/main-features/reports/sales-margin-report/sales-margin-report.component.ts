import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { RequestMethod } from 'src/app/components/common/pagination/pagination.component';
import { ITableHeaderActions } from 'src/app/interfaces/table-header-actions.interace';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';

@Component({
  selector: 'app-sales-margin-report',
  templateUrl: './sales-margin-report.component.html',
  styleUrls: ['./sales-margin-report.component.scss']
})
export class SalesMarginReportComponent implements OnInit {
  pageHeaderOptions: IPageHeader;
  dateStep = 7;
  saleOrderDetail;
  salesOrderItems = [];
  businessOverviewObservable: Observable<any>;
  graphOverviewObservable: Observable<any>;
  isProcessing: boolean;
  businessOverview;
  dataSharingSubscription;

  selected;
  elements = [];
  totalAmount = '';
  totalPage = 0;
  nextPage = '';
  prevPage = '';
  requestPayload = {};
  requestMethod: RequestMethod;
  tableHeaderOption: ITableHeaderActions;
  salesOrdersReports;
  constructor(private title: Title,
    private dataProvider: DataProviderService,
    private notificationService: NotificationsService,
    private constantValues: ConstantValuesService      ) { }

  ngOnInit() {
    // this.title.setTitle(this.constantValues.APP_NAME + ' | Sales Margin');
    // tslint:disable-next-line:max-line-length
    this.pageHeaderOptions = {pageTitle: 'Sales Margin',  hasDateRangeFilter: true, hasPaymentMethodFilter: true, hasShopsFilter: true};
  }
  onDataRefreshed(data: ISharedData) {
    if (data !== null && data !== undefined) {
      // tslint:disable-next-line:max-line-length
      this.requestPayload = { start_date: data.filter_date_range.start_date, end_date: data.filter_date_range.end_date, status: data.order_status, payment_method: data.payment_method, shop_id: data.shop_id, paginate: true};
      // tslint:disable-next-line:max-line-length
      this.getBusinessOverview({ start_date: data.filter_date_range.start_date, end_date: data.filter_date_range.end_date, status: data.order_status, payment_method: data.payment_method, shop_id: data.shop_id, paginate: true});
    }
  }
   /**
   * Get sales summary reports
   * @param fitlerData IDashboardFilterParams interface
   */
  getBusinessOverview(fitlerData: IDashboardFilterParams) {
    // fitlerData.start_date = moment(fitlerData.start_date).format('YYYY-MM-DD');
    // fitlerData.end_date = moment(fitlerData.end_date).format('YYYY-MM-DD');
    this.isProcessing = true;
    this.businessOverviewObservable = this.dataProvider.getAll(this.constantValues.GET_SALES_MARGIN_ENDPOINT, fitlerData);
    this.businessOverviewObservable
      .subscribe(result => {
        this.isProcessing =  false;
        if (result.response_code === '100') {
          const resp:any[] = result.results;
          this.prevPage = result.previous;
          this.nextPage = result.next;
          this.totalPage = result.count;
          this.salesOrdersReports = result;
          const dataSet = [];
          resp.forEach(data => {
            const items: any[] = data.myitems;
            items.forEach(item => {
              dataSet.push({
                order_code: data.order_code,
                date_placed: data.date_placed,
                currency: data.currency,
                item: item
              });
            });
          });
          this.elements = dataSet;
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
    const resp:any[] = result.results;
    this.prevPage = result.previous;
    this.nextPage = result.next;
    this.totalPage = result.count;
    this.salesOrdersReports = result;
    const dataSet = [];
    resp.forEach(data => {
      const items: any[] = data.myitems;
      items.forEach(item => {
        dataSet.push({
          order_code: data.order_code,
          date_placed: data.date_placed,
          currency: data.currency,
          item: item
        });
      });
    });
    this.elements = dataSet;
  }
  /**
   * View sales order details using sales orders dialog
   * @param order order obect
   */
  viewOrderDetails(order) {
    this.saleOrderDetail = order;
  }


}
