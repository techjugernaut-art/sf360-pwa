import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { PaymentsDialogComponent } from '../payments-dialog/payments-dialog.component';

@Component({
  selector: 'app-online-shop-premium-plans',
  templateUrl: './online-shop-premium-plans.component.html',
  styleUrls: ['./online-shop-premium-plans.component.scss']
})
export class OnlineShopPremiumPlansComponent implements OnInit {

  pageHeaderOptions: IPageHeader;
  isProcessing = false;
  requestPayload = {};
  storeId: string;
  shopInfo;
  onFreeTrial;
  premiumPlans;
  isProcessingShops: boolean;
  currentPremiumPlan;
  desc;
  constructor(
    private shopsService: ShopsService,
    private dialog: MatDialog,
    ) { }

  ngOnInit() {
    
    // tslint:disable-next-line:max-line-length
    this.pageHeaderOptions = { pageTitle: 'Storefront Subscription Plans', hasShopsFilter: true, ignoreFilterByAllShops: true, hideFilterPanel: true };
    // this.getPremiumPlans();
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
    this.dialog.open(PaymentsDialogComponent, 
      {data: {premium_plan: plan, shop: this.shopInfo}})
      .afterClosed().subscribe();
  }
  
}
