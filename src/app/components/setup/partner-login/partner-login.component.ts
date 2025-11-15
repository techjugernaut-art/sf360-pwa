import { Component, OnInit } from '@angular/core';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppUtilsService } from '../../../services/app-utils.service';
import { AuthService } from '../../../services/auth.service';
declare const $;
declare const swal;
declare const sweetAlert;

@Component({
  selector: 'app-partner-login',
  templateUrl: './partner-login.component.html',
  styleUrls: ['./partner-login.component.scss']
})
export class PartnerLoginComponent implements OnInit {

  hide = true;
  isProcessing = false;
  loginFormGroup: FormGroup;
  countries = [];
  countryCode = '';
    constructor(
      private dataProvider: DataProviderService,
      private notificationService: NotificationsService,
      private constantValues: ConstantValuesService,
      private router: Router,
      private appUtils: AppUtilsService,
      private authService: AuthService,
      private title: Title
    ) { }

    ngOnInit() {
      // this.title.setTitle(this.constantValues.APP_NAME + ' | Login');
      this.loginFormGroup = new FormGroup({
        phone_number: new FormControl('', [Validators.required]),
        pin: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)])
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
      this.isProcessing = true;
      credential.phone_number = this.countryCode + this.appUtils.removeFirstZero(credential.phone_number);
      this.dataProvider.createNoToken(this.constantValues.LOGIN_ENDPOINT, credential)
        .subscribe(result => {
          this.isProcessing = false;
          if (result.response_code === '100') {
            localStorage.setItem('phoneNumberToConfirm', credential.phone_number);
            localStorage.setItem('prefix', result.prefix);
            this.authService.increaseLoggedInCount();
            this.router.navigate(['/confirm-login']);
          }
        }, error => {
          this.isProcessing = false;
          this.notificationService.error(this.constantValues.APP_NAME, error.detail);
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

}
