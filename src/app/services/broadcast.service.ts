import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {
  onCurrentShopChanged = new BehaviorSubject(null);
  onRefresh = new BehaviorSubject(false);
  constructor() { }
  changeCurrentShop(shop) {
    this.onCurrentShopChanged.next(shop);
  }
  onRefreshData() {
    this.onRefresh.next(true)
  }
}
