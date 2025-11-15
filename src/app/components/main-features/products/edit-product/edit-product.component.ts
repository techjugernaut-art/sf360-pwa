import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { SharedDataApiCallsService } from 'src/app/services/network-calls/shared-data-api-calls.service';
import { AppUtilsService } from 'src/app/services/app-utils.service';
import { ProductsService } from 'src/app/services/network-calls/products.service';
import { Component, OnInit, Inject } from '@angular/core';
declare const swal;
import * as moment from 'moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { ImageUploadGuidelineComponent } from 'src/app/components/common/image-upload-guideline/image-upload-guideline.component';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  editProductModalTitle: string;
  isProcessingEditProduct: boolean;
  editProductFormGroup: FormGroup;
  productDetail;
  btnText = 'UPDATE';
  isOnboarding = false;
  imageUrl: any;
  shopId: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  productTags = [];
  isProcessingImageUpload: boolean;
  shopInfo: any;
  constructor(
    private dataProvider: DataProviderService,
    private notificationService: NotificationsService,
    private dialogRef: MatDialogRef<EditProductComponent>,
    private productsService: ProductsService,
    private appUtils: AppUtilsService,
    private sharedDataServiceApi: SharedDataApiCallsService,
    private shopsService: ShopsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private constantValues: ConstantValuesService
  ) { }

  ngOnInit() {
    this.editProductFormGroup = new FormGroup({
      shop_id: new FormControl(''),
      selling_price: new FormControl(0, [Validators.required]),
      supplier_id: new FormControl(''),
      supplier_price: new FormControl(0),
      new_low_stock_threshold: new FormControl(0),
      image_url: new FormControl(''),
      product_name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      is_service: new FormControl(false),
      product_does_not_expire: new FormControl(false),
      new_quantity: new FormControl(0),
      expiry_date: new FormControl(''),
      barcode: new FormControl(''),
      serial_number: new FormControl(''),
      vat_value: new FormControl(0),
      vat_inclusive: new FormControl(false),
      apply_vat: new FormControl(false),
      tags: new FormControl(''),
      product_id: new FormControl('')
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
    if (this.data !== null && this.data !== undefined) {
      if (this.data.is_onboarding !== undefined && this.data.is_onboarding !== null && this.data.is_onboarding === true) {
        this.editProductModalTitle = 'Add New Product';
        this.btnText = 'SAVE';
        this.isOnboarding = true;
        this.shopId = this.data.shop_id;
        this.getShopById({shop_id: this.shopId});
      } else {
        this.btnText = 'UPDATE';
        this.editProduct(this.data.product);
      }
    }
    this.getPromoTags();
  }
  /**
   * Init Edit Product Modal
   * @param product product to edit
   */
  editProduct(product) {
    this.is_service.setValue(product.is_service);
    this.productDetail = product;
    this.editProductModalTitle = product.name;
    this.imageUrl = product.image;
    this.image_url.setValue(product.image);
    this.edit_product_product_id.setValue(product.id);
    this.new_quantity.setValue(product.new_quantity);
    this.product_name.setValue(product.name);
    // tslint:disable-next-line: max-line-length
    this.edit_product_shop_id.setValue((product.myshop !== null && product.myshop !== undefined && product.myshop.id !== undefined) ? product.myshop.id : '');
    // tslint:disable-next-line: max-line-length
    this.supplier_id.setValue((product.my_supplier !== null && product.my_supplier !== undefined && product.my_supplier.id !== undefined) ? product.my_supplier.id : '');
    this.new_low_stock_threshold.setValue(product.new_low_stock_threshold);
    this.supplier_price.setValue(product.supplier_price);
    this.selling_price.setValue(product.selling_price);
    this.is_service.setValue(product.is_service);
    this.description.setValue(product.description);
    // this.product_does_not_expire.setValue(product.product_does_not_expire);
    const expiryDate = (product.new_expiry_date !== null && product.new_expiry_date !== undefined) ? product.new_expiry_date : '';
    this.expiry_date.setValue(moment(expiryDate, 'DD/MM/YYYY', true));
    this.image_url.setValue(product.image);
    this.barcode.setValue(product.serial_number);
    this.apply_vat.setValue(product.apply_vat);
    this.vat_value.setValue(product.vat_value);
    this.vat_inclusive.setValue(product.vat_inclusive);
    const myTags = (product.tags !== null && product.tags !== undefined) ? product.tags as string : '';
    this.tags.setValue(myTags.split(','));
    this.editProductModalTitle = 'Editing ' + product.name;
    this.getShopById({shop_id: product.myshop.id});
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
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;

  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
  onSubmit(detail) {
    if (this.isOnboarding) {
      this.createProduct(detail);
    } else {
      this.updateProduct(detail);
    }
  }
  /**
      * Update
      * @param detail details for editing stock
      */
  updateProduct(detail) {
    if (this.editProductFormGroup.valid) {

      this.isProcessingEditProduct = true;
      // tslint:disable-next-line: max-line-length
      detail.expiry_date = (detail.expiry_date !== null && detail.expiry_date !== '' && detail.expiry_date !== undefined) ? moment(detail.expiry_date).format(this.constantValues.EXPIRTY_DATE_FORMAT) : '';
      detail.serial_number = detail.barcode;
      const myTags: any[] = (detail.tags !== undefined && detail.tags !== null && detail.tags !== '') ? detail.tags : [];
      detail.tags = myTags.join(',');
      this.dataProvider.create(this.constantValues.UPDATE_PRODUCT_ENDPOINT, detail)
        .subscribe(result => {
          this.isProcessingEditProduct = false;
          this.notificationService.success(this.constantValues.APP_NAME, 'Product successfully updated');
          this.dialogRef.close(true);
        }, error => {
          this.isProcessingEditProduct = false;
          this.notificationService.error(this.constantValues.APP_NAME, error.detail);
        });
    }
  }

  createProduct(detail) {
    if (this.editProductFormGroup.valid) {
      const bcode = new Date().getTime();
      const millisecondDate = this.appUtils.padLeft(bcode.toString(), '0', 13);
      this.isProcessingEditProduct = true;
      // tslint:disable-next-line: max-line-length
      detail.expiry_date = (detail.expiry_date !== null && detail.expiry_date !== '' && detail.expiry_date !== undefined) ? moment(detail.expiry_date).format(this.constantValues.EXPIRTY_DATE_FORMAT) : '';
      // tslint:disable-next-line: max-line-length
      detail.serial_number = (detail.barcode !== undefined && detail.barcode !== '' && detail.barcode !== null) ? detail.barcode : millisecondDate;
      detail.shop_id = this.shopId;
      const myTags: any[] = (detail.tags !== undefined && detail.tags !== null && detail.tags !== '') ? detail.tags : [];
      detail.tags = myTags.join(',');

      this.productsService.createProduct(detail, (error, result) => {
        this.isProcessingEditProduct = false;
        if (result !== null) {
          this.notificationService.snackBarMessage('Product sucessfully created');
          this.dialogRef.close(true);

        }
      });
    }
  }

  onClose() {
    this.dialogRef.close(false);
  }

  getPromoTags() {
    this.productsService.getPromoTags((error, result) => {
      if (result !== null && result.status === 'success') {
        this.productTags = result.results;
      }
    });
  }
  /**
   * Get shop information by a particular shop id
   * @param filterParams filter param
   */
  getShopById(filterParams: IDashboardFilterParams) {
    this.shopsService.getMyShop(filterParams, (error, result) => {
      if (result !== null && result.response_code === '100') {
        this.shopInfo = result.results[0];
      }
    });
  }
  showImageRequirement() {
    this.dialog.open(ImageUploadGuidelineComponent);
  }
  get edit_product_shop_id() { return this.editProductFormGroup.get('shop_id'); }
  get edit_product_product_id() { return this.editProductFormGroup.get('product_id'); }
  get tags() { return this.editProductFormGroup.get('tags'); }
  get new_quantity() { return this.editProductFormGroup.get('new_quantity'); }
  get product_name() { return this.editProductFormGroup.get('product_name'); }
  get description() { return this.editProductFormGroup.get('description'); }
  get selling_price() { return this.editProductFormGroup.get('selling_price'); }
  get is_service() { return this.editProductFormGroup.get('is_service'); }
  get supplier_id() { return this.editProductFormGroup.get('supplier_id'); }
  get supplier_price() { return this.editProductFormGroup.get('supplier_price'); }
  get new_low_stock_threshold() { return this.editProductFormGroup.get('new_low_stock_threshold'); }
  get image_url() { return this.editProductFormGroup.get('image_url'); }
  get product_does_not_expire() { return this.editProductFormGroup.get('product_does_not_expire'); }
  get expiry_date() { return this.editProductFormGroup.get('expiry_date'); }
  get barcode() { return this.editProductFormGroup.get('barcode'); }
  get apply_vat() { return this.editProductFormGroup.get('apply_vat'); }
  get vat_value() { return this.editProductFormGroup.get('vat_value'); }
  get vat_inclusive() { return this.editProductFormGroup.get('vat_inclusive'); }
  get shop_id() { return this.editProductFormGroup.get('shop_id'); }
}
