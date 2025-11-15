import { Router } from '@angular/router';
import { EventTrackerActions, EventTrackerCategories } from 'src/app/utils/enums.util';
import { ComfirmProductUploadComponent } from './../comfirm-product-upload/comfirm-product-upload.component';
import { MatDialog } from '@angular/material/dialog';
import { AppUtilsService } from 'src/app/services/app-utils.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ITableHeaderActions } from 'src/app/interfaces/table-header-actions.interace';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { productUploadColumnNames } from 'src/app/interfaces/product-upload-data.interface';
import { ProductUploadColumnIndices } from 'src/app/models/product-upload-column-indices';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { BulkUploadTemplatesEnum } from 'src/app/utils/enums';


@Component({
  selector: 'app-product-upload',
  templateUrl: './product-upload.component.html',
  styleUrls: ['./product-upload.component.scss']
})
export class ProductUploadComponent implements OnInit {

  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  columnDefinitionFormGroup: FormGroup;
  pageHeaderOptions: IPageHeader;
  isProcessing = false;
  tableHeaderOption: ITableHeaderActions;
  uploadedProducts = [];
  shopProducts = [];
  myProducts = [];
  myProductsToUpload = [];
  clientColumns = [];
  headers = [];
  event: any;
  fileName;
  storeId;
  serverClientColumnNames = productUploadColumnNames;
  isProcessingProductUpload: boolean;
  currency;

  constructor(
    private appUtils: AppUtilsService,
    private dialog: MatDialog,
    private router: Router,
    ) { }

  ngOnInit() {
    // tslint:disable-next-line:max-line-length
    this.pageHeaderOptions = { pageTitle: 'Product Upload', hasShopsFilter: false, hideFilterPanel: true };
    this.columnDefinitionFormGroup = new FormGroup({
      columns: new FormArray([], [Validators.required])
    });
  }
  /**
   * Update shared data
   * @param data ISharedData
   */
  onDataRefreshed(data: ISharedData) {
    if (data !== null && data !== undefined) {
      this.storeId = data.shop_id;
    }
  }
  /**
      * Upload file
      * @param event event data from file input
      */
  onFileUploadChange(event) {
    this.appUtils.trackUserEvents(EventTrackerActions.upload_template_file, EventTrackerCategories.product_upload);
    if (event.target.files && event.target.files.length) {
      this.event = event;
      this.fileName = event.target.files[0].name;
      this.getClientColumnFromExcelSheet();
    }
  }
  findClientNameFromServerNames(clientColumnName) {
    return this.serverClientColumnNames.find(data => data.server_name === clientColumnName);
  }
  /**
   * Get columns of the excel sheet uploaded
   */
  getClientColumnFromExcelSheet() {
    if (this.event.target.files) {
      this.myProductsToUpload = [];
      const target: DataTransfer = <DataTransfer>(this.event.target);
      if (target.files.length !== 1) { throw new Error('Cannot use multiple files'); }
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        this.uploadedProducts = (XLSX.utils.sheet_to_json(ws, { header: 0, dateNF: 14, defval: '' }));
        const range = XLSX.utils.decode_range(ws['!ref']);
        const R = range.s.r; /* start in the first row */
        let C: any;
        let columnIndex = 0;
        /* walk every column in the range */
        for (C = range.s.c; C <= range.e.c; ++C) {
          const cell = ws[XLSX.utils.encode_cell({ c: C, r: R })]; /* find the cell in the first row */
          let hdr = ''; // <-- replace with your desired default
          if (cell && cell.t) {
            hdr = XLSX.utils.format_cell(cell);
          }
          if (hdr === '') {
            break;
          }
          const findResult = this.findClientNameFromServerNames(this.appUtils.replaceWhitespaceWithUnderscore(hdr.toLowerCase()));
          const serName =  (findResult !== null && findResult !== undefined) ? findResult.server_name : '';
          this.clientColumnDefinitions.push(new FormGroup({
            client_column_index: new FormControl(columnIndex),
            client_column: new FormControl(hdr),
            server_column: new FormControl(serName, [Validators.required])
          }));
          columnIndex += 1;
        }
        this.headers = this.clientColumnDefinitions.value;
      };
      reader.readAsBinaryString(target.files[0]);
    }
  }
  /**
   * Validate data before uploading
   */
  validateData() {
    this.appUtils.trackUserEvents(EventTrackerActions.validate_template_data, EventTrackerCategories.product_upload);
    if (this.columnDefinitionFormGroup.valid) {
      const columnIndices = new ProductUploadColumnIndices();
      this.clientColumnDefinitions.value.forEach(element => {
        columnIndices[element.server_column] = element.client_column_index;
      });
      this.myProducts = [];
      this.myProductsToUpload = [];
      this.uploadedProducts.forEach((data: Object, i, val) => {
        const bcode = new Date().getTime() - i;
        const millisecondDate = this.appUtils.padLeft(bcode.toString(), '0', 13);
        if (data !== null && data !== undefined) {
          const productNameColumnData = data[Object.keys(data)[columnIndices.product_name]];
          const quantityColumnData = data[Object.keys(data)[columnIndices.quantity]];
          const priceColumnData = data[Object.keys(data)[columnIndices.price]];
          const supplierPriceColumnData = data[Object.keys(data)[columnIndices.supplier_price]];
          const threshHoldColumnData = data[Object.keys(data)[columnIndices.low_stock_threshold]];
          const isServiceColumnData = data[Object.keys(data)[columnIndices.is_service]];
          const vatValueColumnData = data[Object.keys(data)[columnIndices.vat_value]];
          const isVatInclusiveColumnData = data[Object.keys(data)[columnIndices.vat_inclusive]];
          const supplierNameColumnData = data[Object.keys(data)[columnIndices.supplier_name]];
          const supplierPhoneNumberColumnData = data[Object.keys(data)[columnIndices.supplier_phone_number]];
          const supplierAddressColumnData = data[Object.keys(data)[columnIndices.supplier_address]];
          const productCategoryColumnData = data[Object.keys(data)[columnIndices.product_category]];
          const expiryDateColumnData = data[Object.keys(data)[columnIndices.expiry_date]];
          const barcodeColumnData = data[Object.keys(data)[columnIndices.barcode]];

          let price = 0;
          let supplierPrice = 0;
          let lowStockThreshold = 0;
          let vatValue = 0;
          let expiryDate = '';
          let isService = false;
          let isVatInclusive = false;
          if (priceColumnData !== '' && (typeof priceColumnData === 'number')) {
            price = priceColumnData;
          }
          if (vatValueColumnData !== '' && (typeof vatValueColumnData === 'number')) {
            vatValue = vatValueColumnData;
          }
          if (supplierPriceColumnData !== '' && (typeof supplierPriceColumnData === 'number')) {
            supplierPrice = supplierPriceColumnData;
          }
          if (threshHoldColumnData !== '' && (typeof threshHoldColumnData === 'number')) {
            lowStockThreshold = threshHoldColumnData;
          }
          if (expiryDateColumnData !== undefined && expiryDateColumnData !== '' && expiryDateColumnData !== null) {
            if (typeof expiryDateColumnData === 'number') {
              // tslint:disable-next-line: max-line-length
              expiryDate = (moment(moment(new Date(Math.round((expiryDateColumnData - 25569) * 86400 * 1000))).format('MM-DD-YYYY')).isValid) ? moment(new Date(Math.round((expiryDateColumnData - 25569) * 86400 * 1000))).format('MM-DD-YYYY') : '';
            } else {
              expiryDate = (moment(moment(expiryDateColumnData).format('MM-DD-YYYY')).isValid) ? moment(expiryDateColumnData).format('MM-DD-YYYY') : '';
            }
          }
          // tslint:disable-next-line:max-line-length
          if (isServiceColumnData !== undefined && isServiceColumnData !== '' && isServiceColumnData !== null && typeof (isServiceColumnData === Boolean)) {
            isService = isServiceColumnData;
          }
          // tslint:disable-next-line:max-line-length
          if (isVatInclusiveColumnData !== undefined && isVatInclusiveColumnData !== '' && isVatInclusiveColumnData !== null && typeof (isVatInclusiveColumnData === Boolean)) {
            isVatInclusive = isVatInclusiveColumnData;
          }

          // tslint:disable-next-line: max-line-length
          const barCode = (barcodeColumnData !== undefined && barcodeColumnData !== '' && barcodeColumnData !== null) ? barcodeColumnData : millisecondDate;
          let validData = false;
          // tslint:disable-next-line: max-line-length
          const qty = (quantityColumnData !== '' && (typeof quantityColumnData === 'number') && quantityColumnData !== undefined) ? +quantityColumnData : 0;
          // tslint:disable-next-line:max-line-length
          if (productNameColumnData !== '') {
            validData = true;
            // tslint:disable-next-line:max-line-length
            this.myProductsToUpload.push({ product_name: productNameColumnData, quantity: qty.toFixed(2), price: price.toFixed(2), supplier_price: supplierPrice.toFixed(2), low_stock_threshold: lowStockThreshold.toFixed(2), expiry_date: expiryDate, is_service: isService, vat_value: vatValue.toFixed(2), vat_inclusive: isVatInclusive, supplier_name: supplierNameColumnData, supplier_phone_number: supplierPhoneNumberColumnData, supplier_address: supplierAddressColumnData, product_category: productCategoryColumnData, barcode: barCode, serial_number: barCode });
          }
          // tslint:disable-next-line:max-line-length
          this.myProducts.push({ product_name: productNameColumnData, quantity: qty.toFixed(2), price: price.toFixed(2), supplier_price: supplierPrice.toFixed(2), low_stock_threshold: lowStockThreshold.toFixed(2), expiry_date: expiryDate, valid: validData, is_service: isService, vat_value: vatValue.toFixed(2), vat_inclusive: isVatInclusive, supplier_name: supplierNameColumnData, supplier_phone_number: supplierPhoneNumberColumnData, supplier_address: supplierAddressColumnData, product_category: productCategoryColumnData, barcode: barCode, serial_number: barCode });
        }
      });
    }
  }
  uploadProducts() {
    if (this.myProductsToUpload.length > 0) {
      this.appUtils.trackUserEvents(EventTrackerActions.upload_data_to_server, EventTrackerCategories.product_upload);
      // tslint:disable-next-line: max-line-length
      this.dialog.open(ComfirmProductUploadComponent, {data: {dataSet: this.myProductsToUpload, bulk_upload_type: BulkUploadTemplatesEnum.BULK_PRODUCT_UPLOAD_TEMPLATE}, autoFocus: false})
      .afterClosed().subscribe((isSuccess: boolean) => {
        if (isSuccess) {
          this.router.navigate(['/products']);
        }
      });
    }
  }

  get clientColumnDefinitions() { return this.columnDefinitionFormGroup.get('columns') as FormArray; }
}
