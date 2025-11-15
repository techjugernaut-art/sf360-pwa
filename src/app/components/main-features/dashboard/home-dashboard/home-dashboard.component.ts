import { Title } from '@angular/platform-browser';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { AppUtilsService } from 'src/app/services/app-utils.service';
import { DashboardApiCallsService } from 'src/app/services/network-calls/dashboard-api-calls.service';
import { ProductsService } from 'src/app/services/network-calls/products.service';
import { Router } from '@angular/router';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Chart } from 'chart.js';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import * as moment from 'moment';
import { doughnutGraphTooltipCallback, scalesCallback, toolTipCallback } from 'src/app/utils/chart.utils';
import { colors } from 'src/app/utils/colors';
import { SubscriptionDueDialogComponent } from '../../premium-payments/subscription-due-dialog/subscription-due-dialog.component';
import { OnboardingCongratulationComponent } from '../../onboarding-stepper/steps/onboarding-congratulation/onboarding-congratulation.component';

@Component({
  selector: 'app-home-dashboard',
  templateUrl: './home-dashboard.component.html',
  styleUrls: ['./home-dashboard.component.scss']
})
export class HomeDashboardComponent implements OnInit, OnDestroy {
  greet = '';
  myPieChart: Chart;
  businessOverviewObservable: Observable<any>;
  graphOverviewObservable: Observable<any>;
  multilineChart: Chart;
  expenseOverviewDoughnutChart: Chart;
  expenseOverviewChart: Chart;
  topPerformingProductsChart: Chart;
  dateStep = 7;
  expenseOverviewObservable: Observable<any>;
  isProcessing = false;
  isDoughnutDataAvailable = false;
  refreshInterval;
  businessOverview;
  aMonthBusinessOverview;
  bestPerformingProducts = [];
  businessAlerts = [];
  isProcessingBusinessAlerts: boolean;
  totalStockValueDetail;
  filterData;
  dateLabels = [];
  salesOrderReportData = [];
  isHaveProducts = false;
  shopInfo;
  currentPremiumPlan;
  taskCompletionValue = 0;
  taskCompletionPercentage;
  storefrontMallDomain = '';
  currentSubDomain = '';
  protocol = '';
  todayDate = moment();
  referaSocialMedialMessage = 'I just launched my online store; check it our here ';
  url = '';
  selectedSmallerUnitFormControl: FormControl = new FormControl('');
  totalSupplierValue = 0;
  totalUnitPriceValue = 0;
  remainingDays = 7;
  isExpenseOverviewDataAvailable = false;
  onFreeTrial;

  @ViewChild('rightDrawer', { static: false }) rightDrawer: MatSidenav;
  @ViewChild(MatSidenav, { static: false }) drawer: MatSidenav;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  isHaveAcceptPayment: boolean;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private dataProvider: DataProviderService,
    private constantValues: ConstantValuesService,
    private router: Router,
    private productsService: ProductsService,
    private dialog: MatDialog,
    private appUtils: AppUtilsService,
    private dashboardService: DashboardApiCallsService,
    private shopsService: ShopsService,
    private notificationService: NotificationsService,
  ) { }

  ngOnInit() {
    this.storefrontMallDomain = this.constantValues.STOREFRONT_MALL_URL;
    this.protocol = this.constantValues.STOREFRONT_MALL_URL_PROTOCOL;
    // this.title.setTitle(this.constantValues.APP_NAME + ' | Dashboard');
    this.greetings();
    this.getBusinessOverview({ start_date: moment().format(this.constantValues.DD_MM_YYYY_DATE_FORMAT), end_date: moment().format(this.constantValues.DD_MM_YYYY_DATE_FORMAT), shop_id: '' });
    // tslint:disable-next-line: max-line-length
    this.getBusinessOverview({ start_date: moment().subtract(28, 'days').format(this.constantValues.DD_MM_YYYY_DATE_FORMAT), end_date: moment().format(this.constantValues.DD_MM_YYYY_DATE_FORMAT), shop_id: '' }, true);
    this.getSalesOrderGraph({ start_date: moment().subtract(this.dateStep, 'days').format(this.constantValues.DD_MM_YYYY_DATE_FORMAT), end_date: moment().format(this.constantValues.DD_MM_YYYY_DATE_FORMAT) });
    this.getExpenseOverview({ shop_id: '', start_date: moment().subtract(this.dateStep, 'days').format(this.constantValues.DD_MM_YYYY_DATE_FORMAT), end_date: moment().format(this.constantValues.DD_MM_YYYY_DATE_FORMAT) });

    this.getShopById({ shop_id: '' });
    this.refreshInterval = setInterval(() => {
      this.todayDate = moment();
      this.getBusinessOverview({ start_date: moment().format(this.constantValues.DD_MM_YYYY_DATE_FORMAT), end_date: moment().format(this.constantValues.DD_MM_YYYY_DATE_FORMAT), shop_id: '' });
      // tslint:disable-next-line: max-line-length
      this.getBusinessOverview({ start_date: moment().subtract(28, 'days').format(this.constantValues.DD_MM_YYYY_DATE_FORMAT), end_date: moment().format(this.constantValues.DD_MM_YYYY_DATE_FORMAT), shop_id: '' }, true);
      this.getSalesOrderGraph({ start_date: moment().subtract(this.dateStep, 'days').format(this.constantValues.DD_MM_YYYY_DATE_FORMAT), end_date: moment().format(this.constantValues.DD_MM_YYYY_DATE_FORMAT) });
      this.getExpenseOverview({ shop_id: '', start_date: moment().subtract(this.dateStep, 'days').format(this.constantValues.DD_MM_YYYY_DATE_FORMAT), end_date: moment().format(this.constantValues.DD_MM_YYYY_DATE_FORMAT) });

    }, 300000);
  }
  ngOnDestroy() {
    this.businessOverviewObservable.subscribe().unsubscribe();
    // if (this.multilineChart) { this.multilineChart.destroy(); }
    clearInterval(this.refreshInterval);
  }
  greetings() {
    const myDate = new Date();
    const hrs = myDate.getHours();
    if (hrs < 12) {
      this.greet = 'Good Morning, ' + this.authService.currentUser.first_name;
    } else if (hrs >= 12 && hrs <= 17) {
      this.greet = 'Good Afternoon, ' + this.authService.currentUser.first_name;
    } else if (hrs >= 17 && hrs <= 24) {
      this.greet = 'Good Evening, ' + this.authService.currentUser.first_name;
    }
  }


  /**
    * Get business overview
    * @param fitlerData IDashboardFilterParams interface
    */
  getBusinessOverview(fitlerData: IDashboardFilterParams, isMonth = false) {

    this.filterData = this.filterData;
    this.isProcessing = true;
    this.businessOverviewObservable = this.dataProvider.getAll(this.constantValues.GET_OVERVIEW_ENDPOINT, fitlerData);
    this.businessOverviewObservable
      .subscribe(result => {
        // this.isProcessing = false;
        if (result.response_code === '100') {
          if (!isMonth) {
            this.businessOverview = result;
            this.isDoughnutDataAvailable = false;

          } else {
            this.aMonthBusinessOverview = result;
          }
        }
      }, error => {
        // this.isProcessing = false;
        this.notificationService.snackBarMessage(error.detail);
      });
  }




  /**
    * Get business overview
    * @param filterData filter data
    */
  getSalesOrderGraph(filterData) {
    // this.isProcessing = true;
    const remoteProductMultilineGraphData = [];

    this.dateLabels = this.appUtils.getDateLabelsByEndAndStartDate(filterData.start_date, filterData.end_date);

    this.graphOverviewObservable = this.dataProvider.getAll(this.constantValues.FILTER_ORDER_GRAPH_ENDPOINT, filterData);
    this.graphOverviewObservable
      .subscribe(result => {
        this.isProcessing = false;
        if (result.response_code === '100') {
          this.salesOrderReportData = [];
          const dataPoints = [];
          const activeShopsDataPoints = [];
          const visitingShopsDataPoints = [];
          let activeShopsGraphData = [];
          let visitingShopsGraphData = [];
          this.salesOrderReportData = result.results;
          activeShopsGraphData = result.shop_graph;
          visitingShopsGraphData = result.visiting_shops_graph;
          this.dateLabels.forEach((dateValue) => {
            const dat = this.salesOrderReportData.find(prodVal => {
              return prodVal.date === dateValue;
            });
            if (dat !== null && dat !== undefined) {
              dataPoints.push(dat.total);
            } else {
              dataPoints.push(0);
            }
            const activeShopsData = activeShopsGraphData.find(prodVal => {
              return prodVal.date === dateValue;
            });
            if (activeShopsData !== null && activeShopsData !== undefined) {
              activeShopsDataPoints.push(activeShopsData.count);
            } else {
              activeShopsDataPoints.push(0);
            }

            const visitingShopsData = visitingShopsGraphData.find(prodVal => {
              return prodVal.date === dateValue;
            });
            if (visitingShopsData !== null && visitingShopsData !== undefined) {
              visitingShopsDataPoints.push(visitingShopsData.count);
            } else {
              visitingShopsDataPoints.push(0);
            }
          });
          remoteProductMultilineGraphData.push({
            data: dataPoints,
            label: 'Sales Orders',
            borderColor: '#00BE0A',
            fill: false
          });

          this.renderMultilineGraph(this.dateLabels, remoteProductMultilineGraphData);
        }
      }, error => {
        this.isProcessing = false;
        this.notificationService.snackBarErrorMessage(error.detail);
      });
  }

  /**
  * Render Multiliine graph for the KPIs
  * @param labels Graph labels
  * @param dataSet Graph dataSet
  */
  renderMultilineGraph(labels, dataSet) {
    if (this.multilineChart) { this.multilineChart.destroy(); }
    const ctrl = document.getElementById('multilineGraph');
    this.multilineChart = new Chart(ctrl, {
      type: 'line',
      data: {
        labels: labels,
        datasets: dataSet
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true
        },
        scales: scalesCallback,
        tooltips: {
          callbacks: toolTipCallback
        }
      }
    });
    this.multilineChart.chart.update();
  }

  /**
    * Render Multiliine graph for the KPIs
    * @param labels Graph labels
    * @param dataSet Graph dataSet
    */
  topPerformingGraph(labels, dataSet) {
    if (this.topPerformingProductsChart) { this.topPerformingProductsChart.destroy(); }
    const ctrl = document.getElementById('multilineGraph');
    this.topPerformingProductsChart = new Chart(ctrl, {
      type: 'line',
      data: {
        labels: labels,
        datasets: dataSet
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true
        },
        scales: scalesCallback,
        tooltips: {
          callbacks: toolTipCallback
        }
      }
    });
    this.topPerformingProductsChart.chart.update();
  }
  viewMoreSalesOrders() {
    this.router.navigate(['/reports/sales-orders']);
  }
  viewMoreMallOrders() {
    this.router.navigate(['/reports/mall-orders']);
  }
  viewMoreSalesMargins() {
    this.router.navigate(['/reports/sales-margin']);
  }
  viewMoreCustomers() {
    this.router.navigate(['/customers']);
  }
  viewMoreSuppliers() {
    this.router.navigate(['/suppliers']);
  }

  viewPaymentDashboard() {
    if (this.shopInfo.currency == 'NGN' && this.shopInfo?.has_paga_account == true || this.shopInfo.currency == 'GHS' && this.shopInfo?.payments_enabled == true) {
      this.router.navigate(['/settings/non-cash-transactions']);

    } else {
      if (this.shopInfo.currency == 'NGN') {
        this.router.navigate(['/settings/create-paga-account']);

      } else {
        this.router.navigate(['/settings/payment-request']);

      }
    }
  }

  /**
    * Get shop information by a particular shop id
    * @param filterParams filter param
  */
  getShopById(filterParams: IDashboardFilterParams) {
    this.isProcessing = true;
    this.shopsService.getMyShop(filterParams, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        this.shopInfo = result.results[0];
        // console.log(this.shopInfo, 'shopInfo')
        this.onFreeTrial = this.shopInfo.on_free_trial;
        this.currentPremiumPlan = this.shopInfo.premium_plan;
        if (this.shopInfo.storefrontmall_name !== null && this.shopInfo.storefrontmall_name !== '') {
          this.taskCompletionValue += 25;
          this.taskCompletionPercentage = this.taskCompletionValue + '%';
        }
        // tslint:disable-next-line: max-line-length
        if (this.shopInfo.latitude !== null && this.shopInfo.latitude !== '' && this.shopInfo.longitude !== null && this.shopInfo.longitude !== '') {
          this.taskCompletionValue += 25;
          this.taskCompletionPercentage = this.taskCompletionValue + '%';
        }
        if (this.shopInfo.has_storefront_mall === true && this.shopInfo.is_premium_user === true) {
          if (this.shopInfo.days_left !== null && this.shopInfo.days_left !== '' && this.shopInfo.days_left <= this.remainingDays) {
            this.dialog.open(SubscriptionDueDialogComponent,
              {
                data: { premium_plan: this.currentPremiumPlan, shop: this.shopInfo },
                position: { bottom: '30px', right: '30px' }
              }).afterClosed().subscribe();
          }
        }
      }

    });
  }

  onShowNotifications() {
    this.rightDrawer.toggle();
    this.getBusinessAlerts({ shop_id: '' });
  }
  /**
  * Get business alerts
  * @param filterData IDashboardFilterParams interface
  */
  getBusinessAlerts(filterData: IDashboardFilterParams) {
    this.isProcessingBusinessAlerts = true;
    this.dashboardService.getBusinessAlerts(filterData, (error, result) => {
      this.isProcessingBusinessAlerts = false;
      if (result !== null && result.response_code === '100') {
        this.businessAlerts = result.results;
      }
    });
  }
  formatValue() {
    if (this.totalStockValueDetail !== undefined && this.totalStockValueDetail !== null) {
      this.totalSupplierValue = this.appUtils.formatStringValue(this.totalStockValueDetail.total_supplier_value);
      this.totalUnitPriceValue = this.appUtils.formatStringValue(this.totalStockValueDetail.total_unit_price_value);
    }
  }

  /**
    * Get business overview
    * @param fitlerData IDashboardFilterParams interface
    */
  getExpenseOverview(fitlerData: IDashboardFilterParams) {
    this.isProcessing = true;
    this.expenseOverviewObservable = this.dataProvider.getAll(this.constantValues.EXPENSE_OVERVIEW_ENDPOINT, fitlerData);
    this.expenseOverviewObservable
      .subscribe(result => {
        // this.isProcessing = false;
        if (result.response_code === '100') {
          this.isExpenseOverviewDataAvailable = false;
          const myData: any[] = result.mydata;
          const labels = [];
          const dataPoints = [];
          if (myData.length > 0) {
            this.isExpenseOverviewDataAvailable = true;
          }
          myData.forEach(data => {
            labels.push(data.category__name);
            dataPoints.push(data.total_amount);
          });
          this.isExpenseOverviewDataAvailable = true;
          this.renderExpenseOverviewDoughnutGraph(labels, dataPoints);
        }
      }, error => {
        // this.isProcessing = false;
        this.notificationService.snackBarMessage(error.detail);
      });
  }


  /**
   * Render doughnut graph for the KPIs
   * @param labels Graph labels
   * @param dataPoints Graph dataPoint
   */
  renderExpenseOverviewDoughnutGraph(labels, dataPoints) {
    if (this.expenseOverviewDoughnutChart) { this.expenseOverviewDoughnutChart.destroy(); }
    const ctrl = document.getElementById('expenseOverviewGraph');
    this.expenseOverviewDoughnutChart = new Chart(ctrl, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: dataPoints,
            fill: true,
            label: 'Expense Overview',
            backgroundColor: colors
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true
        },
        tooltips: {
          callbacks: doughnutGraphTooltipCallback
        },
        cutoutPercentage: 50
      }
    });
    this.expenseOverviewDoughnutChart.chart.update();
  }
  /**
    * Get my business alerts
    * @param filterData IDashboardFilterParams interface
    */
  getBestPerformingProducts(filterData: IDashboardFilterParams) {
    this.isProcessing = true;
    this.dataProvider.getAll(this.constantValues.GET_TOP_PERFORMING_PRODUCT_ENDPOINT, filterData)
      .subscribe(result => {
        if (result.response_code === '100') {
          this.bestPerformingProducts = result.results;
        }
      }, error => {
        this.notificationService.snackBarErrorMessage(error.detail);
      });
  }

}
