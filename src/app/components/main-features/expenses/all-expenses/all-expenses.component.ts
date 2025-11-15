import { AuthService } from 'src/app/services/auth.service';
import { IDashboardFilterParams } from './../../../../interfaces/dashboard-overview-filter.interface';
import { NewExpenseComponent } from './../new-expense/new-expense.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { Observable } from 'rxjs';
import { RequestMethod } from 'src/app/components/common/pagination/pagination.component';
import { ITableHeaderActions } from 'src/app/interfaces/table-header-actions.interace';
import { Title } from '@angular/platform-browser';
import { ExportDocumentsService } from 'src/app/services/export-documents.service';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import * as moment from 'moment';
import { ExpensesService } from 'src/app/services/network-calls/expenses.service';
import { DataExportUtilsService, DocTypes } from 'src/app/services/data-export-utils.service';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { NewExpenseCategoryComponent } from '../new-expense-category/new-expense-category.component';


@Component({
  selector: 'app-all-expenses',
  templateUrl: './all-expenses.component.html',
  styleUrls: ['./all-expenses.component.scss']
})
export class AllExpensesComponent implements OnInit {
  pageHeaderOptions: IPageHeader;
  isProcessing: boolean;
  allExpenses = [];
  totalAmount = '';
  totalPage = 0;
  nextPage = '';
  prevPage = '';
  orderStatus = '';
  requestPayload;
  requestMethod: RequestMethod;
  tableHeaderOption: ITableHeaderActions;
  shopId = '';
  isPartner = false;
  expenseCategories;

  constructor(
    private dataExport: DataExportUtilsService,
    private expensesService: ExpensesService,
    private authService: AuthService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit() {
    this.tableHeaderOption = { hasSearch: true, searchPlaceholder: 'Search Expenses' };
    this.isPartner = this.authService.isPartner;
    // tslint:disable-next-line:max-line-length
    this.pageHeaderOptions = { pageTitle: 'Expenses', hasDateRangeFilter: true, hasExpenseCategoryFilter: true, hasShopsFilter: true };
  }
  /**
   * Data refershed from IPageHeader
   * @param data ISharedData interface
   */
  onDataRefreshed(data: ISharedData) {
    if (data !== null && data !== undefined) {
      // tslint:disable-next-line:max-line-length
      this.requestPayload = { start_date: data.filter_date_range.start_date, end_date: data.filter_date_range.end_date, category_id: data.expense_category, shop_id: data.shop_id };
      this.shopId = data.shop_id;
      // tslint:disable-next-line:max-line-length
      this.getExpenses({ start_date: data.filter_date_range.start_date, end_date: data.filter_date_range.end_date, category_id: data.expense_category, shop_id: data.shop_id });
    }
  }
  /**
   * Fired when searching sales order
   * @param searchText searchText
   */
  onSearchOrder(searchText) {
    this.requestPayload = { search_text: searchText };
    this.isProcessing = true;
    this.expensesService.searchExpense(this.requestPayload, (error, result) => {

      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        this.allExpenses = result.results;
        this.prevPage = result.previous;
        this.nextPage = result.next;
        this.totalPage = result.count;
        this.totalAmount = result.total_amount;
      }
    });
  }
  /**
  * Get sales orders reports
  * @param fitlerData IDashboardFilterParams interface
  */
  getExpenses(fitlerData: IDashboardFilterParams) {
    // fitlerData.start_date = moment(fitlerData.start_date).format(this.constantValues.DD_MM_YYYY_DATE_FORMAT);
    // fitlerData.end_date = moment(fitlerData.end_date).format(this.constantValues.DD_MM_YYYY_DATE_FORMAT);
    this.isProcessing = true;
    this.expensesService.getAll(this.requestPayload, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        this.allExpenses = result.results;
        this.prevPage = result.previous;
        this.nextPage = result.next;
        this.totalPage = result.count;
        this.totalAmount = result.total_amount;
      }
    });
  }
  /**
   * On page changed
   * @param result result after page changed
   */
  onPageChanged(result) {
    this.allExpenses = result.results;
    this.prevPage = result.previous;
    this.nextPage = result.next;
    this.totalPage = result.count;
    this.totalAmount = result.total_amount;
  }


  /**
  * Export as excel
  */
  exportAsExcel() {
    this.getDataToDownload(this.requestPayload as IDashboardFilterParams, DocTypes.EXCEL);
  }
  /**
   * Export as PDF
   */
  exportAllAPDF() {
    this.getDataToDownload(this.requestPayload as IDashboardFilterParams, DocTypes.PDF);
  }
  /**
  * Get sales summary reports
  * @param fitlerData IDashboardFilterParams interface
  */
  getDataToDownload(fitlerData: IDashboardFilterParams, docType: DocTypes) {
    fitlerData.paginate = false;
    this.isProcessing = true;
    this.expensesService.getAll(this.requestPayload, (error, result) => {
      this.isProcessing = false;
      if (result.status === 'success') {
        const dataSet: any[] = result.results;
        if (docType === DocTypes.EXCEL) {
          this.dataExport.exportExpensesAsCSV(dataSet);
        } else if (docType === DocTypes.PDF) {
          this.dataExport.exportExpensesAsPDF(dataSet, fitlerData?.start_date + ' - ' + fitlerData?.end_date);
        }
      }
    });
  }
  /**
   * Gets expense categories
   */
  getExpenseCategories() {
    this.expensesService.getCategories((error, result) => {
      if (result !== null) {
        this.expenseCategories = result.results;
      }
    });
  }
  /**
   * Export as excel
   */
  addExpense(isEdit = false, expense = null) {
    this.matDialog.open(NewExpenseComponent, { data: { isEdit: isEdit, expense: expense } })
      .afterClosed().subscribe((isSuccess: boolean) => {
        if (isSuccess) {
          this.getExpenses(this.requestPayload as IDashboardFilterParams);
        }
      });
  }

  /**
 * Add or Update Expense Category
 */
  addExpenseCategory(isEdit = false, expenseCategory = null) {
    this.matDialog.open(NewExpenseCategoryComponent, { data: { isEdit: isEdit, expenseCategories: expenseCategory } })
      .afterClosed().subscribe((isSuccess: boolean) => {
        if (isSuccess) {
          this.getExpenseCategories();
        }
      });
  }
}
