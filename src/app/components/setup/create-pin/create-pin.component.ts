import { passwordMatch } from 'src/app/utils/validators.validator';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-create-pin',
  templateUrl: './create-pin.component.html',
  styleUrls: ['./create-pin.component.scss']
})
export class CreatePinComponent implements OnInit {

  isFetchingCountryInfo = false;
  hide = true;
  hideConfirmPIN = true;
  loginFormGroup: FormGroup;
  countryInfo;
    constructor(
      private dateProvider: DataProviderService,
      private notificationService: NotificationsService,
      private constantValues: ConstantValuesService,
      private title: Title
    ) { }

    ngOnInit() {
      // this.title.setTitle(this.constantValues.APP_NAME + ' | Create PIN');
      this.loginFormGroup = new FormGroup({
        otp_code: new FormControl('', [Validators.required]),
        new_password: new FormControl('', [Validators.required]),
        confirm_password: new FormControl('', [Validators.required, passwordMatch('new_password', 'confirm_password')])
      });

    }

    onSubmit() {

    }
    get otp_code() { return this.loginFormGroup.get('otp_code'); }
    get new_password() { return this.loginFormGroup.get('new_password'); }
    get confirm_password() { return this.loginFormGroup.get('confirm_password'); }

}
