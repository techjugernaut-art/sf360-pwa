import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { Router } from '@angular/router';
import { NotificationActionsComponent } from './../notification-actions/notification-actions.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationActions } from './../../../utils/enums.util';
import { AuthService } from './../../../services/auth.service';
import { ShopsService } from './../../../services/network-calls/shops.service';
import { ExpensesService } from './../../../services/network-calls/expenses.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { datePickerRanges, datePickerLocales } from '../../../utils/const-values.utils';
import { SetActiveShopComponent } from '../dialogs/set-active-shop/set-active-shop.component';

@Component({
  selector: 'app-breadcrumb-actions',
  templateUrl: './breadcrumb-actions.component.html',
  styleUrls: ['./breadcrumb-actions.component.scss']
})
export class BreadcrumbActionsComponent implements OnInit {
  myShops = [];
  @Input() selectedDate = {start_date: moment(), end_date: moment()};
  selectedShop: any;
  selectedOrderStatus = 'SUCCESS';
  selectedMallOrderStatus = '';
  selectedPaymentStatus = '';
  selectedPaymentMethod = '';
  selectedTransactionType = '';
  selectedTransactionSource = '';
  selectedExpenseCategory = '';
  locale = datePickerLocales;
  ranges: any = datePickerRanges;
  @Input() pageHeaderOptions: IPageHeader;
  @Input() isProcessing = false;
  @Output() isProcessingChange = new EventEmitter();
  @Output() dataRefreshed = new EventEmitter<ISharedData>();
  expenseCategories = [];

  constructor(
    private expensesService: ExpensesService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private constantValues: ConstantValuesService,
    private shopsService: ShopsService
  ) { }

  ngOnInit() {
    if (this.pageHeaderOptions.hasShopsFilter === true) {
      this.getMyShops();
    }
    if (this.pageHeaderOptions.hasExpenseCategoryFilter === true) {
      this.getExpenseCategories();
    }
  }

  /**
   * Update shared data with selected date range when changed
   * @param dateRangeSelected date range selected
   */
  dateChanged(dateRangeSelected) {
    this.selectedDate = dateRangeSelected;
    this.updateDataBeforeSharing();
  }
  /**
   * Broadcast shop id changed
   * @param value shop id
   */
  onShopChanged(value) {
    this.selectedShop = (value !== '' && value !== undefined && value !== null) ? +value : value;
    this.updateDataBeforeSharing();
  }
  /**
   * Update selectedOrder
   * @param value order status
   */
  onOrderStatusChanged(value) {
    this.selectedOrderStatus = value;
    this.updateDataBeforeSharing();
  }
/**
   * Update selecteMalldOrder
   * @param value order status
   */
  onMallOrderStatusChanged(value) {
    this.selectedMallOrderStatus = value;
    this.updateDataBeforeSharing();
  }
  /**
   * Determines whether on expense category changed on
   * @param value expense category data
   */
  onOnExpenseCategoryChanged(value) {
    this.selectedExpenseCategory = value;
    this.updateDataBeforeSharing();
  }
  /**
   * Update selectedPaymentStatus
   * @param value payment status
   */
  onPaymentStatusChanged(value) {
    this.selectedPaymentStatus = value;
    this.updateDataBeforeSharing();
  }
  /**
   * Update selectedPaymentMethod
   * @param value order status
   */
  onPaymentMethodChanged(value) {
    this.selectedPaymentMethod = value;
    this.updateDataBeforeSharing();
  }
  /**
   * Update selectedTransactionType
   * @param value transaction type
   */
  onTransactionTypeChanged(value) {
    this.selectedTransactionType = value;
    this.updateDataBeforeSharing();
  }
  /**
   * Update selectedTransactionSource
   * @param value transaction source
   */
  onTransactionSourceChanged(value) {
    this.selectedTransactionSource = value;
    this.updateDataBeforeSharing();
  }
  /**
   * Update data and share
   */
  updateDataBeforeSharing() {
    // tslint:disable-next-line:max-line-length
    this.dataRefreshed.emit({
      filter_date_range: {start_date: this.selectedDate.start_date.format(this.constantValues.DD_MM_YYYY_DATE_FORMAT), end_date: this.selectedDate.end_date.format(this.constantValues.DD_MM_YYYY_DATE_FORMAT)},
      shop_id: this.selectedShop,
      order_status: this.selectedOrderStatus,
      mall_order_status: this.selectedMallOrderStatus,
      payment_method: this.selectedPaymentMethod,
      payment_status: this.selectedPaymentStatus,
      transaction_type: this.selectedTransactionType,
      transaction_source: this.selectedTransactionSource,
      expense_category: this.selectedExpenseCategory
    });
  }
   /**
   * Get shops of current loged in user
   */
  getMyShops() {
    this.shopsService.getMyShop({ shop_id: '' }, (error, result) => {
      if (result !== null && result.status === 'success') {
        this.myShops = result.results;
        if (!this.authService.isPartner) {
          if (this.myShops.length <= 0) {
            this.router.navigate(['/onboarding/industry'], { queryParams: { step: 2 } });
          }
          if (this.myShops.length > 0) {

            const shop = this.myShops[0];
            if (shop.days_left === 0) {
              this.router.navigate(['/premium-features']);
              return;
            }
            if (this.pageHeaderOptions.ignoreFilterByAllShops === true) {
              this.onShopChanged(this.myShops[0].id);
            }
            const hasMutliShops = this.myShops.length > 1;
            if (!hasMutliShops  && (this.authService.getActiveShop === null || this.authService.getActiveShop === undefined)) {
              this.authService.setActiveShop(this.myShops[0]);
              this.selectedShop = +this.myShops[0].id;
              this.onShopChanged(this.selectedShop);
            } else if (hasMutliShops  && (this.authService.getActiveShop === null || this.authService.getActiveShop === undefined)) {
              this.dialog.open(SetActiveShopComponent).afterClosed().subscribe(shop => {
                if (shop !== null && shop !== undefined) {
                  this.selectedShop = shop.id;
                  this.authService.setActiveShop(shop);
                  this.onShopChanged(this.selectedShop);
                }
              });
            }
            if (this.authService.getActiveShop !== null && this.authService.getActiveShop !== undefined) {
              this.selectedShop = JSON.parse(this.authService.getActiveShop).id;
              this.onShopChanged(this.selectedShop);
            }

          }
          this.myShops.forEach(data => {
            if (data.current_notification_action === NotificationActions.BULK_UPLOAD_TEMPLATE) {
             setTimeout(() => {
              const reminderDate = this.authService.getNotificationReminderDate(NotificationActions.BULK_UPLOAD_TEMPLATE);
              if (reminderDate === '') {
                // tslint:disable-next-line: max-line-length
                this.dialog.open(NotificationActionsComponent, {data: {action: NotificationActions.BULK_UPLOAD_TEMPLATE}, autoFocus: false});

              // tslint:disable-next-line: max-line-length
              } else if (reminderDate === moment().format('DD-MM-YYYY')) {
                // tslint:disable-next-line: max-line-length
                this.dialog.open(NotificationActionsComponent, {data: {action: NotificationActions.BULK_UPLOAD_TEMPLATE}, autoFocus: false});
              }
              this.authService.setNotificationReminderDate(NotificationActions.BULK_UPLOAD_TEMPLATE, moment().add(1, 'day').format('DD-MM-YYYY'));
              return;
             }, 300000);
            }
          });
        }
      }
    });
  }
  /**
   * Gets expense categories
   */
  getExpenseCategories() {
    this.expensesService.getCategories((error, result) => {
      if (result !== null) {
        this.expenseCategories = result.results;
      }
    });
  }
}
