import { OnlineStatusService } from './online-status.service';
import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SyncOfflineDataToServerService {

  refreshInterval;
  offlineDataSyncStatus = new EventEmitter<boolean>();

  constructor(
    private internetStatus: OnlineStatusService

  ) {}

  // function to sync offline data with server service
  syncOfflineDataToServer() {
    this.offlineDataSyncStatus.emit(true);
  }

  startSyncingOfflineData() {
    this.refreshInterval = setInterval(() => {
      if (this.internetStatus.onlineStatus === false) {
        this.syncOfflineDataToServer();
      }
    }, 1000);
  }
  // function to stop syncing offline data with server service
  stopSyncingOfflineData() {
      clearInterval(this.refreshInterval);
  }

}
