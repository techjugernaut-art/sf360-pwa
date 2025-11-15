import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { UsersService } from 'src/app/services/network-calls/users.service';
import { Title } from '@angular/platform-browser';
import { ConstantVariables } from 'src/app/utils/enums.util';
import { passwordMatch } from 'src/app/utils/validators.validator';

@Component({
  selector: 'app-create-new-password',
  templateUrl: './create-new-password.component.html',
  styleUrls: ['./create-new-password.component.scss']
})
export class CreateNewPasswordComponent implements OnInit {

  hide = true;
  hideConfirmPIN = true;
  isProcessing = false;
  loginFormGroup: FormGroup;
  message = 'Check Your WhatsApp For The Code';

  constructor(
    private constantValues: ConstantValuesService,
    private notificationService: NotificationsService,
    private usersService: UsersService,
    private router: Router,
    private title: Title
  ) { }

  ngOnInit() {
    // this.title.setTitle(this.constantValues.APP_NAME + ' | Create New PIN');
    this.loginFormGroup = new FormGroup({
      phone_number: new FormControl(''),
      code: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
      confirm_password: new FormControl('', [Validators.required, passwordMatch('password', 'confirm_password')])
    });
  }
  onSubmit(credential) {
    this.isProcessing = true;
    const phoneNumber = localStorage.getItem(ConstantVariables.PHONE_NUMBER_TO_CONFIRM_TEXT);
    if (phoneNumber !== undefined && phoneNumber !== '' && phoneNumber !== null) {
      credential.phone_number = phoneNumber;
    }
    this.usersService.resetPINConfirm(credential, (error, result) => {
      if (result !== null && result.status === 'success') {
        this.usersService.createNewPIN(credential, (resetError, resetResult) => {
          this.isProcessing = false;
          if (result !== null && result.status === 'success') {
            this.notificationService.snackBarMessage('New PIN successfully created, redirecting you to login');
            this.router.navigate(['/login']);
          }
        });
      }
    });
  }
  resendOTP(isViaWhatsApp: boolean) {
    this.isProcessing = true;
    const phoneNumber = localStorage.getItem(ConstantVariables.PHONE_NUMBER_TO_CONFIRM_TEXT);
    this.usersService.resendOTP({ phone_number: phoneNumber, send_code_via_whatsapp: isViaWhatsApp }, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        this.notificationService.success(this.constantValues.APP_NAME, 'OTP Resent');
      }
    });
  }
  get code() { return this.loginFormGroup.get('code'); }
  get password() { return this.loginFormGroup.get('password'); }
  get confirm_password() { return this.loginFormGroup.get('confirm_password'); }

}
