import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { UsersService } from 'src/app/services/network-calls/users.service';

@Component({
  selector: 'app-send-verification-code',
  templateUrl: './send-verification-code.component.html'
})
export class SendVerificationCodeComponent implements OnInit {
  send_code_via_whatsapp = new FormControl(true);
  isProcessing = false;
  phoneNumber = '';
  constructor(
    private usersService: UsersService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SendVerificationCodeComponent>
  ) { }

  ngOnInit() {
    if (this.data !== null) {
      this.phoneNumber = this.data.phone_number;
    }
  }
  onContinue() {
    this.isProcessing = true;
    // tslint:disable-next-line: max-line-length
    this.usersService.sendVerificationCodeToUser({ phone_number: this.phoneNumber, send_code_via_whatsapp: this.send_code_via_whatsapp.value },
      (error, result) => {
        this.isProcessing = false;
        if (result !== null && (result.response_code === '100' || result.response_code === '101')) {
          this.dialogRef.close({ isSuccess: true });
        }
      });
  }
}
