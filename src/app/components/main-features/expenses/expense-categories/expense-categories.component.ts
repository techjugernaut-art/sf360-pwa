import { Component, OnInit } from '@angular/core';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { ExpensesService } from 'src/app/services/network-calls/expenses.service';
import { MatDialog } from '@angular/material/dialog';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ITableHeaderActions } from 'src/app/interfaces/table-header-actions.interace';
import { NewExpenseCategoryComponent } from '../new-expense-category/new-expense-category.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-expense-categories',
  templateUrl: './expense-categories.component.html'
})
export class ExpenseCategoriesComponent implements OnInit {

  pageHeaderOptions: IPageHeader;
  isProcessing: boolean;
  expenseCategories;
  totalPage = 0;
  nextPage = '';
  prevPage = '';
  requestPayload;
  tableHeaderOption: ITableHeaderActions;
  shopId = '';
  isPartner = false;

  constructor(
    private expensesService: ExpensesService,
    private matDialog: MatDialog,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isPartner = this.authService.isPartner;
    this.pageHeaderOptions = { pageTitle: 'Expense Categories', ignoreFilterByAllShops: true, hasShopsFilter: true };
  }
  /**
   * Data refershed from IPageHeader
   * @param data ISharedData interface
   */
  onDataRefreshed(data: ISharedData) {
    if (data !== null && data !== undefined) {
      this.requestPayload = { shopId: data.shop_id };
      this.shopId = data.shop_id;
      this.getExpenseCategories();
    }
  }
  /**
  * Get sales orders reports
  * @param fitlerData IDashboardFilterParams interface
  */
  getExpenseCategories() {
    this.isProcessing = true;
    this.expensesService.getCategories((error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        this.expenseCategories = result.results;
        this.prevPage = result.previous;
        this.nextPage = result.next;
      }
    });
  }
  /**
   * On page changed
   * @param result result after page changed
   */
  onPageChanged(result) {
    this.expenseCategories = result.results;
    this.prevPage = result.previous;
    this.nextPage = result.next;
  }
  /**
   * Add or Update Expense Category
   */
  addExpenseCategory(isEdit = false, expenseCategory = null) {
    this.matDialog.open(NewExpenseCategoryComponent, { data: { isEdit: isEdit, expenseCategory: expenseCategory } })
      .afterClosed().subscribe((isSuccess: boolean) => {
        if (isSuccess) {
          this.getExpenseCategories();
        }
      });
  }
}
