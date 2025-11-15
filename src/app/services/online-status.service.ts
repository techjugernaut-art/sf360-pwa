import { EventEmitter, Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { NotificationsService } from './notifications.service';

@Injectable({
  providedIn: 'root'
})
export class OnlineStatusService {

  online$ = fromEvent(window, 'online');
  offline$ = fromEvent(window, 'offline');
  connectionStatus = new EventEmitter<boolean>();
  onlineStatus: boolean;

  constructor(
    private notifiationService: NotificationsService,
  ) {
    this.subscribeForStatus();
  }
  /**
   * Returns true if a device is online
   */
  get isOnline() {
    return !!window.navigator.onLine;
  }

  /**
   * Returns true if a device is offline
   */
  get isOffline() {
    return !this.isOnline;
  }
  
  private subscribeForStatus() {
    let notifcation;
      this.online$.subscribe(e => {
        if (notifcation !== undefined && notifcation !== null) { notifcation.remove(); }
        this.notifiationService.infoMessage('Internet connection restored');
       this.connectionStatus.emit(true);
       });
      this.offline$.subscribe(e => {
        // tslint:disable-next-line:max-line-length
        notifcation   = this.notifiationService.warningInstance('You are currently offline. Please check your internet connection');
        this.connectionStatus.emit(false);
      });

  }
}
