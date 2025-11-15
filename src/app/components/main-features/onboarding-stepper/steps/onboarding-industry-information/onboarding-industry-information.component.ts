import { Router } from '@angular/router';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
declare const swal;

@Component({
  selector: 'app-onboarding-industry-information',
  templateUrl: './onboarding-industry-information.component.html',
  styleUrls: ['./onboarding-industry-information.component.scss']
})
export class OnboardingIndustryInformationComponent implements OnInit {
  isProcessing = false;
  allIndustries = [];
  tempIndustries = [];
  searchIndustryFormControl = new FormControl();
  industryFormControl = new FormControl('');
  constructor(
    private shopsService: ShopsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.searchIndustryFormControl.valueChanges.subscribe(data => {
      this.searchIndustries(data);
    });
    this.getIndustries();
  }
  /**
   * Search industries in the temp data array
   * @param searchTerm Search Term
   */
  searchIndustries(searchTerm: string) {
    this.allIndustries = this.tempIndustries.filter(data => {
      return (data.name as string).toLowerCase().includes(searchTerm.toLowerCase());
    });
  }
  /**
   * Save industry and move to next step
   */
  onSaveIndustryAndContinue() {
    if (this.industryFormControl.value !== undefined && this.industryFormControl.value !== '' && this.industryFormControl.value !== null) {
      this.router.navigate(['/onboarding/business-info'], { queryParams: { step: 3 } });
    }
  }
  /**
   * Get all industries
   */
  getIndustries() {
    this.isProcessing = true;
    this.shopsService.getIndustries((error, result) => {
      this.isProcessing = false;
      if (result !== null) {
        this.allIndustries = result;
        this.tempIndustries = result;
      }
    });
  }
}
