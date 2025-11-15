import { ProductsOfAGroupComponent } from './../products-of-a-group/products-of-a-group.component';
import { AddProductGroupComponent } from './../add-product-group/add-product-group.component';
import { Component, OnInit } from '@angular/core';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ITableHeaderActions } from 'src/app/interfaces/table-header-actions.interace';
import { MatDialog } from '@angular/material/dialog';
import { ProductsService } from 'src/app/services/network-calls/products.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { Title } from '@angular/platform-browser';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { GlobalDataService } from 'src/app/services/data-access/global-data.service';
import { RequestMethds } from 'src/app/utils/enums';

@Component({
  selector: 'app-my-product-categories',
  templateUrl: './my-product-categories.component.html',
  styleUrls: ['./my-product-categories.component.scss']
})
export class MyProductCategoriesComponent implements OnInit {
  pageHeaderOptions: IPageHeader;
  isProcessing = false;
  shopProducts = [];
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
    private productsService: ProductsService,
    private globalData: GlobalDataService,
    private constantValues: ConstantValuesService
  ) { }

  ngOnInit() {
    this.isPartner = this.authService.isPartner;
    // this.title.setTitle(this.constantValues.APP_NAME + ' | My Product Categories');
    this.tableHeaderOption = { hasSearch: false, searchPlaceholder: 'Search product categories' };
    this.pageHeaderOptions = { pageTitle: 'My Product Categories', hasShopsFilter: true };
    this.getMyProductGroups({ shop_id: '' });
  }
/**
   * Update shared data
   * @param data ISharedData
   */
  onDataRefreshed(data: ISharedData) {
    if (data !== null && data !== undefined) {
      this.storeId = data.shop_id;
      // tslint:disable-next-line:max-line-length
      this.getMyProductGroups({ shop_id: data.shop_id });
    }
  }
  /**
  * Get my products
  * @param filterData IDashboardFilterParams interface
  */
 getMyProductGroups(filterData: IDashboardFilterParams, downloadData: boolean = false) {
  this.productsSearched = false;
  this.isProcessing = true;
  this.requestPayload = filterData;
  this.productsService.getProductGroupsFromRemoteOnly(filterData.shop_id, (error, result) => {
    this.isProcessing = false;
    if (result !== null && result !== undefined && result.response_code === '100') {
      this.shopProducts = result.results;
      this.prevPage = result.previous;
      this.nextPage = result.next;
      this.totalPage = result.count;
      if (downloadData && this.nextPage !== null && this.nextPage !== '' && this.nextPage !== undefined) {
        this.shopProductsToDownload = result.results;
        this.isProcessing = true;
        this.loadMoreDataToDownload(filterData, this.nextPage);
      } else if (downloadData && result.next === null || result.next === '' || result.next === undefined) {
        this.shopProductsToDownload = result.results;
        this.isProcessing = false;
        // this.exportDocs.exportProductsAsCSV(this.shopProductsToDownload);
      }
    }
  });
}
/**
   * Load more data
   * @param requestPayload Request Payload
   * @param url The url to download data with
   */
  loadMoreDataToDownload(requestPayload, url) {
    this.globalData.loadAllDataWithNextURL(url, RequestMethds.POST, requestPayload, (error, result) => {
      if (result !== null && result !== '' && result !== undefined) {
        const res: any[] = result.results;
        const concatenatedData: any[] = this.shopProductsToDownload.concat(res);
        this.shopProductsToDownload = concatenatedData;
        if (result.next === null || result.next === '' || result.next === undefined) {
          this.isProcessing = false;
          // this.exportDocs.exportProductsAsCSV(this.shopProductsToDownload);
        }
      }
    });
  }
  addOrUpdateProductGroup(isEdit = false, productGroup = null) {
    this.dialog.open(AddProductGroupComponent, {data: {isEdit: isEdit, product_group: productGroup}})
    .afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.getMyProductGroups(this.requestPayload as IDashboardFilterParams);
      }
    });
  }
  viewProductsInGroup(productGroup) {
    this.dialog.open(ProductsOfAGroupComponent, {data: {isEdit: false, product_group: productGroup }})
    .afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.getMyProductGroups(this.requestPayload as IDashboardFilterParams);
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
  this.shopProducts = result.results;
  this.prevPage = result.previous;
  this.nextPage = result.next;
  this.totalPage = result.count;
}
}
