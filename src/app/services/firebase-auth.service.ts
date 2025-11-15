import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { NotificationsService } from './notifications.service';
import { AuthService } from './auth.service';

export interface FirebaseUser {
  uid: string;
  email?: string;
  phoneNumber?: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
}

export interface PhoneAuthResult {
  verificationId: string;
  verificationCode?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  private recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  private confirmationResult: firebase.auth.ConfirmationResult;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private notificationService: NotificationsService,
    private authService: AuthService
  ) { }

  /**
   * Initialize reCAPTCHA verifier for phone authentication
   * @param containerId HTML element ID where reCAPTCHA will be rendered
   * @param isInvisible Whether to use invisible reCAPTCHA
   */
  initRecaptcha(containerId: string = 'recaptcha-container', isInvisible: boolean = true): void {
    if (!this.recaptchaVerifier) {
      const config = isInvisible ? { size: 'invisible' } : { size: 'normal' };
      this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(containerId, config);
    }
  }

  /**
   * Send SMS verification code to phone number using Firebase Phone Auth
   * @param phoneNumber Phone number with country code (e.g., +233240000000)
   * @returns Promise with verification ID
   */
  async sendPhoneVerificationCode(phoneNumber: string): Promise<string> {
    try {
      // Ensure reCAPTCHA is initialized
      if (!this.recaptchaVerifier) {
        this.initRecaptcha();
      }

      const appVerifier = this.recaptchaVerifier;
      this.confirmationResult = await firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier);

      this.notificationService.snackBarMessage('Verification code sent successfully');
      return this.confirmationResult.verificationId;
    } catch (error) {
      console.error('Error sending verification code:', error);
      this.notificationService.snackBarMessage('Failed to send verification code: ' + error.message);
      throw error;
    }
  }

  /**
   * Verify phone number with SMS code
   * @param code SMS verification code
   * @returns Promise with user credential
   */
  async verifyPhoneCode(code: string): Promise<firebase.auth.UserCredential> {
    try {
      if (!this.confirmationResult) {
        throw new Error('No confirmation result found. Please request verification code first.');
      }

      const result = await this.confirmationResult.confirm(code);
      this.notificationService.snackBarMessage('Phone number verified successfully');
      return result;
    } catch (error) {
      console.error('Error verifying code:', error);
      this.notificationService.snackBarMessage('Invalid verification code');
      throw error;
    }
  }

  /**
   * Sign in with email and password
   * @param email User email
   * @param password User password
   * @returns Observable with user credential
   */
  signInWithEmail(email: string, password: string): Observable<firebase.auth.UserCredential> {
    return from(firebase.auth().signInWithEmailAndPassword(email, password)).pipe(
      map(credential => {
        this.notificationService.snackBarMessage('Login successful');
        return credential;
      }),
      catchError(error => {
        console.error('Login error:', error);
        this.notificationService.snackBarMessage('Login failed: ' + error.message);
        return throwError(error);
      })
    );
  }

  /**
   * Sign up new user with email and password
   * @param email User email
   * @param password User password
   * @returns Observable with user credential
   */
  signUpWithEmail(email: string, password: string): Observable<firebase.auth.UserCredential> {
    return from(firebase.auth().createUserWithEmailAndPassword(email, password)).pipe(
      map(credential => {
        this.notificationService.snackBarMessage('Account created successfully');
        return credential;
      }),
      catchError(error => {
        console.error('Sign up error:', error);
        this.notificationService.snackBarMessage('Sign up failed: ' + error.message);
        return throwError(error);
      })
    );
  }

  /**
   * Send email verification to current user
   * @returns Promise<void>
   */
  async sendEmailVerification(): Promise<void> {
    try {
      const user = await firebase.auth().currentUser;
      if (user) {
        await user.sendEmailVerification();
        this.notificationService.snackBarMessage('Verification email sent');
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
      this.notificationService.snackBarMessage('Failed to send verification email');
      throw error;
    }
  }

  /**
   * Send password reset email
   * @param email User email
   * @returns Promise<void>
   */
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      this.notificationService.snackBarMessage('Password reset email sent');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      this.notificationService.snackBarMessage('Failed to send password reset email');
      throw error;
    }
  }

  /**
   * Update user profile
   * @param displayName User display name
   * @param photoURL User photo URL
   * @returns Promise<void>
   */
  async updateProfile(displayName?: string, photoURL?: string): Promise<void> {
    try {
      const user = await firebase.auth().currentUser;
      if (user) {
        await user.updateProfile({
          displayName: displayName || user.displayName,
          photoURL: photoURL || user.photoURL
        });
        this.notificationService.snackBarMessage('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      this.notificationService.snackBarMessage('Failed to update profile');
      throw error;
    }
  }

  /**
   * Sign out current user
   * @returns Promise<void>
   */
  async signOut(): Promise<void> {
    try {
      await firebase.auth().signOut();
      this.authService.logOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  /**
   * Get current Firebase user as Observable
   * @returns Observable<firebase.User | null>
   */
  getCurrentUser(): Observable<firebase.User | null> {
    return this.afAuth.authState;
  }

  /**
   * Get current Firebase user ID token
   * @returns Promise<string | null>
   */
  async getIdToken(): Promise<string | null> {
    try {
      const user = await firebase.auth().currentUser;
      if (user) {
        return await user.getIdToken();
      }
      return null;
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  }

  /**
   * Link phone number to existing account
   * @param phoneNumber Phone number with country code
   * @returns Promise<firebase.auth.UserCredential>
   */
  async linkPhoneNumber(phoneNumber: string): Promise<firebase.auth.UserCredential> {
    try {
      if (!this.recaptchaVerifier) {
        this.initRecaptcha();
      }

      const appVerifier = this.recaptchaVerifier;
      const provider = new firebase.auth.PhoneAuthProvider();
      const verificationId = await provider.verifyPhoneNumber(phoneNumber, appVerifier);

      // You'll need to get the verification code from user input
      // This is just the verification ID for now
      this.notificationService.snackBarMessage('Verification code sent to phone');

      // Store verification ID for later use
      sessionStorage.setItem('phoneVerificationId', verificationId);

      return null; // Return null until code is verified
    } catch (error) {
      console.error('Error linking phone number:', error);
      this.notificationService.snackBarMessage('Failed to link phone number');
      throw error;
    }
  }

  /**
   * Complete phone linking with verification code
   * @param code SMS verification code
   * @returns Promise<firebase.auth.UserCredential>
   */
  async completePhoneLinking(code: string): Promise<firebase.auth.UserCredential> {
    try {
      const verificationId = sessionStorage.getItem('phoneVerificationId');
      if (!verificationId) {
        throw new Error('No verification ID found');
      }

      const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
      const user = await firebase.auth().currentUser;

      if (user) {
        const result = await user.linkWithCredential(credential);
        sessionStorage.removeItem('phoneVerificationId');
        this.notificationService.snackBarMessage('Phone number linked successfully');
        return result;
      }

      throw new Error('No user signed in');
    } catch (error) {
      console.error('Error completing phone linking:', error);
      this.notificationService.snackBarMessage('Failed to link phone number');
      throw error;
    }
  }

  /**
   * Save user data to Realtime Database
   * @param uid User ID
   * @param userData User data to save
   * @returns Promise<void>
   */
  async saveUserToDatabase(uid: string, userData: any): Promise<void> {
    try {
      await this.db.object(`users/${uid}`).update(userData);
    } catch (error) {
      console.error('Error saving user to database:', error);
      throw error;
    }
  }

  /**
   * Get user data from Realtime Database
   * @param uid User ID
   * @returns Observable with user data
   */
  getUserFromDatabase(uid: string): Observable<any> {
    return this.db.object(`users/${uid}`).valueChanges();
  }

  /**
   * Clear reCAPTCHA verifier
   */
  clearRecaptcha(): void {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
  }
}
