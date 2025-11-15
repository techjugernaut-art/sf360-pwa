import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationsService } from './../../../../services/notifications.service';
import { OrdersApiCallsService } from './../../../../services/network-calls/orders-api-calls.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-change-mall-order-status-dialog',
  templateUrl: './change-mall-order-status-dialog.component.html',
  styleUrls: ['./change-mall-order-status-dialog.component.scss']
})
export class ChangeMallOrderStatusDialogComponent implements OnInit {
  formGroup: FormGroup;
  isProcessing = false;
  mallOrderId = '';
  shopId = '';
  orderItems = [];

  constructor(
    private ordersService: OrdersApiCallsService,
    private notificationService: NotificationsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ChangeMallOrderStatusDialogComponent>
  ) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      order_item_ids: new FormArray([], [Validators.required]),
      shop_id: new FormControl('')
    });
    if (this.data !== null && this.data !== undefined) {
      this.mallOrderId = this.data.order.id;
      this.shopId = this.data.order.myshop.id;
      this.orderItems = this.data.order.shop_mall_items;
      this.orderItems.forEach(el => {
        this.order_item_ids.push(new FormGroup({
          id: new FormControl(el.id),
          status: new FormControl(el.status, [Validators.required]),
          quantity: new FormControl(el.quantity),
          selling_price: new FormControl(el.my_product.selling_price),
          subtotal: new FormControl(el.subtotal),
          currency: new FormControl(el.my_product.currency),
          item: new FormControl(el.my_product.name),
          image: new FormControl(el.my_product.image)
        }));
      });
    }
  }

  onSubmit(detail) {
    if (this.formGroup.valid) {
      const completedate: any[] = detail.order_item_ids;
      const statuses = [];
      completedate.forEach(el => {
        statuses.push(el.id + ':' + el.status);
      });
      const data = { mall_order_id: this.mallOrderId, shop_id: this.shopId, order_item_ids: statuses.join(',') };

      this.isProcessing = true;
      this.ordersService.updateMallOrderStatus(data, (error, result) => {
        this.isProcessing = false;
        if (result !== null) {
          this.notificationService.snackBarMessage('Mall Order Status successfully updated');
          this.dialogRef.close(true);
        }
      });
    }
  }
  get order_item_ids() { return this.formGroup.get('order_item_ids') as FormArray; }
}
