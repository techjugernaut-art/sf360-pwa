import { AddCustomerDiscountComponent } from './../add-customer-discount/add-customer-discount.component';
import { Component, OnInit } from '@angular/core';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ITableHeaderActions } from 'src/app/interfaces/table-header-actions.interace';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerApiCallsService } from 'src/app/services/network-calls/customer-api-calls.service';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';

@Component({
  selector: 'app-customer-discounts',
  templateUrl: './customer-discounts.component.html'
})
export class CustomerDiscountsComponent implements OnInit {

  pageHeaderOptions: IPageHeader;
  isProcessing = false;
  customerDiscounts = [];
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
  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private customersService: CustomerApiCallsService,
  ) { }

  ngOnInit() {
    this.isPartner = this.authService.isPartner;
    this.tableHeaderOption = { hasSearch: false, searchPlaceholder: 'Search customer discount' };
    this.pageHeaderOptions = { pageTitle: 'Customer Discounts', hasShopsFilter: true };
    this.getCustomerDiscounts({ shop_id: '' });
  }
/**
   * Update shared data
   * @param data ISharedData
   */
  onDataRefreshed(data: ISharedData) {
    if (data !== null && data !== undefined) {
      this.storeId = data.shop_id;
      // tslint:disable-next-line:max-line-length
      this.getCustomerDiscounts({ shop_id: data.shop_id });
    }
  }
  /**
  * Get customer categories
  * @param filterData IDashboardFilterParams interface
  */
 getCustomerDiscounts(filterData: IDashboardFilterParams) {
  this.productsSearched = false;
  this.isProcessing = true;
  this.requestPayload = filterData;
  this.customersService.getCustomerDiscounts(filterData, (error, result) => {
    this.isProcessing = false;
    if (result !== null && result !== undefined && result.response_code === '100') {
      this.customerDiscounts = result.results;
      this.prevPage = result.previous;
      this.nextPage = result.next;
      this.totalPage = result.count;
    }
  });
}

  addOrUpdateDiscount(isEdit = false, category = null) {
    this.dialog.open(AddCustomerDiscountComponent, {data: {isEdit: isEdit, category: category}})
    .afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.getCustomerDiscounts(this.requestPayload as IDashboardFilterParams);
      }
    });
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
  this.customerDiscounts = result.results;
  this.prevPage = result.previous;
  this.nextPage = result.next;
  this.totalPage = result.count;
}

}
