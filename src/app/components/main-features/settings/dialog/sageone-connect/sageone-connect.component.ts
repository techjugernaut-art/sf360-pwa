import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerApiCallsService } from 'src/app/services/network-calls/customer-api-calls.service';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-sageone-connect',
  templateUrl: './sageone-connect.component.html',
  styleUrls: ['./sageone-connect.component.scss']
})
export class SageoneConnectComponent implements OnInit {

  formGroup: FormGroup;
  editStockModalTitle = 'SageOne Connect';
  storeId = '';
  sageCompanies = [];
  sageBankAccounts = [];
  isProcessing: boolean;
  curentStep = 'connectSage';
  companyIdFormControl: FormControl = new FormControl('', [Validators.required]);
  bankAccountFormControl: FormControl = new FormControl('', [Validators.required]);
  constructor(
    private notificationService: NotificationsService,
    private dialogRef: MatDialogRef<SageoneConnectComponent>,
    private shopsService: ShopsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      shop_id: new FormControl(''),
      sageone_email: new FormControl('', [Validators.required, Validators.email]),
      sageone_pass: new FormControl('', [Validators.required])
    });
    if (this.data !== null && this.data !== undefined) {
      this.storeId = this.data.shop_id;
      this.shop_id.setValue(this.data.shop_id);
    }
  }
  /**
   * Connect to sageone
   * @param detail sageone credential
   */
  onSubmit(detail) {
    if (this.formGroup.valid) {
      this.isProcessing = true;
      this.shopsService.fetchSageOneCompany(detail, (error, result) => {
        this.isProcessing = false;
        if (result !== null && result.status === 'success') {
          this.sageCompanies = result.results;
          this.curentStep = 'selectCompany';
          this.notificationService.snackBarMessage('SageOne Connection Successfull');
          this.editStockModalTitle = 'Assign shop to SageOne Company';
        }
      });
    }
  }
/**
   * Assign a shop to company on sageone
   */
  onAssignCompanyId() {
    if (this.companyIdFormControl.valid) {
      const detail = { company_id: this.companyIdFormControl.value, shop_id: this.storeId };
      this.isProcessing = true;
      this.shopsService.assignSageOneCompany(detail, (error, result) => {
        this.isProcessing = false;
        if (result !== null && result.status === 'success') {
          this.notificationService.snackBarMessage('SageOne Company successfully assigned');
          this.fetchSageBankAccounts();
        }
      });
    }
  }
 /**
   * Connect to sageone
   * @param detail sageone credential
   */
  fetchSageBankAccounts() {
    this.isProcessing = true;
      this.shopsService.fetchSageOneBankAccounts({shop_id: this.storeId}, (error, result) => {
        this.isProcessing = false;
        if (result !== null) {
          this.curentStep = 'selectBankAccount';
          this.editStockModalTitle = 'Assign shop to SageOne Bank Account';
          this.sageBankAccounts = result.Results;
        }
      });
  }
  /**
   * Assign a shop to company on sageone
   */
  onAssignBankAccount() {
    if (this.companyIdFormControl.valid) {
      const detail = { company_id: this.companyIdFormControl.value, shop_id: this.storeId };
      this.isProcessing = true;
      this.shopsService.assignSageOneBankAccount(detail, (error, result) => {
        this.isProcessing = false;
        if (result !== null && result.status === 'success') {
          this.notificationService.snackBarMessage('SageOne Bank Account successfully assigned');
          this.dialogRef.close(true);
        }
      });
    }
  }
  get shop_id() { return this.formGroup.get('shop_id'); }
  get sageone_email() { return this.formGroup.get('sageone_email'); }
  get sageone_pass() { return this.formGroup.get('sageone_pass'); }

}
