import { Router } from '@angular/router';
import { BulkUploadTemplatesEnum } from './../../../../utils/enums';
import { bulkCustomerUploadColumnNames } from 'src/app/interfaces/bulk-customer-upload-data.interface';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { BulkCustomerUploadColumnIndices } from 'src/app/models/bulk-customer-upload-column-indices';
import { FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { ITableHeaderActions } from 'src/app/interfaces/table-header-actions.interace';
import { AppUtilsService } from 'src/app/services/app-utils.service';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { EventTrackerActions, EventTrackerCategories } from 'src/app/utils/enums.util';
import { ComfirmProductUploadComponent } from '../../products/comfirm-product-upload/comfirm-product-upload.component';

@Component({
  selector: 'app-bulk-customer-upload',
  templateUrl: './bulk-customer-upload.component.html'
})
export class BulkCustomerUploadComponent implements OnInit {


  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  columnDefinitionFormGroup: FormGroup;
  pageHeaderOptions: IPageHeader;
  isProcessing = false;
  tableHeaderOption: ITableHeaderActions;
  uploadedCustomers = [];
  myCustomers = [];
  myCustomersToUpload = [];
  clientColumns = [];
  headers = [];
  event: any;
  fileName;
  storeId;
  serverClientColumnNames = bulkCustomerUploadColumnNames;
  isProcessingProductUpload: boolean;
  currency;

  constructor(
    private title: Title,
    private appUtils: AppUtilsService,
    private dialog: MatDialog,
    private router: Router,
    private constantValues: ConstantValuesService) { }

  ngOnInit() {
    // tslint:disable-next-line:max-line-length
    this.pageHeaderOptions = { pageTitle: 'Customer Upload', hasShopsFilter: false, hideFilterPanel: true };
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
    this.appUtils.trackUserEvents(EventTrackerActions.customer_template_uploaded_file, EventTrackerCategories.customer_upload);
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
      this.myCustomersToUpload = [];
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
        this.uploadedCustomers = (XLSX.utils.sheet_to_json(ws, { header: 0, dateNF: 14, defval: '' }));
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
    this.appUtils.trackUserEvents(EventTrackerActions.customer_template_validated_data, EventTrackerCategories.customer_upload);
    if (this.columnDefinitionFormGroup.valid) {
      const columnIndices = new BulkCustomerUploadColumnIndices();
      this.clientColumnDefinitions.value.forEach(element => {
        columnIndices[element.server_column] = element.client_column_index;
      });
      this.myCustomers = [];
      this.myCustomersToUpload = [];
      this.uploadedCustomers.forEach((data: Object, i, val) => {
        const bcode = new Date().getTime() - i;
        const millisecondDate = this.appUtils.padLeft(bcode.toString(), '0', 13);
        if (data !== null && data !== undefined) {
          const nameColumnData = data[Object.keys(data)[columnIndices.name]];
          const phoneNumberColumnData = data[Object.keys(data)[columnIndices.phone_number]];
          const emailColumnData = data[Object.keys(data)[columnIndices.email]];
          const addressColumnData = data[Object.keys(data)[columnIndices.address]];


          // tslint:disable-next-line: max-line-length
          this.myCustomersToUpload.push({ name: nameColumnData, phone_number: phoneNumberColumnData, email: emailColumnData, address: addressColumnData });
          // tslint:disable-next-line:max-line-length
          this.myCustomers.push({ name: nameColumnData, phone_number: phoneNumberColumnData, email: emailColumnData, address: addressColumnData });
        }
      });
    }
  }
  uploadProducts() {
    if (this.myCustomersToUpload.length > 0) {
      this.appUtils.trackUserEvents(EventTrackerActions.customer_uploa_data_to_server, EventTrackerCategories.customer_upload);
      // tslint:disable-next-line: max-line-length
      this.dialog.open(ComfirmProductUploadComponent, {data: {dataSet: this.myCustomersToUpload, bulk_upload_type: BulkUploadTemplatesEnum.BULK_CUSTOMER_UPLOAD_TEMPLATE}, autoFocus: false})
      .afterClosed().subscribe(() => {
        this.router.navigate(['/customers']);
      });
    }
  }

  get clientColumnDefinitions() { return this.columnDefinitionFormGroup.get('columns') as FormArray; }

}
