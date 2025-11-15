import { NotificationsService } from 'src/app/services/notifications.service';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/network-calls/users.service';
import { Title } from '@angular/platform-browser';
import { ConstantVariables } from 'src/app/utils/enums.util';

@Component({
  selector: 'app-confirm-sign-up',
  templateUrl: './confirm-sign-up.component.html',
  styleUrls: ['./confirm-sign-up.component.scss']
})
export class ConfirmSignUpComponent implements OnInit {
  hide = true;
  isProcessing = false;
  loginFormGroup: FormGroup;
  message = 'Check Your WhatsApp or Message Inbox For The Code';

  constructor(
    private constantValues: ConstantValuesService,
    private notificationService: NotificationsService,
    private usersService: UsersService,
  ) { }

  ngOnInit() {
    this.loginFormGroup = new FormGroup({
      phone_number: new FormControl(''),
      unique_code: new FormControl('', [Validators.required])
    });
  }
  onSubmit(credential) {
    this.isProcessing = true;
    const phoneNumber = localStorage.getItem(ConstantVariables.PHONE_NUMBER_TO_CONFIRM_TEXT);
    if (phoneNumber !== undefined && phoneNumber !== '' && phoneNumber !== null) {
      credential.phone_number = phoneNumber;
    }
    this.usersService.confirmUserSignUp(credential, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        window.location.href = '/onboarding/personal-info/?step=1';
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
  get unique_code() { return this.loginFormGroup.get('unique_code'); }
}
