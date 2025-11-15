import { NotificationsService } from 'src/app/services/notifications.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShopsService } from 'src/app/services/network-calls/shops.service';

@Component({
  selector: 'app-set-return-policy-dialog',
  templateUrl: './set-return-policy-dialog.component.html',
  styleUrls: ['./set-return-policy-dialog.component.scss']
})
export class SetReturnPolicyDialogComponent implements OnInit {

  formGroup: FormGroup;
  modalTitle = 'UPDATE RETURN POLICY';
  phoneCode: string;
  isProcessing: boolean;
  myShops = [];
  constructor(
    private dialogRef: MatDialogRef<SetReturnPolicyDialogComponent>,
    private shopsService: ShopsService,
    private notificationsService: NotificationsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      return_policy_days: new FormControl('', [Validators.required]),
      shop_id: new FormControl(''),
    });
    if (this.data !== null && this.data !== undefined) {
      this.shop_id.setValue(this.data.shop_id);
    }
  }

  /**
   * Update returning policy days of a shop
   * @param formGroup FormGrou object
   */
  omSubmit(formGroup: FormGroup) {
    if (formGroup.valid) {
      this.isProcessing = true;
      this.shopsService.updateReturnPolicy(formGroup.value, (error, result) => {
        this.isProcessing = false;
        if (result !== null && result.response_code === '100') {
          this.notificationsService.snackBarMessage('Return Policy Days successfully updated.');
          this.dialogRef.close(result.results);
        }
      });
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }

  get return_policy_days() { return this.formGroup.get('return_policy_days'); }
  get shop_id() { return this.formGroup.get('shop_id'); }

}
