import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { AuthService } from 'src/app/services/auth.service';
import { SuppliersApiCallsService } from 'src/app/services/network-calls/suppliers-api-calls.service';
import { AddSupplierComponent } from '../add-supplier/add-supplier.component';

@Component({
  templateUrl: './suppliers-list-dialog.component.html'
})
export class SuppliersListDialogComponent implements OnInit {

  isProcessing = false;
  suppliers = [];
  tempSuppliers = [];
  storeId: string;
  shop;
  searchInputControl: FormControl = new FormControl('');
  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<SuppliersListDialogComponent>,
    private authService: AuthService,
    private suppliersApiCallsService: SuppliersApiCallsService
  ) { }

  ngOnInit() {
    this.searchInputControl.valueChanges.subscribe((searchT: string) => {
      const searchTerm = searchT.toLowerCase();
      if (searchTerm === null || searchTerm === undefined || searchTerm === '') {
        this.suppliers = this.tempSuppliers;
      } else {
        this.suppliers = this.tempSuppliers.filter(supplier => ((supplier.name !== null && supplier.name !== undefined) ? supplier.name as string : '').toLowerCase().indexOf(searchTerm) >= 0 || ((supplier.phone_number !== null && supplier.phone_number !== undefined) ? supplier.phone_number as string : '').toLowerCase().indexOf(searchTerm) >= 0)
      }
    });
    if (this.authService.getActiveShop !== null && this.authService.getActiveShop !== undefined) {
      this.shop = JSON.parse(this.authService.getActiveShop);
      this.storeId = this.shop.id;
      this.getMySuppliers({ shop_id: this.storeId });
    }
  }
  onSelectSupplier(supplier) {
    this.dialogRef.close(supplier);
  }
  onClose() {
    this.dialogRef.close(null);
  }
 /**
  * Get my products
  * @param filterData IDashboardFilterParams interface
  */
  getMySuppliers(filterData: IDashboardFilterParams) {
    this.isProcessing = true;
    this.suppliersApiCallsService.getSuppliers(filterData, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        this.suppliers = result.results;
      }
    });
  }
  addSupplier(isEdit = false, supplier = null) {
    this.dialog.open(AddSupplierComponent, {data: {isEdit: isEdit, supplier: supplier}})
    .afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.getMySuppliers({shop_id: this.storeId});
      }
    });
  }

}