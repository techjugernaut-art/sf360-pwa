import { PromoCodeRateTypeEnum } from './../../../../utils/enums';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { CustomerApiCallsService } from 'src/app/services/network-calls/customer-api-calls.service';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { PromoCodeUsageEnum, PromotionTypesEnum } from 'src/app/utils/enums';

@Component({
  selector: 'app-add-promo-code',
  templateUrl: './add-promo-code.component.html',
  styleUrls: ['./add-promo-code.component.scss']
})
export class AddPromoCodeComponent implements OnInit {

  formGroup: FormGroup;
  editStockModalTitle = 'Add Promo Code';
  promoId = '';
  isEdit = false;
  myShops = [];
  isProcessing: boolean;
  shopInfo: any;
  promoCodeRateTypes = PromoCodeRateTypeEnum;
  constructor(
    private customerApiCallsService: CustomerApiCallsService,
    private notificationService: NotificationsService,
    private dialogRef: MatDialogRef<AddPromoCodeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      shop_id: new FormControl(''),
      rate_type: new FormControl(PromoCodeRateTypeEnum.FLAT),
      code: new FormControl('', [Validators.required]),
      rate_value: new FormControl('', [Validators.required]),
      is_public: new FormControl(true)
    });
    if (this.data !== null && this.data !== undefined) {
      this.promoId = this.data.promoId;
        this.shop_id.setValue(this.data.shopInfo.id);
        this.shopInfo = this.data.shopInfo;
      this.isEdit = this.data.isEdit;
      if (this.isEdit) {
        this.editStockModalTitle = 'Update Promo Code';
        this.rate_value.setValue(this.data.category.rate_value);
        this.rate_type.setValue(this.data.category.rate_type);
        this.code.setValue(this.data.category.code);
      }
    }
    this.rate_type.valueChanges.subscribe(value => {
      this.rate_value.setValue('');
      this.rate_value.clearValidators();
      this.rate_value.updateValueAndValidity();
      if (value === PromoCodeRateTypeEnum.PERCENTAGE) {
        this.rate_value.setValidators([Validators.required, Validators.max(90)]);
        this.rate_value.updateValueAndValidity();
      } else {
        this.rate_value.setValidators([Validators.required]);
        this.rate_value.updateValueAndValidity();
      }
    });
  }
  /**
   * Submit promotion
   * @param detail details for editing stock
   */
  onSubmit(detail) {
    if (this.formGroup.valid) {
      this.isProcessing = true;
      this.customerApiCallsService.createPromoCode(this.promoId, detail, (error, result) => {
        this.isProcessing = false;
        if (result !== null) {
          this.notificationService.snackBarMessage('Promo Code successfully created');
          this.dialogRef.close(true);
        }
      });
    }
  }

  get shop_id() { return this.formGroup.get('shop_id'); }
  get code() { return this.formGroup.get('code'); }
  get rate_type() { return this.formGroup.get('rate_type'); }
  get rate_value() { return this.formGroup.get('rate_value'); }

}
