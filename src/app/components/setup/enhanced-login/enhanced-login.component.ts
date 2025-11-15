import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppUtilsService } from '../../../services/app-utils.service';
import { AuthService } from '../../../services/auth.service';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';
import { TwilioSmsService } from '../../../services/twilio-sms.service';
import { AwsCognitoService } from '../../../services/aws-cognito.service';
import { UsersService } from '../../../services/network-calls/users.service';
import { NotificationsService } from '../../../services/notifications.service';
import { inAnimation } from 'src/app/utils/animations.animator';
import { ConstantVariables } from 'src/app/utils/enums.util';
import { LoginUserTypeEnum } from 'src/app/utils/enums';

declare const swal;

export enum AuthMethod {
  PHONE_SMS = 'phone_sms',
  EMAIL_PASSWORD = 'email_password',
  FIREBASE_PHONE = 'firebase_phone',
  COGNITO = 'cognito'
}

@Component({
  selector: 'app-enhanced-login',
  templateUrl: './enhanced-login.component.html',
  styleUrls: ['./enhanced-login.component.scss'],
  animations: [inAnimation]
})
export class EnhancedLoginComponent implements OnInit, OnDestroy {
  // Form groups
  phoneLoginForm: FormGroup;
  emailLoginForm: FormGroup;
  verificationForm: FormGroup;

  // UI state
  isProcessing = false;
  hide = true;
  showVerificationInput = false;
  showPinField = false;
  selectedAuthMethod: AuthMethod = AuthMethod.PHONE_SMS;
  authMethods = AuthMethod;

  // Phone auth
  countryCode = '';
  phoneNumber = '';
  verificationId = '';
  otpCode = '';

  // Destroy subject for cleanup
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private appUtils: AppUtilsService,
    private authService: AuthService,
    private firebaseAuth: FirebaseAuthService,
    private twilioSms: TwilioSmsService,
    private cognitoService: AwsCognitoService,
    private usersService: UsersService,
    private notificationService: NotificationsService
  ) { }

  ngOnInit(): void {
    this.initializeForms();
    this.checkExistingAuth();
    this.initializeFirebaseRecaptcha();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.firebaseAuth.clearRecaptcha();
  }

  /**
   * Initialize all form groups
   */
  private initializeForms(): void {
    this.phoneLoginForm = this.formBuilder.group({
      phone_number: ['', [Validators.required, Validators.minLength(9)]],
      pin: ['', [Validators.minLength(4), Validators.maxLength(4)]]
    });

    this.emailLoginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.verificationForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  /**
   * Check if user is already authenticated
   */
  private checkExistingAuth(): void {
    if (this.authService.isLogedIn) {
      this.router.navigate(['/dashboard']);
    }
  }

  /**
   * Initialize Firebase reCAPTCHA for phone auth
   */
  private initializeFirebaseRecaptcha(): void {
    setTimeout(() => {
      this.firebaseAuth.initRecaptcha('recaptcha-container', true);
    }, 500);
  }

  /**
   * Handle phone number login (Original SF360 flow)
   */
  async onPhoneLogin(): Promise<void> {
    if (!this.phoneLoginForm.valid) {
      this.notificationService.snackBarMessage('Please enter a valid phone number');
      return;
    }

    this.isProcessing = true;
    const phoneNumberValue = this.phoneLoginForm.get('phone_number').value;
    const formattedPhone = this.countryCode + this.appUtils.removeFirstZero(phoneNumberValue);
    this.phoneNumber = formattedPhone;

    try {
      // Check phone number existence using original API
      this.usersService.checkPhoneNumber({ phone_number: formattedPhone }, (error, result) => {
        this.isProcessing = false;
        if (result !== null) {
          localStorage.setItem(ConstantVariables.PHONE_NUMBER_TO_CONFIRM_TEXT, formattedPhone);

          if (result.results === true && result.response_code === '100') {
            this.router.navigate(['/enter-pin']);
          } else if (result.results === false && result.response_code === '200') {
            // New user - send verification via selected method
            this.sendVerificationCode(formattedPhone);
          } else if (result.results === true && result.response_code === '201') {
            this.router.navigate(['/enter-pin']);
          } else if (result.results === true && result.response_code === '202') {
            this.sendVerificationCode(formattedPhone);
          }
        }
      });
    } catch (error) {
      this.isProcessing = false;
      console.error('Phone login error:', error);
    }
  }

  /**
   * Send verification code using selected method
   */
  private async sendVerificationCode(phoneNumber: string): Promise<void> {
    this.isProcessing = true;

    try {
      switch (this.selectedAuthMethod) {
        case AuthMethod.FIREBASE_PHONE:
          await this.sendFirebaseVerification(phoneNumber);
          break;

        case AuthMethod.PHONE_SMS:
        default:
          await this.sendTwilioVerification(phoneNumber);
          break;
      }
    } catch (error) {
      this.isProcessing = false;
      console.error('Verification send error:', error);
    }
  }

  /**
   * Send verification via Firebase Phone Auth
   */
  private async sendFirebaseVerification(phoneNumber: string): Promise<void> {
    try {
      this.verificationId = await this.firebaseAuth.sendPhoneVerificationCode(phoneNumber);
      this.showVerificationInput = true;
      this.isProcessing = false;
    } catch (error) {
      this.isProcessing = false;
      throw error;
    }
  }

  /**
   * Send verification via Twilio SMS
   */
  private async sendTwilioVerification(phoneNumber: string): Promise<void> {
    try {
      // Check if Twilio Verify is configured
      if (this.twilioSms.isConfigured()) {
        this.twilioSms.sendVerificationCode(phoneNumber, 'sms')
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            result => {
              if (result.success) {
                this.showVerificationInput = true;
              }
              this.isProcessing = false;
            },
            error => {
              this.isProcessing = false;
            }
          );
      } else {
        // Fall back to original verification flow
        this.usersService.sendVerificationCodeToUser(
          { phone_number: phoneNumber },
          (error, result) => {
            this.isProcessing = false;
            if (result !== null) {
              this.showVerificationInput = true;
            }
          }
        );
      }
    } catch (error) {
      this.isProcessing = false;
      throw error;
    }
  }

  /**
   * Verify code entered by user
   */
  async onVerifyCode(): Promise<void> {
    if (!this.verificationForm.valid) {
      this.notificationService.snackBarMessage('Please enter a valid verification code');
      return;
    }

    this.isProcessing = true;
    const code = this.verificationForm.get('code').value;

    try {
      switch (this.selectedAuthMethod) {
        case AuthMethod.FIREBASE_PHONE:
          await this.verifyFirebaseCode(code);
          break;

        case AuthMethod.PHONE_SMS:
        default:
          await this.verifyTwilioCode(code);
          break;
      }
    } catch (error) {
      this.isProcessing = false;
      console.error('Verification error:', error);
    }
  }

  /**
   * Verify Firebase phone code
   */
  private async verifyFirebaseCode(code: string): Promise<void> {
    try {
      const result = await this.firebaseAuth.verifyPhoneCode(code);
      if (result) {
        // Get Firebase ID token and authenticate with backend
        const idToken = await this.firebaseAuth.getIdToken();
        await this.authenticateWithBackend(idToken, 'firebase');
      }
    } catch (error) {
      this.isProcessing = false;
      throw error;
    }
  }

  /**
   * Verify Twilio code
   */
  private async verifyTwilioCode(code: string): Promise<void> {
    if (this.twilioSms.isConfigured()) {
      this.twilioSms.verifyCode(this.phoneNumber, code)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          result => {
            if (result.valid) {
              this.router.navigate(['/confirm-signup']);
            }
            this.isProcessing = false;
          },
          error => {
            this.isProcessing = false;
          }
        );
    } else {
      // Fall back to original flow
      this.usersService.confirmUserSignUp(
        { phone_number: this.phoneNumber, otp: code },
        (error, result) => {
          this.isProcessing = false;
          if (result !== null && result.response_code === '100') {
            this.router.navigate(['/confirm-signup']);
          }
        }
      );
    }
  }

  /**
   * Email/Password login
   */
  async onEmailLogin(): Promise<void> {
    if (!this.emailLoginForm.valid) {
      this.notificationService.snackBarMessage('Please enter valid credentials');
      return;
    }

    this.isProcessing = true;
    const email = this.emailLoginForm.get('email').value;
    const password = this.emailLoginForm.get('password').value;

    try {
      if (this.selectedAuthMethod === AuthMethod.COGNITO) {
        await this.cognitoLogin(email, password);
      } else {
        await this.firebaseEmailLogin(email, password);
      }
    } catch (error) {
      this.isProcessing = false;
      console.error('Email login error:', error);
    }
  }

  /**
   * Firebase email login
   */
  private async firebaseEmailLogin(email: string, password: string): Promise<void> {
    this.firebaseAuth.signInWithEmail(email, password)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        async credential => {
          const idToken = await this.firebaseAuth.getIdToken();
          await this.authenticateWithBackend(idToken, 'firebase_email');
        },
        error => {
          this.isProcessing = false;
        }
      );
  }

  /**
   * AWS Cognito login
   */
  private async cognitoLogin(email: string, password: string): Promise<void> {
    try {
      const tokens = await this.cognitoService.signIn({
        username: email,
        password: password
      });

      if (tokens) {
        await this.authenticateWithBackend(tokens.idToken, 'cognito');
      }
    } catch (error) {
      this.isProcessing = false;
      throw error;
    }
  }

  /**
   * Authenticate with backend using token from auth provider
   */
  private async authenticateWithBackend(idToken: string, provider: string): Promise<void> {
    // TODO: Call your backend API to validate the token and get user session
    // For now, navigate to dashboard
    this.isProcessing = false;
    this.router.navigate(['/dashboard']);
  }

  /**
   * Change authentication method
   */
  setAuthMethod(method: AuthMethod): void {
    this.selectedAuthMethod = method;
    this.showVerificationInput = false;
    this.verificationForm.reset();
  }

  /**
   * Country code selected
   */
  onCountry(countryInfo: any): void {
    if (countryInfo !== undefined && countryInfo !== null) {
      this.countryCode = '+' + (countryInfo.callingCodes[0] as string);
    }
  }

  /**
   * Navigate to onboarding
   */
  navigateToOnboarding(): void {
    this.router.navigate(['/onboarding/personal-info'], { queryParams: { step: 1 } });
  }

  /**
   * Password reset
   */
  async onPasswordReset(): Promise<void> {
    const email = this.emailLoginForm.get('email').value;

    if (!email) {
      swal('Password Reset', 'Please enter your email address', 'info');
      return;
    }

    try {
      if (this.selectedAuthMethod === AuthMethod.COGNITO) {
        await this.cognitoService.forgotPassword(email);
      } else {
        await this.firebaseAuth.sendPasswordResetEmail(email);
      }
    } catch (error) {
      console.error('Password reset error:', error);
    }
  }

  // Getters for form controls
  get phone() { return this.phoneLoginForm.get('phone_number'); }
  get email() { return this.emailLoginForm.get('email'); }
  get password() { return this.emailLoginForm.get('password'); }
  get code() { return this.verificationForm.get('code'); }
}
