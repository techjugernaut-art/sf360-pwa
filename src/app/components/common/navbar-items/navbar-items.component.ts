import { DashboardApiCallsService } from './../../../services/network-calls/dashboard-api-calls.service';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ChangePasswordComponent } from '../../setup/change-password/change-password.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar-items',
  templateUrl: './navbar-items.component.html',
  styleUrls: ['./navbar-items.component.scss']
})
export class NavbarItemsComponent implements OnInit {
  isProcessingBusinessAlerts = false;
  businessAlerts = [];
 @Output() showNotificationDrawer = new EventEmitter();
 @Output() onCartClicked = new EventEmitter();
 @Input() showCartIcon = false;
  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
  ) { }

  ngOnInit() {
  }

onShowNotifications() {
  this.showNotificationDrawer.emit();
}
onChangePassword() {
  this.dialog.open(ChangePasswordComponent);
}
logOut() {
  this.authService.logOut();
}
onCartClick() {
  this.onCartClicked.emit();
}
}
