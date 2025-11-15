import { PaymentRequestTypesEnums } from './../../../../utils/enums';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { AppUtilsService } from 'src/app/services/app-utils.service';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { EditPaymentRequestDialogComponent } from '../dialog/edit-payment-request-dialog/edit-payment-request-dialog.component';

@Component({
  selector: 'app-all-payments-requests',
  templateUrl: './all-payments-requests.component.html'
})
export class AllPaymentsRequestsComponent implements OnInit {
  pageHeaderOptions: IPageHeader;
  isProcessing = false;
  storeId: string;
  shopInfo;
  totalPage = 0;
  nextPage = '';
  prevPage = '';
  requestPayload = {};
  isProcessingShops: boolean;
  paymentRequests = []
  paymentRequestDetail;
  redirectUrl = '';
  paymentRequestTitle = 'My Payment Requests'
  requestTypes = PaymentRequestTypesEnums;

  constructor(
    private shopsService: ShopsService,
    private appUtils: AppUtilsService,
    private dialog: MatDialog
    ) { }

  ngOnInit() {
    // tslint:disable-next-line:max-line-length
    this.pageHeaderOptions = { pageTitle: 'Payment Requests', hasShopsFilter: true, ignoreFilterByAllShops: true, hideFilterPanel: false };
    this.getPaymentRequests()
  }

  getPaymentRequests() {
    this.isProcessing = true;
    this.shopsService.getPaymentRequests((error, result) => {
      this.isProcessing = false;
      if (result !== null && result !== undefined && result.response_code === "100") {
        this.paymentRequests = result.results;
        this.prevPage = result.previous;
        this.nextPage = result.next;
        this.totalPage = result.count;
      }
    }); 
  }
  /**
   * On page changed
   * @param result result after page changed
   */
  onPageChanged(result) {
    this.paymentRequests = result.results;
    this.prevPage = result.previous;
    this.nextPage = result.next;
    this.totalPage = result.count;
  }
  
  editPaymentRequest(paymentRequest, isEdit=true){
    this.dialog.open(EditPaymentRequestDialogComponent, { data: { paymentRequest: paymentRequest } }).afterClosed()
    .subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.getPaymentRequests();
      }
    });
  }

  onViewRequest(paymentRequest) {
    this.paymentRequestDetail = paymentRequest;
  }
  paymentRequestStatusCssClass(status) {
    return this.appUtils.replaceWhitespaceWithHyphen(status).toLowerCase();
  }

}
