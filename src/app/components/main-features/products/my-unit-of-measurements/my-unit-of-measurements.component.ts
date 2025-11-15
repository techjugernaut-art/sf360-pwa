import { AddUnitOfMeasurementComponent } from './../add-unit-of-measurement/add-unit-of-measurement.component';
import { Component, OnInit } from '@angular/core';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ITableHeaderActions } from 'src/app/interfaces/table-header-actions.interace';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { ProductsService } from 'src/app/services/network-calls/products.service';
import { GlobalDataService } from 'src/app/services/data-access/global-data.service';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { RequestMethds } from 'src/app/utils/enums.util';

@Component({
  selector: 'app-my-unit-of-measurements',
  templateUrl: './my-unit-of-measurements.component.html',
  styleUrls: ['./my-unit-of-measurements.component.scss']
})
export class MyUnitOfMeasurementsComponent implements OnInit {

  pageHeaderOptions: IPageHeader;
  isProcessing = false;
  shopUnitOfMeasurements = [];
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
    private productsService: ProductsService,
    private globalData: GlobalDataService,
  ) { }

  ngOnInit() {
    this.isPartner = this.authService.isPartner;
    this.tableHeaderOption = { hasSearch: false, searchPlaceholder: 'Search unit of measurement' };
    this.pageHeaderOptions = { pageTitle: 'Unit of Measurements', hasShopsFilter: true, ignoreFilterByAllShops: true };
    // this.getUnitOfMeasurements({ shop_id: this.storeId });
  }
/**
   * Update shared data
   * @param data ISharedData
   */
  onDataRefreshed(data: ISharedData) {
    if (data !== null && data !== undefined) {
      this.storeId = data.shop_id;
      // tslint:disable-next-line:max-line-length
      this.getUnitOfMeasurements({ shop_id: data.shop_id });
    }
  }
  /**
  * Get my unit of measurements
  * @param filterData IDashboardFilterParams interface
  */
 getUnitOfMeasurements(filterData: IDashboardFilterParams, downloadData: boolean = false) {
  this.productsSearched = false;
  this.isProcessing = true;
  this.requestPayload = filterData;
  this.productsService.getUnitsOfMeasurement(filterData.shop_id, (error, result) => {
    this.isProcessing = false;
    if (result !== null && result !== undefined && result.response_code === '100') {
      this.shopUnitOfMeasurements = result.results;
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
  addUnitOfMeasurement() {
    this.dialog.open(AddUnitOfMeasurementComponent, {data: {isEdit: false}})
    .afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.getUnitOfMeasurements(this.requestPayload as IDashboardFilterParams);
      }
    });
  }
  editUnitOfMeasurement(unit) {
    this.dialog.open(AddUnitOfMeasurementComponent, {data: {isEdit: true, unit: unit}})
    .afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.getUnitOfMeasurements(this.requestPayload as IDashboardFilterParams);
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
  this.shopUnitOfMeasurements = result.results;
  this.prevPage = result.previous;
  this.nextPage = result.next;
  this.totalPage = result.count;
}
}
