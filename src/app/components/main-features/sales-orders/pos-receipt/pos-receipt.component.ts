import { AuthService } from 'src/app/services/auth.service';
import { Component, Input, OnInit } from '@angular/core';
import { AppUtilsService } from 'src/app/services/app-utils.service';

@Component({
  selector: 'app-pos-receipt',
  templateUrl: './pos-receipt.component.html'
})
export class PosReceiptComponent implements OnInit {
@Input() printData;
@Input() currency = '';
@Input() orderItems = [];
url = '';
activeShop;
currentUser;
  constructor(
    private appUtils: AppUtilsService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.activeShop = (this.authService.getActiveShop !== null && this.authService.getActiveShop !== undefined) ? JSON.parse(this.authService.getActiveShop) : null;
    this.currentUser = this.authService.currentUser;
    if (this.printData !== null && this.printData !== undefined) {
      this.url = this.appUtils.generateReceiptUrl(this.printData.shop_id, this.printData.frontend_order_id);
      // console.log(this.orderItems);
    }
  }

}
