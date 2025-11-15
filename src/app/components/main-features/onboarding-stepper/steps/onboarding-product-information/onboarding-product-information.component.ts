import { ConfirmDialogComponent } from './../../../../common/dialogs/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { EditProductComponent } from './../../../products/edit-product/edit-product.component';
import { NewProductComponent } from './../../../products/new-product/new-product.component';
import { MatDialog } from '@angular/material/dialog';
import { ConstantVariables } from 'src/app/utils/enums.util';
import { ProductsService } from './../../../../../services/network-calls/products.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-onboarding-product-information',
  templateUrl: './onboarding-product-information.component.html',
  styleUrls: ['./onboarding-product-information.component.scss']
})
export class OnboardingProductInformationComponent implements OnInit {
  isProcessing = false;
  products = [];
  constructor(
    private productsService: ProductsService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.isProcessing = true;
    this.productsService.getMyProductsFromRemoteOnly({shop_id: localStorage.getItem(ConstantVariables.SHOP_ID)}, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        this.products = result.results;
      }
    });
  }
  onAddProduct() {
    // tslint:disable-next-line: max-line-length
    this.dialog.open(EditProductComponent, {data: {shop_id: localStorage.getItem(ConstantVariables.SHOP_ID), is_onboarding: true}})
    .afterClosed().subscribe((isSuccessful: boolean) => {
      if (isSuccessful) {
        this.getProducts();
      }
    });
  }
  onSkip() {
    if (this.products.length > 0) {
      this.router.navigate(['/onboarding/mall-template'], {queryParams: {step: 5}});
    } else {
      this.dialog.open(ConfirmDialogComponent, {data: {title: 'Are you sure?', message: 'Uploading products will make your shop be listed on SF Mall and your prodcts will be available for customers to buy.', btnText: 'Yes, Skip'}})
      .afterClosed().subscribe((isYes: boolean) => {
        if (isYes) {
          this.router.navigate(['/onboarding/mall-template'], {queryParams: {step: 5}});
        }
      });
    }
  }
}
