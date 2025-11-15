import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { PaymentsDialogComponent } from '../payments-dialog/payments-dialog.component';

@Component({
  selector: 'app-subscription-due-dialog',
  templateUrl: './subscription-due-dialog.component.html'
})
export class SubscriptionDueDialogComponent implements OnInit {

  pageHeaderOptions: IPageHeader;
  isProcessing = false;
  requestPayload = {};
  storeId: string;
  shopInfo;
  premiumPlans = [];
  isProcessingShops: boolean;
  currentPremiumPlan: any;

  constructor(
    private shopsService: ShopsService,
    private dialog: MatDialog,
    ) { }

  ngOnInit() {
    // tslint:disable-next-line:max-line-length
    this.pageHeaderOptions = { pageTitle: 'Subscription Due Message', hasShopsFilter: true, ignoreFilterByAllShops: true, hideFilterPanel: true };
    this.getPremiumPlans();

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
        this.currentPremiumPlan = this.shopInfo.premium_plan;
      }

    });
  }
/**
 *Get all premium plans that applies to a shop
 */
getPremiumPlans() {
    this.isProcessingShops = true;
    this.shopsService.getMallPremiumPlans((error, result) => {
      this.isProcessingShops = false;
      if (result !== null && result.response_code === '100') {
        this.premiumPlans = result.results;
      }
    });
  }

  payPremiumNow(plan) {
    this.dialog.open(PaymentsDialogComponent, {data: {premium_plan: plan, shop: this.shopInfo}}).afterClosed().subscribe();
  }

}
