import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { PromoCodeUsageEnum, PromotionTypesEnum, PromoTemplates } from 'src/app/utils/enums';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerApiCallsService } from 'src/app/services/network-calls/customer-api-calls.service';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import * as moment from 'moment';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { ProductsService } from 'src/app/services/network-calls/products.service';

@Component({
  selector: 'app-add-promotion',
  templateUrl: './add-promotion.component.html',
  styleUrls: ['./add-promotion.component.scss']
})
export class AddPromotionComponent implements OnInit {
  products = [];
  dropdownList = [];
  customerGroupDropdownList = [];
  dropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    textField1: 'item_text1',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  formGroup: FormGroup;
  editStockModalTitle = 'Add Promotion';
  promoId = '';
  isEdit = false;
  myShops = [];
  isProcessing: boolean;
  shopInfo: any;
  promoCodeUsageTypes = PromoCodeUsageEnum;
  promoTypes = PromotionTypesEnum;
  promoTemplatesTypes = PromoTemplates
  constructor(
    private customerApiCallsService: CustomerApiCallsService,
    private notificationService: NotificationsService,
    private dialogRef: MatDialogRef<AddPromotionComponent>,
    private shopsService: ShopsService,
    private constantValues: ConstantValuesService,
    private productsService: ProductsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      shop_id: new FormControl('', [Validators.required]),
      // product_ids: new FormControl(''),
      // promo_template_type: new FormControl(this.promoTemplatesTypes.GENERAL_SHOP_CODE, [Validators.required]),
      code_usage_type: new FormControl(PromoCodeUsageEnum.MULTIPLE),
      promo_type: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      start_date: new FormControl('', [Validators.required]),
      end_date: new FormControl('', [Validators.required]),
    });
    this.getMyShops();
    if (this.data !== null && this.data !== undefined) {
      this.isEdit = this.data.isEdit;
      if (this.isEdit) {
        this.editStockModalTitle = 'Update Promotion';
        this.promoId = this.data.category.id;
        this.shop_id.setValue(this.data.category.myshop.id);
        this.code_usage_type.setValue(this.data.category.code_usage_type);
        this.promo_type.setValue(this.data.category.promo_type);
        this.name.setValue(this.data.category.name);
        this.start_date.setValue(new Date(this.data.category.start_date));
        this.end_date.setValue(new Date(this.data.category.end_date));
      }
    }
    this.getProducts({shop_id:''})
  }
  getProducts(filterParam: IDashboardFilterParams) {
    this.isProcessing = true;
    this.productsService.getMyProducts(filterParam, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        this.products = result.results;
        this.dropdownList = [];
        this.products.forEach(data => {
          this.dropdownList.push({ item_id: data.id, item_text: data.name });
        });        
      }
    });
  }
  /**
   * Submit promotion
   * @param detail details for editing stock
   */
  onSubmit(detail) {
    detail.start_date = moment(detail.start_date).format(this.constantValues.DATE_TIME_FORMAT);
    detail.end_date = moment(detail.end_date).format(this.constantValues.DATE_TIME_FORMAT);
    if (!this.isEdit) {
      if (this.formGroup.valid) {
        this.isProcessing = true;
        this.customerApiCallsService.createPromotion(detail, (error, result) => {
          this.isProcessing = false;
          if (result !== null) {
            this.notificationService.snackBarMessage('Promotion successfully created');
            this.dialogRef.close(true);
          }
        });
      }
    } else {
      if (this.formGroup.valid) {
        this.isProcessing = true;
        this.customerApiCallsService.updatePromotion(this.promoId, detail, (error, result) => {
          this.isProcessing = false;
          if (result !== null) {
            this.notificationService.snackBarMessage('Promotion successfully updated');
            this.dialogRef.close(true);
          }
        });
      }
    }
  }
  /**
  * Get shops of current loged in user
  */
  getMyShops() {
    this.isProcessing = true;
    this.shopsService.getMyShop({ shop_id: '' }, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.status === 'success') {
        this.myShops = result.results;
      }
    });
  }
   /**
   *On shop changed
   * @param shopId Shop ID
   */
  onShopChanged(shopId) {
    this.shopInfo = this.getShopByIdFromLocal(shopId);
  }
  getShopByIdFromLocal(shopId) {
    return this.myShops.find(data => data.id === shopId);
  }
  get shop_id() { return this.formGroup.get('shop_id'); }
  get name() { return this.formGroup.get('name'); }
  get product_ids() { return this.formGroup.get('product_ids'); }
  get promo_template_type() { return this.formGroup.get('promo_template_type'); }
  get code_usage_type() { return this.formGroup.get('code_usage_type'); }
  get promo_type() { return this.formGroup.get('promo_type'); }
  get start_date() { return this.formGroup.get('start_date'); }
  get end_date() { return this.formGroup.get('end_date'); }

}
