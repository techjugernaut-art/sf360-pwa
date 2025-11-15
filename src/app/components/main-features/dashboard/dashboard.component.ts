import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js';
import { colors } from '../../../utils/colors';
import * as moment from 'moment';
import { AppUtilsService } from '../../../services/app-utils.service';
import { IPageHeader } from '../../../interfaces/page-heading.interface';
import { Title } from '@angular/platform-browser';
import { ConstantValuesService } from '../../../services/constant-values.service';
import { Observable } from 'rxjs';
import { DataProviderService } from '../../../services/data-provider.service';
import { IDashboardFilterParams } from '../../../interfaces/dashboard-overview-filter.interface';
import { NotificationsService } from '../../../services/notifications.service';
import { isNullOrUndefined } from 'util';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { Router } from '@angular/router';
import { scalesCallback, toolTipCallback, doughnutGraphTooltipCallback, horizontalToolTipCallback } from '../../../utils/chart.utils';
import { uuid4 } from '@sentry/utils';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  myPieChart: Chart;
  expenseOverviewDoughnutChart: Chart;
  multilineChart: Chart;
  expenseOverviewChart: Chart;
  pageHeaderOptions: IPageHeader;
  dateStep = 7;
  businessOverviewObservable: Observable<any>;
  expenseOverviewObservable: Observable<any>;
  graphOverviewObservable: Observable<any>;
  filterData: IDashboardFilterParams;
  isProcessing = false;
  businessOverview;
  dataSharingSubscription;
  refreshInterval;
  salesOrderReportData: any[];
  dateLabels = [];
  businessAlerts = [];
  bestPerformingProducts = [];
  isDoughnutDataAvailable = false;
  expenseOverview: any;
  isExpenseOverviewDataAvailable = false;
  constructor(
    private appUtils: AppUtilsService,
    private title: Title,
    private dataProvider: DataProviderService,
    private notificationService: NotificationsService,
    private router: Router,
    private constantValues: ConstantValuesService  ) { }

  ngOnInit() {
    this.title.setTitle(this.constantValues.APP_NAME + ' | Overview');
    this.pageHeaderOptions = { pageTitle: 'Overview', hasShopsFilter: true, hasDateRangeFilter: true };
    this.refreshInterval = setInterval(() => {
      this.getBusinessOverview(this.filterData);
      this.getExpenseOverview(this.filterData);
      this.getBusinessAlerts(this.filterData);
      this.getBestPerformingProducts(this.filterData);
      if (this.filterData.start_date === moment().format(this.constantValues.DD_MM_YYYY_DATE_FORMAT) && this.filterData.end_date === moment().format(this.constantValues.DD_MM_YYYY_DATE_FORMAT)) {
        // tslint:disable-next-line:max-line-length
        this.getSalesOrderGraph({ start_date: moment().subtract(this.dateStep, 'days').format(this.constantValues.DD_MM_YYYY_DATE_FORMAT), end_date: moment().format(this.constantValues.DD_MM_YYYY_DATE_FORMAT), shop_id: this.filterData.shop_id });
      } else {
        this.getSalesOrderGraph(this.filterData);
      }
    }, 300000);
  }
  ngOnDestroy() {
    this.businessOverviewObservable.subscribe().unsubscribe();
    this.graphOverviewObservable.subscribe().unsubscribe();
    this.expenseOverviewObservable.subscribe().unsubscribe();
    if (this.multilineChart) { this.multilineChart.destroy(); }
    clearInterval(this.refreshInterval);
  }
  onDataRefreshed(data: ISharedData) {
    if (data !== null && data !== undefined) {
      // tslint:disable-next-line:max-line-length
      const filterData = { start_date: data.filter_date_range.start_date, end_date: data.filter_date_range.end_date, shop_id: data.shop_id };
      this.filterData = filterData;
      this.getBusinessOverview(filterData);
      this.getExpenseOverview(filterData);
      this.getBusinessAlerts(filterData);
      this.getBestPerformingProducts(this.filterData);
      // tslint:disable-next-line:max-line-length
      if (data.filter_date_range.start_date === moment().format(this.constantValues.DD_MM_YYYY_DATE_FORMAT) && data.filter_date_range.end_date === moment().format(this.constantValues.DD_MM_YYYY_DATE_FORMAT)) {
        // tslint:disable-next-line:max-line-length
        this.getSalesOrderGraph({ start_date: moment().subtract(this.dateStep, 'days').format(this.constantValues.DD_MM_YYYY_DATE_FORMAT), end_date: moment().format(this.constantValues.DD_MM_YYYY_DATE_FORMAT) });
      } else {
        // tslint:disable-next-line:max-line-length
        this.getSalesOrderGraph({ start_date: data.filter_date_range.start_date, end_date: data.filter_date_range.end_date, shop_id: data.shop_id });
      }
    }
  }
  /**
 * Render doughnut graph for the KPIs
 * @param labels Graph labels
 * @param dataPoints Graph dataPoint
 */
  renderDoughnutGraph(labels, dataPoints) {
    if (this.myPieChart) { this.myPieChart.destroy(); }
    const ctrl = document.getElementById('reportDonunt');
    this.myPieChart = new Chart(ctrl, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: dataPoints,
            fill: true,
            label: 'Payment Methods',
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
    this.myPieChart.chart.update();
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
  * @param dataPoints Graph dataPoints
  */
 renderExpenseOverviewGraph(labels, dataPoints) {
  if (this.expenseOverviewChart) { this.expenseOverviewChart.destroy(); }
  const ctrl = document.getElementById('expenseOverviewGraph');
  this.expenseOverviewChart = new Chart(ctrl, {
    type: 'horizontalBar',
    data: {
      labels: labels,
      datasets: [ {
        label: 'Total Expenses',
        data: dataPoints,
        backgroundColor: colors
      }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      legend: {
        display: false
      },
      scales: scalesCallback,
    tooltips: {
      callbacks: horizontalToolTipCallback
  }
    }
  });
  this.expenseOverviewChart.chart.update();
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
    * Get business overview
    * @param fitlerData IDashboardFilterParams interface
    */
  getBusinessOverview(fitlerData: IDashboardFilterParams) {
    // fitlerData.start_date = moment(fitlerData.start_date).format(this.constantValues.DD_MM_YYYY_DATE_FORMAT);
    // fitlerData.end_date = moment(fitlerData.end_date).format(this.constantValues.DD_MM_YYYY_DATE_FORMAT);
    this.isProcessing = true;
    this.businessOverviewObservable = this.dataProvider.getAll(this.constantValues.GET_OVERVIEW_ENDPOINT, fitlerData);
    this.businessOverviewObservable
      .subscribe(result => {
        // this.isProcessing = false;
        if (result.response_code === '100') {
          this.businessOverview = result;
          this.isDoughnutDataAvailable = false;
          // tslint:disable-next-line:max-line-length
          if (this.businessOverview.card_orders !== null || this.businessOverview.cash_orders !== null || this.businessOverview.momo_orders !== null || this.businessOverview.paycode_orders !== null || this.businessOverview.qr_orders !== null || this.businessOverview.ussd_orders !== null) {
            this.isDoughnutDataAvailable = true;
            this.doughnutGraph(result);
          }
        }
      }, error => {
        // this.isProcessing = false;
        this.notificationService.snackBarMessage(error.detail);
      });
  }
  /**
    * Get business overview
    * @param fitlerData IDashboardFilterParams interface
    */
   getExpenseOverview(fitlerData: IDashboardFilterParams) {
    fitlerData.start_date = moment(fitlerData.start_date).format(this.constantValues.DD_MM_YYYY_DATE_FORMAT);
    fitlerData.end_date = moment(fitlerData.end_date).format(this.constantValues.DD_MM_YYYY_DATE_FORMAT);
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
  * Get my business alerts
  * @param filterData IDashboardFilterParams interface
  */
 getBusinessAlerts(filterData: IDashboardFilterParams) {
  this.isProcessing = true;
  this.dataProvider.getAll(this.constantValues.GET_BUSINESS_ALERTS_ENDPOINT, filterData)
    .subscribe(result => {
      if (result.response_code === '100') {
        this.businessAlerts = result.results;
      }
    }, error => {
      this.notificationService.snackBarErrorMessage(error.detail);
    });
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
  /**
 * Render doughnut graph
 * @param result data to extract
 */
  doughnutGraph(result) {
    const localGraphLabel = [];
    const localGraphDataPoint = [];
    localGraphLabel.push('Card Orders');
    localGraphDataPoint.push(result.card_orders);
    localGraphLabel.push('Cash Orders');
    localGraphDataPoint.push(result.cash_orders);
    localGraphLabel.push('MoMo Orders');
    localGraphDataPoint.push(result.momo_orders);
    localGraphLabel.push('USSD Orders');
    localGraphDataPoint.push(result.ussd_orders);
    localGraphLabel.push('QR Orders');
    localGraphDataPoint.push(result.qr_orders);
    localGraphLabel.push('PayCode Orders');
    localGraphDataPoint.push(result.paycode_orders);
    this.renderDoughnutGraph(localGraphLabel, localGraphDataPoint);
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
            if (!isNullOrUndefined(dat)) {
              dataPoints.push(dat.total);
            } else {
              dataPoints.push(0);
            }
            const activeShopsData = activeShopsGraphData.find(prodVal => {
              return prodVal.date === dateValue;
            });
            if (!isNullOrUndefined(activeShopsData)) {
              activeShopsDataPoints.push(activeShopsData.count);
            } else {
              activeShopsDataPoints.push(0);
            }

            const visitingShopsData = visitingShopsGraphData.find(prodVal => {
              return prodVal.date === dateValue;
            });
            if (!isNullOrUndefined(visitingShopsData)) {
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
          // remoteProductMultilineGraphData.push({
          //   data: activeShopsDataPoints,
          //   label: 'Active Shops',
          //   borderColor: colors[1],
          //   fill: false
          // });
          // remoteProductMultilineGraphData.push({
          //   data: visitingShopsDataPoints,
          //   label: 'Visiting Shops',
          //   borderColor: colors[2],
          //   fill: false
          // });
          this.renderMultilineGraph(this.dateLabels, remoteProductMultilineGraphData);
        }
      }, error => {
        this.isProcessing = false;
        this.notificationService.snackBarErrorMessage(error.detail);
      });
  }
  viewMoreSalesOrders() {
    // this.router.navigate(['/reports/sales-orders'], {queryParams: this.filterData});
    this.router.navigate(['/reports/sales-orders']);
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
}

