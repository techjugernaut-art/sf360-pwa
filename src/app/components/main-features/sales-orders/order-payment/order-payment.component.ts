import { NotificationsService } from './../../../../services/notifications.service';
import { CustomersListDialogComponent } from './../../customers/customers-list-dialog/customers-list-dialog.component';
import { ProductsLocalDbCallsService } from './../../../../services/local-db-calls/products-local-db-calls.service';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { OrdersApiCallsService } from 'src/app/services/network-calls/orders-api-calls.service';
import { EnterMomoWalletNumberComponent } from './../enter-momo-wallet-number/enter-momo-wallet-number.component';
import { CurrencyEnums } from './../../../../utils/enums.util';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentMethodsEnum, TransactionStatusEnums } from 'src/app/utils/enums';
import * as moment from 'moment';
import { max } from 'rxjs/operators';
// import { PrintService, UsbDriver, WebPrintDriver } from 'ng-thermal-print';
// import { PrintDriver } from 'ng-thermal-print/lib/drivers/PrintDriver';

@Component({
  selector: 'app-order-payment',
  templateUrl: './order-payment.component.html',
  styleUrls: ['./order-payment.component.scss']
})
export class OrderPaymentComponent implements OnInit {
  isProcessing = false;
  splitPayCtrl = new FormControl(false);
  currencies = CurrencyEnums;
  paymentMethods = PaymentMethodsEnum;
  currency = '';
  paymentMethod = PaymentMethodsEnum.CASH;
  paymentNetwork = '';
  networkName = '';
  redirectUrl = '';
  discountPercentage = 0;
  discountAmount = 0;
  formGroup: FormGroup;
  customer: any;
  status = false;
  isChangePaymentMethod = false;
  orderItems = [];
  // usbPrintDriver: UsbDriver;
  // webPrintDriver: WebPrintDriver;
  ip = '';
  constructor(
    private dialogRef: MatDialogRef<OrderPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private constantValues: ConstantValuesService,
    // private printService: PrintService,
    private notificationsService: NotificationsService,
    private ordersApisCallsService: OrdersApiCallsService,
    private productLocalDb: ProductsLocalDbCallsService
  ) { }

  ngOnInit() {

    this.formGroup = new FormGroup({
      total_amount: new FormControl(''),
      payment_method: new FormControl(PaymentMethodsEnum.CASH, [Validators.required]),
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
      cash_tendered: new FormControl(0),
      cash_balance: new FormControl(0),
      payment_network: new FormControl(''),
      phone_number: new FormControl(''),
      payment_status: new FormControl(''),
      discount: new FormControl(0),
      frontend_order_datetime: new FormControl(''),
      vat_value: new FormControl(0),
      credit_amount_paid: new FormControl(0),
      bank_id: new FormControl(''),
      cheque_image: new FormControl(''),
      next_payment_date: new FormControl(''),
      is_instant: new FormControl(false),
      double_checkout_code: new FormControl(''),
      double_checkout_not_synced: new FormControl(false),
      device_name: new FormControl(''),
      location: new FormControl(''),
      location_name: new FormControl(''),
      order_note: new FormControl(''),
      shop_id: new FormControl(''),
      discount_object_id: new FormControl(''),
      cheque_number: new FormControl('')
    });
    if (this.data !== null && this.data !== undefined) {
      this.currency = this.data.currency;
      this.customer = this.data.customer;
      this.orderItems = this.data.order_items;
      this.isChangePaymentMethod = (this.data.isChangePaymentMethod || false);
      if (this.isChangePaymentMethod) {

      } else {

        this.order_items.setValue(this.data.order.order_items);
        this.total_amount.setValue(this.data.order.total_amount);
        this.cash_tendered.setValue(this.data.order.total_amount);
        this.shop_id.setValue(this.data.order.shop_id);

        if (this.data.order.customer !== null && this.data.order.customer !== undefined) {
          this.customer_id.setValue(this.data.order.customer.id);
          this.customer_email.setValue(this.data.order.customer.email);
          this.customer_name.setValue(this.data.order.customer.name);
          this.customer_phone_number.setValue(this.data.order.customer.phone_number);
          this.customer_address.setValue(this.data.order.customer.address);
        }
      }

    }
    // this.usbPrintDriver = new UsbDriver();
    //     this.printService.isConnected.subscribe(result => {
    //         this.status = result;
    //         if (result) {
    //             console.log('Connected to printer!!!');
    //         } else {
    //         console.log('Not connected to printer.');
    //         }
    //     });
    //   this.usbPrintDriver.requestUsb().subscribe(result => {
    //     console.log(result);
    //     this.printService.setDriver(this.usbPrintDriver, 'ESC/POS');
    // });
  }

  onClose() {
    this.dialogRef.close(null);
  }
  selectPaymentMethod(paymentMethod, paymentNetwork, networkFullName) {
    this.paymentMethod = paymentMethod;
    this.paymentNetwork = paymentNetwork;
    this.networkName = networkFullName;
    this.payment_method.setValue(paymentMethod);
    this.phone_number.clearValidators();
    this.payment_voucher_code.clearValidators();
    this.next_payment_date.clearValidators();
    this.next_payment_date.setValue('');

    if (paymentMethod === PaymentMethodsEnum.MOMO) {
      this.phone_number.setValidators([Validators.required]);
      this.dialog.open(EnterMomoWalletNumberComponent).afterClosed().subscribe(paymentData => {
        if (paymentData !== null && paymentData !== undefined) {
          this.phone_number.setValue(paymentData.phone_number);
          this.customer_phone_number.setValue(paymentData.phone_number);
          this.payment_network.setValue(paymentData.payment_network);
          this.payment_voucher_code.setValue(paymentData.payment_voucher_code);
          this.paymentMethod = paymentData.payment_method;
          this.paymentNetwork = paymentData.payment_network;
          this.networkName = paymentData.network_name;
        }
      });
    } else if (paymentMethod === PaymentMethodsEnum.CREDIT_SALE) {
      this.next_payment_date.setValidators([Validators.required]);
      this.next_payment_date.setValue(moment().add(7, 'days').format('MM/DD/YYYY'));
      if (this.customer_name.value === '' && this.customer_phone_number.value === '') {
        this.dialog.open(CustomersListDialogComponent, { disableClose: true }).afterClosed().subscribe(customer => {
          if (customer !== null && customer !== undefined) {
            this.customer_name.setValue(customer?.name);
            this.customer_phone_number.setValue(customer?.phone_number);
          }
        });
      }
    } else if (paymentMethod === PaymentMethodsEnum.PAYMENT_LINK || paymentMethod === PaymentMethodsEnum.MOMO || paymentMethod === PaymentMethodsEnum.SPLIT_PAYMENT) {
      if (this.customer_name.value === '' && this.customer_phone_number.value === '') {
        this.dialog.open(CustomersListDialogComponent, { disableClose: true }).afterClosed().subscribe(customer => {
          if (customer !== null && customer !== undefined) {
            this.customer_name.setValue(customer?.name);
            this.customer_phone_number.setValue(customer?.phone_number);
          }
        });
      }
    }
  }
  placeOrder(data) {
    // tslint:disable-next-line: max-line-length
    data.next_payment_date = (data.next_payment_date !== '' && data.next_payment_date !== undefined && data.next_payment_date !== null) ? moment(data.next_payment_date).format(this.constantValues.SLASH_DD_MM_YYYY_DATE_FORMAT) : '';
    if (this.paymentMethod === PaymentMethodsEnum.CREDIT_SALE && +data.credit_amount_paid <= 0) {
      data.payment_status = TransactionStatusEnums.SUCCESS;
    }
    if (this.paymentMethod === PaymentMethodsEnum.CASH) {
      data.payment_status = TransactionStatusEnums.SUCCESS;
    }
    if (this.paymentMethod === PaymentMethodsEnum.PAYMENT_LINK || this.paymentMethod === PaymentMethodsEnum.MOMO || this.paymentMethod === PaymentMethodsEnum.SPLIT_PAYMENT) {
      if (data.customer_phone_number === null || data.customer_phone_number === undefined || data.customer_phone_number === '') {
        this.dialog.open(CustomersListDialogComponent, { disableClose: true }).afterClosed().subscribe(customer => {
          if (customer !== null && customer !== undefined) {
            this.customer_name.setValue(customer?.name);
            this.customer_phone_number.setValue(customer?.phone_number);
            data.customer_name = customer?.name;
            data.customer_phone_number = customer?.phone_number;
          }
        });
        return;
      }
    }

    this.isProcessing = true;
    this.ordersApisCallsService.placeOrder(data, (error, result) => {
      this.isProcessing = false;
      if (result !== null) {
        this.orderItems.forEach(orderData => {
          this.productLocalDb.updatePersistedProducts(orderData.sku, (e, r) => {
          });
        })
        this.dialogRef.close(result);
      }
    });
  }

  get phone_number() { return this.formGroup.get('phone_number'); }
  get payment_voucher_code() { return this.formGroup.get('payment_voucher_code'); }
  get order_note() { return this.formGroup.get('order_note'); }
  get total_amount() { return this.formGroup.get('total_amount'); }
  get payment_method() { return this.formGroup.get('payment_method'); }
  get customer_id() { return this.formGroup.get('customer_id'); }
  get customer_email() { return this.formGroup.get('customer_email'); }
  get customer_name() { return this.formGroup.get('customer_name'); }
  get customer_phone_number() { return this.formGroup.get('customer_phone_number'); }
  get customer_address() { return this.formGroup.get('customer_address'); }
  get frontend_order_id() { return this.formGroup.get('frontend_order_id'); }
  get order_items() { return this.formGroup.get('order_items'); }
  get cash_tendered() { return this.formGroup.get('cash_tendered'); }
  get cash_balance() { return this.formGroup.get('cash_balance'); }
  get payment_network() { return this.formGroup.get('payment_network'); }
  get payment_status() { return this.formGroup.get('payment_status'); }
  get discount() { return this.formGroup.get('discount'); }
  get frontend_order_datetime() { return this.formGroup.get('frontend_order_datetime'); }
  get vat_value() { return this.formGroup.get('vat_value'); }
  get credit_amount_paid() { return this.formGroup.get('credit_amount_paid'); }
  get bank_id() { return this.formGroup.get('bank_id'); }
  get next_payment_date() { return this.formGroup.get('next_payment_date'); }
  get cheque_image() { return this.formGroup.get('cheque_image'); }
  get cheque_number() { return this.formGroup.get('cheque_number'); }
  get shop_id() { return this.formGroup.get('shop_id'); }
}
