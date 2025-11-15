import { IJsPDFAutoTableColumn } from './../interfaces/jspdf-autotable-columns';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { Injectable } from '@angular/core';
import { ExportDocumentsService } from './export-documents.service';
import * as moment from 'moment';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DataExportUtilsService {

  constructor(
    private exportDocument: ExportDocumentsService,
    private constantValues: ConstantValuesService,
    private decimalPipe: DecimalPipe
  ) { }
  transformDecimal(num) {
    return this.decimalPipe.transform(num, '1.2-2');
  }
  /**
   * Export Sales Summary report as excel file
   * @param dataSet Data to download
   */
  exportSummaryAsExcel(title: string, dataSet: any[]) {
    const csvData = [];
    dataSet.forEach(data => {
      csvData.push({
        'PRODUCT NAME': data.product_name,
        'QTY IN STOCK': data.quantity_left,
        'SUPPLIER PRICE': data.supplier_price,
        'SELLING PRICE': data.selling_price,
        'QUANTITY SOLD': data.quantity_sold,
        'AMOUNT': data.amount_sold,
        'SALES MARGIN': data.sales_margin,
        'IS SERVICE': data.is_service
      });
    });
    this.exportDocument.exportAsCSV(title + '_' + moment().format('DD_MM_YYYY').toString(), csvData);
  }

  /**
  * Export Sales Orders as CSV
  */
  exportSalesOrdersAsCSV(salesOrders: any[]) {
    const csvData = [];
    let myItems = [];
    salesOrders.forEach(data => {
      myItems = data.myitems;
      myItems.forEach(item => {
        let qtyBefore = 'N/A';
        let qtyAfter = 'N/A';
        if (item.my_product.is_service === false) {
          qtyBefore = item.product_quantity_before;
          qtyAfter = item.product_quantity_after;
        }
        csvData.push({
          'DATE PLACED': moment(data.date_placed).format('MM/DD/YYYY, HH:mm:ss'),
          'SHOP NAME': data.myshop.business_name,
          'ORDER CODE': data.order_code,
          'PRODUCT': item.my_product.name,
          'SUPPLIER PRICE': item.my_product.supplier_price,
          'SELLING PRICE': item.product_price,
          'QUANTITY BEFORE': qtyBefore,
          'QUANTITY SOLD': item.new_quantity,
          'QUANTITY AFTER': qtyAfter,
          'SUBTOTAL': item.subtotal,
          'CUSTOMER NAME': (data.customer !== null && data.customer !== undefined && data.customer !== '') ? data.customer.name : '',
          'CUSTOMER PHONE': (data.customer !== null && data.customer !== undefined && data.customer !== '') ? data.customer.phone_number : '',
          'AGENT': data.author.last_name + ' ' + data.author.first_name
        });
      });
    });
    this.exportDocument.exportAsCSV('Sales_Orders_' + moment().format('DD_MM_YYYY').toString(), csvData);
  }
  /**
 * Export Sales Orders as PDF
 */
  exportSalesOrdersAsPDF(salesOrders: any[], dateRange) {
    const csvData = [];
    let myItems = [];
    let totalAmount = 0;
    let totalQty = 0;
    let currency = '';
    salesOrders.forEach(data => {
      myItems = data.myitems;
      myItems.forEach(item => {
        let qtyBefore = 'N/A';
        let qtyAfter = 'N/A';
        if (item.my_product.is_service === false) {
          qtyBefore = item.product_quantity_before;
          qtyAfter = item.product_quantity_after;
        }
        csvData.push({
          'date_placed': moment(data.date_placed).format('MM/DD/YYYY, HH:mm:ss'),
          'business_name': data.myshop.business_name,
          'order_code': data.order_code,
          'product_name': item.my_product.name,
          'supplier_price': item.my_product.currency + ' ' + this.transformDecimal(+item.my_product.supplier_price),
          'product_price': item.my_product.currency + ' ' + this.transformDecimal(+item.product_price),
          'qtyBefore': qtyBefore,
          'new_quantity': this.transformDecimal(+item.new_quantity),
          'qtyAfter': qtyAfter,
          'subtotal': item.my_product.currency + ' ' + item.subtotal,
          'CUSTOMER_NAME': (data.customer !== null && data.customer !== undefined && data.customer !== '') ? data.customer.name : '',
          'CUSTOMER_PHONE': (data.customer !== null && data.customer !== undefined && data.customer !== '') ? data.customer.phone_number : '',
          'AGENT': data.author.last_name + ' ' + data.author.first_name
        });
        totalAmount += +item.subtotal;
        totalQty += +item.new_quantity;
        currency = item.my_product.currency;
      });
    });
    const columns: IJsPDFAutoTableColumn[] = [
      { header: 'DATE PLACED', dataKey: 'date_placed' },
      { header: 'SHOP', dataKey: 'business_name' },
      { header: 'ORDER CODE', dataKey: 'order_code' },
      { header: 'PRODUCT', dataKey: 'product_name' },
      { header: 'SUPPLIER PRICE', dataKey: 'supplier_price' },
      { header: 'SELLING PRICE', dataKey: 'product_price' },
      { header: 'QUANTITY BEFORE', dataKey: 'qtyBefore' },
      { header: 'QUANTITY SOLD', dataKey: 'new_quantity' },
      { header: 'QUANTITY AFTER', dataKey: 'qtyAfter' },
      { header: 'SUBTOTAL', dataKey: 'subtotal' },
      { header: 'CUSTOMER NAME', dataKey: 'CUSTOMER_NAME' }
    ];
    const footer = [{ 'date_placed': 'Total' , 'new_quantity': this.transformDecimal(totalQty), 'subtotal': currency + ' ' + this.transformDecimal(totalAmount)}];
    this.exportDocument.genericExportTablePDF('Sales Report', 'Sales_Orders_' + moment().unix().toString(), '', dateRange, columns , csvData, footer);

  }
  /**
 * Export Sales Orders as CSV
 */
  exportMallOrdersAsCSV(salesOrders: any[]) {
    const csvData = [];
    let myItems = [];
    salesOrders.forEach(data => {
      myItems = data.shop_mall_items;
      myItems.forEach(item => {
        csvData.push({
          'DATE PLACED': moment(data.date_placed).format('MM/DD/YYYY, HH:mm:ss'),
          'SHOP NAME': data.myshop.business_name,
          'PRODUCT': item.my_product.name,
          'SELLING PRICE': item.selling_price,
          'QUANTITY': item.quantity,
          'SUBTOTAL': item.subtotal,
          'CUSTOMER NAME': data.customer_name,
          'CUSTOMER PHONE': data.customer_phone_number,
          'ORDER NOTE': data.order_note,
          'PROMO CODE': data.promo_code,
          'DELIVERY ADDRESS': data.delivery_address
        });
      });
    });
    this.exportDocument.exportAsCSV('Mall_Orders_' + moment().format('DD_MM_YYYY').toString(), csvData);
  }
  /**
   * Export transaction as excell file
   * @param transactions transactions
   */
  exportTransactionsAsExcel(transactions: any[]) {
    const csvData = [];
    transactions.forEach(data => {
      let responseCode = data.payment_response_code;
      if (data.payment_method === 'CARD' && (data.payment_response_code === '' || data.payment_response_code === undefined)) {
        responseCode = 'INVESTIGATE';
      }
      csvData.push({
        'Shop Name': data.myshop.business_name,
        'Trans Date/Time': moment(data.time_created).format('MM/DD/YYYY, HH:MM:SS'),
        'Trans ID': data.transaction_id,
        'Trans Type': data.payment_method,
        'Currency': data.myshop.currency,
        'Trans Amount': data.credit_amt,
        'TRANSACTION LOCATION': data.myshop.location,
        'RESPONSE MESSAGE': data.payment_response_message,
        'TRANSACTION STATUS': data.transaction_status,
      });
    });
    this.exportDocument.exportAsCSV('transactions_' + moment().unix().toString(), csvData);
  }

  /**
  * Export transaction as excell file
  * @param transactions transactions
  */
  exportTransactionsAsPDF(transactions: any[], dateRange: any) {
    const csvData = [];
    let totalAmount = 0;
    let currency = '';
    transactions.forEach(data => {
      let responseCode = data.payment_response_code;
      if (data.payment_method === 'CARD' && (data.payment_response_code === '' || data.payment_response_code === undefined)) {
        responseCode = 'INVESTIGATE';
      }
      csvData.push({
        'date_placed': moment(data.time_created).format('MM/DD/YYYY, HH:MM:SS'),
        'business_name': data.myshop.business_name,
        'transaction_id': data.transaction_id,
        'payment_method': data.payment_method,
        'trans_amount':  data.myshop.currency + ' ' + this.transformDecimal(+data.credit_amt),
        // 'payment_response_message': data.payment_response_message,
        'transaction_status': data.transaction_status,
      });
      totalAmount += +data.credit_amt;
      currency = data.myshop.currency;
    });

    const columns: IJsPDFAutoTableColumn[] = [
      { header: 'TRANS DATE', dataKey: 'date_placed' },
      { header: 'SHOP', dataKey: 'business_name' },
      { header: 'TRANS ID', dataKey: 'transaction_id' },
      { header: 'TRANS TYPE', dataKey: 'payment_method' },
      { header: 'TRANS AMOUNT', dataKey: 'trans_amount' },
      // { header: 'RESP. MESSAGE', dataKey: 'payment_response_message' },
      { header: 'TRANS STATUS', dataKey: 'transaction_status' },
    ];
    const footer = [{ 'date_placed': 'Total' , 'trans_amount': currency + ' ' + this.transformDecimal(totalAmount) }];
    this.exportDocument.genericExportTablePDF('Transactions Report', 'transactions_' + moment().unix().toString(), '', dateRange, columns , csvData, footer);
  }

  /**
  * Export Products as CSV
  */
  exportProductsAsCSV(products: any[]) {
    const csvData = [];
    products.forEach(data => {
      const qty = (data.is_service === false) ? +data.new_quantity : 0;
      let supplierName = '';
      let supplierAddress = '';
      let supplierPhone = '';
      if (data.my_supplier !== null && data.my_supplier !== undefined && data.my_supplier !== '') {
        supplierName = data.my_supplier.name;
        supplierAddress = data.my_supplier.physical_address;
        supplierPhone = data.my_supplier.phone_number;
      }
      csvData.push({
        'PRODUCT NAME': data.name,
        'QUANTITY': qty,
        'SUPPLIER PRICE': +data.supplier_price,
        'UNIT PRICE': +data.selling_price,
        // tslint:disable-next-line: max-line-length
        'EXPIRY DATE': (data.expiry_date !== null && data.expiry_date !== undefined && data.expiry_date !== '') ? moment(data.expiry_date).format(this.constantValues.SLASH_MM_DD_YYYY_DATE_FORMAT) : '',
        'LOW STOCK THRESHOLD': +data.low_stock_threshold,
        'IS SERVICE': data.is_service,
        'VAT VAL(%)': +data.vat_value,
        'VAT INC.': data.vat_inclusive,
        'SUPPLIER NAME': supplierName,
        'SUPPLIER PHONE NUMBER': supplierPhone,
        'SUPPLIER ADDRESS': supplierAddress,
        // tslint:disable-next-line: max-line-length
        'PRODUCT CATEGORY': (data.product_group !== null && data.product_group !== undefined && data.product_group !== '') ? data.product_group.name : '',
        'BARCODE': data.serial_number
        // 'SHOP': (data.myshop !== null && data.myshop !== undefined && data.myshop !== '') ? data.myshop.business_name : ''
      });
    });
    this.exportDocument.exportAsCSV('Products_' + moment().format('DD_MM_YYYY').toString(), csvData);
  }


  /**
  * Export Sales Orders as CSV
  */
   exportStockHistoriesAsPDF(salesOrders: any[], shopName, productName, category, dateRange) {
    const csvData = [];
    let totalAmount = 0;
    let totalQty = 0;
    let myItems = [];
    let currency = '';
    salesOrders.forEach(data => {
      myItems = data.myitems;
      myItems.forEach(item => {

        csvData.push({
          'date_placed': moment(data.date_placed).format('MM/DD/YYYY, HH:mm:ss'),
          'order_code': data.order_code,
          'customer_name': (data.customer !== null && data.customer !== undefined && data.customer !== '') ? data.customer.name : '',
          // 'customer_phone_number': (data.customer !== null && data.customer !== undefined && data.customer !== '') ? data.customer.phone_number : '',
          'total_quantity': item.new_quantity + ' ' + item.unit_name,
          'selling_price': item.my_product.currency + ' ' + this.transformDecimal(+item.product_price),
          'total_amount': item.my_product.currency + ' ' + this.transformDecimal(+item.subtotal)
        });
        totalAmount += +item.subtotal;
        totalQty += +item.new_quantity;
        currency = item.my_product.currency;
      });
    });
    const columns: IJsPDFAutoTableColumn[] = [
      { header: 'DATE PLACED', dataKey: 'date_placed' },
      { header: 'ORDER CODE', dataKey: 'order_code' },
      { header: 'CUSTOMER', dataKey: 'customer_name' },
      // {header: 'CUSTOMER PHONE', dataKey: 'customer_phone_number'},
      { header: 'QTY SOLD', dataKey: 'total_quantity' },
      { header: 'UNIT PRICE', dataKey: 'selling_price' },
      { header: 'AMOUNT', dataKey: 'total_amount' },
    ];
    const footer = [{ 'date_placed': 'Total', 'total_quantity': this.transformDecimal(totalQty), 'total_amount': currency + ' ' + this.transformDecimal(totalAmount) }];
    this.exportDocument.exportTablePDF('ItemSalesReport' + moment().format('DD_MM_YYYY').toString(), shopName, productName, category, dateRange, columns, csvData, footer);
  }

  /**
  * Export Sales Orders as CSV
  */
   exportExpensesAsCSV(expenses: any[]) {
    const csvData = [];
    expenses.forEach(data => {
      csvData.push({
        'TRANS DATE': moment(data.transaction_date).format('MM/DD/YYYY'),
        'SHOP NAME': data.myshop.business_name,
        'CATEGORY': (data.category !== null && data.category !== undefined && data.category !== '') ? data.category.name : '',
        'NOTE': data.note,
        'CURRENCY': data.currency,
        'AMOUNT': +data.amount,
        'RECURRING INTERVAL': data.recurring_interval
      });
    });
    this.exportDocument.exportAsCSV('Expenses_' + moment().format('DD_MM_YYYY').toString(), csvData);
  }
  /**
 * Export Sales Orders as PDF
 */
  exportExpensesAsPDF(expenses: any[], dateRange) {
    const csvData = [];
    let myItems = [];
    let totalAmount = 0;
    let totalQty = 0;
    let currency = '';
    expenses.forEach(data => {
        csvData.push({
          'date_placed': moment(data.transaction_date).format('MM/DD/YYYY'),
          'business_name': data.myshop.business_name,
          'category': (data.category !== null && data.category !== undefined && data.category !== '') ? data.category.name : '',
          'note': data.note,
          'amount':  data.currency + ' ' + this.transformDecimal(+data.amount),
          'recurring_interval': data.recurring_interval
        });
        totalAmount += +data.amount;
        currency = data.currency;
    });
    const columns: IJsPDFAutoTableColumn[] = [
      { header: 'TRANS DATE', dataKey: 'date_placed' },
      { header: 'SHOP', dataKey: 'business_name' },
      { header: 'CATEGORY', dataKey: 'category' },
      { header: 'NOTE', dataKey: 'note' },
      { header: 'AMOUNT', dataKey: 'amount' },
      { header: 'RECURRING INTERVAL', dataKey: 'recurring_interval' }
    ];
    const footer = [{ 'date_placed': 'Total' , 'amount': currency + ' ' + this.transformDecimal(totalAmount)}];
    this.exportDocument.genericExportTablePDF('Expenses Report', 'Expenses_' + moment().unix().toString(), '', dateRange, columns , csvData, footer);

  }
}
export enum DocTypes {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
}

