import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/network-calls/products.service';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { NotificationsService } from 'src/app/services/notifications.service';
declare const swal;

@Component({
  selector: 'app-merge-products',
  templateUrl: './merge-products.component.html',
  styleUrls: ['./merge-products.component.scss']
})
export class MergeProductsComponent implements OnInit {
  dupicatedProducts = [];
  isProcessing = false;
  totalCount = 0;
  myShops = [];
  shopId = '';
  message = '';
  constructor(
    private shopsService: ShopsService,
    private dialogRef: MatDialogRef<MergeProductsComponent>,
    private productsService: ProductsService
  ) { }

  ngOnInit() {
    this.getMyShops();
  }
  /**
   * Get all duplicated products of a shop
   * @param shopId shop id
   */
  getDuplicateProducts(shopId) {
    this.shopId = shopId;
    this.isProcessing = true;
    this.productsService.getDuplicateProducts(shopId, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        this.dupicatedProducts = result.results;
        this.totalCount = result.total_count;
      }
    });
  }
  /**
   * Merge all d
   */
  mergeDuplicatedProducts() {
    const self = this;
    swal({
      title: 'Are you sure?',
      text: 'This action will merge ' + self.totalCount + ' proucts.',
      type: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, merge it',
      closeOnConfirm: false,
      showLoaderOnConfirm: true,
      html: true
    }, function (inputValue) {
      if (inputValue) {
        self.productsService.mergeDuplicatedProducts(self.shopId, (error, result) => {
          if (result !== null && result.response_code === '100') {
            swal('Merge Products', result.results, 'success');
            self.getDuplicateProducts(self.shopId);
          }
        });
      }
    });
  }
    /**
   * Get shops of current loged in user
   */
  getMyShops() {
    this.isProcessing = true;
    this.shopsService.getMyShop({ shop_id: '' }, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.status === 'success') {
        this.myShops = result.results;
      }
    });
  }
  onClose() {
    this.dialogRef.close(true);
  }
}
