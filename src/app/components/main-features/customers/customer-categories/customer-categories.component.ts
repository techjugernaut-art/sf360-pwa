import { AddCustomerCategoryComponent } from './../add-customer-category/add-customer-category.component';
import { Component, OnInit } from '@angular/core';
import { CustomerApiCallsService } from 'src/app/services/network-calls/customer-api-calls.service';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ITableHeaderActions } from 'src/app/interfaces/table-header-actions.interace';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalDataService } from 'src/app/services/data-access/global-data.service';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { RequestMethds } from 'src/app/utils/enums.util';

@Component({
  selector: 'app-customer-categories',
  templateUrl: './customer-categories.component.html'
})
export class CustomerCategoriesComponent implements OnInit {

  pageHeaderOptions: IPageHeader;
  isProcessing = false;
  customerCatgories = [];
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
    private title: Title,
    private dialog: MatDialog,
    private authService: AuthService,
    private customersService: CustomerApiCallsService,
    private constantValues: ConstantValuesService
  ) { }

  ngOnInit() {
    this.isPartner = this.authService.isPartner;
    this.tableHeaderOption = { hasSearch: false, searchPlaceholder: 'Search customer segments' };
    this.pageHeaderOptions = { pageTitle: 'Customer Segments', hasShopsFilter: true };
    this.getCustomerCategories({ shop_id: '' });
  }
/**
   * Update shared data
   * @param data ISharedData
   */
  onDataRefreshed(data: ISharedData) {
    if (data !== null && data !== undefined) {
      this.storeId = data.shop_id;
      // tslint:disable-next-line:max-line-length
      this.getCustomerCategories({ shop_id: data.shop_id });
    }
  }
  /**
  * Get customer categories
  * @param filterData IDashboardFilterParams interface
  */
 getCustomerCategories(filterData: IDashboardFilterParams) {
  this.productsSearched = false;
  this.isProcessing = true;
  this.requestPayload = filterData;
  this.customersService.getCategories(filterData, (error, result) => {
    this.isProcessing = false;
    if (result !== null && result !== undefined && result.response_code === '100') {
      this.customerCatgories = result.results;
      this.prevPage = result.previous;
      this.nextPage = result.next;
      this.totalPage = result.count;
    }
  });
}

  addOrUpdateCategory(isEdit = false, category = null) {
    this.dialog.open(AddCustomerCategoryComponent, {data: {isEdit: isEdit, category: category}})
    .afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.getCustomerCategories(this.requestPayload as IDashboardFilterParams);
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
  this.customerCatgories = result.results;
  this.prevPage = result.previous;
  this.nextPage = result.next;
  this.totalPage = result.count;
}

}
