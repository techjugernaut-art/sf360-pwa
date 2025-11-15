import { CustomerFilterByEnum } from '../../../../utils/enums';
import { AddCustomerComponent } from '../add-customer/add-customer.component';
import { AddCustomersToCategoryComponent } from '../add-customers-to-category/add-customers-to-category.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomerApiCallsService } from 'src/app/services/network-calls/customer-api-calls.service';
import { AuthService } from '../../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ITableHeaderActions } from 'src/app/interfaces/table-header-actions.interace';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { AddCustomerCategoryComponent } from '../add-customer-category/add-customer-category.component';
import { AddCustomerDiscountComponent } from '../add-customer-discount/add-customer-discount.component';
import { CustomerDetailsComponent } from '../customer-details/customer-details.component';
declare const swal;

@Component({
  selector: 'app-my-customers',
  templateUrl: './my-customers.component.html'
})
export class MyCustomersComponent implements OnInit {

  pageHeaderOptions: IPageHeader;
  isProcessing = false;
  shopProducts = [];
  totalAmountOwing = 0;
  totalPage = 0;
  nextPage = '';
  prevPage = '';
  requestPayload = {};
  selectedCustomerType;
  tableHeaderOption: ITableHeaderActions;
  productDetail;
  isPartner = false;
  productGroupId: any;
  productGroupName: any;
  productGroupStoreId: any;
  hasShopFilter: boolean;
  storeId: string;
  isGroupProducts: boolean;
  pageTitleAndName = 'My Customers';
  selection = new SelectionModel<number>(true, []);



  constructor(
    private dataProvider: DataProviderService,
    private notificationService: NotificationsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private customerApiService: CustomerApiCallsService,
    private dialog: MatDialog,
    private constantValues: ConstantValuesService) { }

  ngOnInit() {
    this.isPartner = this.authService.isPartner;
    this.route.queryParams.subscribe(param => {
      this.productGroupId = param['gId'];
      this.productGroupName = param['gName'];
      this.productGroupStoreId = param['s'];

      this.hasShopFilter = true;
      this.storeId = '';
      this.isGroupProducts = false;
      this.pageTitleAndName = ' My Customers';

      // tslint:disable-next-line: max-line-length
      if (this.productGroupId !== '' && this.productGroupId !== null && this.productGroupId !== undefined && this.productGroupStoreId !== '' && this.productGroupStoreId !== null && this.productGroupStoreId !== undefined) {
        this.hasShopFilter = false;
        this.storeId = this.productGroupStoreId;
        this.isGroupProducts = true;
        this.pageTitleAndName = ' Customers in ' + this.productGroupName;
      }
      this.tableHeaderOption = { hasSearch: true, searchPlaceholder: 'Search customer' };
      // tslint:disable-next-line:max-line-length
      this.pageHeaderOptions = { pageTitle: this.pageTitleAndName, hasShopsFilter: this.hasShopFilter, hasCustomFilter: this.hasShopFilter };
      if (this.isGroupProducts) {
        this.getCustomersOfGroup({ shop_id: this.productGroupStoreId });
      } else {
        this.getMyCustomers({shop_id: ''});
      }
    });
  }
  /**
   * Update shared data
   * @param data ISharedData
   */
  onDataRefreshed(data: ISharedData) {
    if (data !== null && data !== undefined) {
      this.storeId = data.shop_id;
      // tslint:disable-next-line:max-line-length
      this.requestPayload = { shop_id: data.shop_id };
      // tslint:disable-next-line:max-line-length
      this.getMyCustomers({ shop_id: data.shop_id });
    }
  }
  onChangeCustomerType(value) {
    this.selectedCustomerType = value;
    this.getMyCustomers(this.requestPayload as IDashboardFilterParams);
  }
  /**
  * Get my customers
  * @param filterData IDashboardFilterParams interface
  */
  getMyCustomers(filterData: IDashboardFilterParams) {
    this.selection.clear();
    this.isProcessing = true;
    this.customerApiService.getCustomers(filterData, this.selectedCustomerType, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        this.shopProducts = result.results;
        this.prevPage = result.previous;
        this.nextPage = result.next;
        this.totalPage = result.count;
        if (this.selectedCustomerType === CustomerFilterByEnum.OWING) {
          this.totalAmountOwing = result.total_amount;
        }
      }
    });
  }

  /**
  * Get my customers of a customer group
  * @param filterData IDashboardFilterParams interface
  */
 getCustomersOfGroup(filterData: IDashboardFilterParams) {
   this.selection.clear();
  this.requestPayload = filterData;
  this.isProcessing = true;
  this.customerApiService.getCustomersOfCustomerGroup(this.productGroupId, filterData, (error, result) => {
    this.isProcessing = false;
    if (result !== null && result !== undefined && result.response_code === '100') {
      this.shopProducts = result.results;
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
 searchMyCustomers(searchText) {
  this.selection.clear();
   const searchParam = {search_text: searchText};
  if (!this.isGroupProducts) {
    this.isProcessing = true;
  this.dataProvider.getAll(this.constantValues.SEARCH_CUSTOMER_ENDPOINT, searchParam)
    .subscribe(result => {
      this.isProcessing = false;
      if (result.response_code === '100') {
        this.shopProducts = result.results;
        this.prevPage = result.previous;
        this.nextPage = result.next;
        this.totalPage = result.count;
      }
    }, error => {
      this.isProcessing = false;
      this.notificationService.snackBarErrorMessage(error.detail);
    });
  } else {
    this.isProcessing = true;
    // tslint:disable-next-line: max-line-length
    this.customerApiService.searchCustomersOfACustomerGroup(this.productGroupId, {search_text: searchText, shop_id: this.productGroupStoreId}, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        this.shopProducts = result.results;
        this.prevPage = result.previous;
        this.nextPage = result.next;
        this.totalPage = result.count;
      }
    });
  }
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

  exportAsExcel() {

  }
 /** Whether the number of selected elements matches the total number of rows. */
 isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.totalPage;
  return numSelected === numRows;
}
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.shopProducts.forEach(row => this.selection.select(row.id));
  }
  removeSelectedCustomersFromCategory() {
    if (this.selection.hasValue()) {
      const self = this;
      const payload = {shop_id: this.storeId, product_ids: this.selection.selected.join() };
      swal({
        title: 'Are you sure?',
        text: 'This action will remove selected products from ' + this.productGroupName,
        type: 'info',
        showCancelButton: true,
        confirmButtonText: 'Yes, remove it',
        closeOnConfirm: false,
        showLoaderOnConfirm: true,
        html: true
      }, function (inputValue) {
        if (inputValue) {
          self.customerApiService.removeCustomersFromCustomerGroup(self.productGroupId, payload, (error, result) => {
            if (result !== null && result.status === 'success') {
              swal('Customer Category', 'Customer successfully removed', 'success');
              self.getCustomersOfGroup({ shop_id: self.productGroupStoreId });
            }
            if (error !== null) {
              swal('Customer Category', error.detail, 'error');
            }
          });
        }
      });
    }
  }
  /**
   * Display add product dialog
   */
  onAssignCustomersToCategory() {
    if (this.storeId !== '' && this.storeId !== null && this.storeId !== undefined) {
      // tslint:disable-next-line: max-line-length
      this.dialog.open(AddCustomersToCategoryComponent, { data: { shop_id: this.storeId, selected: this.selection.selected } })
        .afterClosed().subscribe((isSuccessful: boolean) => {
          if (isSuccessful) {
            if (this.isGroupProducts) {
              this.getCustomersOfGroup({ shop_id: this.productGroupStoreId });
            } else {
              this.getMyCustomers(this.requestPayload as IDashboardFilterParams);
            }
          }
        });
    } else {
      this.notificationService.snackBarErrorMessage('Please select a shop');
    }
  }

  addOrUpdateCategory(isEdit = false, category = null) {
    this.dialog.open(AddCustomerCategoryComponent, {data: {isEdit: isEdit, category: category}})
    .afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
      }
    });
  }
  addOrUpdateDiscount(isEdit = false, discount = null) {
    this.dialog.open(AddCustomerDiscountComponent, {data: {isEdit: isEdit, category: discount}})
    .afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
      }
    });
  }
  addOrUpdateCustomer(isEdit = false, customer = null) {
    this.dialog.open(AddCustomerComponent, {data: {isEdit: isEdit, customer: customer}})
    .afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.getMyCustomers({shop_id: this.storeId});
      }
    });
  }
  viewCustomerDetail(customer) {
    this.router.navigate(['/customers/', customer.id, customer.name]);
    // console.log(customer)
    localStorage.setItem('customer', JSON.stringify(customer));
  }

}
