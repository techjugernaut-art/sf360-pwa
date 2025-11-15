import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataProviderService } from 'src/app/services/data-provider.service';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-intl-country-codes',
  templateUrl: './intl-country-codes.component.html',
  styleUrls: ['./intl-country-codes.component.scss']
})
export class IntlCountryCodesComponent implements OnInit {
countries = [];
preferedCountries = [];
countryCode;
searchInputControl: FormControl = new FormControl('');
@Output() countryCodeSelected = new EventEmitter();
isFetchingCountryInfo = false;
countriesData= [];
  constructor(
    private dataProvider: DataProviderService,
    private constantValues: ConstantValuesService,
  ) { }

  ngOnInit() {
    this.dataProvider.getIntTelCodes().subscribe(result => {
      this.countries = result;
      this.countriesData = result;
      this.getCountryInfo();
    });
    this.searchInputControl.valueChanges.subscribe((searchT: string) => {
      const searchTerm = searchT.toLowerCase();
      if (searchTerm === null || searchTerm === undefined || searchTerm === '') {
        this.countries = this.countriesData;
      } else {
        this.countries = this.countriesData.filter(country => ((country.name !== null && country.name !== undefined) ? country.name as string : '').toLowerCase().indexOf(searchTerm) >= 0)
      }
    });
  }
  onCountrySelected(countryInfo) {
    this.countryCode = '+' + (countryInfo.callingCodes[0] as string);
    this.countryCodeSelected.emit(countryInfo);
  }
  /**
 * Fetch User's Country Information
 */
getCountryInfo() {
  this.isFetchingCountryInfo = true;
  this.dataProvider.httpGetNextPage(this.constantValues.GET_COUNTRY_INFO_URL).subscribe(result => {
    this.isFetchingCountryInfo = false;
    this.countryCode = result.country_calling_code;
    const currentCountry = this.countries.find((element) => '+' + (element.callingCodes[0] as string) === (this.countryCode as string ));
    this.countryCodeSelected.emit(currentCountry);
  }, () => {
    this.isFetchingCountryInfo = false;
  });
}
}
