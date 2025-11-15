import { UsersService } from 'src/app/services/network-calls/users.service';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ITableHeaderActions } from 'src/app/interfaces/table-header-actions.interace';
import { Title } from '@angular/platform-browser';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { ActivatedRoute } from '@angular/router';
import { ExportDocumentsService } from 'src/app/services/export-documents.service';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import * as moment from 'moment';

@Component({
  selector: 'app-agent-profile',
  templateUrl: './agent-profile.component.html',
  styleUrls: ['./agent-profile.component.scss']
})
export class AgentProfileComponent implements OnInit {
  pageHeaderOptions: IPageHeader;
  isProcessing: boolean;
  canGiveDiscount: FormControl = new FormControl(false);
  canBackdateOrder: FormControl = new FormControl(false);
  canModifyPrice: FormControl = new FormControl(false);
  canViewProfit: FormControl = new FormControl(false);
  canViewCustomerInfo: FormControl = new FormControl(false);
  upgradeOrDowngrade: FormControl = new FormControl(false);
  totalAmount = '';
  totalPage = 0;
  nextPage = '';
  prevPage = '';
  requestPayload = {};
  tableHeaderOption: ITableHeaderActions;
  agentId;
  agentDetail;
  salesOrders = [];
  isProcessingSalesOrders: boolean;
  saleOrderDetail;
  salesOrderItems = [];
  agentName = 'Agent Profile';

  constructor(
    private title: Title,
    private dataProvider: DataProviderService,
    private notificationService: NotificationsService,
    private constantValues: ConstantValuesService,
    private exportDocs: ExportDocumentsService,
    private usersService: UsersService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.agentId = this.route.snapshot.params['id'];
    this.agentName = this.route.snapshot.params['name'];
    this.title.setTitle(this.constantValues.APP_NAME + ' | ' + this.agentName);
    this.tableHeaderOption = {};
    // tslint:disable-next-line:max-line-length
    this.pageHeaderOptions = { pageTitle: this.agentName, hideFilterPanel: true };
    this.getAgentProfile();
    // tslint:disable-next-line:max-line-length
    this.getAgentSales(this.agentId, { start_date: moment().subtract(36, 'months').format('YYYY-MM-DD'), end_date: moment().format('YYYY-MM-DD'), status: '', payment_method: '', shop_id: '' });
    this.changePermissions();
  }
  /**
   * Data refershed from IPageHeader
   * @param data ISharedData interface
   */
  onDataRefreshed(data: ISharedData) {
    if (data !== null && data !== undefined) {
      // tslint:disable-next-line:max-line-length
      this.requestPayload = { start_date: data.filter_date_range.start_date, end_date: data.filter_date_range.end_date, status: data.order_status, payment_method: data.payment_method, shop_id: data.shop_id };
      // tslint:disable-next-line:max-line-length
      this.getAgentSales(this.agentId, { start_date: data.filter_date_range.start_date, end_date: data.filter_date_range.end_date, status: data.order_status, payment_method: data.payment_method, shop_id: data.shop_id });
    }
  }
  /**
  * Get agent profile
  */
  getAgentProfile() {
    this.isProcessing = true;
    this.dataProvider.httpGetAll(this.constantValues.GET_AGENTS_ENDPOINT + this.agentId + '/')
      .subscribe(result => {
        this.isProcessing = false;
        this.agentDetail = result;
      }, error => {
        this.isProcessing = false;
        this.notificationService.snackBarErrorMessage(error.detail);
      });
  }
  /**
   * Get all sales orders processed by an agent
   * @param agentId agent id
   * @param fitlerData IDashboardFilterParams interface
   */
  getAgentSales(agentId, fitlerData: IDashboardFilterParams) {
    this.isProcessingSalesOrders = true;
    this.constantValues.primaryKey = agentId;
    this.dataProvider.getAll(this.constantValues.GET_AGENT_SALES_ENDPOINT, fitlerData).subscribe(result => {
      this.isProcessingSalesOrders = false;
      if (result.status === 'success') {
        this.salesOrders = result.results;
        this.prevPage = result.previous;
        this.nextPage = result.next;
        this.totalPage = result.count;
      }
    }, error => {
      this.isProcessingSalesOrders = false;
      this.notificationService.snackBarErrorMessage(error.detail);
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

  changePermissions() {
    // Can give discount permission
    this.canGiveDiscount.valueChanges.subscribe((value: boolean) => {
      this.isProcessing = true;
      this.usersService.upgradeToGiveDiscount(this.agentId, value, (error, result) => {
        this.isProcessing = false;
        if (result !== null) {
          this.agentDetail = result;
          this.notificationService.snackBarMessage('Agent Discount Permission successfully changed');
        }
      });
    });
    // Can backdate order permission
    this.canBackdateOrder.valueChanges.subscribe((value: boolean) => {
      this.isProcessing = true;
      this.usersService.changeBackdateOrdersPermission(this.agentId, value, (error, result) => {
        this.isProcessing = false;
        if (result !== null) {
          this.agentDetail = result;
          this.notificationService.snackBarMessage('Agent Backdate Order Permission successfully changed');
        }
      });
    });
    // Can modify order rpermission
    this.canModifyPrice.valueChanges.subscribe((value: boolean) => {
      this.isProcessing = true;
      this.usersService.changeModifyOrderPermission(this.agentId, value, (error, result) => {
        this.isProcessing = false;
        if (result !== null) {
          this.agentDetail = result;
          this.notificationService.snackBarMessage('Agent Modify Order Permission successfully changed');
        }
      });
    });
    // Profit info visibility permission
    this.canViewProfit.valueChanges.subscribe((value: boolean) => {
      this.isProcessing = true;
      this.usersService.changeProfitVisibilityPermission(this.agentId, value, (error, result) => {
        this.isProcessing = false;
        if (result !== null) {
          this.agentDetail = result;
          this.notificationService.snackBarMessage('Agent Profit Visibility Permission successfully changed');
        }
      });
    });
    // Customer info visibility permission
    this.canViewCustomerInfo.valueChanges.subscribe((value: boolean) => {
      this.isProcessing = true;
      this.usersService.changeCustomerVisibilityPermission(this.agentId, value, (error, result) => {
        this.isProcessing = false;
        if (result !== null) {
          this.agentDetail = result;
          this.notificationService.snackBarMessage('Agent Customer Info Visibility Permission successfully changed');
        }
      });
    });
    // Customer info visibility permission
    this.upgradeOrDowngrade.valueChanges.subscribe((value: boolean) => {
      this.isProcessing = true;
      this.usersService.upgradeOrDowngradeAgentManagerPermission(this.agentId, value, (error, result) => {
        this.isProcessing = false;
        if (result !== null) {
          this.agentDetail = result;
          this.notificationService.snackBarMessage('Upgrade/Downgrade Agent to Manager Permission successfully changed');
        }
      });
    });
  }
}
