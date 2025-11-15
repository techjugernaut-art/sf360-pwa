import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  templateUrl: './verify-email-dialog.component.html',
})
export class VerifyEmailDialogComponent implements OnInit {
  isProcessing = false;
  loginFormGroup: FormGroup;
  optInOutTitle = 'Email Verification';
  showOTPInput = false;

  constructor(
    private notificationService: NotificationsService,
    private router: Router,
    private shopsService: ShopsService,
    private dialogRef: MatDialogRef<VerifyEmailDialogComponent>,
  ) { }

  ngOnInit() {
    this.loginFormGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    })
  }
  onVerifyEmail(payload){
    this.isProcessing = true;
    this.shopsService.initiateEmailVerification(payload, (error, result) => {
      this.isProcessing = false;

      if(result.response_code === '100'){
        // this.showOTPInput = true;

        this.notificationService.snackBarMessage(result.message);
        this.dialogRef.close();
      }
    })
  }

  get email() { return this.loginFormGroup.get('email'); }

}
