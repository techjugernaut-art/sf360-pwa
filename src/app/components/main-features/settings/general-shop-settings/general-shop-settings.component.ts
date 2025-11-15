import { VerifyEmailDialogComponent } from './../dialog/verify-email-dialog/verify-email-dialog.component';
import { ShopDataUpdateDilaogComponent } from './../dialog/shop-data-update-dilaog/shop-data-update-dilaog.component';
import { SetReturnPolicyDialogComponent } from 'src/app/components/common/dialogs/set-return-policy-dialog/set-return-policy-dialog.component';
import { SageoneConnectComponent } from './../dialog/sageone-connect/sageone-connect.component';
import { WhatsAppEnableOrDisableActions, ShopEditingAction } from 'src/app/utils/enums';
import { EnableDisableWhatsappCommunicationComponent } from './../dialog/enable-disable-whatsapp-communication/enable-disable-whatsapp-communication.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { ITableHeaderActions } from 'src/app/interfaces/table-header-actions.interace';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { OptInOutEmailReportsComponent } from '../dialog/opt-in-out-email-reports/opt-in-out-email-reports.component';

@Component({
  selector: 'app-general-shop-settings',
  templateUrl: './general-shop-settings.component.html',
  styleUrls: ['./general-shop-settings.component.scss']
})
export class GeneralShopSettingsComponent implements OnInit {

  pageHeaderOptions: IPageHeader;
  isProcessing: boolean;
  requestPayload = {};
  tableHeaderOption: ITableHeaderActions;
  storeId: string;
  shopInfo: any;
  whatsComAction = WhatsAppEnableOrDisableActions;
  shopSettingsEditingActions = ShopEditingAction;

  constructor(
    private shopsService: ShopsService,
    private dialog: MatDialog,
    ) { }

  ngOnInit() {
    this.tableHeaderOption = {};
    // tslint:disable-next-line:max-line-length
    this.pageHeaderOptions = { pageTitle: 'General Shop Settings', hasShopsFilter: true, ignoreFilterByAllShops: true};
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
      }

    });
  }
  /**
   * Enable/Disable WhatsApp Communication
   */
  enableWhatsApp(action: WhatsAppEnableOrDisableActions) {
    // tslint:disable-next-line: max-line-length
    this.dialog.open(EnableDisableWhatsappCommunicationComponent, {data: {shop_id: this.storeId, shop: this.shopInfo, action: action}})
    .afterClosed().subscribe((shopInfo) => {
      if (shopInfo !== null && shopInfo !== undefined) {
        this.shopInfo = shopInfo;
      }
    });
  }

  /**
   * Connect to SageOne Accounting
   */
  connectToSageOne() {
    // tslint:disable-next-line: max-line-length
    this.dialog.open(SageoneConnectComponent, {data: {shop_id: this.storeId}})
    .afterClosed().subscribe((isSuccess: boolean) => {

    });
  }

      /**
   * Update return policy days of a shop
   */
  updateReturnPolicy() {
    // tslint:disable-next-line: max-line-length
    this.dialog.open(SetReturnPolicyDialogComponent, {data: {shop_id: this.storeId}})
    .afterClosed().subscribe((shopInfo) => {
      if (shopInfo !== null && shopInfo !== undefined) {
        this.shopInfo = shopInfo;
      }
    });
  }
   /**
   * Edit shop settins
   */
  editShopSettings(action: ShopEditingAction) {
    // tslint:disable-next-line: max-line-length
    this.dialog.open(ShopDataUpdateDilaogComponent, {data: {shop_id: this.storeId, shop: this.shopInfo, action: action}})
    .afterClosed().subscribe((shopInfo) => {
      if (shopInfo !== null && shopInfo !== undefined) {
        this.shopInfo = shopInfo;
      }
    });
  }
  updateEmailReporting(){
    this.dialog.open( OptInOutEmailReportsComponent, {data: {shop_id: this.shopInfo.id, receive_reports: this.shopInfo.receive_reports, report_frequency: this.shopInfo.report_frequency }})
    .afterClosed().subscribe((shopInfo) => {
      if (shopInfo !== null && shopInfo !== undefined) {
        this.shopInfo = shopInfo;
      }
    });
  }
  verifyEmail(){
    this.dialog.open( VerifyEmailDialogComponent, {data: {shop_id: this.shopInfo.id}})
    .afterClosed().subscribe((shopInfo) => {
      if (shopInfo !== null && shopInfo !== undefined) {
        this.shopInfo = shopInfo;
        console.log(this.shopInfo)

      }
    });
  }

}