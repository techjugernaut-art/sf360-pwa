import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-onboarding-congratulation',
  templateUrl: './onboarding-congratulation.component.html'
})
export class OnboardingCongratulationComponent implements OnInit {
  shopInfo
  filterParams: IDashboardFilterParams;
  isProcessing = false;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private shopsService: ShopsService,
    private notificationService: NotificationsService

  ) { }

  ngOnInit() {
    this.shopsService.getMyShop(this.filterParams, (error, result) => {
      if (result !== null && result.response_code === '100') {
        this.shopInfo = result.results[0];
      }
    })
  }
  onUpgrade(){
    this.router.navigate(['/service-payment'])
    this.dialog.closeAll();
  }
  onJumpIn(){
    this.dialog.closeAll();
    this.router.navigate(['/dashboard'])
  }

  onUseFreeTrial() {
    this.dialog.closeAll();
    this.shopsService.useFreeTrail({shop_id: this.shopInfo.id}, (error, result)=>{
      if(result !== null && result.response_code ==='100'){
        this.router.navigate(['/dashboard'])
        this.notificationService.snackBarMessage(result.message)
      }
    })
  }
}
