import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { PaymentsDialogComponent } from '../payments-dialog/payments-dialog.component';

@Component({
  selector: 'app-subscription-dialog',
  templateUrl: './subscription-dialog.component.html',
  styleUrls: ['./subscription-dialog.component.scss']
})
export class SubscriptionDialogComponent implements OnInit {
  requestPayload: { shop_id: string; };
  storeId: string;
  isProcessing: boolean;
  onFreeTrial: any;
  currentPremiumPlan: any;
  shopInfo: any;
  isProcessingShops: boolean;
  premiumPlans: any;
  desc: any;
  dialogTitle = 'Storefront Subscription Plans'
  constructor(
    private shopsService: ShopsService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.fetchStorefrontPlans();
  }
  /**
   * Update shared data
   * @param data ISharedData
   */
  onDataRefreshed(data: ISharedData) {
    if (data !== null && data !== undefined) {
      // tslint:disable-next-line:max-line-length
      this.requestPayload = { shop_id: data.shop_id };
      this.storeId = data.shop_id;
      this.getShopById(this.requestPayload as IDashboardFilterParams);
    }
  }

  /**
   * Get shop information by a particular shop id
   * @param filterParams filter param
   */
  getShopById(filterParams: IDashboardFilterParams) {
    this.isProcessing = true;
    this.shopsService.getMyShop(filterParams, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        this.shopInfo = result.results[0];
        this.onFreeTrial = this.shopInfo.on_free_trial;
        this.currentPremiumPlan = this.shopInfo.premium_plan;
      }

    });
  }
/**
 *Get all premium plans that applies to a shop
 */
fetchStorefrontPlans(){
  this.shopsService.fetchStorefrontPlans((error, result)=>{
    this.isProcessingShops = false;
    if (result !== null && result.response_code === '100') {
      this.premiumPlans = result.results;

      this.premiumPlans.forEach(element => {
        this.desc = element.description;
       
      });
    }
  });
}
/**
 *Payment for a subscription package
 */
  payPremiumNow(plan) {
    this.dialog.open(PaymentsDialogComponent, {data: {premium_plan: plan, shop: this.shopInfo}})
      .afterClosed().subscribe();
  }
  
}

