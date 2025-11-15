import { UsersService } from 'src/app/services/network-calls/users.service';
import { ConstantVariables } from './../../../utils/enums.util';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-confirm-login',
  templateUrl: './confirm-login.component.html',
  styleUrls: ['./confirm-login.component.scss']
})
export class ConfirmLoginComponent implements OnInit {

  isFetchingCountryInfo = false;
  hide = true;
  loginFormGroup: FormGroup;
  countryInfo;
  isProcessing: boolean;
  prefix = '';
  message = 'Check Your WhatsApp or Message Inbox For The Code';
  constructor(
    private dataProvider: DataProviderService,
    private constantValues: ConstantValuesService,
    private authService: AuthService,
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationsService
  ) { }

  ngOnInit() {
    this.loginFormGroup = this.formBuilder.group({
      phone_number: [''],
      email: [''],
      unique_code: ['', [Validators.required]]
    });
    this.prefix = localStorage.getItem(ConstantVariables.PREFIX_TEXT);
    if (this.authService.isPartner) {
      this.message = 'Enter the OTP Code received in your email';
    }
  }

  onSubmit(credential) {
    this.isProcessing = true;
    const phoneNumber = localStorage.getItem(ConstantVariables.PHONE_NUMBER_TO_CONFIRM_TEXT);
    if (phoneNumber !== undefined && phoneNumber !== '' && phoneNumber !== null) {
      credential.phone_number = phoneNumber;
    }
    let endpoint = this.constantValues.CONFIRM_LOGIN_ENDPOINT;
    if (this.authService.isPartner) {
      credential.email = localStorage.getItem('email');
      endpoint = this.constantValues.CONFIRM_PARTNER_LOGIN_ENDPOINT;
    }
    this.dataProvider.createNoToken(endpoint, credential)
      .subscribe(result => {
        this.isProcessing = false;
        if (result.response_code === '100') {
          localStorage.removeItem(ConstantVariables.PHONE_NUMBER_TO_CONFIRM_TEXT);
          localStorage.removeItem(ConstantVariables.PREFIX_TEXT);
          localStorage.removeItem('email');
          this.authService.removeUserAndToken();
          if (!this.authService.isPartner) {
            this.authService.removeLoginType();
          }
          this.authService.saveUser(result.results);
          this.authService.saveToken(result.results.auth_token);
          window.location.href = '/dashboard';
        }
      }, error => {
        this.isProcessing = false;
        this.notificationService.error(this.constantValues.APP_NAME, error.detail);
      });
  }
  resendOTP(isViaWhatsApp: boolean) {
    this.isProcessing = true;
    const phoneNumber = localStorage.getItem(ConstantVariables.PHONE_NUMBER_TO_CONFIRM_TEXT);
    this.usersService.resendOTP({ phone_number: phoneNumber, send_code_via_whatsapp: isViaWhatsApp }, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.status === 'success') {
        this.notificationService.snackBarMessage(result.message);
      }
    });
  }
  get unique_code() { return this.loginFormGroup.get('unique_code'); }


}
