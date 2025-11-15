import { ConfirmPremiumPaymentComponent } from './../../premium-payments/confirm-premium-payment/confirm-premium-payment.component';
import { PaymentMethodsEnum } from './../../../../utils/enums';
import { AfterSalesDialogComponent } from './../after-sales-dialog/after-sales-dialog.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BroadcastService } from 'src/app/services/broadcast.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { SetActiveShopComponent } from '../../../common/dialogs/set-active-shop/set-active-shop.component';
import { AuthService } from 'src/app/services/auth.service';
import { OrderPaymentComponent } from '../order-payment/order-payment.component';
import { CustomersListDialogComponent } from '../../customers/customers-list-dialog/customers-list-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ProductsService } from 'src/app/services/network-calls/products.service';
import { DashboardApiCallsService } from 'src/app/services/network-calls/dashboard-api-calls.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { AllowIn, KeyboardShortcutsComponent, ShortcutEventOutput, ShortcutInput } from 'ng-keyboard-shortcuts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-sales-order',
  templateUrl: './new-sales-order.component.html',
  styleUrls: ['./new-sales-order.component.scss']
})
export class NewSalesOrderComponent implements OnInit, AfterViewInit {
  pageTitle: 'Process New Order';
  selectedCustomer = null;
  customerName = 'N/A';
  productGroups = [];
  businessAlerts = [];
  shopProducts = [];
  tempShopProducts = [];
  tempOrderItems = [];
  shopId = '';
  shop;
  isProcessingBusinessAlerts: boolean;
  formGroup: FormGroup;
  salesOrderFormGroup: FormGroup;

  @ViewChild('rightDrawer', { static: false }) rightDrawer: MatSidenav;
  @ViewChild(MatSidenav, { static: false }) drawer: MatSidenav;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  isProcessing: boolean;
  shortcuts: ShortcutInput[] = [];
  @ViewChild('searchInput') input: ElementRef;
  @ViewChild(KeyboardShortcutsComponent) private keyboard: KeyboardShortcutsComponent;
  searchInputControl: FormControl = new FormControl('');

  // keyboardEventsManager: ListKeyManager;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private productsService: ProductsService,
    private dialog: MatDialog,
    private authService: AuthService,
    private bottomSheet: MatBottomSheet,
    private notificationsService: NotificationsService,
    private dashboardService: DashboardApiCallsService,
    private broadcastService: BroadcastService,
    private router: Router
  ) { }

  ngOnInit() {
    // this.dialog.open(AfterSalesDialogComponent, {data: {sales_order:this.shop , currency: this.shop, order_items: this.tempOrderItems }, disableClose: true})

    this.formGroup = new FormGroup({
      customer_id: new FormControl('', [Validators.required]),
      data: new FormArray([], [Validators.required])
    });
    this.salesOrderFormGroup = new FormGroup({
      total_amount: new FormControl(''),
      payment_method: new FormControl(''),
      payment_response_code: new FormControl(''),
      payment_response_message: new FormControl(''),
      payment_reference: new FormControl(''),
      payment_voucher_code: new FormControl(''),
      payment_card_type: new FormControl(''),
      customer_email: new FormControl(''),
      customer_name: new FormControl(''),
      customer_phone_number: new FormControl(''),
      customer_address: new FormControl(''),
      customer_id: new FormControl(''),
      frontend_order_id: new FormControl(''),
      order_items: new FormControl(''),
      cash_tendered: new FormControl(''),
      cash_balance: new FormControl(''),
      payment_network: new FormControl(''),
      payment_status: new FormControl(''),
      discount: new FormControl(''),
      frontend_order_datetime: new FormControl(''),
      vat_value: new FormControl(''),
      credit_amount_paid: new FormControl(''),
      bank_id: new FormControl(''),
      cheque_image: new FormControl(''),
      next_payment_date: new FormControl(''),
      is_instant: new FormControl(false),
      double_checkout_code: new FormControl(''),
      double_checkout_not_synced: new FormControl(false),
      device_name: new FormControl(''),
      note: new FormControl(''),
      discount_object_id: new FormControl(''),
      cheque_number: new FormControl(''),
      currency: new FormControl('')
    });
    this.broadcastService.onCurrentShopChanged.subscribe(shop => {
      if (shop !== null) {
        window.location.reload();
        this.shopId = shop.id;
        this.getMyProducts({ shop_id: this.shopId });
        this.getMyProductGroups({ shop_id: this.shopId });
        // window.location.reload();
      }
    });
    
    this.broadcastService.onRefresh.subscribe(isRefreshed => {
      if (isRefreshed) {
        this.getMyProducts({ shop_id: this.shopId });
        this.getMyProductGroups({ shop_id: this.shopId });
      }
    });
    if (this.authService.getActiveShop !== null && this.authService.getActiveShop !== undefined) {
      this.shop = JSON.parse(this.authService.getActiveShop);
      this.shopId = this.shop.id;
      this.getMyProducts({ shop_id: this.shopId });
      this.getMyProductGroups({ shop_id: this.shopId });
    } else {
      this.dialog.open(SetActiveShopComponent).afterClosed().subscribe(shop => {
        if (shop !== null && shop !== undefined) {
          this.shop = shop;
          this.shopId = this.shop.id;
          this.getMyProducts({ shop_id: this.shopId });
          this.getMyProductGroups({ shop_id: this.shopId });
        }
      });
    }
    this.searchInputControl.valueChanges.subscribe((searchT: string) => {
      const searchTerm = searchT.toLowerCase();
      if (searchTerm === null || searchTerm === undefined || searchTerm === '') {
        this.shopProducts = JSON.parse(JSON.stringify(this.tempShopProducts));
      } else {
        this.shopProducts = JSON.parse(JSON.stringify(this.tempShopProducts.filter(product => ((product.name !== null && product.name !== undefined) ? product.name as string : '').toLowerCase().indexOf(searchTerm) >= 0 || ((product.description !== null && product.description !== undefined) ? product.description as string : '').toLowerCase().indexOf(searchTerm) >= 0)));
      }
    });
  }
  ngAfterViewInit(): void {
    this.shortcuts.push(
      {
        key: ['cmd + f', 'ctrl + f'],
        label: 'Search Product',
        description: 'Search product',
        allowIn: [AllowIn.Textarea, AllowIn.Input, AllowIn.Select],
        command: (output: ShortcutEventOutput) => this.input.nativeElement.focus(),
        preventDefault: true
      },
      {
        key: ['cmd + b', 'ctrl + b'],
        label: 'Scan barcode',
        description: 'Scan barcode of prodiuct',
        allowIn: [AllowIn.Textarea, AllowIn.Input, AllowIn.Select],
        command: (output: ShortcutEventOutput) => this.input.nativeElement.focus(),
        preventDefault: true
      }, {
      key: ['cmd + d', 'ctrl + d'],
      label: 'Clear Cart',
      description: 'Clear all items from cart',
      allowIn: [AllowIn.Textarea, AllowIn.Input, AllowIn.Select],
      command: (output: ShortcutEventOutput) => this.clearCart(),
      preventDefault: true
    }, {
      key: ['cmd + g', 'ctrl + g'],
      label: 'Customer',
      description: 'Select customer',
      allowIn: [AllowIn.Textarea, AllowIn.Input, AllowIn.Select],
      command: (output: ShortcutEventOutput) => this.onSelectCustomer(),
      preventDefault: true
    }, {
      key: ['cmd + enter', 'ctrl + enter'],
      label: 'Process Order',
      description: 'Shows order payment dialog',
      allowIn: [AllowIn.Textarea, AllowIn.Input, AllowIn.Select],
      command: (output: ShortcutEventOutput) => this.onPlaceOrder(),
      preventDefault: true
    }
    );

    // this.keyboard.select('cmd + f').subscribe(e => console.log(e));
  }
  /**
      * Get Total of All Items and Amount
      */
  get getTotalItemAndAmount() {
    const totals = { amount: 0, quantity: 0, currency: '' };
    if (this.formArray.controls.length > 0) {
      this.formArray.controls.forEach((data: FormGroup) => {
        totals.amount = totals.amount + +data.get('total_amount').value;
        totals.quantity = +totals.quantity + +data.get('qty').value;
        totals.currency = data.get('currency').value;
      });
    }
    return totals;
  }
  onShowNotifications() {
    this.rightDrawer.toggle();
    this.getBusinessAlerts({ shop_id: this.shopId });
  }
  /**
  * Get business alerts
  * @param filterData IDashboardFilterParams interface
  */
  getBusinessAlerts(filterData: IDashboardFilterParams) {
    this.isProcessingBusinessAlerts = true;
    this.dashboardService.getBusinessAlerts(filterData, (error, result) => {
      this.isProcessingBusinessAlerts = false;
      if (result !== null && result.response_code === '100') {
        this.businessAlerts = result.results;
      }
    });
  }
  clearCart() {
    this.formArray.clear();
    this.shopProducts = JSON.parse(JSON.stringify(this.tempShopProducts));
  }
  onSelectCustomer() {
    this.dialog.open(CustomersListDialogComponent).afterClosed().subscribe(customer => {
      this.customerName = (customer !== null && customer !== undefined) ? customer.name : 'N/A';
      this.selectedCustomer = customer;
    });
  }
  onProductGroupSelected(index: number) {
    if (index === 0) {
      this.shopProducts = this.tempShopProducts;
    } else {
      const productGroupId = (this.productGroups[index - 1] !== undefined && this.productGroups[index - 1] !== null ) ? this.productGroups[index - 1].id : '';
      this.shopProducts = this.tempShopProducts.filter(data => ((data.product_group !== null && data.product_group !== undefined) ? data.product_group.id : '') === productGroupId);
    }
  }
  /**
 * Increase or decrease sku order quantity and updating form
 * @param index Index
 * @param operator Mathematics operator to apply (-/+)
 */
  increaseOrDecreaseQuantity(index: number, operator) {
    let newQty = 0;
    let newQtyWithMultiplier = 0;
    let totalAmount = 0;
    const qty = +this.formArray.controls[index].get('qty').value;
    const price = +this.formArray.controls[index].get('price').value;
    const newPrice = +this.formArray.controls[index].get('price').value;
    const pIndex = this.formArray.controls[index].get('p_index').value;
    const baseUnitMultiplier = +this.formArray.controls[index].get('base_unit_multiplier').value;
    const existingQty = this.tempShopProducts[pIndex].new_quantity;
    const oldExistingQty = this.shopProducts[pIndex].new_quantity;


    if (operator === '+') {
      newQty = qty + 1;
      newQtyWithMultiplier = newQty * baseUnitMultiplier;
      if (newQtyWithMultiplier > existingQty) {
        this.notificationsService.snackBarErrorMessage(`Quantity cannot exceed ${existingQty}`);
        return;
      }
      totalAmount = newPrice * newQty;
      this.formArray.controls[index].get('qty').setValue(newQty);
      this.formArray.controls[index].get('total_amount').setValue(totalAmount);

      this.shopProducts[pIndex].new_quantity = oldExistingQty - baseUnitMultiplier;
    } else if (operator === '-') {
      newQty = qty - 1;
      newQtyWithMultiplier = newQty * baseUnitMultiplier;
      if (newQty <= 0) {
        this.notificationsService.snackBarErrorMessage('Quantity must be above 0');
        return;
      }
      totalAmount = newPrice * newQty;
      this.formArray.controls[index].get('qty').setValue(newQty);
      this.formArray.controls[index].get('total_amount').setValue(totalAmount);
      const pIndex = this.formArray.controls[index].get('p_index').value;
      this.shopProducts[pIndex].new_quantity = oldExistingQty + baseUnitMultiplier;;
    }
  }
   getCurrentQuantity(id): number {
    const prod = this.tempShopProducts.find(data => data.id == id);
    return (prod !== null && prod !== undefined) ? prod.new_quantity : 0;
  }

  onPriceEdited(event, index) {
    // Update total_amount based on adjusted quantity and price
    const newPrice = event.target.value;
    const qty = this.formArray.controls[index].get('qty').value;
    const totalAmount = newPrice * qty;
    this.formArray.controls[index].get('total_amount').setValue(totalAmount);
  }
  
  /**
   * Get my products
   * @param filterData IDashboardFilterParams interface
   */
  getMyProducts(filterData: IDashboardFilterParams) {
    this.isProcessing = true;
    this.productsService.getMyProductsLocalFirstNewImplementation(filterData, (error, result) => {
      this.isProcessing = false;
      if (result !== null) {
        this.shopProducts = Object.assign([], result.results);
        this.tempShopProducts = JSON.parse(JSON.stringify(result.results));
      }
    });
  }

  /**
    * Add SKU to cart
    * @param sku SKU
  */
  onAddSKU(sku, priceList: any[], qty: number, pIndex, unitName='item', isRoot = true) {
    if (priceList.length <= 0 && unitName === 'item' && isRoot) {
      this.priceList(pIndex, sku, sku.selling_price, qty, 0, '', unitName);  
    } else {
      if (!isRoot) {
        const unit = priceList.find(data => data.unit_name === unitName);
        this.priceList(pIndex, sku, unit.selling_price, qty, 0, unit.id, unitName, '', +unit.base_unit_multiplier);
      }
    }
  }
  priceList(pIndex, sku, sellingPrice, qty, vatPrice, unitId, unitName, price_list_id = '', baseUnitMultipler = 1) {
    let isNew = true;
    if (this.formArray.controls.length > 0) {
      this.formArray.controls.forEach((data, index) => {
        if (data.get('sku').value.id === sku.id && data.get('unit_id').value === unitId) {
          const newQty = +data.get('qty').value + qty;
          const totalAmount = newQty * sellingPrice;
          const totalInclusive = newQty * sellingPrice;
          const totalExclusive = newQty * sellingPrice;
          this.formArray.controls[index].get('qty').setValue(newQty);
          this.formArray.controls[index].get('sku').setValue(sku);
          this.formArray.controls[index].get('unit_id').setValue(unitId);
          this.formArray.controls[index].get('unit_name').setValue(unitName);
          this.formArray.controls[index].get('price').setValue(sellingPrice);
          this.formArray.controls[index].get('currency').setValue(sku.currency);
          this.formArray.controls[index].get('total_amount').setValue(totalAmount);
          this.formArray.controls[index].get('total_vat_inclusive').setValue(totalInclusive);
          this.formArray.controls[index].get('total_vat_exclusive').setValue(totalExclusive);
          this.formArray.controls[index].get('vat_price').setValue(vatPrice);
          this.formArray.controls[index].get('price_list_id').setValue(price_list_id);
          this.formArray.controls[index].get('image').setValue(sku.image);
          this.formArray.controls[index].get('p_index').setValue(pIndex);
          this.formArray.controls[index].get('base_unit_multiplier').setValue(baseUnitMultipler);
          this.formArray.controls[index].get('new_quantity').setValue(this.getCurrentQuantity(sku?.id));
          isNew = false;
        }
      });
    }
    if (isNew) {
      const totalAmount = qty * sellingPrice;
      const totalInclusive = qty * sellingPrice;
      const totalExclusive = qty * sellingPrice;
      // tslint:disable-next-line: max-line-length
      // this.selectedSKUs.push({sku: sku, qty: qty, unit: skuItem.unit, price: skuItem.price, currency: skuItem.currency, total_amount: totalAmount });
      this.formArray.push(new FormGroup({
        sku: new FormControl(sku, [Validators.required]),
        qty: new FormControl(qty, [Validators.required]),
        unit_id: new FormControl(unitId, [Validators.required]),
        unit_name: new FormControl(unitName, [Validators.required]),
        price: new FormControl(sellingPrice, [Validators.required]),
        currency: new FormControl(sku.currency, [Validators.required]),
        total_amount: new FormControl(totalAmount, [Validators.required]),
        vat_price: new FormControl(vatPrice),
        total_vat_inclusive: new FormControl(totalInclusive),
        total_vat_exclusive: new FormControl(totalExclusive),
        price_list_id: new FormControl(price_list_id),
        image: new FormControl(sku.image),
        p_index: new FormControl(pIndex),
        base_unit_multiplier: new FormControl(baseUnitMultipler),
        new_quantity: new FormControl(this.getCurrentQuantity(sku?.id))
      }));

      this.shopProducts[pIndex].new_quantity -= (qty * baseUnitMultipler);
    }
  }
  //TODO: check quantity remaining before droping
  onQuantityEdited(inputQty, index) {
    const pIndex = this.formArray.controls[index].get('p_index').value;
    const baseUnitMultipler = this.formArray.controls[index].get('base_unit_multiplier').value;
    const qtyRemanining = +this.tempShopProducts[pIndex].new_quantity;
    const totalAmount = +inputQty * +this.formArray.controls[index].get('price').value;
    this.formArray.controls[index].get('total_amount').setValue(totalAmount);
    this.shopProducts[pIndex].new_quantity = qtyRemanining - (+inputQty * baseUnitMultipler);
  }
  /**
 *
 * @param index index at which to remove sku
 */
  onRemoveSKU(index) {
    this.formArray.removeAt(index);
  }
  /**
* Get my products
* @param filterData IDashboardFilterParams interface
*/
  getMyProductGroups(filterData: IDashboardFilterParams) {
    this.productsService.getProductGroups(filterData.shop_id, (error, result) => {
      if (result !== null && result !== undefined && result.response_code === '100') {
        this.productGroups = result.results;

      }
    });
  }
  onPlaceOrder() {
    if (this.formArray.controls.length > 0) {
      if (this.authService.getActiveShop !== null && this.authService.getActiveShop !== undefined) {
        this.shop = JSON.parse(this.authService.getActiveShop);
        this.shopId = this.shop.id;
        this.placingOrder(this.shopId);
      } else {
        this.dialog.open(SetActiveShopComponent).afterClosed().subscribe(shop => {
          if (shop !== null && shop !== undefined) {
            this.shop = shop;
            this.shopId = this.shop.id;
            this.placingOrder(this.shopId);
          }
        });
      }
    } else {
      this.notificationsService.snackBarErrorMessage('Please add item to cart to process order');
    }
  }
  placingOrder(shopId) {
    this.tempOrderItems = JSON.parse(JSON.stringify(this.formArray.value));
    // tslint:disable-next-line: max-line-length
    const orderItems = this.formArray.value.map(elem => elem.sku.id + ':' + elem.qty + ':' + elem.total_amount + ':' + elem.sku.selling_price + ':' + elem.price_list_id + ':' + elem.vat_price).join(',');
    // tslint:disable-next-line: max-line-length
    const data = { total_amount: this.getTotalItemAndAmount.amount, shop_id: shopId, order_items: orderItems, customer: this.selectedCustomer };
    const currency = this.getTotalItemAndAmount.currency;
    this.dialog.open(OrderPaymentComponent, { data: { order: data, currency: currency, order_items: this.formArray.value } })
      .afterClosed().subscribe((result) => {
        if (result !== null && result !== undefined) {
          this.notificationsService.snackBarMessage('Order successfully placed');
          this.selectedCustomer = null;
          this.customerName = 'N/A';
          this.clearCart();
          if (result.data.payment_method === PaymentMethodsEnum.MOMO) {
            this.dialog.open(ConfirmPremiumPaymentComponent, {data: {order: result.data, IsTransactionStatusCheck: true, currency: currency, order_items: this.formArray.value}}).afterClosed().subscribe(() => {
              this.dialog.open(AfterSalesDialogComponent, {data: {sales_order: result.data, currency: currency, order_items: this.tempOrderItems }, disableClose: true})

            })
          } else {
            this.dialog.open(AfterSalesDialogComponent, {data: {sales_order: result.data, currency: currency, order_items: this.tempOrderItems }, disableClose: true})

          }
        }
      });
  }
  onAddProduct(){
    this.router.navigate(['/products/create'])
  }

  get selected_customer_id() { return this.formGroup.get('customer_id'); }
  get total_amount() { return this.salesOrderFormGroup.get('total_amount'); }
  get payment_method() { return this.salesOrderFormGroup.get('payment_method'); }
  get customer_id() { return this.salesOrderFormGroup.get('customer_id'); }
  get frontend_order_id() { return this.salesOrderFormGroup.get('frontend_order_id'); }
  get order_items() { return this.salesOrderFormGroup.get('order_items'); }
  get cash_tendered() { return this.salesOrderFormGroup.get('cash_tendered'); }
  get cash_balance() { return this.salesOrderFormGroup.get('cash_balance'); }
  get payment_network() { return this.salesOrderFormGroup.get('payment_network'); }
  get payment_status() { return this.salesOrderFormGroup.get('payment_status'); }
  get discount() { return this.salesOrderFormGroup.get('discount'); }
  get frontend_order_datetime() { return this.salesOrderFormGroup.get('frontend_order_datetime'); }
  get vat_value() { return this.salesOrderFormGroup.get('vat_value'); }
  get credit_amount_paid() { return this.salesOrderFormGroup.get('credit_amount_paid'); }
  get bank_id() { return this.salesOrderFormGroup.get('bank_id'); }
  get next_payment_date() { return this.salesOrderFormGroup.get('next_payment_date'); }
  get cheque_image() { return this.salesOrderFormGroup.get('cheque_image'); }
  get cheque_number() { return this.salesOrderFormGroup.get('cheque_number'); }
  get formArray() { return this.formGroup.get('data') as FormArray; }
}
