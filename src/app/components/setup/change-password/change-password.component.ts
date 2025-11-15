import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { UsersService } from 'src/app/services/network-calls/users.service';
import { Title } from '@angular/platform-browser';
import { passwordMatch } from 'src/app/utils/validators.validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  hide = true;
  hideConfirmPIN = true;
  isProcessing = false;
  loginFormGroup: FormGroup;

  constructor(
    private notificationService: NotificationsService,
    private dialogRef: MatDialogRef<ChangePasswordComponent>,
    private usersService: UsersService  ) { }

  ngOnInit() {
    this.loginFormGroup = new FormGroup({
      old_password: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
      confirm_password: new FormControl('', [Validators.required, passwordMatch('password', 'confirm_password')])
    });
  }
  onSubmit(credential) {
    this.isProcessing = true;
    this.usersService.changePassword(credential, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        this.notificationService.snackBarMessage('PIN successfully created');
        this.dialogRef.close(true);
      }
    });
  }

  get old_password() { return this.loginFormGroup.get('old_password'); }
  get password() { return this.loginFormGroup.get('password'); }
  get confirm_password() { return this.loginFormGroup.get('confirm_password'); }
}
