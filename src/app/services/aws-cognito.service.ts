import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NotificationsService } from './notifications.service';
import { environment } from '../../environments/environment';

// Interfaces for AWS Cognito
export interface CognitoConfig {
  userPoolId: string;
  clientId: string;
  region: string;
  identityPoolId?: string;
}

export interface CognitoUser {
  username: string;
  email?: string;
  phoneNumber?: string;
  attributes?: any;
  sub?: string;
}

export interface AuthTokens {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface SignUpParams {
  username: string;
  password: string;
  email?: string;
  phoneNumber?: string;
  attributes?: { [key: string]: string };
}

export interface SignInParams {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AwsCognitoService {
  private cognitoConfig: CognitoConfig;
  private currentUserSubject: BehaviorSubject<CognitoUser | null>;
  public currentUser: Observable<CognitoUser | null>;

  // Note: For full AWS Cognito integration, you would typically use
  // amazon-cognito-identity-js package. This is a simplified implementation
  // that shows the structure. Install with: npm install amazon-cognito-identity-js

  constructor(
    private http: HttpClient,
    private notificationService: NotificationsService
  ) {
    this.initializeCognitoConfig();
    this.currentUserSubject = new BehaviorSubject<CognitoUser | null>(
      this.loadUserFromStorage()
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  /**
   * Initialize AWS Cognito configuration
   */
  private initializeCognitoConfig(): void {
    this.cognitoConfig = {
      userPoolId: environment.AWS_COGNITO_USER_POOL_ID || '',
      clientId: environment.AWS_COGNITO_CLIENT_ID || '',
      region: environment.AWS_COGNITO_REGION || 'us-east-1',
      identityPoolId: environment.AWS_COGNITO_IDENTITY_POOL_ID || ''
    };
  }

  /**
   * Load user from local storage
   */
  private loadUserFromStorage(): CognitoUser | null {
    const userJson = localStorage.getItem('cognito_user');
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Save user to local storage
   */
  private saveUserToStorage(user: CognitoUser): void {
    localStorage.setItem('cognito_user', JSON.stringify(user));
  }

  /**
   * Remove user from local storage
   */
  private removeUserFromStorage(): void {
    localStorage.removeItem('cognito_user');
    localStorage.removeItem('cognito_tokens');
  }

  /**
   * Sign up new user
   * @param params Sign up parameters
   * @returns Promise with user data
   */
  async signUp(params: SignUpParams): Promise<any> {
    try {
      // This is a placeholder. In production, you would use:
      // const cognitoUser = await this.userPool.signUp(...)

      // For now, we'll make an API call to your backend that handles Cognito
      const result = await this.http.post(`${environment.BASE_URL}auth/cognito-signup`, {
        username: params.username,
        password: params.password,
        email: params.email,
        phone_number: params.phoneNumber,
        user_pool_id: this.cognitoConfig.userPoolId,
        client_id: this.cognitoConfig.clientId,
        attributes: params.attributes
      }).toPromise();

      this.notificationService.snackBarMessage('Sign up successful. Please verify your email/phone.');
      return result;
    } catch (error) {
      console.error('Cognito sign up error:', error);
      this.notificationService.snackBarMessage('Sign up failed: ' + (error.error?.message || error.message));
      throw error;
    }
  }

  /**
   * Confirm sign up with verification code
   * @param username Username
   * @param code Verification code
   * @returns Promise<any>
   */
  async confirmSignUp(username: string, code: string): Promise<any> {
    try {
      const result = await this.http.post(`${environment.BASE_URL}auth/cognito-confirm-signup`, {
        username,
        code,
        user_pool_id: this.cognitoConfig.userPoolId,
        client_id: this.cognitoConfig.clientId
      }).toPromise();

      this.notificationService.snackBarMessage('Account verified successfully');
      return result;
    } catch (error) {
      console.error('Cognito confirm sign up error:', error);
      this.notificationService.snackBarMessage('Verification failed');
      throw error;
    }
  }

  /**
   * Sign in user
   * @param params Sign in parameters
   * @returns Promise with auth tokens
   */
  async signIn(params: SignInParams): Promise<AuthTokens> {
    try {
      const result: any = await this.http.post(`${environment.BASE_URL}auth/cognito-signin`, {
        username: params.username,
        password: params.password,
        user_pool_id: this.cognitoConfig.userPoolId,
        client_id: this.cognitoConfig.clientId
      }).toPromise();

      const tokens: AuthTokens = {
        accessToken: result.access_token,
        idToken: result.id_token,
        refreshToken: result.refresh_token,
        expiresIn: result.expires_in
      };

      // Save tokens
      localStorage.setItem('cognito_tokens', JSON.stringify(tokens));

      // Get user attributes
      const user = await this.getUserAttributes(tokens.accessToken);
      this.saveUserToStorage(user);
      this.currentUserSubject.next(user);

      this.notificationService.snackBarMessage('Sign in successful');
      return tokens;
    } catch (error) {
      console.error('Cognito sign in error:', error);
      this.notificationService.snackBarMessage('Sign in failed');
      throw error;
    }
  }

  /**
   * Get user attributes
   * @param accessToken Access token
   * @returns Promise with user data
   */
  async getUserAttributes(accessToken: string): Promise<CognitoUser> {
    try {
      const result: any = await this.http.post(`${environment.BASE_URL}auth/cognito-user-attributes`, {
        access_token: accessToken,
        user_pool_id: this.cognitoConfig.userPoolId
      }).toPromise();

      return {
        username: result.username,
        email: result.email,
        phoneNumber: result.phone_number,
        attributes: result.attributes,
        sub: result.sub
      };
    } catch (error) {
      console.error('Error getting user attributes:', error);
      throw error;
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      const tokens = this.getTokens();
      if (tokens) {
        await this.http.post(`${environment.BASE_URL}auth/cognito-signout`, {
          access_token: tokens.accessToken,
          user_pool_id: this.cognitoConfig.userPoolId
        }).toPromise();
      }

      this.removeUserFromStorage();
      this.currentUserSubject.next(null);
      this.notificationService.snackBarMessage('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      // Still clear local data even if API call fails
      this.removeUserFromStorage();
      this.currentUserSubject.next(null);
    }
  }

  /**
   * Refresh auth tokens
   * @param refreshToken Refresh token
   * @returns Promise with new tokens
   */
  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      const result: any = await this.http.post(`${environment.BASE_URL}auth/cognito-refresh`, {
        refresh_token: refreshToken,
        user_pool_id: this.cognitoConfig.userPoolId,
        client_id: this.cognitoConfig.clientId
      }).toPromise();

      const tokens: AuthTokens = {
        accessToken: result.access_token,
        idToken: result.id_token,
        refreshToken: refreshToken,
        expiresIn: result.expires_in
      };

      localStorage.setItem('cognito_tokens', JSON.stringify(tokens));
      return tokens;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  /**
   * Forgot password - send reset code
   * @param username Username
   * @returns Promise<any>
   */
  async forgotPassword(username: string): Promise<any> {
    try {
      const result = await this.http.post(`${environment.BASE_URL}auth/cognito-forgot-password`, {
        username,
        user_pool_id: this.cognitoConfig.userPoolId,
        client_id: this.cognitoConfig.clientId
      }).toPromise();

      this.notificationService.snackBarMessage('Password reset code sent');
      return result;
    } catch (error) {
      console.error('Forgot password error:', error);
      this.notificationService.snackBarMessage('Failed to send reset code');
      throw error;
    }
  }

  /**
   * Confirm forgot password with new password
   * @param username Username
   * @param code Verification code
   * @param newPassword New password
   * @returns Promise<any>
   */
  async confirmForgotPassword(username: string, code: string, newPassword: string): Promise<any> {
    try {
      const result = await this.http.post(`${environment.BASE_URL}auth/cognito-confirm-forgot-password`, {
        username,
        code,
        new_password: newPassword,
        user_pool_id: this.cognitoConfig.userPoolId,
        client_id: this.cognitoConfig.clientId
      }).toPromise();

      this.notificationService.snackBarMessage('Password reset successful');
      return result;
    } catch (error) {
      console.error('Confirm forgot password error:', error);
      this.notificationService.snackBarMessage('Password reset failed');
      throw error;
    }
  }

  /**
   * Change password for authenticated user
   * @param oldPassword Old password
   * @param newPassword New password
   * @returns Promise<any>
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<any> {
    try {
      const tokens = this.getTokens();
      if (!tokens) {
        throw new Error('No access token found');
      }

      const result = await this.http.post(`${environment.BASE_URL}auth/cognito-change-password`, {
        access_token: tokens.accessToken,
        old_password: oldPassword,
        new_password: newPassword,
        user_pool_id: this.cognitoConfig.userPoolId
      }).toPromise();

      this.notificationService.snackBarMessage('Password changed successfully');
      return result;
    } catch (error) {
      console.error('Change password error:', error);
      this.notificationService.snackBarMessage('Password change failed');
      throw error;
    }
  }

  /**
   * Get stored tokens
   * @returns Auth tokens or null
   */
  getTokens(): AuthTokens | null {
    const tokensJson = localStorage.getItem('cognito_tokens');
    if (tokensJson) {
      try {
        return JSON.parse(tokensJson);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Get current user value
   */
  getCurrentUserValue(): CognitoUser | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const tokens = this.getTokens();
    return !!tokens && !!this.getCurrentUserValue();
  }

  /**
   * Resend confirmation code
   * @param username Username
   * @returns Promise<any>
   */
  async resendConfirmationCode(username: string): Promise<any> {
    try {
      const result = await this.http.post(`${environment.BASE_URL}auth/cognito-resend-code`, {
        username,
        user_pool_id: this.cognitoConfig.userPoolId,
        client_id: this.cognitoConfig.clientId
      }).toPromise();

      this.notificationService.snackBarMessage('Confirmation code resent');
      return result;
    } catch (error) {
      console.error('Resend confirmation code error:', error);
      this.notificationService.snackBarMessage('Failed to resend code');
      throw error;
    }
  }

  /**
   * Update user attributes
   * @param attributes Attributes to update
   * @returns Promise<any>
   */
  async updateUserAttributes(attributes: { [key: string]: string }): Promise<any> {
    try {
      const tokens = this.getTokens();
      if (!tokens) {
        throw new Error('No access token found');
      }

      const result = await this.http.post(`${environment.BASE_URL}auth/cognito-update-attributes`, {
        access_token: tokens.accessToken,
        attributes,
        user_pool_id: this.cognitoConfig.userPoolId
      }).toPromise();

      // Refresh user data
      const user = await this.getUserAttributes(tokens.accessToken);
      this.saveUserToStorage(user);
      this.currentUserSubject.next(user);

      this.notificationService.snackBarMessage('Profile updated successfully');
      return result;
    } catch (error) {
      console.error('Update attributes error:', error);
      this.notificationService.snackBarMessage('Profile update failed');
      throw error;
    }
  }

  /**
   * Check if Cognito is configured
   */
  isConfigured(): boolean {
    return !!(
      this.cognitoConfig.userPoolId &&
      this.cognitoConfig.clientId &&
      this.cognitoConfig.region
    );
  }
}
