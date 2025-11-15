import { Component, OnInit, Inject } from '@angular/core';
import { ProductsService } from 'src/app/services/network-calls/products.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-products-of-a-group',
  templateUrl: './products-of-a-group.component.html',
  styleUrls: ['./products-of-a-group.component.scss']
})
export class ProductsOfAGroupComponent implements OnInit {
isProcessing = false;
productGroupId = '';
productGroup;
shopId = '';
products = [];
  constructor(
    private productsService: ProductsService,
    private notificationService: NotificationsService,
    private dialogRef: MatDialogRef<ProductsOfAGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    if (this.data !== null && this.data !== undefined) {
      this.productGroupId = this.data.product_group.id;
      this.shopId = this.data.product_group.myshop.id;
      this.productGroup = this.data.product_group;
      this.getProducts();
    }
  }
  getProducts() {
    this.isProcessing = true;
    this.productsService.prouctsOfAProductGroup(this.productGroupId, this.shopId, (error, result) => {
      this.isProcessing = false;
      if (result !== null) {
        this.products = result.results;
      }
    });
  }
}
