import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-actions',
  templateUrl: './notification-actions.component.html',
  styleUrls: ['./notification-actions.component.scss']
})
export class NotificationActionsComponent implements OnInit {

  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<NotificationActionsComponent>,
  ) { }

  ngOnInit() {
  }
  /**
   * On Notification Action
   */
  onNotificationAction() {
    this.dialogRef.close();
    this.router.navigate(['/products/upload']);
  }
}
