import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ITableHeaderActions } from 'src/app/interfaces/table-header-actions.interace';
import { Title } from '@angular/platform-browser';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { MatDialog } from '@angular/material/dialog';
import { AddAgentDialogComponent } from '../add-agent-dialog/add-agent-dialog.component';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent implements OnInit {
  pageHeaderOptions: IPageHeader;
  isProcessing = false;
  isPartner = false;
  allAgents = [];
  totalPage = 0;
  nextPage = '';
  prevPage = '';
  requestPayload = {};
  tableHeaderOption: ITableHeaderActions;
  isAgent = false;

  constructor(
    private title: Title,
    private dataProvider: DataProviderService,
    private notificationService: NotificationsService,
    private dialog: MatDialog,
    private authService: AuthService,
    private constantValues: ConstantValuesService) { }

  ngOnInit() {
    this.title.setTitle(this.constantValues.APP_NAME + ' | Agents');
    this.tableHeaderOption = { hasCustomAction: true };
    this.isPartner = this.authService.isPartner;
    this.isAgent = this.authService.currentUser.is_shop_agent;
    // tslint:disable-next-line:max-line-length
    this.pageHeaderOptions = {pageTitle: 'Agents',  hasShopsFilter: true};
    this.getAgents({shop_id: ''});
  }
  /**
   * Update shared data
   * @param data ISharedData
   */
  onDataRefreshed(data: ISharedData) {
    if (data !== null && data !== undefined) {
      // tslint:disable-next-line:max-line-length
      this.requestPayload = { shop_id: data.shop_id};
      // tslint:disable-next-line:max-line-length
      this.getAgents({ shop_id: data.shop_id});
    }
  }
   /**
   * Get sales summary reports
   * @param filterData IDashboardFilterParams interface
   */
  getAgents(filterData: IDashboardFilterParams) {
    this.isProcessing = true;
    this.dataProvider.getAll(this.constantValues.GET_AGENTS_ENDPOINT, filterData)
      .subscribe(result => {
        this.isProcessing =  false;
        if (result.response_code === '100') {
          this.allAgents = result.results;
          this.prevPage = result.previous;
          this.nextPage = result.next;
          this.totalPage = result.count;
        }
      }, error => {
        this.isProcessing =  false;
        this.notificationService.snackBarErrorMessage(error.detail);
      });
  }
  /**
   * On page changed
   * @param result result after page changed
   */
  onPageChanged(result) {
    this.allAgents = result.results;
          this.prevPage = result.previous;
          this.nextPage = result.next;
          this.totalPage = result.count;
  }
  exportAsExcel() {

  }
  addAgent() {
    this.dialog.open(AddAgentDialogComponent).afterClosed().subscribe((isSuccessful: boolean) => {
      if (isSuccessful) {
        this.getAgents(this.requestPayload as IDashboardFilterParams);
      }
    });
  }

}
