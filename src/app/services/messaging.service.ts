import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { AuthService } from './auth.service';
import { NotificationsService } from './notifications.service';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  currentMessage = new BehaviorSubject(null);
  constructor(
    private angularFireMessaging: AngularFireMessaging,
    private authService: AuthService,
    private notificationService: NotificationsService
  ) {
    this.angularFireMessaging.messaging.subscribe(
      (_messaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      });
  }

  /**
   * request permission for notification from firebase cloud messaging
   */
  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        if (this.authService.notifictionToken !== token) {
          this.authService.saveNotificationToken(token);
        }
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  /**
   * hook method when new notification received in foreground
   */
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload: any) => {
        const data = JSON.parse(payload.data.notification);
        console.log('got here', data);
        this.notificationService.info(data.title, data.body);
        this.currentMessage.next(payload);
      });
  }
}
