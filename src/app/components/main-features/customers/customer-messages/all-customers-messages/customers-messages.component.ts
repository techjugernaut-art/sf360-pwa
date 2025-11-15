import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { ITableHeaderActions } from 'src/app/interfaces/table-header-actions.interace';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerApiCallsService } from 'src/app/services/network-calls/customer-api-calls.service';
import { CreateCustomerMessageComponent } from '../create-customer-message/create-customer-message.component';
import { CustomerMessageDetailsComponent } from '../customer-message-details/customer-message-details.component';

@Component({
  selector: 'app-customers-messages',
  templateUrl: './customers-messages.component.html'
})
export class CustomersMessagesComponent implements OnInit {
  pageHeaderOptions: IPageHeader;
  isProcessing = false;
  customerMessages = [];
  totalPage = 0;
  nextPage = '';
  prevPage = '';
  requestPayload = {};
  tableHeaderOption: ITableHeaderActions;
  myShops = [];
  storeId: string;
  isPartner = false;


  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private customersService: CustomerApiCallsService,
  ) { }

  ngOnInit() {
    this.isPartner = this.authService.isPartner;
    this.pageHeaderOptions = { pageTitle: 'Automation Templates', ignoreFilterByAllShops: true, hasShopsFilter: true };
  }

  /**
     * Update shared data
     * @param data ISharedData
     */
   onDataRefreshed(data: ISharedData) {
    if (data !== null && data !== undefined) {
      this.storeId = data.shop_id;
      // tslint:disable-next-line:max-line-length
      this.getAutomationTemplates({ shop_id: data.shop_id });
    }
  }
  /**
  * Get customer campaigns
  * @param filterData IDashboardFilterParams interface
  */
   getAutomationTemplates(filterData: IDashboardFilterParams) {
    this.isProcessing = true;
    this.customersService.getAutomationTemplate(filterData, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result !== undefined && result.response_code === '100') {
        this.customerMessages = result.results;
        this.prevPage = result.previous;
        this.nextPage = result.next;
        this.totalPage = result.count;
      }
    });
  }

  createAutomationTemplate(isEdit = false, category = null) {
    this.dialog.open(CreateCustomerMessageComponent, { data: { isEdit: isEdit, category: category } })
      .afterClosed().subscribe((isSuccess: boolean) => {
        if (isSuccess) {
          this.getAutomationTemplates(this.requestPayload as IDashboardFilterParams);
        }
      });
  }

  viewAutomationTemplate(message) {
    this.dialog.open(CustomerMessageDetailsComponent, { data: { message: message } });
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
    this.customerMessages = result.results;
    this.prevPage = result.previous;
    this.nextPage = result.next;
    this.totalPage = result.count;
  }

}
