import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { AuthService } from 'src/app/services/auth.service';
import { ProductsService } from 'src/app/services/network-calls/products.service';
import { CustomersListDialogComponent } from '../../customers/customers-list-dialog/customers-list-dialog.component';

@Component({
  selector: 'app-products-list-dialog',
  templateUrl: './products-list-dialog.component.html'
})
export class ProductsListDialogComponent implements OnInit {
  isProcessing = false;
  products = [];
  tempProducts = [];
  storeId: string;
  shop;
  searchInputControl: FormControl = new FormControl('');
  constructor(
    private dialogRef: MatDialogRef<CustomersListDialogComponent>,
    private authService: AuthService,
    private productsService: ProductsService
  ) { }

  ngOnInit() {
    this.searchInputControl.valueChanges.subscribe((searchT: string) => {
      const searchTerm = searchT.toLowerCase();
      if (searchTerm === null || searchTerm === undefined || searchTerm === '') {
        this.products = this.tempProducts;
      } else {
        this.products = this.tempProducts.filter(product => ((product.name !== null && product.name !== undefined) ? product.name as string : '').toLowerCase().indexOf(searchTerm) >= 0)
      }
    });
    if (this.authService.getActiveShop !== null && this.authService.getActiveShop !== undefined) {
      this.shop = JSON.parse(this.authService.getActiveShop);
      this.storeId = this.shop.id;
      this.getProducts({ shop_id: this.storeId });
    }
  }
  onSelectProduct(product) {
    this.dialogRef.close(product);
  }
  onClose() {
    this.dialogRef.close(null);
  }
  getProducts(filterParam: IDashboardFilterParams) {
    this.isProcessing = true;
    this.productsService.getMyProducts(filterParam, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        this.products = result.results;
        this.tempProducts = result.results;
      }
    });
  }

}
