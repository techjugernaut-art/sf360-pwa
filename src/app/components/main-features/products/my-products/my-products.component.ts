import { GenerateProductPromoCodeUrlQrCodeComponent } from '../generate-product-promo-code-url-qr-code/generate-product-promo-code-url-qr-code.component';
import { SelectShopComponent } from 'src/app/components/common/dialogs/select-shop/select-shop.component';

import { AssignProductsToAGroupComponent } from '../assign-products-to-a-group/assign-products-to-a-group.component';
import { ActivatedRoute } from '@angular/router';
import { EditStockActionsEnums } from 'src/app/utils/enums';
import { IncreaseAndDecreaseStockComponent } from '../increase-and-decrease-stock/increase-and-decrease-stock.component';
import { UpdatePriceListComponent } from '../update-price-list/update-price-list.component';
import { MergeProductsComponent } from '../merge-products/merge-products.component';
import { AuthService } from 'src/app/services/auth.service';
import { UploadProductImageComponent } from '../upload-product-image/upload-product-image.component';
import { RequestMethds } from 'src/app/utils/enums';
import { GlobalDataService } from 'src/app/services/data-access/global-data.service';
import { ProductsService } from 'src/app/services/network-calls/products.service';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, Input } from '@angular/core';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ITableHeaderActions } from 'src/app/interfaces/table-header-actions.interace';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import * as moment from 'moment';
import { datePickerLocales, datePickerRanges } from 'src/app/utils/const-values.utils';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataExportUtilsService } from 'src/app/services/data-export-utils.service';
import { fadeInOutAnimation } from 'src/app/utils/animations.animator';
import { SelectionModel } from '@angular/cdk/collections';
import { EditStockDialogComponent } from 'src/app/components/common/dialogs/edit-stock/edit-stock.component';
import { AppUtilsService } from 'src/app/services/app-utils.service';
declare const swal;

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.scss'],
  animations: [fadeInOutAnimation]
})
export class MyProductsComponent implements OnInit {

  totalSupplierValue = 0;
  totalUnitPriceValue = 0;
  editStockActions = EditStockActionsEnums;
  pageHeaderOptions: IPageHeader;
  isProcessing = false;
  shopProducts =  [];
  shopProductsToDownload = [];
  totalPage = 0;
  nextPage = '';
  prevPage = '';
  requestPayload = {};
  tableHeaderOption: ITableHeaderActions;
  productDetail;
  totalStockValueDetail;
  salesOrders = [];
  productSalesOrdersPrevPage = '';
  productSalesOrdersNextPage = '';
  productSalesOrdersTotalPage = 0;
  productSalesOrdersTotalAmount = 0;
  productSalesOrdersSalesOrdersReports;
  saleOrderDetail;
  salesOrderItems = [];
  locale = datePickerLocales;
  ranges: any = datePickerRanges;
  selectedDate = { start_date: moment(), end_date: moment() };
  increaseOrDecreaseStockFormGroup: FormGroup;
  editStockModalTitle = '';
  myShops = [];
  stockEditAction = 'increase';
  isProcessingEditStock: boolean;
  isProcessingProductImageUpload: boolean;
  storeId: string;
  productsSearched: boolean;
  searchTerm = '';
  isPartner = false;
  productGroupId = '';
  productGroupName = '';
  productGroupStoreId = '';
  hasShopFilter = true;
  isGroupProducts = false;
  pageTitleAndName = 'My Products';
  selection = new SelectionModel<number>(true, []);


  constructor(
    private dataProvider: DataProviderService,
    private notificationService: NotificationsService,
    private dialog: MatDialog,
    private productsService: ProductsService,
    private globalData: GlobalDataService,
    private exportDocs: DataExportUtilsService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private constantValues: ConstantValuesService,
    private appUtils: AppUtilsService
    ) { }

  ngOnInit() {
    this.isPartner = this.authService.isPartner;
    this.route.queryParams.subscribe(param => {
      this.productGroupId = param['gId'];
      this.productGroupName = param['gName'];
      this.productGroupStoreId = param['s'];

      this.hasShopFilter = true;
      this.storeId = '';
      this.isGroupProducts = false;
      this.productsSearched = false;
      this.pageTitleAndName = ' My Products';

      // tslint:disable-next-line: max-line-length
      if (this.productGroupId !== '' && this.productGroupId !== null && this.productGroupId !== undefined && this.productGroupStoreId !== '' && this.productGroupStoreId !== null && this.productGroupStoreId !== undefined) {
        this.hasShopFilter = false;
        this.storeId = this.productGroupStoreId;
        this.isGroupProducts = true;
        this.productsSearched = true;
        this.pageTitleAndName = ' Products of ' + this.productGroupName;
      }
      // this.title.setTitle(this.constantValues.APP_NAME + ' | ' + this.pageTitleAndName);
      this.tableHeaderOption = { hasSearch: true, searchPlaceholder: 'Search product' };
      // tslint:disable-next-line:max-line-length
      this.pageHeaderOptions = { pageTitle: this.pageTitleAndName, hasShopsFilter: this.hasShopFilter };
      if (this.isGroupProducts) {
        this.getProductsOfAGroup({ shop_id: this.productGroupStoreId });
      } else {
        this.getMyProducts({ shop_id: '' });
        this.getTotalStockValue({ shop_id: '' });
      }
    });


    this.increaseOrDecreaseStockFormGroup = new FormGroup({
      shop_id: new FormControl(''),
      quantity: new FormControl('', [Validators.required]),
      product_id: new FormControl('')
    });
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
      // tslint:disable-next-line:max-line-length
      this.getMyProducts({ shop_id: data.shop_id });
      this.getTotalStockValue({ shop_id: data.shop_id });
    }
  }
  searchProducts(term) {
    this.selection.clear();
    if (term !== '' && term !== null && term !== '') {
      this.searchMyProducts(term, false);
    } else {
      if (!this.isGroupProducts) {
        this.getTotalStockValue(this.requestPayload as IDashboardFilterParams);
      this.getMyProducts(this.requestPayload as IDashboardFilterParams);
      } else {
        this.getProductsOfAGroup({ shop_id: this.productGroupStoreId });
      }
    }
  }
  /**
  * Get my products
  * @param filterData IDashboardFilterParams interface
  */
  getMyProducts(filterData: IDashboardFilterParams, downloadData: boolean = false) {
    this.selection.clear();
    this.requestPayload = filterData;
    this.productsSearched = false;
    this.isProcessing = true;
    this.productsService.getMyProductsFromRemoteOnly(filterData, (error, result) => {
      this.isProcessing = false;
      if (result !== null) {
        this.shopProducts = result.results;
        this.prevPage = result.previous;
        this.nextPage = result.next;
        this.totalPage = result.count;
        if (downloadData && (this.nextPage !== null && this.nextPage !== '' && this.nextPage !== undefined)) {
          this.shopProductsToDownload = result.results;
          this.isProcessing = true;
          this.loadMoreDataToDownload(this.requestPayload, this.nextPage);
        } else if (downloadData && (result.next === null || result.next === '' || result.next === undefined)) {
          this.shopProductsToDownload = result.results;
          this.isProcessing = false;
          this.exportDocs.exportProductsAsCSV(this.shopProductsToDownload);
        }
      }
    });
  }
  getProductsOfAGroup(filterData: IDashboardFilterParams, downloadData: boolean = false) {
    this.selection.clear();
    this.requestPayload = filterData;
    this.isProcessing = true;
    this.productsService.prouctsOfAProductGroup(this.productGroupId, this.productGroupStoreId, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result !== undefined && result.response_code === '100') {
        this.shopProducts = result.results;
        this.prevPage = result.previous;
        this.nextPage = result.next;
        this.totalPage = result.count;
        if (downloadData && this.nextPage !== null && this.nextPage !== '' && this.nextPage !== undefined) {
          this.shopProductsToDownload = result.results;
          this.isProcessing = true;
          this.loadMoreDataToDownload(filterData, this.nextPage);
        } else if (downloadData && result.next === null || result.next === '' || result.next === undefined) {
          this.shopProductsToDownload = result.results;
          this.isProcessing = false;
          this.exportDocs.exportProductsAsCSV(this.shopProductsToDownload);
        }
      }
    });
  }
  /**
* Get Total StockV alue
* @param filterData IDashboardFilterParams interface
*/
  getTotalStockValue(filterData: IDashboardFilterParams) {
    // this.isProcessing = true;
    this.productsService.getTotalStockValue(filterData, (error, result) => {
      // this.isProcessing = false;
      if (result !== null && result !== undefined && result.response_code === '100') {
        this.totalStockValueDetail = result ;
        this.formatValue();
      }
    });
  }
  /**
* Get my product by id
* @param filterData IDashboardFilterParams interface
*/
  getMyProductById(productId) {
    this.isProcessing = true;
    this.dataProvider.httpGetAll(this.constantValues.GET_PRODUCTS_ENDPOINT + productId + '/')
      .subscribe(result => {
        this.isProcessing = false;
        if (result.response_code === '100') {
          this.shopProducts = result.results;
          this.prevPage = result.previous;
          this.nextPage = result.next;
          this.totalPage = result.count;
        }
      }, error => {
        this.isProcessing = false;
        this.notificationService.snackBarErrorMessage(error.detail);
      });
  }
  /**
  * Search my products
  * @param searchText search term
  */
  searchMyProducts(searchText, downloadData: boolean = false) {
    if (!this.isGroupProducts) {
      this.productsSearched = true;
    this.isProcessing = true;
    this.requestPayload = { shop_id: this.storeId, search_text: searchText };
    this.searchTerm = searchText;
    this.productsService.searchMyProducts(this.requestPayload, (error, result) => {
      this.isProcessing = false;
      if ((result !== null && result !== undefined) && result.response_code === '100') {
        this.shopProducts = result.results;
        this.prevPage = result.previous;
        this.nextPage = result.next;
        this.totalPage = result.count;
        if (downloadData && (this.nextPage !== null && this.nextPage !== '' && this.nextPage !== undefined)) {
          this.shopProductsToDownload = result.results;
          this.isProcessing = true;
          this.loadMoreDataToDownload(this.requestPayload, this.nextPage);
        } else if (downloadData && (result.next === null || result.next === '' || result.next === undefined)) {
          this.shopProductsToDownload = result.results;
          this.isProcessing = false;
          this.exportDocs.exportProductsAsCSV(this.shopProductsToDownload);
        }
      }
    });
    } else {
    this.isProcessing = true;
    this.requestPayload = { shop_id: this.storeId, search_text: searchText };
    this.searchTerm = searchText;
    this.productsService.searchProuctsOfAProductGroup(this.productGroupId, this.requestPayload, (error, result) => {
      this.isProcessing = false;
      if ((result !== null && result !== undefined) && result.response_code === '100') {
        this.shopProducts = result.results;
        this.prevPage = result.previous;
        this.nextPage = result.next;
        this.totalPage = result.count;
        if (downloadData && (this.nextPage !== null && this.nextPage !== '' && this.nextPage !== undefined)) {
          this.shopProductsToDownload = result.results;
          this.isProcessing = true;
          this.loadMoreDataToDownload(this.requestPayload, this.nextPage);
        } else if (downloadData && (result.next === null || result.next === '' || result.next === undefined)) {
          this.shopProductsToDownload = result.results;
          this.isProcessing = false;
          this.exportDocs.exportProductsAsCSV(this.shopProductsToDownload);
        }
      }
    });
    }
  }
  /**
   * On page changed
   * @param result result after page changed
   */
  onPageChanged(result) {
    this.shopProducts = result.results;
    this.prevPage = result.previous;
    this.nextPage = result.next;
    this.totalPage = result.count;
  }
  exportAsExcel() {

  }
  /**
   * Init Edit Stock Modal
   * @param product product to edit
   * @param action stock edit aciton to perform (increase/decrease)
   */
  editStock(product, action: EditStockActionsEnums) {
    const priceList: any[] = product.price_list;
    if (priceList.length > 0) {
      this.dialog.open(IncreaseAndDecreaseStockComponent, { data: { product: product, action: action } })
      .afterClosed().subscribe((isSuccess: boolean) => {
        if (isSuccess) {
          this.getTotalStockValue(this.requestPayload as IDashboardFilterParams);
          this.getMyProducts(this.requestPayload as IDashboardFilterParams);
        }
      });
    } else {
      this.dialog.open(EditStockDialogComponent, { data: { product: product, action: action } })
      .afterClosed().subscribe((isSuccess: boolean) => {
        if (isSuccess) {
          this.getTotalStockValue(this.requestPayload as IDashboardFilterParams);
          this.getMyProducts(this.requestPayload as IDashboardFilterParams);
        }
      });
    }
  }

  /**
 * Increase/Decrease stock
 * @param detail details for editing stock
 */
  increaseOrDereaseStockForAProduct(detail) {
    if (this.increaseOrDecreaseStockFormGroup.valid) {
      let endpoint = this.constantValues.INCREASE_STOCK_ENDPOINT;
      if (this.stockEditAction === 'decrease') {
        endpoint = this.constantValues.DECREASE_STOCK_ENDPOINT;
      }
      this.isProcessingEditStock = true;
      this.dataProvider.getAll(endpoint, detail)
        .subscribe(result => {
          this.isProcessingEditStock = false;
          document.getElementById('btnCloseEditStockModal').click();
          swal('Edit Stock', 'Stock successfully ' + this.stockEditAction + 'd', 'success');
          this.getMyProducts(this.requestPayload as IDashboardFilterParams);
        }, error => {
          this.isProcessingEditStock = false;
          swal('Edit Stock', error.detail, 'error');
        });
    }
  }


  /**
     * Upload user avatar or company logo
     * @param fileBrowser Image File to upload
     */
  uploadImages(fileBrowser) {
    if (fileBrowser.files.length > 0) {
      const file: File = fileBrowser.files[0];
      const formData = new FormData();

      formData.append('image', file);
      this.isProcessingProductImageUpload = false;
      this.dataProvider.createForFormData(this.constantValues.UPLOAD_ALL_IMAGES_ENDPOINT, formData)
        .subscribe(result => {
          this.isProcessingProductImageUpload = false;
          document.getElementById('previewNationalIdPicture').setAttribute('src', result.image_url);
          this.notificationService.snackBarMessage('Primary Image successfully uploaded');
        }, error => {
          this.isProcessingProductImageUpload = false;
          this.notificationService.snackBarErrorMessage(error.detail);
        });
    }
  }
  editProduct(product) {
    // tslint:disable-next-line: max-line-length
    this.dialog.open(EditProductComponent, { data: { product: product }, autoFocus: false }).afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.getMyProducts(this.requestPayload as IDashboardFilterParams);
      }
    });
  }
  uploadProductImage(product) {
    // tslint:disable-next-line: max-line-length
    this.dialog.open(UploadProductImageComponent, { data: { product: product }, autoFocus: false }).afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.getMyProducts(this.requestPayload as IDashboardFilterParams);
      }
    });
  }
  /**
   * Download products as excel file
   */
  downloadProductsAsExcelFile() {
    if (this.storeId === '' || this.storeId === null || this.storeId === undefined) {
      this.dialog.open(SelectShopComponent).afterClosed().subscribe(shop_id => {
        if (shop_id !== null) {
          this.storeId = shop_id;
          this.downloadProductsAsExcelFile();
        }
      });
    } else {
      if (!this.productsSearched) {
        this.getMyProducts({shop_id: this.storeId}, true);
      } else {
        if (!this.isGroupProducts) {
          this.searchMyProducts(this.searchTerm, true);
        } else {
          this.getProductsOfAGroup({ shop_id: this.productGroupStoreId }, true);
        }
      }
    }
  }
  /**
   * Load more data
   * @param requestPayload Request Payload
   * @param url The url to download data with
   */
  loadMoreDataToDownload(requestPayload, url) {
    this.globalData.loadAllDataWithNextURL(url, RequestMethds.POST, requestPayload, (error, result) => {
      if (result !== null && result !== '' && result !== undefined) {
        const res: any[] = result.results;
        const concatenatedData: any[] = this.shopProductsToDownload.concat(res);
        this.shopProductsToDownload = concatenatedData;
        if (result.next !== null && result.next !== '' && result.next !== undefined) {
          // this.loadMoreDataToDownload(requestPayload, result.next);
        } else {
          this.isProcessing = false;
          this.exportDocs.exportProductsAsCSV(this.shopProductsToDownload);
        }
      }
    });
  }
  /**
   * Display add product dialog
   */
  onAddProduct() {
    if (this.storeId !== '' && this.storeId !== null && this.storeId !== undefined) {
      // tslint:disable-next-line: max-line-length
      this.dialog.open(EditProductComponent, { data: { shop_id: this.storeId, is_onboarding: true } })
        .afterClosed().subscribe((isSuccessful: boolean) => {
          if (isSuccessful) {
            this.getMyProducts(this.requestPayload as IDashboardFilterParams);
          }
        });
    } else {
      this.notificationService.snackBarErrorMessage('Please select a shop');
    }
  }
  /**
   * Show a dialog to merge duplicated products
   */
  onDuplicateProductMerge() {
    this.dialog.open(MergeProductsComponent)
      .afterClosed().subscribe((isSuccessful: boolean) => {
        if (isSuccessful) {
          this.getMyProducts(this.requestPayload as IDashboardFilterParams);
        }
      });
  }
  /**
   * Update Price list of a product
   * @param product product
   */
  changePriceList(product) {
    this.dialog.open(UpdatePriceListComponent, { data: { product: product } })
      .afterClosed().subscribe((isSuccess: boolean) => {
        if (isSuccess) {
          this.getMyProducts(this.requestPayload as IDashboardFilterParams);
        }
      });
  }
   /** Whether the number of selected elements matches the total number of rows. */
   isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.totalPage;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.shopProducts.forEach(row => this.selection.select(row.id));
  }
  removeSelectedProductsFromCategory() {
    if (this.selection.hasValue()) {
      const self = this;
      const payload = {shop_id: this.storeId, product_ids: this.selection.selected.join() };
      swal({
        title: 'Are you sure?',
        text: 'This action will remove selected products from ' + this.productGroupName,
        type: 'info',
        showCancelButton: true,
        confirmButtonText: 'Yes, remove it',
        closeOnConfirm: false,
        showLoaderOnConfirm: true,
        html: true
      }, function (inputValue) {
        if (inputValue) {
          self.productsService.removeProductsFromProductGroup(self.productGroupId, payload, (error, result) => {
            if (result !== null && result.status === 'success') {
              swal('Product Category', 'Products successfully removed', 'success');
              self.getProductsOfAGroup({ shop_id: self.productGroupStoreId });
            }
            if (error !== null) {
              swal('Product Category', error.detail, 'error');
            }
          });
        }
      });
    }
  }
  /**
   * Display add product dialog
   */
  onAssignProductsToProductGroup() {
    if (this.storeId !== '' && this.storeId !== null && this.storeId !== undefined) {
      // tslint:disable-next-line: max-line-length
      this.dialog.open(AssignProductsToAGroupComponent, { data: { shop_id: this.storeId, selected: this.selection.selected } })
        .afterClosed().subscribe((isSuccessful: boolean) => {
          if (isSuccessful) {
            if (this.isGroupProducts) {
              this.getProductsOfAGroup({ shop_id: this.productGroupStoreId });
            } else {
              this.getMyProducts(this.requestPayload as IDashboardFilterParams);
            }
          }
        });
    } else {
      this.notificationService.snackBarErrorMessage('Please select a shop');
    }
  }
  onGenratePromoCodeQR(product) {
    this.dialog.open(GenerateProductPromoCodeUrlQrCodeComponent, {data: {product: product}});
  }
  get shop_id() { return this.increaseOrDecreaseStockFormGroup.get('shop_id'); }
  get quantity() { return this.increaseOrDecreaseStockFormGroup.get('quantity'); }
  get product_id() { return this.increaseOrDecreaseStockFormGroup.get('product_id'); }

  formatValue() {
    if (this.totalStockValueDetail !==undefined && this.totalStockValueDetail !== null) {
      this.totalSupplierValue = this.appUtils.formatStringValue(this.totalStockValueDetail.total_supplier_value);
      this.totalUnitPriceValue = this.appUtils.formatStringValue(this.totalStockValueDetail.total_unit_price_value);
    }
  }
}
