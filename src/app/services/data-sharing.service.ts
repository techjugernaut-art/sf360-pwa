import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ISharedData } from '../interfaces/shared-data.interface';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  private sharedData: ISharedData = {};
  private dataSource = new BehaviorSubject(this.sharedData);
  constructor() { }
  /**
   * Update Data to be shared among components
   * @param sharedData ISharedData to be passed
   */
  updateData(sharedData: ISharedData) {
    this.dataSource.next(sharedData);
  }
  /**
   * An observable of current data
   */
  get currentData() {
    return this.dataSource.asObservable();
  }
}
