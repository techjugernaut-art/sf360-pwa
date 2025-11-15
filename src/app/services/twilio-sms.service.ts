import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NotificationsService } from './notifications.service';
import { environment } from '../../environments/environment';

export interface TwilioSMSConfig {
  accountSid: string;
  authToken: string;
  fromPhoneNumber: string;
  serviceSid?: string; // For Verify API
}

export interface SMSResponse {
  success: boolean;
  message: string;
  sid?: string;
  status?: string;
}

export interface VerifyResponse {
  success: boolean;
  status: string;
  sid?: string;
  valid?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TwilioSmsService {
  private twilioConfig: TwilioSMSConfig;
  private readonly TWILIO_API_BASE = 'https://api.twilio.com/2010-04-01';
  private readonly TWILIO_VERIFY_BASE = 'https://verify.twilio.com/v2';

  constructor(
    private http: HttpClient,
    private notificationService: NotificationsService
  ) {
    // Initialize Twilio config from environment or backend
    this.initializeTwilioConfig();
  }

  /**
   * Initialize Twilio configuration
   * In production, these should come from your backend API
   */
  private initializeTwilioConfig(): void {
    // TODO: Fetch these from backend API endpoint
    this.twilioConfig = {
      accountSid: environment.TWILIO_ACCOUNT_SID || '',
      authToken: environment.TWILIO_AUTH_TOKEN || '',
      fromPhoneNumber: environment.TWILIO_PHONE_NUMBER || '',
      serviceSid: environment.TWILIO_VERIFY_SERVICE_SID || ''
    };
  }

  /**
   * Send SMS using Twilio Messaging API
   * @param toPhoneNumber Recipient phone number (E.164 format: +233240000000)
   * @param message SMS message body
   * @returns Observable with SMS response
   */
  sendSMS(toPhoneNumber: string, message: string): Observable<SMSResponse> {
    const url = `${this.TWILIO_API_BASE}/Accounts/${this.twilioConfig.accountSid}/Messages.json`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${this.twilioConfig.accountSid}:${this.twilioConfig.authToken}`)
    });

    const body = new URLSearchParams({
      To: toPhoneNumber,
      From: this.twilioConfig.fromPhoneNumber,
      Body: message
    }).toString();

    return this.http.post(url, body, { headers }).pipe(
      map((response: any) => {
        this.notificationService.snackBarMessage('SMS sent successfully');
        return {
          success: true,
          message: 'SMS sent successfully',
          sid: response.sid,
          status: response.status
        };
      }),
      catchError(error => {
        console.error('Twilio SMS error:', error);
        this.notificationService.snackBarMessage('Failed to send SMS');
        return throwError({
          success: false,
          message: error.error?.message || 'Failed to send SMS'
        });
      })
    );
  }

  /**
   * Send verification code using Twilio Verify API
   * This is more secure and handles OTP generation automatically
   * @param phoneNumber Phone number to verify (E.164 format)
   * @param channel Verification channel: 'sms' or 'call'
   * @returns Observable with verification response
   */
  sendVerificationCode(phoneNumber: string, channel: 'sms' | 'call' = 'sms'): Observable<VerifyResponse> {
    const url = `${this.TWILIO_VERIFY_BASE}/Services/${this.twilioConfig.serviceSid}/Verifications`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${this.twilioConfig.accountSid}:${this.twilioConfig.authToken}`)
    });

    const body = new URLSearchParams({
      To: phoneNumber,
      Channel: channel
    }).toString();

    return this.http.post(url, body, { headers }).pipe(
      map((response: any) => {
        this.notificationService.snackBarMessage('Verification code sent');
        return {
          success: true,
          status: response.status,
          sid: response.sid
        };
      }),
      catchError(error => {
        console.error('Twilio Verify error:', error);
        this.notificationService.snackBarMessage('Failed to send verification code');
        return throwError({
          success: false,
          status: 'failed',
          message: error.error?.message || 'Failed to send verification code'
        });
      })
    );
  }

  /**
   * Verify code sent via Twilio Verify API
   * @param phoneNumber Phone number being verified
   * @param code Verification code entered by user
   * @returns Observable with verification result
   */
  verifyCode(phoneNumber: string, code: string): Observable<VerifyResponse> {
    const url = `${this.TWILIO_VERIFY_BASE}/Services/${this.twilioConfig.serviceSid}/VerificationCheck`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${this.twilioConfig.accountSid}:${this.twilioConfig.authToken}`)
    });

    const body = new URLSearchParams({
      To: phoneNumber,
      Code: code
    }).toString();

    return this.http.post(url, body, { headers }).pipe(
      map((response: any) => {
        const isValid = response.status === 'approved';
        if (isValid) {
          this.notificationService.snackBarMessage('Code verified successfully');
        } else {
          this.notificationService.snackBarMessage('Invalid verification code');
        }
        return {
          success: isValid,
          status: response.status,
          valid: isValid
        };
      }),
      catchError(error => {
        console.error('Twilio Verify check error:', error);
        this.notificationService.snackBarMessage('Verification failed');
        return throwError({
          success: false,
          status: 'failed',
          valid: false,
          message: error.error?.message || 'Verification failed'
        });
      })
    );
  }

  /**
   * Send OTP via SMS using custom message template
   * @param phoneNumber Recipient phone number
   * @param otp One-time password/code
   * @param businessName Your business name
   * @returns Observable with SMS response
   */
  sendOTP(phoneNumber: string, otp: string, businessName: string = 'SF360'): Observable<SMSResponse> {
    const message = `Your ${businessName} verification code is: ${otp}. Valid for 10 minutes. Do not share this code.`;
    return this.sendSMS(phoneNumber, message);
  }

  /**
   * Generate random OTP code
   * @param length OTP length (default: 6)
   * @returns Random numeric OTP
   */
  generateOTP(length: number = 6): string {
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    return otp;
  }

  /**
   * Format phone number to E.164 format
   * @param phoneNumber Phone number
   * @param countryCode Country code (e.g., '233' for Ghana)
   * @returns Formatted phone number
   */
  formatPhoneNumber(phoneNumber: string, countryCode: string): string {
    // Remove all non-numeric characters
    let cleaned = phoneNumber.replace(/\D/g, '');

    // Remove leading zero if present
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }

    // Add country code if not present
    if (!cleaned.startsWith(countryCode)) {
      cleaned = countryCode + cleaned;
    }

    // Add + prefix for E.164 format
    return '+' + cleaned;
  }

  /**
   * Validate phone number format
   * @param phoneNumber Phone number to validate
   * @returns true if valid E.164 format
   */
  isValidPhoneNumber(phoneNumber: string): boolean {
    // E.164 format: +[country code][number]
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    return e164Regex.test(phoneNumber);
  }

  /**
   * Send login notification SMS
   * @param phoneNumber Phone number
   * @param deviceInfo Device information
   * @returns Observable with SMS response
   */
  sendLoginNotification(phoneNumber: string, deviceInfo?: string): Observable<SMSResponse> {
    const device = deviceInfo || 'a new device';
    const message = `New login detected from ${device}. If this wasn't you, please secure your account immediately.`;
    return this.sendSMS(phoneNumber, message);
  }

  /**
   * Update Twilio configuration
   * @param config New Twilio configuration
   */
  updateConfig(config: Partial<TwilioSMSConfig>): void {
    this.twilioConfig = { ...this.twilioConfig, ...config };
  }

  /**
   * Get current Twilio configuration status
   * @returns true if Twilio is properly configured
   */
  isConfigured(): boolean {
    return !!(
      this.twilioConfig.accountSid &&
      this.twilioConfig.authToken &&
      this.twilioConfig.fromPhoneNumber
    );
  }
}
