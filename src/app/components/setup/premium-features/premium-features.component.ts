import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { owlCustomOptions } from 'src/app/utils/owl-carousel-config';

@Component({
  selector: 'app-premium-features',
  templateUrl: './premium-features.component.html'
})
export class PremiumFeaturesComponent implements OnInit {
  customOptions: OwlOptions = owlCustomOptions;
  filterParams: IDashboardFilterParams;
  isProcessing = false;
  shopInfo;

  constructor(
    private shopsService: ShopsService,
    private notificationService: NotificationsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.shopsService.getMyShop(this.filterParams, (error, result) => {
      if (result !== null && result.response_code === '100') {
        this.shopInfo = result.results[0];
      }
    })
  }
  onFreeTrial(){
    this.shopsService.useFreeTrail({shop_id: this.shopInfo.id}, (error, result)=>{
      if(result !== null && result.response_code ==='100'){
        this.router.navigate(['/dashboard'])
        this.notificationService.snackBarMessage(result.message)
      }
    })
  }
}
