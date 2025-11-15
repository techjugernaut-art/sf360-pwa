import { PurchaseSmsCreditComponent } from '../purchase-sms-credit/purchase-sms-credit.component';
import { CustomerCampaignDetailComponent } from '../customer-campaign-detail/customer-campaign-detail.component';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ITableHeaderActions } from 'src/app/interfaces/table-header-actions.interace';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerApiCallsService } from 'src/app/services/network-calls/customer-api-calls.service';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { AppUtilsService } from 'src/app/services/app-utils.service';
import { CreateCustomersCampaignComponent } from '../create-customers-campaign/create-customers-campaign.component';
import moment from 'moment';

declare var google: any;

@Component({
  selector: 'app-customer-campaigns',
  templateUrl: './customer-campaigns.component.html'
})
export class CustomerCampaignsComponent implements OnInit {
  pageHeaderOptions: IPageHeader;
  isProcessing = false;
  customerCampaigns = [];
  totalPage = 0;
  nextPage = '';
  prevPage = '';
  requestPayload = {};
  tableHeaderOption: ITableHeaderActions;
  productDetail;
  myShops = [];
  storeId: string;
  searchTerm = '';
  isPartner = false;
  productsSearched: boolean;
  shopProductsToDownload = [];
  customerCampaignsOverview;
  campaignOverview: any;
  smsCampaignsGraph = [];
  emailCampaignsGraph = [];
  dateLabels = [];
  graphData = [];


  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private customersService: CustomerApiCallsService,
    private appUtils: AppUtilsService,
  ) { }

  ngOnInit() {
    this.isPartner = this.authService.isPartner;
    this.tableHeaderOption = { hasSearch: false, searchPlaceholder: 'Search customer campaigns' };
    this.pageHeaderOptions = { pageTitle: 'Customer Campaigns', hasShopsFilter: true };
    this.getCustomerCampaigns({ shop_id: '' });
    this.getCampaignsgraphOverview({ shop_id: '', })
  }
  toList() {
    document.getElementById("list").scrollIntoView({ behavior: "smooth" });
  }
  /**
     * Update shared data
     * @param data ISharedData
     */
  onDataRefreshed(data: ISharedData) {
    if (data !== null && data !== undefined) {
      this.storeId = data.shop_id;
      // tslint:disable-next-line:max-line-length
      this.getCustomerCampaigns({ shop_id: data.shop_id });
      this.getCampaignsgraphOverview({ shop_id: data.shop_id })
    }
  }
  /**
  * Get customer campaigns
  * @param filterData IDashboardFilterParams interface
  */
  getCustomerCampaigns(filterData: IDashboardFilterParams) {
    this.productsSearched = false;
    this.isProcessing = true;
    this.requestPayload = filterData;
    this.customersService.filterCampaigns(filterData, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result !== undefined && result.response_code === '100') {
        this.customerCampaigns = result.results;
        this.prevPage = result.previous;
        this.nextPage = result.next;
        this.totalPage = result.count;
      }
    });
  }

  addOrUpdateCampaign(isEdit = false, category = null) {
    this.dialog.open(CreateCustomersCampaignComponent, { data: { isEdit: isEdit, category: category } })
      .afterClosed().subscribe((isSuccess: boolean) => {
        if (isSuccess) {
          this.getCustomerCampaigns(this.requestPayload as IDashboardFilterParams);
        }
      });
  }

  viewCampaign(campaign) {
    this.dialog.open(CustomerCampaignDetailComponent, { data: { campaign: campaign } });
  }
  /**
    * Search my units
    * @param searchText search term
    */
  onSearch(searchText, downloadData: boolean = false) {

  }
  /**
   * On page changed
   * @param result result after page changed
   */
  onPageChanged(result) {
    this.customerCampaigns = result.results;
    this.prevPage = result.previous;
    this.nextPage = result.next;
    this.totalPage = result.count;
  }

  onBuySMSCredit() {
    this.dialog.open(PurchaseSmsCreditComponent);
  }
  /**
  * Display customer campaigns overview and graph
  */
  getCampaignsgraphOverview(filterData: IDashboardFilterParams) {
    this.dateLabels = this.appUtils.getDateLabelsByEndAndStartDate(filterData.start_date, filterData.end_date);
    this.isProcessing = true;
    this.requestPayload = filterData;
    this.customersService.getCampaignOverview(filterData, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        this.campaignOverview = result
        this.smsCampaignsGraph = result.sms_campaigns_graph;
        this.emailCampaignsGraph = result.email_campaigns_graph;
        this.emailCampaignsGraph.forEach(data => {
          const smsData = this.smsCampaignsGraph.find(dat => dat.month == data.month);
          const sms = (smsData !== null && smsData !== undefined) ? smsData.count : 0;
          // this.graphData.push(['Email', 'SMS']);
          this.graphData.push([moment(data.month).format('MMM YYYY'), data.count, sms]);
        });
      }
    });
  }
  /**
 * Display customer campaigns graph
 */
  title = ['Email', 'SMS'];
  type = 'ColumnChart';
  columnNames = ['Email', 'SMS'];
  options = {
    legend: { position: 'right' },
    hAxis: {
      title: 'Months'
    },
    vAxis: {
      title: 'Campaigns'
    },
    series: {
      0: { color: '#3366cc' },
      1: { color: '#00b3ff' },
    },
    isStacked: true

  };
  width = 450;
  height = 400;

}
