import { ExportDocumentsService } from 'src/app/services/export-documents.service';
import { ConstantValuesService } from './../../../../services/constant-values.service';
import { Router } from '@angular/router';
import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { CustomerApiCallsService } from 'src/app/services/network-calls/customer-api-calls.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-generate-product-promo-code-url-qr-code',
  templateUrl: './generate-product-promo-code-url-qr-code.component.html',
  styleUrls: ['./generate-product-promo-code-url-qr-code.component.scss']
})
export class GenerateProductPromoCodeUrlQrCodeComponent implements OnInit {
  isProcessing = false;
  promos = [];
  promoCodes = [];
  productInfo;
  url = '';
  @ViewChild('child') child: ElementRef;
  promoCode: any;
  constructor(
    private customerApiCalls: CustomerApiCallsService,
    private notificationService: NotificationsService,
    private constantValues: ConstantValuesService,
    private exportDocs: ExportDocumentsService,
    private dialogRef: MatDialogRef<GenerateProductPromoCodeUrlQrCodeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    if (this.data !== null && this.data !== undefined) {
      this.productInfo = this.data.product;
      this.getPromotions({shop_id: this.productInfo.myshop.id});
    }
  }
  /**
  * Get online shop promotions
  * @param filterData IDashboardFilterParams interface
  */
 getPromotions(filterData: IDashboardFilterParams) {
  this.isProcessing = true;
  this.customerApiCalls.filterPromotions(filterData, (error, result) => {
    this.isProcessing = false;
    if (result !== null && result !== undefined && result.response_code === '100') {
      this.promos = result.results;
    }
  });
}
 /**
* Get promotion detail by id
* @param promoId Promo Id
*/
getPromoCodesOfAPromotion(promoId) {
this.isProcessing = true;
this.customerApiCalls.getPromoCodes(promoId, this.productInfo.myshop.id, (error, result) => {
  this.isProcessing = false;
  if (result !== null) {
    this.promoCodes = result;
  }
});
}
generateQR(code) {
  this.url = '';
  this.promoCode = code;
  // tslint:disable-next-line: max-line-length
  this.url = this.constantValues.STOREFRONT_MALL_URL_PROTOCOL + this.productInfo.myshop.storefrontmall_name + '.' + this.constantValues.STOREFRONT_MALL_URL + '/mall/product-detail/' + this.productInfo.slug + '?promoCode=' + code;
  console.log(this.child, this.child.nativeElement.childNodes[0].childNodes);
}
onCopied(e) {
  this.notificationService.snackBarMessage('Copied');
}
exportAsImage() {
  this.exportDocs.exportAsImage('Promo Code QR', 'divQR');
}
}
