import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppUtilsService } from 'src/app/services/app-utils.service';
import { UsersService } from 'src/app/services/network-calls/users.service';
import { ConstantVariables } from 'src/app/utils/enums.util';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  isProcessing = false;
  loginFormGroup: FormGroup;
  countries = [];
  countryCode = '';
  phoneNumber = '';
  constructor(
    private constantValues: ConstantValuesService,
    private router: Router,
    private appUtils: AppUtilsService,
    private usersService: UsersService,
    private title: Title
  ) { }

  ngOnInit() {
    // this.title.setTitle(this.constantValues.APP_NAME + ' | Login');
    this.loginFormGroup = new FormGroup({
      phone_number: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      send_code_via_whatsapp: new FormControl(false)
    });
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
      this.usersService.resetPIN(credential, (error, result) => {
        this.isProcessing = false;
        if (result !== null && result.status === 'success') {
          localStorage.setItem(ConstantVariables.PHONE_NUMBER_TO_CONFIRM_TEXT, credential.phone_number);
          this.router.navigate(['/create-new-pin']);
        }
      });
    }
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
}
