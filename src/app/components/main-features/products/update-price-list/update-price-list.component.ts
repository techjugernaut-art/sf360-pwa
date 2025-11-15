import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, AbstractControl } from '@angular/forms';
import { ProductsService } from 'src/app/services/network-calls/products.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-price-list',
  templateUrl: './update-price-list.component.html',
  styleUrls: ['./update-price-list.component.scss']
})
export class UpdatePriceListComponent implements OnInit {
  productGroupFormGroup: FormGroup;
  editStockModalTitle =  '';
  myShops = [];
  isProcessing: boolean;
  productId = '';
  shopInfo: any;
  baseUnitName = '';
  isBaseUnitSelected = false;
  selectedBaseUnitIndex = 0;
  unitsOfMeasurements = [];
  productDetail: any;
  constructor(
    private productsService: ProductsService,
    private notificationService: NotificationsService,
    private dialogRef: MatDialogRef<UpdatePriceListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.productGroupFormGroup = new FormGroup({
      shop_id: new FormControl('', [Validators.required]),
      price_list: new FormArray([], [Validators.required])
    });
    if (this.data !== null && this.data !== undefined) {
      this.shopInfo = this.data.product.myshop;
      this.shop_id.setValue(this.shopInfo.id);
      this.productId = this.data.product.id;
      this.productDetail = this.data.product;
      this.getUnitOfMeasurements(this.shopInfo.id);
      const priceList: any[] = this.productDetail.price_list;
      this.prepopuatePriceList(priceList);
    }
  }
 /**
  * Submit product category data
  * @param detail details for editing stock
  */
 onSubmit(detail) {
  if (this.productGroupFormGroup.valid) {
    this.isProcessing = true;
    detail.price_list = '' + JSON.stringify(detail.price_list) + '';
    this.productsService.changePriceList(this.productId, detail, (error, result) => {
      this.isProcessing = false;
      if (result !== null) {
        this.notificationService.snackBarMessage('Price List successfully updated');
        this.dialogRef.close(true);
      }
    });
  }
}
/**
   * Add price list item to list
   */
  addPriceList() {
    this.price_list.push(new FormGroup({
      unit_name: new FormControl('', [Validators.required]),
      supplier_price: new FormControl('', [Validators.required]),
      selling_price: new FormControl('', [Validators.required]),
      is_base_unit: new FormControl(false),
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
      }
    });
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
    } else {
      this.addPriceList();
    }
  }
  get shop_id() { return this.productGroupFormGroup.get('shop_id'); }
  get name() { return this.productGroupFormGroup.get('name'); }
  get price_list() { return this.productGroupFormGroup.get('price_list') as FormArray; }

}
