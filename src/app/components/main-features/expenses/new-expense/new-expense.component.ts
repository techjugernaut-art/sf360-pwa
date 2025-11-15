import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { NewExpenseCategoryComponent } from './../new-expense-category/new-expense-category.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotificationsService } from './../../../../services/notifications.service';
import { ExpensesService } from 'src/app/services/network-calls/expenses.service';
import { ShopsService } from './../../../../services/network-calls/shops.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-new-expense',
  templateUrl: './new-expense.component.html',
  styleUrls: ['./new-expense.component.scss']
})
export class NewExpenseComponent implements OnInit {
  isProcessingNewExpense = false;
  isEditOrNewExpenseCategory = false;
  newExpenseModalTitle = 'Add Expense';
  btnText = 'Add Expense';
  newExpenseFormGroup: FormGroup;
  myShops = [];
  expenseCategories = [];
  maxDate = new Date();
  expenseId = '';
  shopId = '';
  expenseDetail;
  isEdit: boolean;
  constructor(
    private shopsService: ShopsService,
    private notificationsService: NotificationsService,
    private dialogRef: MatDialogRef<NewExpenseComponent>,
    private dialog: MatDialog,
    private expensesService: ExpensesService,
    private constantValues: ConstantValuesService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.newExpenseFormGroup = new FormGroup({
      shop_id: new FormControl('', [Validators.required]),
      category_id: new FormControl('', [Validators.required]),
      transaction_date: new FormControl('', [Validators.required]),
      note: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required]),
      is_recurring: new FormControl(false),
      recurring_interval: new FormControl('')
    });
    this.is_recurring.valueChanges.subscribe((isRecurring: boolean) => {
      this.recurring_interval.clearValidators();
      this.recurring_interval.setValue('');
      this.recurring_interval.updateValueAndValidity();
      if (isRecurring === true) {
        this.recurring_interval.setValidators([Validators.required]);
        this.recurring_interval.updateValueAndValidity();
      }
    });
    this.getMyShops();
    if (this.data !== null && this.data !== undefined && this.data !== '') {
      if (this.data.isEdit === true) {
        this.isEdit = true;
        this.onEdit(this.data.expense);
      }
      this.shop_id.setValue(this.data.shopId);
    }
  }
  /**
     * Determines whether submit on
     * @param data Expense data
     */
  onSubmit(data) {
    const tdate = moment(data.transaction_date);
    if (tdate > moment()) {
      this.notificationsService.snackBarMessage('Transaction Date must not be in the future');
      return;
    }
    data.transaction_date = moment(data.transaction_date).format(this.constantValues.DD_MM_YYYY_DATE_FORMAT);
    if (!this.isEdit) {
      this.isProcessingNewExpense = true;
      this.expensesService.createExpense(data, (error, result) => {
        this.isProcessingNewExpense = false;
        if (result !== null) {
          this.dialogRef.close(true);
        }
      });
    } else {
      this.isProcessingNewExpense = true;
      this.expensesService.updateExpense(this.expenseId, data, (error, result) => {
        this.isProcessingNewExpense = false;
        if (result !== null) {
          this.dialogRef.close(true);
        }
      });
    }

  }
  /**
   * Get shops of current loged in user
   */
  getMyShops() {
    this.shopsService.getMyShop({ shop_id: '' }, (error, result) => {
      if (result !== null && result.status === 'success') {
        this.myShops = result.results;
      }
    });
  }
  onShopChanged(shopId) {
    this.shopId = shopId;
    this.getExpenseCategories(this.shopId);
  }
  /**
   * Gets expense categories
   */
  getExpenseCategories(shopId) {
    this.isProcessingNewExpense = true;
    this.expensesService.getExpensesByShopId(shopId, (error, result) => {
      this.isProcessingNewExpense = false;
      if (result !== null) {
        this.expenseCategories = result.results;
      }
    });
  }
  onEdit(expense) {
    this.shopId = expense.myshop.id
    this.expenseDetail = expense;
    this.newExpenseModalTitle = 'Edit Expense';
    this.btnText = 'Update Expense';
    this.expenseId = expense.id;
    this.shop_id.setValue(expense.myshop.id);
    this.category.setValue(expense.category.id);
    this.is_recurring.setValue(expense.is_recurring);
    this.recurring_interval.setValue(expense.recurring_interval);
    this.note.setValue(expense.note);
    this.amount.setValue(expense.amount);
    this.transaction_date.setValue(expense.transaction_date);
    this.getExpenseCategories(this.shopId);
  }
  /**
   * Show add expense category
   */
  addExpenseCategory() {
    // this.dialogRef.close(false);
    this.dialog.open(NewExpenseCategoryComponent, { data: { isEdit: false, expenseCategory: null } })
      .afterClosed().subscribe((isSuccessful: boolean) => {
        if (isSuccessful) {
          this.getExpenseCategories(this.shopId);
        }
      });
  }
  /**
   * Show a prepoulated expense category dialog to edit
   * @param id category id
   */
  onEditExpenseCategory(id) {
    const category = this.expenseCategories.find(data => data.id === id);
    this.dialogRef.close(false);
    this.dialog.open(NewExpenseCategoryComponent, { data: { isEdit: true, expenseCategory: category } })
      .afterClosed().subscribe((isSuccessful: boolean) => {
        if (isSuccessful) {
          this.getExpenseCategories(this.shopId);
        }
      });
  }
  onClose() {
    this.dialogRef.close(false);
  }
  get is_recurring() { return this.newExpenseFormGroup.get('is_recurring'); }
  get recurring_interval() { return this.newExpenseFormGroup.get('recurring_interval'); }
  get category() { return this.newExpenseFormGroup.get('category_id'); }
  get note() { return this.newExpenseFormGroup.get('note'); }
  get amount() { return this.newExpenseFormGroup.get('amount'); }
  get transaction_date() { return this.newExpenseFormGroup.get('transaction_date'); }
  get shop_id() { return this.newExpenseFormGroup.get('shop_id'); }
}
