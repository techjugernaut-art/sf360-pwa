import { Component, OnInit } from '@angular/core';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ConstantValuesService } from '../../../services/constant-values.service';
import { ITableHeaderActions } from 'src/app/interfaces/table-header-actions.interace';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';

@Component({
  selector: 'app-intelligent-spotlight',
  templateUrl: './intelligent-spotlight.component.html'
})
export class IntelligentSpotlightComponent implements OnInit {
  pageHeaderOptions: IPageHeader;
  isProcessing = false;
  intellisights = [];
  totalPage = 0;
  nextPage = '';
  prevPage = '';
  requestPayload = {};
  tableHeaderOption: ITableHeaderActions;

  constructor(
    private dataProvider: DataProviderService,
    private notificationService: NotificationsService,
    private constantValues: ConstantValuesService) { }

  ngOnInit() {
    this.tableHeaderOption = {};
    // tslint:disable-next-line:max-line-length
    this.pageHeaderOptions = { pageTitle: 'Intellisights', hasShopsFilter: true, hasDateRangeFilter: true };
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
      this.getIntellisight({ shop_id: data.shop_id });
    }
  }
  /**
  * Get my intellisights
  * @param filterData IDashboardFilterParams interface
  */
  getIntellisight(filterData: IDashboardFilterParams) {
    this.isProcessing = true;
    this.dataProvider.getAll(this.constantValues.GET_INTELLISIGHTS_ENDPOINT, filterData)
      .subscribe(result => {
        this.isProcessing = false;
        if (result.response_code === '100') {
          this.intellisights = result.results;
          this.prevPage = result.previous;
          this.nextPage = result.next;
          this.totalPage = result.count;
        }
      }, error => {
        this.isProcessing = false;
        this.notificationService.snackBarErrorMessage(error.detail);
      });
  }
  /**
   * On page changed
   * @param result result after page changed
   */
  onPageChanged(result) {
    this.intellisights = result.results;
    this.prevPage = result.previous;
    this.nextPage = result.next;
    this.totalPage = result.count;
  }

}
