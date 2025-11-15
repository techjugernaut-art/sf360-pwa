import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageTypeEnum } from 'src/app/utils/enums';

@Component({
  selector: 'app-customer-message-details',
  templateUrl: './customer-message-details.component.html'
})
export class CustomerMessageDetailsComponent implements OnInit {

  modalTitle = 'Message Template Details';
  message;
  messageTypes = MessageTypeEnum;
  // targetType = TargetTypesEnums;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    if (this.data !== null && this.data !== undefined) {
      this.message = this.data.message;
    }
  }

}