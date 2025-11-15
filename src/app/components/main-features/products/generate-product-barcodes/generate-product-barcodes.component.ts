import { NotificationsService } from 'src/app/services/notifications.service';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { GenerateProductBarcodesParamsComponent } from './../generate-product-barcodes-params/generate-product-barcodes-params.component';
import { MatDialog } from '@angular/material/dialog';
import { RequestMethds } from './../../../../utils/enums';
import { ProductsService } from './../../../../services/network-calls/products.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-generate-product-barcodes',
  templateUrl: './generate-product-barcodes.component.html',
  styleUrls: ['./generate-product-barcodes.component.scss']
})
export class GenerateProductBarcodesComponent implements OnInit {
  pageHeaderOptions: IPageHeader;
  storeId = '';
  requestPayload = {};
  shopProducts = [];
  productsWithBarcodes = [];
  productsWithoutBarcodes = [];
  requestMethod: RequestMethds = RequestMethds.POST;
  isProcessing: boolean;
  isProcessingMore = false;
  isSingleProduct = false;
  numberOfBarcodesForASingleProduct = 0;
  graphOverviewObservable: Observable<any>;
  count = 0;
  numbers = [];
  productDetail;
  nextPageUrl = '';
  searchFormControl = new FormControl;
  elementType: 'url' | 'canvas' | 'img' = 'url';
  constructor(
    private title: Title,
    private constantValues: ConstantValuesService,
    private productsService: ProductsService,
    private notificationService: NotificationsService,
    private dataProvider: DataProviderService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.title.setTitle(this.constantValues.APP_NAME + ' | Preview Product Barcodes');
    // tslint:disable-next-line:max-line-length
    this.pageHeaderOptions = { pageTitle: 'Preview Product Barcodes', hasShopsFilter: true };
    this.searchFormControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.searchMyProducts(searchTerm);
    });
    this.getMyProducts({ shop_id: '' });
  }
  /**
   * Update shared data
   * @param data ISharedData
   */
  onDataRefreshed(data: ISharedData) {
    if (data !== null && data !== undefined) {
      this.storeId = data.shop_id;
      this.requestPayload = { shop_id: data.shop_id };
      // tslint:disable-next-line:max-line-length
      this.getMyProducts({ shop_id: data.shop_id });
    }
  }
  getMyProducts(filterParams) {
    this.isProcessing = true;
    this.productsService.getMyProducts(filterParams, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        this.shopProducts = [];
        this.shopProducts = result.results;
        this.nextPageUrl = result.next;
        this.count = result.count;
        this.productsWithBarcodes = this.getAllProductsWithBarcodes;
      }
    });
  }
  /**
      *Load more data for next page urls
      */
  loadMoreData() {
    if (this.nextPageUrl === null || this.nextPageUrl === '' || this.nextPageUrl === undefined ) {
      return;
    }
    this.isProcessingMore = true;
    this.dataProvider.httpPostNextPage(this.nextPageUrl, this.requestPayload).subscribe(result => {
      this.isProcessingMore = false;
      if (result !== null && result !== '' && result !== undefined) {
        const newData: any[] = result.results;
        const old = this.shopProducts.concat(newData);
        this.shopProducts = old;
        this.nextPageUrl = result.next;
        this.count = result.count;
        this.productsWithBarcodes = this.getAllProductsWithBarcodes;
      }
    }, error => {
      this.isProcessingMore = false;
        this.notificationService.snackBarErrorMessage(error.detail);
    });
  }
    /**
  * Search my products
  * @param searchText search term
  */
 searchMyProducts(searchText) {
  this.isProcessing = true;
  this.requestPayload = { shop_id: this.storeId, search_text: searchText };
  this.dataProvider.getAll(this.constantValues.SEARCH_PRODUCTS_ENDPOINT, this.requestPayload)
    .subscribe(result => {
      this.isProcessing = false;
      if (result.response_code === '100') {
        this.shopProducts = result.results;
        this.nextPageUrl = result.next;
        this.count = result.count;
        this.productsWithBarcodes = this.getAllProductsWithBarcodes;
      }
    }, error => {
      this.isProcessing = false;
      this.notificationService.snackBarErrorMessage(error.detail);
    });
}
  /**
   * Get all products with barcodes
   */
  get getAllProductsWithBarcodes() {
    // tslint:disable-next-line: max-line-length
    return this.shopProducts.filter(data => (data.serial_number !== null && data.serial_number !== '' && data.serial_number !== undefined));
  }
  /**
   * Configure the number of barcodes to generate for a single product
   * @param product product selected
   */
  configureBarcodeGeneration(product) {
    this.productDetail = product;
    this.count = 0;
    this.dialog.open(GenerateProductBarcodesParamsComponent, { data: { product: product }, autoFocus: false })
      .afterClosed().subscribe(data => {
        if (data !== null) {
          this.isSingleProduct = true;
          const numberOfBarcodes = +data.number_of_barcodes;
          this.numbers = Array.from(Array(numberOfBarcodes)).map((x, i) => i);
          this.count = 1;
        }
      });
  }
  /**
* Export order detail as PDF Document
*/
  exportAsPDF() {
    window.print();
    this.count = 2;
  }
}
