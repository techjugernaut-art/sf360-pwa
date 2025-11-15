import { NotificationActions, asyncLocalStorage } from './../utils/enums.util';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { uuid4 } from '@sentry/utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user = new User();
  private logedInCount = 'logedInCount';
  constructor() { }
  /**
   * Verify if a user is logged in
   * @returns True if logged in else false
   */
  get isLogedIn(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      return true;
    }
    return false;
  }
   /**
   * Verify if a user is 360 Partner
   * @returns True if logged in else false
   */
  get isPartner(): boolean {
    const loginType = localStorage.getItem('loginType');
    if (loginType === 'partner') {
      return true;
    }
    return false;
  }
  /**
   * Verify if a user is logged in for the first time
   * @returns True if logged in else false
   */
  get isFirstLogedIn(): boolean {
    const status = localStorage.getItem(this.logedInCount);
    if (status !== undefined && status !== '' && status === '1') {
      return true;
    }
    return false;
  }
  /**
   * Upate first logged in status
   * @param status logged in status
   */
  increaseLoggedInCount() {
    let count: number = this.getLogedInCount;
    if (count !== undefined && !Number.isNaN(count) && count !== null) {
      count += 1;
      localStorage.setItem(this.logedInCount, count.toString());
    }
  }
/**
   * Get user's logged in count
   * @returns Number
   */
  get getLogedInCount(): number {
    const status = localStorage.getItem(this.logedInCount);
    let count = 0;
    if (status !== undefined && status !== '' && status !== null) {
      // tslint:disable-next-line:radix
      count = Number.parseInt(status);
    }
    return count;
  }
  /**
   * Get information about current user logged in from localStorage
   * @returns User object
   */
  get currentUser() {
    this.user = <User>JSON.parse(localStorage.getItem('user'));
    if (!this.user) {
      return null;
    }
    return this.user;
  }
  /**
   * Save user's information locally in localStorage
   * @param user User data in JSON format
   */
  saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
  /**
   * Save user's token to localStorage
   * @param token User's auth_token from server
   */
  saveToken(token) {
    localStorage.setItem('token', token);
  }
   /**
   * Save user type to localStorage
   * @param userType User type
   */
  saveUserType(userType) {
    localStorage.setItem('loginType', userType);
  }
     /**
   * Remove user type from localStorage
   */
  removeLoginType() {
    localStorage.removeItem('loginType');
  }
     /**
   * Remove phone number from localStorage
   */
  removePhoneNumber() {
    localStorage.removeItem('phoneNumberToConfirm');
  }
  /**
   * Save user's token to localStorage
   * @param token User's auth_token from server
   */
  saveNotificationToken(token) {
    localStorage.setItem('browser_token', token);
  }
  /**
   * Get noifcation token
   */
  get getNotificationToken() {
    const browser_token = localStorage.getItem('browser_token');
    const uuId = localStorage.getItem('uuid');
    let token = '';
    if (browser_token !== undefined && browser_token !== null && browser_token !== '') {
      token = browser_token;
    } else  if (uuId !== undefined && uuId !== null && uuId !== '') {
      token = uuId;
    } else {
      token = uuid4();
      localStorage.setItem('uuid', token);
    }
    return token;
  }
  removeUserAndToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // localStorage.removeItem('browser_token');
  }
  /**
   * Locally update user information in localStorage
   * @param key Key to update
   * @param value Value to update to
   */
  updateUser(key: string, value: any) {
    const user = <User>JSON.parse(localStorage.getItem('user'));
    if (this.user) {
      user[key] = value;
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
  /**
   * Get logged in user's auth_token
   * @returns Returns string of auth token, but null if not exist
   */
  get token() {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    return token;
  }
  /**
   * Get notification token
   * @returns notication token
   */
  get notifictionToken() {
    const token = localStorage.getItem('browser_token');
    if (!token) {
      return null;
    }
    return token;
  }
    /**
   * Get notification reminder date
   * @param action NotificationActions enum object
   * @returns reminder date
   */
   getNotificationReminderDate(action: NotificationActions) {
    const date = localStorage.getItem(action + '_REMINDER_DATE');
    if (date !== undefined && date !== '' && date !== null) {
      return date;
    }
    return '';
  }
     /**
   * Set notification reminder date
   * @param action NotificationActions enum object
   * @returns reminder date
   */
  setNotificationReminderDate(action: NotificationActions, reminderDate) {
    localStorage.setItem(action + '_REMINDER_DATE', reminderDate);
  }
   /**
   * Get if notification reminder was showed
   * @param action NotificationActions enum object
   * @returns reminder showed status as boolean
   */
  isNotificationReminderShowed(action: NotificationActions) {
    const status = localStorage.getItem(action + '_REMINDER_SHOWED');
    if (status !== undefined && status !== '' && status !== null && status === 'true') {
      return true;
    }
    return false;
  }
     /**
   * Set if notification reminder was showed
   * @param action NotificationActions enum object
   * @returns reminder date
   */
  setIsNotificationReminderShowed(action: NotificationActions, isShowed) {
    localStorage.setItem(action + '_REMINDER_SHOWED', isShowed);
  }
     /**
   * Get active shop
   */
  get getActiveShop() {
    const shop = localStorage.getItem('ACTIVE_SHOP');
    if (shop !== undefined && shop !== '' && shop !== null && typeof shop !== 'object' && shop !== '[object Object]') {
      return shop;
    }
    return null;
  }
     /**
   * Set active shop
   * @param shop  object
   */
  setActiveShop(shop) {
    return asyncLocalStorage.setItem('ACTIVE_SHOP', JSON.stringify(shop));
  }
  /**
   * Logout user from system
   */
  logOut() {
    const count = this.getLogedInCount;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    localStorage.removeItem('prefix');
    localStorage.removeItem('ACTIVE_SHOP');
    this.removeLoginType();
    this.removePhoneNumber();
    this.removeUserAndToken();
    // localStorage.clear();
    localStorage.setItem(this.logedInCount, count.toString());
    window.location.href = '/login';
  }
}
