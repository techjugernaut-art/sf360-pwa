import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IsProcessingStatusService {
  private dataSource = new BehaviorSubject(false);
  constructor() { }
  /**
   * Update isProcessing status
   * @param isProcessing isProcessing to be passed
   */
  updateStatus(isProcessing: boolean) {
    this.dataSource.next(isProcessing);
  }
  /**
   * An observable of current data
   */
  get currentIsProcessingStatus() {
    return this.dataSource.asObservable();
  }
}
