import { BroadcastService } from './../../../services/broadcast.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { ProductsService } from 'src/app/services/network-calls/products.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { SetActiveShopComponent } from '../dialogs/set-active-shop/set-active-shop.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'sales-navbar-item',
  templateUrl: './sales-navbar-item.component.html'
})
export class SalesNavbarItemComponent implements OnInit {
  shopId = '';
  shop;
  shopProducts = [];
  tempShopProducts = [];
  isProcessing: Boolean;
  productGroups = [];
  products = [];

  constructor(
    private dialog: MatDialog,
    private notificationService: NotificationsService,
    private broadcastService: BroadcastService,
    private productsService: ProductsService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    if (this.authService.getActiveShop !== null && this.authService.getActiveShop !== undefined) {
      this.shop = JSON.parse(this.authService.getActiveShop);
    }
  }

  onChangeActiveShop() {
    this.dialog.open(SetActiveShopComponent).afterClosed().subscribe(shop => {
      if (shop !== null && shop !== undefined) {
        this.shop = shop;
        this.broadcastService.changeCurrentShop(JSON.stringify(shop));
        this.notificationService.snackBarMessage('Shop Successfully Switched');
      }
    });
  }

  onRefresh(){
    this.broadcastService.onRefreshData();
        this.notificationService.snackBarMessage('Data refreshing');
  }

}
