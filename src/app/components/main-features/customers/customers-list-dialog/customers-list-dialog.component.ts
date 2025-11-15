import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CustomerApiCallsService } from 'src/app/services/network-calls/customer-api-calls.service';
import { CustomerFilterByEnum } from 'src/app/utils/enums';
import { AddCustomerComponent } from '../add-customer/add-customer.component';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-customers-list-dialog',
  templateUrl: './customers-list-dialog.component.html'
})
export class CustomersListDialogComponent implements OnInit {
  isProcessing = false;
  customers = [];
  tempCustomers = [];
  storeId: string;
  shop;
  searchInputControl: FormControl = new FormControl('');
  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<CustomersListDialogComponent>,
    private authService: AuthService,
    private customerApiService: CustomerApiCallsService
  ) { }

  ngOnInit() {
    this.searchInputControl.valueChanges.subscribe((searchT: string) => {
      const searchTerm = searchT.toLowerCase();
      if (searchTerm === null || searchTerm === undefined || searchTerm === '') {
        this.customers = this.tempCustomers;
      } else {
        this.customers = this.tempCustomers.filter(customer => ((customer.name !== null && customer.name !== undefined) ? customer.name as string : '').toLowerCase().indexOf(searchTerm) >= 0 || ((customer.phone_number !== null && customer.phone_number !== undefined) ? customer.phone_number as string : '').toLowerCase().indexOf(searchTerm) >= 0)
      }
    });
    if (this.authService.getActiveShop !== null && this.authService.getActiveShop !== undefined) {
      this.shop = JSON.parse(this.authService.getActiveShop);
      this.storeId = this.shop.id;
      this.getCustomers({ shop_id: this.storeId });
    }
  }
  onSelectCustomer(customer) {
    this.dialogRef.close(customer);
  }
  onClose() {
    this.dialogRef.close(null);
  }
  getCustomers(filterParam: IDashboardFilterParams) {
    this.isProcessing = true;
    this.customerApiService.getCustomers(filterParam, CustomerFilterByEnum.ALL, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        this.customers = result.results;
        this.tempCustomers = result.results;
      }
    });
  }
  addOrUpdateCustomer(isEdit = false, customer = null) {
    this.dialog.open(AddCustomerComponent, {data: {isEdit: isEdit, customer: customer}})
    .afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.getCustomers({shop_id: this.storeId});
      }
    });
  }

}
