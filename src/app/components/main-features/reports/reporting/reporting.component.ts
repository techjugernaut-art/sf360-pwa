import { Component, OnInit } from '@angular/core';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { Title } from '@angular/platform-browser';
import { ConstantValuesService } from 'src/app/services/constant-values.service';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent implements OnInit {

  pageHeaderOptions: IPageHeader;
  constructor(
    private title: Title,
    private constantValues: ConstantValuesService
      ) { }

  ngOnInit() {
    // this.title.setTitle(this.constantValues.APP_NAME + ' | Sales Summary Report');
    // tslint:disable-next-line:max-line-length
    this.pageHeaderOptions = {pageTitle: 'Reporting',  hasDateRangeFilter: true, hasPaymentMethodFilter: true, hasOrderStatusFilter: true};
  }

}
