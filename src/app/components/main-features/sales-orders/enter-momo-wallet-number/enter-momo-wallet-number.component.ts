import { PaymentMethodsEnum } from './../../../../utils/enums';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CurrencyEnums } from 'src/app/utils/enums.util';

@Component({
  selector: 'app-enter-momo-wallet-number',
  templateUrl: './enter-momo-wallet-number.component.html',
  styleUrls: ['./enter-momo-wallet-number.component.scss']
})
export class EnterMomoWalletNumberComponent implements OnInit {
  phone_number = new FormControl('', [Validators.required]);
  payment_voucher_code = new FormControl('', [Validators.required]);
  currencies = CurrencyEnums;
  currency = '';
  paymentMethod = PaymentMethodsEnum.MOMO;
  paymentNetwork = 'MTN';
  networkName = 'MTN MOMO';
  constructor(
    private dialogRef: MatDialogRef<EnterMomoWalletNumberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  onClose() {
    this.dialogRef.close(null);
  }
  selectPaymentMethod(paymentMethod, paymentNetwork, networkFullName) {
    this.paymentMethod = paymentMethod;
    this.paymentNetwork = paymentNetwork;
    this.networkName = networkFullName;
    // this.payment_method.setValue(paymentMethod);
  }
  onContinue() {
    this.dialogRef.close({
      phone_number: this.phone_number.value,
      payment_voucher_code: this.payment_voucher_code.value,
      payment_method: this.paymentMethod,
      payment_network: this.paymentNetwork,
      network_name: this.networkName
    });
  }
}
