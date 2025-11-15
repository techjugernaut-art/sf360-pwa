import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ExpensesService } from 'src/app/services/network-calls/expenses.service';

@Component({
  selector: 'app-new-expense-category',
  templateUrl: './new-expense-category.component.html'
})
export class NewExpenseCategoryComponent implements OnInit {

  isProcessingNewExpense = false;
  isEditOrNewExpenseCategory = false;
  newExpenseModalTitle = 'Add Expense Category';
  btnText = 'Add Expense Category';
  newExpenseFormGroup: FormGroup;
  myShops = [];
  expenseCatId = '';
  expenseDetail;
  isEdit: boolean;
  expenseCategoryDetail: any;
  constructor(
    private shopsService: ShopsService,
    private dialogRef: MatDialogRef<NewExpenseCategoryComponent>,
    private expensesService: ExpensesService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.newExpenseFormGroup = new FormGroup({
      shop_id: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required])
    });

    this.getMyShops();
    if (this.data !== null && this.data !== undefined && this.data !== '' && this.data.isEdit === true) {
      this.isEdit = true;
      this.onEdit(this.data.expenseCategory);
    }
  }
  /**
     * Determines whether submit on
     * @param data Expense data
     */
  onSubmit(data) {
    if (!this.isEdit) {
      this.isProcessingNewExpense = true;
      this.expensesService.createExpenseCategory(data, (error, result) => {
        this.isProcessingNewExpense = false;
        if (result !== null) {
          this.dialogRef.close(true);
        }
      });
    } else {
      this.isProcessingNewExpense = true;
      this.expensesService.updateExpenseCategory(this.expenseCatId, data, (error, result) => {
        this.isProcessingNewExpense = false;
        if (result !== null) {
          this.dialogRef.close(true);
        }
      });
    }

  }
  onClose() {
    this.dialogRef.close(false);
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

  onEdit(expenseCategory) {
    this.expenseCategoryDetail = expenseCategory;
    this.newExpenseModalTitle = 'Edit Expense Category';
    this.btnText = 'Update Expense Category';
    this.expenseCatId = expenseCategory.id;
    // this.shop_id.setValue(expenseCategory.myshop.id);
    this.name.setValue(expenseCategory.name);
  }

  get name() { return this.newExpenseFormGroup.get('name'); }
  get shop_id() { return this.newExpenseFormGroup.get('shop_id'); }

}
