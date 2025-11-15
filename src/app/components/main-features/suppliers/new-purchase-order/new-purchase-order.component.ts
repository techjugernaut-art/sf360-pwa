import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SelectShopComponent } from 'src/app/components/common/dialogs/select-shop/select-shop.component';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ITableHeaderActions } from 'src/app/interfaces/table-header-actions.interace';
import { ProductsService } from 'src/app/services/network-calls/products.service';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { SuppliersApiCallsService } from 'src/app/services/network-calls/suppliers-api-calls.service';
import { InvoiceTypesEnums } from 'src/app/utils/enums';
import { ProductsListDialogComponent } from '../../products/products-list-dialog/products-list-dialog.component';
import { ConfirmPurchaseOrderDialogComponent } from '../confirm-purchase-order-dialog/confirm-purchase-order-dialog.component';
import { SuppliersListDialogComponent } from '../suppliers-list-dialog/suppliers-list-dialog.component';

@Component({
  templateUrl: './new-purchase-order.component.html'
})
export class NewPurchaseOrderComponent implements OnInit {
  modalTitle = 'New Purchase Order'
  selectedSupplier = null; 
  selectedShop = null;
  pageHeaderOptions: IPageHeader;
  isProcessing = false;
  isPartner = false;
  suppliers = [];
  myShops = [];
  requestPayload = {};
  tableHeaderOption: ITableHeaderActions;
  purchaseOrderFormGroup: FormGroup;
  invoiceTypes = InvoiceTypesEnums;
  shopInfo;
  items: FormArray[];
  purchaseOrderRequests: [];
  storeId;
  selectedProduct = null;
  invoiceDate = new Date
  total_amount = 0

  constructor(
    private suppliersApiCallsService: SuppliersApiCallsService,
    private productsService: ProductsService,
    private shopsService: ShopsService,
    private router: Router,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.purchaseOrderFormGroup = this.formBuilder.group({
      // shop_id: [''],
      // supplier_id: [''],
      // is_same_shipping_address: [true, [Validators.required]],
      location: [''],
      total_amount: this.total_amount,
      item_list: this.formBuilder.array([
        this.formBuilder.group({
          product_id: ['',],
          name: ['', [Validators.required]],
          quantity: ['', [Validators.required]],
          supplier_price: ['', [Validators.required]]
        })
      ])
    });
    // this.is_same_shipping_address.valueChanges.subscribe(value =>{
    //   console.log(value, 'VALUE')
    //   if(this.is_same_shipping_address.value === false){
    //     this.location.setValue('', [Validators.required])
    //     console.log(location, 'LOC')

    //   } else{
    //     this.location.setValue(this.selectedShop.location, [Validators.required])
    //     console.log(location, 'LOC')

    //   }
    // })
    this.getMySuppliers({ shop_id: '' });
    this.getTotal();
  }
  addItemList() {
    this.item_list.push(this.formBuilder.group({
      product_id: ['', [Validators.required]],
      name: [''],
      quantity: ['', [Validators.required]],
      supplier_price: [''],
    }));
  }
  deleteItemList(index) {
    this.item_list.removeAt(index);
  }
  /**
 * Get unit of purchaseOrderRequests of a shop
 * @param shopId Shop ID
 */
  getPurchaseOrderRequests(shopId) {
    this.isProcessing = true;
    this.productsService.getPurchaseOrders(shopId, (error, result) => {
      if (result !== null && result !== undefined && result.response_code === '100') {
        this.isProcessing = false;
        this.purchaseOrderRequests = result.results;
      }
    });
  }
 
  /**
  * Get my Customer
  * @param filterData IDashboardFilterParams interface
  */
   getMySuppliers(filterParam: IDashboardFilterParams) {
    this.suppliersApiCallsService.getSuppliers(filterParam, (error, result) => {
      if (result !== null && result.response_code === '100') {
        this.suppliers = result.results;
      }
    });
  }
  /**
  * Get selected Supplier info
  */
  onSelectSupplier() {
    this.dialog.open(SuppliersListDialogComponent).afterClosed().subscribe(supplier => {
      this.selectedSupplier = supplier;
    });
  }
  /**
  * Get selected Supplier info
  */
  onSelectShop() {
    this.dialog.open(SelectShopComponent).afterClosed().subscribe(shop => {
      this.selectedShop = shop;
    });
  }
  onDeleteSupplier() {
    this.selectedSupplier = null;
  }
  onDeleteShop() {
    this.selectedShop = null;
  }
  /**
  * Get selected product info
  */
  onSelectProduct(index: number) {
    this.dialog.open(ProductsListDialogComponent).afterClosed().subscribe(product => {
      this.selectedProduct = product;
      this.item_list.at(index).get('product_id').setValue(product.id);
      this.item_list.at(index).get('name').setValue(product.name);
      this.item_list.at(index).get('supplier_price').setValue(product.supplier_price);
    });
  }
  /**
  * Get shops of current logged in user
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
  * Get Total amount
  */
  getTotal() {
    this.total_amount = 0;
    this.item_list.controls.forEach(data => {
      this.total_amount += data.get('supplier_price')?.value * data.get('quantity')?.value;
    })
  }
  /**
  * Sending Purchase Order details to confirm dialog before submit
  */
  onViewSubmitOrder(){
    this.dialog.open(ConfirmPurchaseOrderDialogComponent, {data: { order: this.purchaseOrderFormGroup.value, supplier_id: this.selectedSupplier.id, shop_id: this.selectedShop.id}})
    .afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.router.navigate(['/purchase-orders']);
      }
    }); 
  }

  onChangeShippingAddress(){
    this.is_same_shipping_address.valueChanges.subscribe(value =>{
      if(this.is_same_shipping_address.value === false){
        this.location.setValue('')
      } else if (this.is_same_shipping_address.value === true){
        this.location.setValue(this.selectedShop.location)
      }
    })
  }

  get shop_id() { return this.purchaseOrderFormGroup.get('shop_id'); }
  get is_same_shipping_address() { return this.purchaseOrderFormGroup.get('is_same_shipping_address'); }
  get location() { return this.purchaseOrderFormGroup.get('location'); }
  get name() { return this.purchaseOrderFormGroup.get('name'); }
  get quantity() { return this.purchaseOrderFormGroup.get('quantity'); }
  get supplier_price() { return this.purchaseOrderFormGroup.get('supplier_price'); }
  get item_list() { return this.purchaseOrderFormGroup.get('item_list') as FormArray; }
}
