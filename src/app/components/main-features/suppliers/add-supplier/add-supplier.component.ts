import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SuppliersApiCallsService } from 'src/app/services/network-calls/suppliers-api-calls.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShopsService } from 'src/app/services/network-calls/shops.service';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.scss']
})
export class AddSupplierComponent implements OnInit {

  formGroup: FormGroup;
  editStockModalTitle =  'Add Supplier';
  myShops = [];
  supplierCategories = [];
  isProcessing: boolean;
  isEdit: boolean;
  supplierId: any;
  constructor(
    private suppliersApiCallsService: SuppliersApiCallsService,
    private notificationService: NotificationsService,
    private dialogRef: MatDialogRef<AddSupplierComponent>,
    private shopsService: ShopsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      shop_id: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      phone_number: new FormControl(''),
      physical_address: new FormControl(''),
      category_id: new FormControl(''),
      supplier_code: new FormControl(''),
      foresight_supplier_id: new FormControl('')
    });
    this.getMyShops();
    this.getSupplierCategories();
    if (this.data !== null && this.data !== undefined) {
      this.isEdit = this.data.isEdit;
      if (this.isEdit) {
        this.supplierId = this.data.supplier.id;
        // this.shop_id.setValue(this.data.supplier.myshop.id);
        this.name.setValue(this.data.supplier.name);
        this.physical_address.setValue(this.data.supplier.physical_address);
        this.phone_number.setValue(this.data.supplier.phone_number);
        // tslint:disable-next-line: max-line-length
        this.category_id.setValue((this.data.supplier.category !== null && this.data.supplier.category !== undefined) ? this.data.supplier.category.id : '');
        this.editStockModalTitle = 'Update Supplier';
      }
    }
  }
 /**
  * Submit product category data
  * @param detail details for editing stock
  */
 onSubmit(detail) {
  if (this.formGroup.valid) {
    if (!this.isEdit) {
      this.isProcessing = true;
    this.suppliersApiCallsService.createSupplier(detail, (error, result) => {
      this.isProcessing = false;
      if (result !== null) {
        this.notificationService.snackBarMessage('Supplier successfully created');
        this.dialogRef.close(true);
      }
    });
    } else {
      this.isProcessing = true;
    this.suppliersApiCallsService.updateSupplier(this.supplierId, detail, (error, result) => {
      this.isProcessing = false;
      if (result !== null) {
        this.notificationService.snackBarMessage('Supplier successfully updated');
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
   * Get supplier categories
   */
  getSupplierCategories() {
    this.isProcessing = true;
    this.suppliersApiCallsService.getSupplierCategories((error, result) => {
      this.isProcessing = false;
      if (result !== null) {
        this.supplierCategories = result.results;
      }
    });
  }
  get shop_id() { return this.formGroup.get('shop_id'); }
  get name() { return this.formGroup.get('name'); }
  get physical_address() { return this.formGroup.get('physical_address'); }
  get phone_number() { return this.formGroup.get('phone_number'); }
  get category_id() { return this.formGroup.get('category_id'); }

}
