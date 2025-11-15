import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { CustomerApiCallsService } from 'src/app/services/network-calls/customer-api-calls.service';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { PaymentsDialogComponent } from '../../premium-payments/payments-dialog/payments-dialog.component';

@Component({
  selector: 'app-sms-topup-dialog',
  templateUrl: './sms-topup-dialog.component.html'
})
export class SmsTopupDialogComponent implements OnInit {
  pageHeaderOptions: IPageHeader;
  isProcessing = false;
  requestPayload = {};
  storeId: string;
  shopInfo;
  premiumPlans = [];
  shops = [];
  isProcessingShops: boolean;
  currentPremiumPlan: any;
  dialogTitle = 'SMS Credit Top Up'
  plan;
  shopId;

  constructor(
    private shopsService: ShopsService,
    private dialog: MatDialog,
    private customerApiCallsService: CustomerApiCallsService,
    private dialogRef: MatDialogRef<SmsTopupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit() {
    this.getSMSPackages(this.shopId)
    this.getShopById(this.shopId) 
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
        this.getSMSPackages(this.storeId);
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
        this.shops = result.results;
        this.shopInfo = result.results[0];
        this.currentPremiumPlan = this.shopInfo.premium_plan;
      }
    });
  }

  payPremiumNow(plan) {
    this.dialog.open(PaymentsDialogComponent, {data: {sms_package: plan, shop: this.shopInfo}}).afterClosed().subscribe();
  }
  getSMSPackages(shopId) {
    this.isProcessing = true;
    this.customerApiCallsService.getSMSPackages(shopId, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        this.premiumPlans = result.results;
      }
    });
  }
  findShopLocally(id) {
    this.shopInfo = this.shops.find(el => el.id.toString() === id.toString());
  }
  onSelectSMSPlan(creditSMS) {
    this.dialogRef.close(creditSMS);
  }
  onClose() {
    this.dialogRef.close(null);
  }
}
