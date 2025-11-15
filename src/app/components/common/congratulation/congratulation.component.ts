import { PaymentRequestTypesEnums } from './../../../utils/enums';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConstantVariables } from 'src/app/utils/enums.util';
import { Component, Inject, OnInit } from '@angular/core';
import { ConstantValuesService } from 'src/app/services/constant-values.service';

@Component({
  selector: 'app-congratulation',
  templateUrl: './congratulation.component.html',
  styleUrls: ['./congratulation.component.scss']
})
export class CongratulationComponent implements OnInit {
onlineAddress = '';
storefrontMallDomain = '';
protocol = '';
platformsEnum = PaymentRequestTypesEnums;
platform = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private constantValue: ConstantValuesService,
    private dialogRef: MatDialog
    ) { }

  ngOnInit() {
    this.onlineAddress = localStorage.getItem(ConstantVariables.ONLINE_STORE_ADDRESS);
    this.protocol = this.constantValue.STOREFRONT_MALL_URL_PROTOCOL;
    this.storefrontMallDomain = this.constantValue.STOREFRONT_MALL_URL;
    if (this.data !== null && this.data !== undefined) {
      this.platform = this.data.platform;
    }
  }
  onJumpIn() {
    this.dialogRef.closeAll();
    this.router.navigate(['/dashboard']);
  }
  onClose() {
    this.dialogRef.closeAll();
  }
}
