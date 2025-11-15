import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-read-payment-request-requirements',
  templateUrl: './read-payment-request-requirements.component.html'
})
export class ReadPaymentRequestRequirementsComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ReadPaymentRequestRequirementsComponent>
  ) { }

  ngOnInit() {

  }
  onCloseRead(){
    this.dialogRef.close()
  }

}
