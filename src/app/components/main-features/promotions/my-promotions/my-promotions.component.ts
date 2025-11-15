import { Router } from '@angular/router';
import { PromoCodeUsageEnum } from 'src/app/utils/enums';
import { AddPromotionComponent } from './../add-promotion/add-promotion.component';
import { Component, OnInit } from '@angular/core';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { MatDialog } from '@angular/material/dialog';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { ITableHeaderActions } from 'src/app/interfaces/table-header-actions.interace';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerApiCallsService } from 'src/app/services/network-calls/customer-api-calls.service';

@Component({
  selector: 'app-my-promotions',
  templateUrl: './my-promotions.component.html',
  styleUrls: ['./my-promotions.component.scss']
})
export class MyPromotionsComponent implements OnInit {
  pageHeaderOptions: IPageHeader;
  isProcessing = false;
  customerDiscounts = [];
  totalPage = 0;
  nextPage = '';
  prevPage = '';
  requestPayload = {};
  tableHeaderOption: ITableHeaderActions;
  productDetail;
  myShops = [];
  storeId: string;
  searchTerm = '';
  isPartner = false;
  productsSearched: boolean;
  shopProductsToDownload = [];
  promoCodeUsageTypes = PromoCodeUsageEnum;
  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private customersService: CustomerApiCallsService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.isPartner = this.authService.isPartner;
    this.tableHeaderOption = { hasSearch: false, searchPlaceholder: 'Search Promotions' };
    this.pageHeaderOptions = { pageTitle: 'Promotions', hasShopsFilter: true };
    this.getPromotions({ shop_id: '' });
  }
/**
   * Update shared data
   * @param data ISharedData
   */
  onDataRefreshed(data: ISharedData) {
    if (data !== null && data !== undefined) {
      this.storeId = data.shop_id;
      // tslint:disable-next-line:max-line-length
      this.getPromotions({ shop_id: data.shop_id });
    }
  }
  /**
  * Get online shop promotions
  * @param filterData IDashboardFilterParams interface
  */
 getPromotions(filterData: IDashboardFilterParams) {
  this.productsSearched = false;
  this.isProcessing = true;
  this.requestPayload = filterData;
  this.customersService.filterPromotions(filterData, (error, result) => {
    this.isProcessing = false;
    if (result !== null && result !== undefined && result.response_code === '100') {
      this.customerDiscounts = result.results;
      this.prevPage = result.previous;
      this.nextPage = result.next;
      this.totalPage = result.count;
    }
  });
}

  addOrUpdateDiscount(isEdit = false, category = null) {
    this.dialog.open(AddPromotionComponent, {data: {isEdit: isEdit, category: category}})
    .afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.getPromotions(this.requestPayload as IDashboardFilterParams);
      }
    });
  }

/**
  * Search my units
  * @param searchText search term
  */
 onSearch(searchText, downloadData: boolean = false) {

}
/**
 * On page changed
 * @param result result after page changed
 */
onPageChanged(result) {
  this.customerDiscounts = result.results;
  this.prevPage = result.previous;
  this.nextPage = result.next;
  this.totalPage = result.count;
}
/**
 * View Promtion detail
 * @param id promo id
 */
viewPromotionDetail(id, name, shopid) {
  this.router.navigate(['/settings/online-store/promotions/', id, shopid, name]);
}

}
