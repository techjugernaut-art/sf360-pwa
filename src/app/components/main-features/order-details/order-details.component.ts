import { NotificationsService } from 'src/app/services/notifications.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { DataProviderService } from 'src/app/services/data-provider.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
orderSlug;
  isProcessing: boolean;
  orderDetail;
  myItems = [];
  vatValue = 0;
  constructor(
    private route: ActivatedRoute,
    private constantValues: ConstantValuesService,
    private dataProvider: DataProviderService,
    private notificationService: NotificationsService
  ) { }

  ngOnInit() {
    this.orderSlug = this.route.snapshot.queryParams.id;
    this.getOrder(this.orderSlug);
  }
/**
   * Get order detail
   * @param id order base 64 id
   */
  getOrder(id) {
      this.isProcessing = true;
      this.dataProvider.resouresCreateNoToken(this.constantValues.GET_ORDER_ENDPOINT, {order_id: id}).subscribe(result => {
        this.isProcessing = false;
        if (result.response_code === '100') {
          this.orderDetail = result.results;
          this.myItems = result.results.myitems;
          // tslint:disable-next-line:max-line-length
          this.vatValue = parseFloat(this.orderDetail.gross_total) - (parseFloat(this.orderDetail.discount) + parseFloat(this.orderDetail.total_amount));
        }
      }, error => {
        this.isProcessing = false;
        this.notificationService.error(this.constantValues.APP_NAME, error.detail);
      });
    }
}
