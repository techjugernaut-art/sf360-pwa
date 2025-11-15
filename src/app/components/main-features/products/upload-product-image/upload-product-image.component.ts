import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ProductsService } from 'src/app/services/network-calls/products.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedDataApiCallsService } from 'src/app/services/network-calls/shared-data-api-calls.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ImageUploadGuidelineComponent } from 'src/app/components/common/image-upload-guideline/image-upload-guideline.component';

@Component({
  selector: 'app-upload-product-image',
  templateUrl: './upload-product-image.component.html',
  styleUrls: ['./upload-product-image.component.scss']
})
export class UploadProductImageComponent implements OnInit {
  isProcessing = false;
  isEdit = false;
  btnText = 'UPDATE';
  imageUrl: any;
  shopId: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  formGroup: FormGroup;
  editProductFormGroup: FormGroup;
  isProcessingEditProduct: boolean;
  imageUrlCtrl = new FormControl('', [Validators.required]);
  productDetail: any;
  editProductModalTitle = 'Upload Product Image';
  invalidImage: boolean;
  files: File[] = [];
  isAddExtraImage = false;

  constructor(
    private productService: ProductsService,
    private sharedDataApiService: SharedDataApiCallsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private notificationService: NotificationsService,
    private constantsValues: ConstantValuesService,
    private dialogRef: MatDialogRef<UploadProductImageComponent>
  ) { }

  ngOnInit() {
    this.editProductFormGroup = new FormGroup({
      shop_id: new FormControl(''),
      selling_price: new FormControl(''),
      supplier_id: new FormControl(0),
      supplier_price: new FormControl(0),
      new_low_stock_threshold: new FormControl(0),
      image_url: new FormControl(''),
      product_name: new FormControl(''),
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
      product_id: new FormControl(''),
      tags: new FormControl('')
    });
    if (this.data !== null && this.data !== undefined) {
      this.btnText = 'UPLOAD IMAGE';
      if (this.data.isAddExtraImage === true && this.data.isAddExtraImage !== null && this.data.isAddExtraImage !== undefined) {
        this.isAddExtraImage = this.data.isAddExtraImage;
        this.editProductModalTitle = 'Upload Extra Product Image';
        this.productDetail = this.data.product;
      } else {
        this.editProduct(this.data.product);
      }
    }
  }

  /**
  * Upload user avatar or company logo
  * @param fileBrowser Image File to upload
  * @param source Source of upload request (profile/logo)
  */
  uploadImages(fileBrowser) {
    if (fileBrowser.files.length > 0) {
      // const _URL = window.URL || window.webkitURL;
      const file: File = fileBrowser.files[0];
      // const img = new Image();
      const self = this;
      this.invalidImage = false;

      const formData = new FormData();
      this.isProcessingEditProduct = true;
      formData.append('image', file);
      this.sharedDataApiService.uploadImage(formData, (error, result) => {
        this.isProcessingEditProduct = false;
        if (result !== null) {
          this.imageUrl = result.image_url;
          this.image_url.setValue(result.image_url);
          this.imageUrlCtrl.setValue(result.image_url);
        }
      });

    }
  }
  /**
      * Update
      * @param detail details for editing stock
      */
  updateProduct(detail) {
    if (this.imageUrlCtrl.valid) {
      detail.image_url = this.imageUrl;
      this.isProcessingEditProduct = true;
      if (this.isAddExtraImage) {
        // tslint:disable-next-line: max-line-length
        const shopId = (this.productDetail.myshop !== null && this.productDetail.myshop !== undefined && this.productDetail.myshop.id !== undefined) ? this.productDetail.myshop.id : '';
        // tslint:disable-next-line: max-line-length
        this.productService.addExtraProductImasge({product_id: this.productDetail.id, image: this.imageUrl, shop_id: shopId}, (error, result) => {
          this.isProcessingEditProduct = false;
          if (result !== null) {
            this.notificationService.snackBarMessage('Product Image successfully added');
            this.dialogRef.close(true);
          }
        });
      } else {
        this.productService.editProduct(detail, (error, result) => {
          this.isProcessingEditProduct = false;
          if (result !== null) {
            this.notificationService.snackBarMessage('Product Image successfully updated');
            this.dialogRef.close(true);
          }
        });
      }
    }
  }
  onClose() {
    this.dialogRef.close(false);
  }
  onSelect(event) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
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
    this.product_does_not_expire.setValue(product.product_does_not_expire);
    this.expiry_date.setValue(product.new_expiry_date);
    this.image_url.setValue(product.image);
    this.barcode.setValue(product.serial_number);
    this.apply_vat.setValue(product.apply_vat);
    this.vat_value.setValue(product.vat_value);
    this.vat_inclusive.setValue(product.vat_inclusive);
    const myTags = (product.tags !== null && product.tags !== undefined) ? product.tags as string : '';
    this.tags.setValue(myTags.split(','));



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
