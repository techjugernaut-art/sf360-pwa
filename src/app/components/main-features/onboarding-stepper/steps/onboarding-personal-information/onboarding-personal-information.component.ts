import { pinRegex } from './../../../../../utils/const-values.utils';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConstantVariables } from 'src/app/utils/enums.util';
import { UsersService } from 'src/app/services/network-calls/users.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { passwordMatch } from 'src/app/utils/validators.validator';

@Component({
  selector: 'app-onboarding-personal-information',
  templateUrl: './onboarding-personal-information.component.html',
  styleUrls: ['./onboarding-personal-information.component.scss']
})
export class OnboardingPersonalInformationComponent implements OnInit {
  personalInformationFormGroup: FormGroup;
  hide = true;
  hideConfirmPIN = true;
  isProcessing = false;

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.personalInformationFormGroup = new FormGroup({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      phone_number: new FormControl(localStorage.getItem(ConstantVariables.PHONE_NUMBER_TO_CONFIRM_TEXT)),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.pattern(pinRegex)]),
      confirm_password: new FormControl('', [Validators.required, passwordMatch('password', 'confirm_password')])
    });
  }
  onSubmit(data) {
    if (this.personalInformationFormGroup.valid) {
      this.isProcessing = true;
      data.phone_number = localStorage.getItem(ConstantVariables.PHONE_NUMBER_TO_CONFIRM_TEXT);
      this.usersService.newUserSignUp(data, (error, result) => {
        this.isProcessing = false;
        if (result !== null && result.response_code === '100') {
          localStorage.setItem('userFirstName', data.first_name);
          this.authService.saveUser(result.results);
          this.authService.saveToken(result.results.auth_token);
          this.router.navigate(['/onboarding/industry'], { queryParams: { step: 2 } });
        }
      });
    }
  }
  getUsrProfile() {
    this.isProcessing = true;
    this.usersService.me((error, result) => {

    });
  }
  get first_name() { return this.personalInformationFormGroup.get('first_name'); }
  get last_name() { return this.personalInformationFormGroup.get('last_name'); }
  get gender() { return this.personalInformationFormGroup.get('gender'); }
  get email() { return this.personalInformationFormGroup.get('email'); }
  get password() { return this.personalInformationFormGroup.get('password'); }
  get confirm_password() { return this.personalInformationFormGroup.get('confirm_password'); }
}
