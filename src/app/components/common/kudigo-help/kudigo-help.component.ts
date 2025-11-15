import { element } from 'protractor';
import { FormControl } from '@angular/forms';
import { SharedDataApiCallsService } from 'src/app/services/network-calls/shared-data-api-calls.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ConstantValuesService } from 'src/app/services/constant-values.service';

@Component({
  selector: 'app-kudigo-help',
  templateUrl: './kudigo-help.component.html',
  styleUrls: ['./kudigo-help.component.scss']
})
export class KudigoHelpComponent implements OnInit {

  pageHeaderOptions: IPageHeader;
  isProcessing = false;
  requestPayload = {};
  helpContents = [];
  helpContentsAll = [];
  searchFormControl: FormControl = new FormControl('');
  constructor(
    private sharedService: SharedDataApiCallsService
  ) { }

  ngOnInit() {
    // tslint:disable-next-line:max-line-length
    this.pageHeaderOptions = { pageTitle: ' KudiGo Help', hasShopsFilter: false, ignoreFilterByAllShops: true, hideFilterPanel: true };
    this.getHelpContent();
    this.searchFormControl.valueChanges.subscribe((value: string) => {
      const tempToSearch: any[] = this.helpContentsAll;
      if (value !== undefined && value !== null && value !== '') {
        // tslint:disable-next-line: max-line-length
        this.helpContents = tempToSearch.filter(element => ((element.title as string).toLowerCase().includes(value.toLowerCase())));
      } else {
        this.helpContents = this.helpContentsAll;
      }
    });
  }

getHelpContent() {
  this.isProcessing = true;
  this.sharedService.getKudiGoHelp((error, result) => {
    this.isProcessing = false;
    if (result !== null) {
      this.helpContents = result.results;
      this.helpContentsAll = result.results;
    }
  });
}
}
