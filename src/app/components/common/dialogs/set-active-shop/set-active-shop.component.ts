import { AuthService } from 'src/app/services/auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ShopsService } from 'src/app/services/network-calls/shops.service';

@Component({
  selector: 'app-set-active-shop',
  templateUrl: './set-active-shop.component.html',
  styleUrls: ['./set-active-shop.component.scss']
})
export class SetActiveShopComponent implements OnInit {
  dialogTitle = 'select the shop you want to start selling with'
  myShops = [];
  isProcessing = false;
  shopFormCtrl = new FormControl('', [Validators.required]);
  constructor(
    private shopsService: ShopsService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<SetActiveShopComponent>
  ) { }

  ngOnInit() {
    this.getMyShops();
    if (this.authService.getActiveShop !== null && this.authService.getActiveShop !== undefined) {
      const shop = JSON.parse(this.authService.getActiveShop);
      this.shopFormCtrl.setValue(shop.id);
    }
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
  onSetActive(shop) {
    this.authService.setActiveShop(shop).then(value => {
      this.dialogRef.close(shop)
    });
  }
  onClose() {
    this.dialogRef.close(null);
  }

}
