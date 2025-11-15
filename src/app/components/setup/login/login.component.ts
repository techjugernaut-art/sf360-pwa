import { SendVerificationCodeComponent } from './../send-verification-code/send-verification-code.component';
import { UsersService } from './../../../services/network-calls/users.service';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AppUtilsService } from '../../../services/app-utils.service';
import { AuthService } from '../../../services/auth.service';
import { inAnimation } from 'src/app/utils/animations.animator';
import { ConstantVariables } from 'src/app/utils/enums.util';
import { LoginUserTypeEnum } from 'src/app/utils/enums';
declare const swal;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    inAnimation
  ]
})
export class LoginComponent implements OnInit {
  hide = true;
  partnerHide = true;
  isProcessing = false;
  isPartner = false;
  loginFormGroup: FormGroup;
  partnerLoginFormGroup: FormGroup;
  countries = [];
  countryCode = '';
  phoneNumber = '';
  constructor(
    private router: Router,
    private appUtils: AppUtilsService,
    private authService: AuthService,
    private dialog: MatDialog,
    private usersService: UsersService,
    private formBuilder: FormBuilder  ) { }

  ngOnInit() {
    this.loginFormGroup = this.formBuilder.group({
      phone_number:['', [Validators.required]],
      pin:['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
    });
    this.partnerLoginFormGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });

    if (this.authService.isLogedIn) {
      this.router.navigate(['/dashboard']);
    }
  }

  /**
   *Login a user and redirect user to confirm login
   * @param credential login credential
   */
  onSubmit(credential) {
    if (this.loginFormGroup.valid) {
      this.isProcessing = true;
      credential.phone_number = this.countryCode + this.appUtils.removeFirstZero(this.phone_number.value);
      this.phoneNumber = credential.phone_number;
      this.usersService.checkPhoneNumber(credential, (error, result) => {
        this.isProcessing = false;
        if (result !== null) {
          localStorage.setItem(ConstantVariables.PHONE_NUMBER_TO_CONFIRM_TEXT, credential.phone_number);
          if (result.results === true && result.response_code === '100') {
            this.router.navigate(['/enter-pin']);
          } else if (result.results === false && result.response_code === '200') {
            this.authService.removeUserAndToken();
            this.authService.removeLoginType();
            localStorage.removeItem('ACTIVE_SHOP');
            this.showReceiveVerficationCodeViaWhatsAppDialog();
          } else if (result.results === true && result.response_code === '201') { this.router.navigate(['/enter-pin']);
          } else if (result.results === true && result.response_code === '202') { this.showReceiveVerficationCodeViaWhatsAppDialog(); }
        }
      });
    }
  }
  /**
   * Show receive verfication code via WhatsApp dialog
   */
  showReceiveVerficationCodeViaWhatsAppDialog() {
    this.dialog.open(SendVerificationCodeComponent, {data: {phone_number: this.phoneNumber}})
    .afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.router.navigate(['/confirm-signup']);
      }
    });
  }
  /**
 *Login a partner user and redirect to dashboard (OTP removed)
 * @param credential login credential
 */
  onLoginAsPartner(credential) {
    credential.player_id = this.authService.getNotificationToken;
    this.isProcessing = true;
    this.usersService.partnerLogin(credential, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '200') {
        localStorage.removeItem('email');
        localStorage.removeItem(ConstantVariables.PREFIX_TEXT);
        this.authService.removeUserAndToken();
        this.authService.removeLoginType();
        this.authService.saveUser(result.results);
        this.authService.saveToken(result.results.auth_token);
        this.authService.saveUserType(LoginUserTypeEnum.PARTNER);
        window.location.href = '/dashboard';
      }
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

  navigateToOnboarding() {
    this.router.navigate(['/onboarding/personal-info'], { queryParams: { step: 1 } });
  }
  get phone_number() { return this.loginFormGroup.get('phone_number'); }
  get pin() { return this.loginFormGroup.get('pin'); }
  get email() { return this.partnerLoginFormGroup.get('email'); }
  get password() { return this.partnerLoginFormGroup.get('password'); }
}
