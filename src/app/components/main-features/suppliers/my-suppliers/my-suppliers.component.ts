import { AddSupplierComponent } from './../add-supplier/add-supplier.component';
import { SuppliersApiCallsService } from './../../../../services/network-calls/suppliers-api-calls.service';
import { Component, OnInit } from '@angular/core';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ITableHeaderActions } from 'src/app/interfaces/table-header-actions.interace';
import { Title } from '@angular/platform-browser';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-my-suppliers',
  templateUrl: './my-suppliers.component.html',
  styleUrls: ['./my-suppliers.component.scss']
})
export class MySuppliersComponent implements OnInit {

  pageHeaderOptions: IPageHeader;
  isProcessing = false;
  isPartner = false;
  suppliers = [];
  totalPage = 0;
  nextPage = '';
  prevPage = '';
  requestPayload = {};
  selectedCustomerType;
  tableHeaderOption: ITableHeaderActions;
  productDetail;

  constructor(
    private suppliersApiCallsService: SuppliersApiCallsService,
    private dialog: MatDialog,
    private authService: AuthService,
    ) { }

  ngOnInit() {
    this.isPartner = this.authService.isPartner;
    this.tableHeaderOption = {};
    // tslint:disable-next-line:max-line-length
    this.pageHeaderOptions = { pageTitle: 'My Suppliers', hasShopsFilter: true };
    this.getMySuppliers({shop_id: ''});
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
      this.getMySuppliers({ shop_id: data.shop_id });
    }
  }
  onChangeCustomerType(value) {
    this.selectedCustomerType = value;
    this.getMySuppliers(this.requestPayload as IDashboardFilterParams);
  }
  /**
  * Get my suppliers
  * @param filterData IDashboardFilterParams interface
  */
  getMySuppliers(filterData: IDashboardFilterParams) {
    this.isProcessing = true;
    this.suppliersApiCallsService.getSuppliers(filterData, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        this.suppliers = result.results;
        this.prevPage = result.previous;
        this.nextPage = result.next;
        this.totalPage = result.count;
      }
    });
  }
  /**
  * Search my suppliers
  * @param searchText search term
  */
 searchMySuppliers(searchText) {
  this.isProcessing = true;
  this.suppliersApiCallsService.searchMySuppliers(searchText, (error, result) => {
    this.isProcessing = false;
    if (result !== null && result.response_code === '100') {
      this.suppliers = result.results;
      this.prevPage = result.previous;
      this.nextPage = result.next;
      this.totalPage = result.count;
    }
  });
}
  /**
   * On page changed
   * @param result result after page changed
   */
  onPageChanged(result) {
    this.suppliers = result.results;
    this.prevPage = result.previous;
    this.nextPage = result.next;
    this.totalPage = result.count;
  }
  /**
   * Show product detail
   * @param product product info
   */
  showProductDetail(product) {
    this.productDetail = product;
  }
  exportAsExcel() {

  }
  addOrUpdateSupplier(isEdit = false, supplier = null) {
    this.dialog.open(AddSupplierComponent, {data: {isEdit: isEdit, supplier: supplier}})
    .afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.getMySuppliers(this.requestPayload as IDashboardFilterParams);
      }
    });
  }

}
