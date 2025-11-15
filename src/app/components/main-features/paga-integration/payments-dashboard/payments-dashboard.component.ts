import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ISharedData } from 'src/app/interfaces/shared-data.interface';
import { ChartComponent } from "ng-apexcharts";
import { ChartOptions } from 'src/app/interfaces/apex-chart';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PagaApiCallsService } from 'src/app/services/network-calls/paga-api-calls.service';
import { SmsTopupDialogComponent } from '../../customers/sms-topup-dialog/sms-topup-dialog.component';
import { SubscriptionDialogComponent } from '../../premium-payments/subscription-dialog/subscription-dialog.component';

@Component({
  selector: 'app-payments-dashboard',
  templateUrl: './payments-dashboard.component.html'
})

export class PaymentsDashboardComponent implements OnInit {
  pageHeaderOptions: IPageHeader;
  storeId;
  isProcessing = false;
  transactionDetails;
  purchaseAirtimeData: FormGroup;

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartReceivable: Partial<ChartOptions>;


  constructor(
    private router: Router,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private pagaService: PagaApiCallsService,

  ) {

    this.chartOptions = {

      markers: {
        size: 6,
        hover: {
          size: 10
        }
      },
      series: [
        {
          name: "Transactions",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 48]
        }
      ],
      chart: {
        toolbar: {
          show: false
        },

        height: 350,
        type: "line"
      },
      colors: ["#026E08"],

      title: {
        text: ""
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
      }
    };

    this.chartReceivable = {
      markers: {
        size: 6,
        hover: {
          size: 10
        }
      },
      series: [
        {
          name: "Receivable",
          data: [20, 41, 35, 31, 49, 62, 45, 71, 48]
        }
      ],
      chart: {
        type: "line",
        height: 70,
        sparkline: {
          enabled: true
        }
      },
      // colors: ["#00E396"],

      title: {
        text: ""
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
      }
    };
  }

  ngOnInit() {
    this.pageHeaderOptions = { pageTitle: 'Non Cash Transactions Dashboard', hideFilterPanel: true};

    this.purchaseAirtimeData = this.formBuilder.group({
      referenceNumber: ['', Validators.required],
      Currency: [''],
      destinationPhoneNumber: ['', Validators.required],
      mobileOperatorPublicId: ['', Validators.required],
    })

    this.pagaGetMobileOperators()
  }
  pagaGetMobileOperators() {
    this.pagaService.pagaGetMobileOperators({ referenceNumber: 'MX12269', locale: '' }, (error, result) => {
      console.log(result)
    })
  }
  addNewCard() {
    this.router.navigate(['/settings/create-paga-account'])
  }
 
  onSMStopUp() {
    this.dialog.open(SmsTopupDialogComponent).afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        // this.getMyShops();
      }
    });
  }
  onSubscriptionDialog() {
    this.dialog.open(SubscriptionDialogComponent).afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        // this.getMyShops();
      }
    });
  }
  /**
 * Update shared data
 * @param data ISharedData
 */
  onDataRefreshed(data: ISharedData) {
    if (data !== null && data !== undefined) {
      this.storeId = data.shop_id;
      // this.getMyCustomers({ shop_id: data.shop_id });
    }
  }
  /**
  * View Transaction details using Transaction dialog
  * @param transaction transaction obect
  */
  viewOrderDetails(transaction) {
    this.transactionDetails = transaction;
  }

  get referenceNumber() { return this.purchaseAirtimeData.get('referenceNumber') };
  get Amount() { return this.purchaseAirtimeData.get('Amount') };
  get Currency() { return this.purchaseAirtimeData.get('Currency') };
  get destinationPhoneNumber() { return this.purchaseAirtimeData.get('destinationPhoneNumber') };

}
