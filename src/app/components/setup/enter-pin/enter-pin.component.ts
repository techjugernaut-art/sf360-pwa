import { ConstantVariables } from './../../../utils/enums.util';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
declare const swal;

@Component({
  selector: 'app-enter-pin',
  templateUrl: './enter-pin.component.html',
  styleUrls: ['./enter-pin.component.scss']
})
export class EnterPinComponent implements OnInit {

  hide = true;
  partnerHide = true;
  isProcessing = false;
  isPartner = false;
  loginFormGroup: FormGroup;
  partnerLoginFormGroup: FormGroup;
  countries = [];
  countryCode = '';
  constructor(
    private dataProvider: DataProviderService,
    private notificationService: NotificationsService,
    private constantValues: ConstantValuesService,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.loginFormGroup = new FormGroup({
      phone_number: new FormControl(localStorage.getItem(ConstantVariables.PHONE_NUMBER_TO_CONFIRM_TEXT)),
      player_id: new FormControl(''),
      send_code_via_whatsapp: new FormControl(true),
      pin: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)])
    });
    this.partnerLoginFormGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      player_id: new FormControl(''),
      password: new FormControl('', [Validators.required])
    });
    if (this.authService.isLogedIn) {
      // this.router.navigate(['/dashboard']);
    }
  }

  /**
   *Login a user and redirect user to confirm login
   * @param credential login credential
   */
  onSubmit(credential) {
    if (this.loginFormGroup.valid) {
      credential.player_id = this.authService.getNotificationToken;
      credential.phone_number = localStorage.getItem(ConstantVariables.PHONE_NUMBER_TO_CONFIRM_TEXT);
      this.isProcessing = true;
    this.dataProvider.createNoToken(this.constantValues.LOGIN_ENDPOINT, credential)
      .subscribe(result => {
        this.isProcessing = false;
        if (result.response_code === '100') {
          localStorage.setItem(ConstantVariables.PREFIX_TEXT, result.prefix);
          this.authService.increaseLoggedInCount();
          this.router.navigate(['/confirm-login']);
        } else if (result.response_code === '200') {
          localStorage.removeItem(ConstantVariables.PHONE_NUMBER_TO_CONFIRM_TEXT);
          localStorage.removeItem(ConstantVariables.PREFIX_TEXT);
          this.authService.removeUserAndToken();
          this.authService.removeLoginType();
          this.authService.saveUser(result.results);
          this.authService.saveToken(result.results.auth_token);
          window.location.href = '/dashboard';
        }
      }, error => {
        this.isProcessing = false;
        this.notificationService.error(this.constantValues.APP_NAME, error.detail);
      });
    }
  }
  /**
 *Login a partner user and redirect to dashboard (OTP removed)
 * @param credential login credential
 */
  onLoginAsPartner(credential) {
    credential.player_id = this.authService.getNotificationToken;
    this.isProcessing = true;
    this.dataProvider.createNoToken(this.constantValues.PARTNER_LOGIN_ENDPOINT, credential)
      .subscribe(result => {
        this.isProcessing = false;
        if (result.response_code === '200') {
          localStorage.removeItem('email');
          localStorage.removeItem('prefix');
          this.authService.removeUserAndToken();
          this.authService.removeLoginType();
          this.authService.saveUser(result.results);
          this.authService.saveToken(result.results.auth_token);
          this.authService.saveUserType('partner');
          window.location.href = '/dashboard';
        }
      }, error => {
        this.isProcessing = false;
        this.notificationService.snackBarErrorMessage(error.detail);
      });
  }
  passwordResetMessage() {
    swal('Password Reset', 'Password Reset is available only in Storefront app', 'info');
  }
  /**
   * Country code selected
   * @param countryInfo country info
   */
  onCountry(countryInfo) {
    if (countryInfo !== undefined && countryInfo !== null) {
      this.countryCode = '+' + (countryInfo.callingCodes[0] as string);
    }
  }
  get phone_number() { return this.loginFormGroup.get('phone_number'); }
  get pin() { return this.loginFormGroup.get('pin'); }
  get email() { return this.partnerLoginFormGroup.get('email'); }
  get password() { return this.partnerLoginFormGroup.get('password'); }

}
