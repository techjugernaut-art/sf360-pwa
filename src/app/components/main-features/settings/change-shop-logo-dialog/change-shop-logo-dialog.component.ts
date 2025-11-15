import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ShopDataUpdateDilaogComponent } from '../dialog/shop-data-update-dilaog/shop-data-update-dilaog.component';

@Component({
  selector: 'app-change-shop-logo-dialog',
  templateUrl: './change-shop-logo-dialog.component.html',
  styleUrls: ['./change-shop-logo-dialog.component.scss']
})
export class ChangeShopLogoDialogComponent implements OnInit {
  formGroup: FormGroup;
  isProcessing = false;
  shopInfo;
  imageUrl = '';
  editStockModalTitle = 'Change Shop Logo';
  constructor(
    private notificationsService: NotificationsService,
    private dialogRef: MatDialogRef<ShopDataUpdateDilaogComponent>,
    private shopsService: ShopsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      shop_id: new FormControl(''),
      logo: new FormControl()
    });

    if (this.data !== null && this.data !== undefined) {
      this.shopInfo = this.data.shop;
      this.shop_id.setValue(this.shopInfo.id);
    }
  }

  /**
   * Get shop information by a particular shop id
   * @param data payload to submit to server
   */
  onSubmit(data) {
    data.shop_id = this.shopInfo.id;
    this.isProcessing = true;
    this.shopsService.updateShopLogo(data, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        this.notificationsService.snackBarMessage('Shop logo successfully updated');
        this.dialogRef.close(result.results);
      }

    });
  }

  onClose() {
    this.dialogRef.close(null);
  }


  get logo() { return this.formGroup.get('logo'); }
  get shop_id() { return this.formGroup.get('shop_id'); }
}
