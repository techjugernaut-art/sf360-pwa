import { CampaignTypesEnums, TargetTypesEnums } from 'src/app/utils/enums';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-customer-campaign-detail',
  templateUrl: './customer-campaign-detail.component.html'
})
export class CustomerCampaignDetailComponent implements OnInit {
  modalTitle = 'Campaign Detail';
  campaign;
  campaignTypes = CampaignTypesEnums;
  targetType = TargetTypesEnums;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    if (this.data !== null && this.data !== undefined) {
      this.campaign = this.data.campaign;
    }
  }

}
