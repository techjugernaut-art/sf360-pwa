import { FormControl, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-select-shop',
  templateUrl: './select-shop.component.html',
  styleUrls: ['./select-shop.component.scss']
})
export class SelectShopComponent implements OnInit {
  modalTitle = 'Select Shop';
  shop_id: FormControl = new FormControl('', [Validators.required]);
  isProcessing = false;
  myShops = [];
  shopFormCtrl = new FormControl('', [Validators.required]);

  constructor(
    private dialogRef: MatDialogRef<SelectShopComponent>,
    private shopsService: ShopsService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
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
