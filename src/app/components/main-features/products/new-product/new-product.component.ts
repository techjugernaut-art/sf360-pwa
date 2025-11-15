import { ImageUploadGuidelineComponent } from 'src/app/components/common/image-upload-guideline/image-upload-guideline.component';
import { AddUnitOfMeasurementComponent } from './../add-unit-of-measurement/add-unit-of-measurement.component';
import { AddProductGroupComponent } from './../add-product-group/add-product-group.component';
import { ColorPickerDialogComponent } from 'src/app/components/common/dialogs/color-picker-dialog/color-picker-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, DialogPosition } from '@angular/material/dialog';
import { ProductsService } from 'src/app/services/network-calls/products.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, AbstractControl } from '@angular/forms';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { AppUtilsService } from 'src/app/services/app-utils.service';
import { SharedDataApiCallsService } from 'src/app/services/network-calls/shared-data-api-calls.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import * as moment from 'moment';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { SuppliersApiCallsService } from 'src/app/services/network-calls/suppliers-api-calls.service';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { AddSupplierComponent } from '../../suppliers/add-supplier/add-supplier.component';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss']
})
export class NewProductComponent implements OnInit {
  productInfoFormGroup: FormGroup;
  pricingFormGroup: FormGroup;
  productCategories = [];
  suppliers = [];
  unitsOfMeasurements = [];
  myShops = [];
  shopId = '';
  pageHeaderOptions: IPageHeader;
  isProcessing = false;
  isPartner = false;
  productDetail;
  btnText = 'UPDATE';
  isOnboarding = false;
  isProcessingImageUpload = false;
  imageUrl: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  productTags = [];
  imageOrColorCtrl: FormControl = new FormControl('IMAGE');
  selecteColor = '';
  shopInfo: any;
  baseUnitName = '';
  isBaseUnitSelected = false;
  selectedBaseUnitIndex = 0;
  storeId: string;
  productId = '';
  productName = '';
  isEdit = false;
  vatValues = [];
  currentShop;
  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private authService: AuthService,
    private constantValues: ConstantValuesService,
    private dataProvider: DataProviderService,
    private notificationService: NotificationsService,
    private appUtils: AppUtilsService,
    private bottomSheet: MatBottomSheet,
    private shopsService: ShopsService,
    private dialog: MatDialog,
    private suppliersApiCallsService: SuppliersApiCallsService,
    private sharedDataServiceApi: SharedDataApiCallsService
  ) { }

  ngOnInit() {
    this.isPartner = this.authService.isPartner;
    // tslint:disable-next-line:max-line-length
    this.pageHeaderOptions = { pageTitle: 'Add Product', hasShopsFilter: false, hideFilterPanel: true };
    this.productInfoFormGroup = new FormGroup({
      product_group_id: new FormControl(''),
      shop_id: new FormControl('', [Validators.required]),
      selling_price: new FormControl(0),
      supplier_id: new FormControl(''),
      supplier_price: new FormControl(0),
      new_low_stock_threshold: new FormControl(0),
      image_url: new FormControl(''),
      product_name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      is_service: new FormControl(false),
      product_does_not_expire: new FormControl(false),
      has_unit_measurement: new FormControl(false),
      new_quantity: new FormControl(0),
      expiry_date: new FormControl(''),
      barcode: new FormControl(''),
      serial_number: new FormControl(''),
      vat_value: new FormControl(0),
      vat_inclusive: new FormControl(true),
      apply_vat: new FormControl(false),
      tags: new FormControl(''),
      product_id: new FormControl(''),
      color_code: new FormControl(''),
      is_available_oneline: new FormControl(false),
      price_list: new FormArray([])
    });
    this.pricingFormGroup = new FormGroup({
      data: new FormArray([])
    });
    this.product_does_not_expire.setValue(false);
    this.product_does_not_expire.valueChanges.subscribe((doesNotExpire: boolean) => {
      this.expiry_date.clearValidators();
      this.expiry_date.updateValueAndValidity();
      if (doesNotExpire === false) {
        this.expiry_date.setValidators([Validators.required]);
        this.expiry_date.updateValueAndValidity();
      }
    });


    // this.getVatValues();
    // this.getPromoTags();
    this.imageOrColorCtrl.valueChanges.subscribe(value => {
      this.color_code.setValue('');
      this.image_url.setValue('');
      if (value === 'COLOR') {
        this.color_code.setValue('#026E08');
      }
    });
    this.getMyShops();
    this.productId = this.route.snapshot.params['id'];
    this.productName = this.route.snapshot.params['name'];
    if (this.productId !== null && this.productId !== undefined && this.productId !== '') {
      this.title.setTitle(this.constantValues.APP_NAME + ' | ' + this.productName);
      // tslint:disable-next-line:max-line-length
      this.pageHeaderOptions = { pageTitle: this.productName, hasShopsFilter: false };
      this.getMyProductById(this.productId);
      this.isEdit = true;
    }
    this.currentShop = (this.authService.getActiveShop !== null && this.authService.getActiveShop !== undefined) ? JSON.parse(this.authService.getActiveShop) : this.currentShop;
    if (!this.isEdit) {
      if (this.currentShop !== null && this.currentShop !== undefined) {
        // this.getUnitOfMeasurements(this.currentShop.id);
        // this.getMySuppliers({shop_id: this.currentShop.id});
        this.onShopChanged(this.currentShop.id);
        this.shop_id.setValue(this.currentShop.id)
        this.shopId = this.currentShop.id;
      }
      this.addPriceList();
      // this.isBaseUnitSelected = true;
    }
    this.is_available_oneline.valueChanges.subscribe((isAvailableOnine: boolean) => {
      this.image_url.clearValidators();
      this.image_url.updateValueAndValidity();
      if (isAvailableOnine) {
        this.image_url.setValidators([Validators.required]);
      this.image_url.updateValueAndValidity();
      this.imageOrColorCtrl.setValue('IMAGE');
      }
    });
    this.product_does_not_expire.valueChanges.subscribe((value: boolean) => {
      if(value) {
        this.expiry_date.setValue('');
        this.expiry_date.updateValueAndValidity()
      }
    });
    this.has_unit_measurement.valueChanges.subscribe((value: boolean) => {
      if(value === false) {
        this.new_quantity.setValidators([Validators.required]);
        this.new_quantity.updateValueAndValidity()
        this.unit_name.setValue('')
        this.unit_name.updateValueAndValidity()
        this.supplier_price.setValue('');
        this.supplier_price.updateValueAndValidity()
        this.selling_price.setValue('');
        this.selling_price.updateValueAndValidity()
        this.is_base_unit.setValue('');
        this.is_base_unit.updateValueAndValidity()
        this.base_unit_multiplier.setValue('');
        this.base_unit_multiplier.updateValueAndValidity()

      }else if(value === true){
        this.new_quantity.setValue('')
        this.new_quantity.updateValueAndValidity()
      }
    });
    this.getProductGroups(this.storeId);
    this.getMySuppliers({ shop_id: this.storeId });

  }
  addProductGroup() {
    this.dialog.open(AddProductGroupComponent, { data: { shop_id: this.storeId } }).afterClosed()
      .subscribe((isSuccess: boolean) => {
        if (isSuccess) {
          this.getProductGroups(this.storeId);
        }
      });
  }
  addNewUnitOfMeasurement() {
    this.dialog.open(AddUnitOfMeasurementComponent, { data: { shop_id: this.storeId } }).afterClosed()
      .subscribe((isSuccess: boolean) => {
        if (isSuccess) {
          this.getUnitOfMeasurements(this.storeId);
        }
      });
  }
  addSupplier() {
    this.dialog.open(AddSupplierComponent, { data: { shop_id: this.storeId } }).afterClosed()
      .subscribe((isSuccess: boolean) => {
        if (isSuccess) {
          this.getMySuppliers({ shop_id: this.storeId });
        }
      });
  }
  /**
   * Add price list item to list
   */
  addPriceList(isFirst = false) {
    this.price_list.push(new FormGroup({
      unit_name: new FormControl('', [Validators.required]),
      supplier_price: new FormControl('', [Validators.required]),
      selling_price: new FormControl('', [Validators.required]),
      is_base_unit: new FormControl(isFirst),
      base_unit_multiplier: new FormControl(1, [Validators.required, Validators.min(1)])
    }));
  }
  /**
   * Remove item from price list
   * @param index index to delete at
   */
  removePriceList(index) {
    this.price_list.removeAt(index);
  }
  /**
   * Get unit of measurements of a shop
   * @param shopId Shop ID
   */
  getUnitOfMeasurements(shopId) {
    this.productsService.getUnitsOfMeasurement(shopId, (error, result) => {
      if (result !== null && result !== undefined && result.response_code === '100') {
        this.unitsOfMeasurements = result.results;
        // if (this.unitsOfMeasurements.length <= 0) {
        //   this.isBaseUnitSelected = true;
        // }
      }
    });
  }
  /**
     * Get product groups of a shop
     * @param shopId Shop ID
     */
  getProductGroups(shopId) {
    this.productsService.getProductGroupsFromRemoteOnly(shopId, (error, result) => {
      // console.log(result, 'RESULT')
      if (result !== null && result !== undefined && result.response_code === '100') {
        this.productCategories = result.results;
      }
    });
  }
  /**
* Get a product detail by id
* @param productId Product Id
*/
  getMyProductById(productId) {
    this.isProcessing = true;
    this.productsService.getMyProductById(productId, (error, result) => {
      if (result !== null) {
        this.isProcessing = false;
        this.productDetail = result.results;
        if (this.productDetail !== null && this.productDetail !== undefined) {
          this.editProduct(this.productDetail);
        }
      }
    });
  }
  /**
   *On shop changed
   * @param shopId Shop ID
   */
  onShopChanged(shopId) {
    this.storeId = shopId;
    // console.log(shopId);
    this.getUnitOfMeasurements(shopId);
    this.getProductGroups(shopId);
    this.shopInfo = this.getShopByIdFromLocal(shopId);
    this.getMySuppliers({ shop_id: shopId });
  }
  /**
 * Get my products
 * @param filterData IDashboardFilterParams interface
 */
  getMySuppliers(filterData: IDashboardFilterParams) {
    this.isProcessing = true;
    this.suppliersApiCallsService.getSuppliers(filterData, (error, result) => {
      // console.log(result, 'SUPPLIERS')
      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        this.suppliers = result.results;
      }
    });
  }
  /**
   * Init Edit Product Modal
   * @param product product to edit
   */
  editProduct(product) {
    this.isEdit = true;
    this.is_service.setValue(product.is_service);
    this.productDetail = product;
    this.imageUrl = product.image;
    this.image_url.setValue(product.image);
    this.edit_product_product_id.setValue(product.id);
    this.new_quantity.setValue(product.new_quantity);
    this.product_name.setValue(product.name);
    // tslint:disable-next-line: max-line-length
    this.shop_id.setValue((product.myshop !== null && product.myshop !== undefined && product.myshop.id !== undefined) ? product.myshop.id : '');
    this.storeId = this.shop_id.value;
    this.getUnitOfMeasurements(this.shop_id.value);
    this.getProductGroups(this.shop_id.value);
    this.shopInfo = this.getShopByIdFromLocal(this.shop_id.value);
    // tslint:disable-next-line: max-line-length
    this.supplier_id.setValue((product.my_supplier !== null && product.my_supplier !== undefined && product.my_supplier.id !== undefined) ? product.my_supplier.id : '');
    this.new_low_stock_threshold.setValue(product.new_low_stock_threshold);
    this.supplier_price.setValue(product.supplier_price);
    this.selling_price.setValue(product.selling_price);
    this.is_service.setValue(product.is_service);
    this.description.setValue(product.description);
    // this.product_does_not_expire.setValue(product.product_does_not_expire);
    // tslint:disable-next-line: max-line-length
    const expiryDate = (product.new_expiry_date !== null && product.new_expiry_date !== undefined && product.new_expiry_date !== '') ? product.new_expiry_date : '';
    this.expiry_date.setValue(moment(expiryDate, 'DD/MM/YYYY', true));
    this.image_url.setValue(product.image);
    this.barcode.setValue(product.serial_number);
    this.apply_vat.setValue(product.apply_vat);
    this.vat_value.setValue(product.vat_value);
    this.vat_inclusive.setValue(product.vat_inclusive);
    // tslint:disable-next-line: max-line-length
    this.product_group_id.setValue((product.product_group !== null && product.product_group !== undefined && product.product_group !== '') ? product.product_group.id : '');
    const myTags = (product.tags !== null && product.tags !== undefined) ? product.tags as string : '';
    this.tags.setValue(myTags.split(','));
    this.color_code.setValue(product.color_code);
    // this.prepopuatePriceList(product.price_list);
    this.price_list.clearValidators();
    this.price_list.updateValueAndValidity();
  }
  /**
   * Upload user avatar or company logo
   * @param fileBrowser Image File to upload
   * @param source Source of upload request (profile/logo)
   */
  uploadImages(fileBrowser) {
    if (fileBrowser.files.length > 0) {
      const file: File = fileBrowser.files[0];
      const formData = new FormData();

      formData.append('image', file);
      this.isProcessingImageUpload = true;
      this.sharedDataServiceApi.uploadImage(formData, (error, result) => {
        this.isProcessingImageUpload = false;
        if (result !== null) {
          this.imageUrl = result.image_url;
          this.image_url.setValue(result.image_url);
        }
      });

    }
  }
  /**
   * Create/Update product
   */
  onSubmit(detail, isSaveAndAdd = false) {
    // console.log(detail, 'PROD')
    if (!this.isEdit) {
      this.createProduct(detail, isSaveAndAdd);
    } else {
      this.updateProduct(detail, isSaveAndAdd);
    }
  }
  /**
   * Fired when Is Base Unit value changes for any item in the price list
   * @param event MatCheckboxChange event
   * @param baseUnitMultiplierControl Base Unit Multiplier FormControl
   * @param unitName Unit name
   * @param index Index of checkbox
   */
  onIsBaseUnitChange(event: MatCheckboxChange, baseUnitMultiplierControl: AbstractControl, unitName: string, index: number) {
    baseUnitMultiplierControl.setValue(1);
    baseUnitMultiplierControl.clearValidators();
    this.baseUnitName = unitName;
    this.isBaseUnitSelected = event.checked;
    this.selectedBaseUnitIndex = index;
    if (!event.checked) {
      this.baseUnitName = '';
      baseUnitMultiplierControl.setValidators([Validators.required]);
    }
    baseUnitMultiplierControl.updateValueAndValidity();
  }
  /**
   * Update
   * @param detail details for editing stock
   */
  updateProduct(detail, isSaveAndAdd = false) {
    // console.log(detail)
    if (this.productInfoFormGroup.valid) {

      this.isProcessing = true;
      // tslint:disable-next-line: max-line-length
      detail.expiry_date = (detail.expiry_date !== null && detail.expiry_date !== '' && detail.expiry_date !== undefined) ? moment(detail.expiry_date).format(this.constantValues.EXPIRTY_DATE_FORMAT) : '';
      detail.serial_number = detail.barcode;
      const myTags: any[] = (detail.tags !== undefined && detail.tags !== null && detail.tags !== '') ? detail.tags : [];
      detail.tags = myTags.join(',');
      detail.price_list = '' + JSON.stringify(detail.price_list) + '';
      this.dataProvider.create(this.constantValues.UPDATE_PRODUCT_ENDPOINT, detail)
        .subscribe(result => {
          this.isProcessing = false;
          this.notificationService.snackBarMessage('Product sucessfully updated');
          // this.productInfoFormGroup.reset('');
          // this.pricingFormGroup.reset([]);
          this.router.navigate(['/products']);
          if (!isSaveAndAdd) {

          }
        }, error => {
          this.isProcessing = false;
          this.notificationService.error(this.constantValues.APP_NAME, error.detail);
        });
    }
  }
  /**
   * Generate form controls for price list from server
   * @param priceList price list array
   */
  prepopuatePriceList(priceList: any[]) {
    if (priceList.length > 0) {
      this.price_list.clear();
      priceList.forEach(data => {
        this.price_list.push(new FormGroup({
          unit_name: new FormControl(data.unit_name, [Validators.required]),
          supplier_price: new FormControl(data.supplier_price, [Validators.required]),
          selling_price: new FormControl(data.selling_price, [Validators.required]),
          is_base_unit: new FormControl(data.is_base_unit),
          base_unit_multiplier: new FormControl(data.base_unit_multiplier, [Validators.required, Validators.min(1)])
        }));
      });
    }
  }

  /**
   * Create new product
   * @param detail product information
   */
  createProduct(detail, isSaveAndAdd = false) {
    if (this.productInfoFormGroup.valid) {
      const bcode = new Date().getTime();
      const millisecondDate = this.appUtils.padLeft(bcode.toString(), '0', 13);
      this.isProcessing = true;
      // tslint:disable-next-line: max-line-length
      detail.expiry_date = (detail.expiry_date !== null && detail.expiry_date !== '' && detail.expiry_date !== undefined) ? moment(detail.expiry_date).format(this.constantValues.DD_MM_YYYY_DATE_FORMAT) : '';
      // tslint:disable-next-line: max-line-length
      detail.serial_number = (detail.barcode !== undefined && detail.barcode !== '' && detail.barcode !== null) ? detail.barcode : millisecondDate;
      const myTags: any[] = (detail.tags !== undefined && detail.tags !== null && detail.tags !== '') ? detail.tags : [];
      detail.tags = myTags.join(',');
      if (this.price_list.length > 0) {
        detail.selling_price = 0;
        detail.supplier_price = 0;
        // detail.price_list = JSON.stringify(detail.price_list);
      }

      this.productsService.createProduct(detail, (error, result) => {
        this.isProcessing = false;
        if (result !== null) {
          this.notificationService.snackBarMessage('Product sucessfully created');
          // this.productInfoFormGroup.reset('');
          // this.pricingFormGroup.reset([]);
          this.router.navigate(['/products']);
          if (!isSaveAndAdd) {
          }

        }
      });
    }
  }

/**
 * Get promo tags
 */
  getPromoTags() {
    this.productsService.getPromoTags((error, result) => {
      if (result !== null && result.status === 'success') {
        this.productTags = result.results;
      }
    });
  }
  /**
 * Get vat values
 */
getVatValues() {
  this.productsService.getVatValues((error, result) => {
    if (result !== null && result.status === 'success') {
      this.vatValues = result.results;
    }
  });
}
  /**
   * Show color picker bottom sheet
   */
  showColorPicker() {
    this.bottomSheet.open(ColorPickerDialogComponent).afterDismissed()
      .subscribe((color: string) => {
        if (color !== '' && color !== null && color !== undefined) {
          this.color_code.setValue(color);
        }
      });
  }
  /**
  * Get shops of current loged in user
  */
  getMyShops() {
    this.shopsService.getMyShop({ shop_id: '' }, (error, result) => {
      if (result !== null && result.status === 'success') {
        this.myShops = result.results;
      }
    });
  }
  /**
   * Get a shop by id from shops array locally
   */
  getShopByIdFromLocal(shopId) {
    return this.myShops.find(data => data.id === shopId);
  }
  showImageRequirement() {
    this.dialog.open(ImageUploadGuidelineComponent, {});
  }
  get unit_name() { return this.productInfoFormGroup.get('unit_name'); }
  get is_base_unit() { return this.productInfoFormGroup.get('is_base_unit'); }
  get base_unit_multiplier() { return this.productInfoFormGroup.get('is_base_unit'); }
  get product_group_id() { return this.productInfoFormGroup.get('product_group_id'); }
  get edit_product_product_id() { return this.productInfoFormGroup.get('product_id'); }
  get tags() { return this.productInfoFormGroup.get('tags'); }
  get new_quantity() { return this.productInfoFormGroup.get('new_quantity'); }
  get product_name() { return this.productInfoFormGroup.get('product_name'); }
  get description() { return this.productInfoFormGroup.get('description'); }
  get selling_price() { return this.productInfoFormGroup.get('selling_price'); }
  get is_service() { return this.productInfoFormGroup.get('is_service'); }
  get supplier_id() { return this.productInfoFormGroup.get('supplier_id'); }
  get supplier_price() { return this.productInfoFormGroup.get('supplier_price'); }
  get new_low_stock_threshold() { return this.productInfoFormGroup.get('new_low_stock_threshold'); }
  get image_url() { return this.productInfoFormGroup.get('image_url'); }
  get product_does_not_expire() { return this.productInfoFormGroup.get('product_does_not_expire'); }
  get has_unit_measurement() { return this.productInfoFormGroup.get('has_unit_measurement'); }
  get expiry_date() { return this.productInfoFormGroup.get('expiry_date'); }
  get barcode() { return this.productInfoFormGroup.get('serial_number'); }
  get apply_vat() { return this.productInfoFormGroup.get('apply_vat'); }
  get vat_value() { return this.productInfoFormGroup.get('vat_value'); }
  get vat_inclusive() { return this.productInfoFormGroup.get('vat_inclusive'); }
  get shop_id() { return this.productInfoFormGroup.get('shop_id'); }
  get color_code() { return this.productInfoFormGroup.get('color_code'); }
  get is_available_oneline() { return this.productInfoFormGroup.get('is_available_oneline'); }
  get price_list() { return this.productInfoFormGroup.get('price_list') as FormArray; }

  // get priceListFormArray() { return this.pricingFormGroup.get('data') as FormArray; }
}
