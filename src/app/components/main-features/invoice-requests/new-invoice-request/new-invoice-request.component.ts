import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SelectShopComponent } from 'src/app/components/common/dialogs/select-shop/select-shop.component';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ITableHeaderActions } from 'src/app/interfaces/table-header-actions.interace';
import { CustomerApiCallsService } from 'src/app/services/network-calls/customer-api-calls.service';
import { ProductsService } from 'src/app/services/network-calls/products.service';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { CustomerFilterByEnum, InvoiceTypesEnums } from 'src/app/utils/enums';
import { CustomersListDialogComponent } from '../../customers/customers-list-dialog/customers-list-dialog.component';
import { ProductsListDialogComponent } from '../../products/products-list-dialog/products-list-dialog.component';
import { ConfirmInvoiceTypeDialogComponent } from '../confirm-invoice-type-dialog/confirm-invoice-type-dialog.component';

@Component({
  templateUrl: './new-invoice-request.component.html'
})
export class NewInvoiceRequestComponent implements OnInit {
  modalTitle = 'New Invoice Request'
  dialogTitle = '';
  selectedCustomer = null;
  selectedShop = null;
  pageHeaderOptions: IPageHeader;
  isProcessing = false;
  isPartner = false;
  customers = [];
  myShops = [];
  requestPayload = {};
  selectedCustomerType;
  tableHeaderOption: ITableHeaderActions;
  productDetail;
  invoiceFormGroup: FormGroup;
  invoiceTypes = InvoiceTypesEnums;
  shopInfo;
  items: FormArray[];
  invoiceRequests: [];
  storeId;
  selectedProduct = null;
  invoiceDate = new Date
  total_amount = 0

  constructor(
    private customerApiService: CustomerApiCallsService,
    private productsService: ProductsService,
    private shopsService: ShopsService,
    private router: Router,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.invoiceFormGroup = this.formBuilder.group({
      shop_id: [''],
      customer_id: [''],
      total_amount: this.total_amount,
      item_list: this.formBuilder.array([
        this.formBuilder.group({
          product_id: ['', [Validators.required]],
          name: [''],
          quantity: ['', [Validators.required]],
          selling_price: ['']
        })
      ])
    });
    this.getMyCustomers({ shop_id: '' });
    this.getTotal();
  }
  addItemList() {
    this.item_list.push(this.formBuilder.group({
      product_id: ['', [Validators.required]],
      name: [''],
      quantity: ['', [Validators.required]],
      selling_price: [''],
    }));
  }
  deleteItemList(index) {
    this.item_list.removeAt(index);
  }
  /**
 * Get unit of invoiceRequests of a shop
 * @param shopId Shop ID
 */
  getInvoiceRequests(shopId) {
    this.isProcessing = true;
    this.productsService.getInvoiceRequests(shopId, (error, result) => {
      if (result !== null && result !== undefined && result.response_code === '100') {
        this.isProcessing = false;
        this.invoiceRequests = result.results;
        if (this.invoiceRequests.length <= 0) {
        }
      }
    });
  }
  /**
  * Get my Customer
  * @param filterData IDashboardFilterParams interface
  */
  getMyCustomers(filterParam: IDashboardFilterParams) {
    this.customerApiService.getCustomers(filterParam, CustomerFilterByEnum.ALL, (error, result) => {
      if (result !== null && result.response_code === '100') {
        this.customers = result.results;
      }
    });
  }
  /**
  * Get selected customer info
  */
  onSelectCustomer() {
    this.dialog.open(CustomersListDialogComponent).afterClosed().subscribe(customer => {
      this.selectedCustomer = customer;
    });
  }
  onDeleteCustomer() {
    this.selectedCustomer = null;
  }
  /**
  * Get selected product info
  */
  onSelectProduct(index: number) {
    this.dialog.open(ProductsListDialogComponent).afterClosed().subscribe(product => {
      this.selectedProduct = product;
      this.item_list.at(index).get('product_id').setValue(product.id);
      this.item_list.at(index).get('name').setValue(product.name);
      this.item_list.at(index).get('selling_price').setValue(product.selling_price);
    });
  }
 /**
  * Get selected Supplier info
  */
  onSelectShop() {
    this.dialogTitle = 'Select Shop'
    this.dialog.open(SelectShopComponent).afterClosed().subscribe(shop => {
      this.selectedShop = shop;
      console.log(this.selectedShop.id, 'SHOP ID')
    });
  }
  onDeleteShop() {
    this.selectedShop = null;
  }
  /**
  * Get Total amount
  */
  getTotal() {
    this.total_amount = 0;
    this.item_list.controls.forEach(data => {
      this.total_amount += data.get('selling_price')?.value * data.get('quantity')?.value;
    })
  }
  /**
  * Sending invoice details to confirm dialog before submit
  */
  onViewSubmitInvoice(){
    this.dialog.open(ConfirmInvoiceTypeDialogComponent, {data: { newInvoice: this.invoiceFormGroup.value, shop_id: this.selectedShop.id, customer_id: this.selectedCustomer.id}})
    .afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.router.navigate(['/invoices']);
      }
    }); 
  }

  get shop_id() { return this.invoiceFormGroup.get('shop_id'); }
  get invoice_type() { return this.invoiceFormGroup.get('invoice_type'); }
  get name() { return this.invoiceFormGroup.get('name'); }
  get quantity() { return this.invoiceFormGroup.get('quantity'); }
  get selling_price() { return this.invoiceFormGroup.get('selling_price'); }
  get item_list() { return this.invoiceFormGroup.get('item_list') as FormArray; }
}
