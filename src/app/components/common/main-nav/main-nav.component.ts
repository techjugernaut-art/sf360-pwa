import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { DashboardApiCallsService } from 'src/app/services/network-calls/dashboard-api-calls.service';
import { NavigationItemsEnum } from 'src/app/utils/enums';
import { ChangePasswordComponent } from './../../setup/change-password/change-password.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { collapsibleMenuAnimation } from 'src/app/utils/animations.animator';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { FormControl } from '@angular/forms';
import { IDashboardFilterParams } from 'src/app/interfaces/dashboard-overview-filter.interface';
declare const $;

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
  animations: collapsibleMenuAnimation
})
export class MainNavComponent implements OnInit {
  panelOpenState = false;
  onFreeTrial;
  shopInfo;
  countryShop;
  filterParams: IDashboardFilterParams;
  isPartner = false;
  @Input() isProcessing = false;
  currentUser: User;
  expanded: boolean;
  businessAlerts = [];
  isProcessingBusinessAlerts: boolean;
  @ViewChild('rightDrawer', {static: false}) rightDrawer: MatSidenav;
  @Input() currentNavigation: NavigationItemsEnum;
  navigationItem = NavigationItemsEnum;
  @Output() onCartClicked = new EventEmitter();
  @Input() showCartIcon = false;

    selectedSmallerUnitFormControl: FormControl = new FormControl('');
    @ViewChild(MatSidenav, { static: false }) drawer: MatSidenav;
    isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
  constructor(
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private dashboardService: DashboardApiCallsService,
    private authService: AuthService,
    private shopsService: ShopsService
    ) {
  }
  ngOnInit() {
    this.currentUser = this.authService.currentUser;
    this.isPartner = this.authService.isPartner;
    this.isHandset$.subscribe(isHandset => {
      if (isHandset) {
        // this.tourService.end();
      } else {
        if (this.authService.isFirstLogedIn) {
          this.authService.increaseLoggedInCount();
          // this.setupGuidedTour();
        }
      }
    });
    this.shopsService.getMyShop(this.filterParams, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.response_code === '100') {
        this.shopInfo = result.results[0];
        // console.log(this.shopInfo)
        this.onFreeTrial = this.shopInfo.on_free_trial;
        this.countryShop = this.shopInfo.currency
      }
    });
  }
  expandOrCollapseMenu() {
    this.expanded = !this.expanded;
  }
  logOut() {
    this.authService.logOut();
  }
  toggleMenu() {

  }
  onChangePassword() {
    this.dialog.open(ChangePasswordComponent);
  }

  /**
* Get business alerts
* @param filterData IDashboardFilterParams interface
*/
getBusinessAlerts(filterData: IDashboardFilterParams) {
  this.isProcessingBusinessAlerts = true;
  this.dashboardService.getBusinessAlerts(filterData, (error, result) => {
    this.isProcessingBusinessAlerts = false;
    if (result !== null && result.response_code === '100') {
      this.businessAlerts = result.results;
    }
  });
}
onShowNotifications() {
  this.getBusinessAlerts({shop_id: ''});
  this.rightDrawer.toggle();
}
onCartClick() {
  this.onCartClicked.emit();
}
}
