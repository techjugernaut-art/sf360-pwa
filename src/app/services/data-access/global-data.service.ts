import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataProviderService } from '../data-provider.service';
import { ICallback } from 'src/app/interfaces/callback.interface';
import { RequestMethds } from 'src/app/utils/enums';

@Injectable({
  providedIn: 'root'
})
export class GlobalDataService {

  pageChangedObservable: Observable<any>;
  constructor(
    private dataProvider: DataProviderService) { }
  /**
   * Get Business Types
   */
  get getBusinessTypes() {
    return [
      {id: 'Sole Proprietorship', name: 'Sole Proprietorship'},
      // {id: 'Corporation', name: 'Corporation'},
      // {id: 'Coorperative', name: 'Coorperative'},
      // {id: 'Partnership', name: 'Partnership'},
      // {id: 'Public Limited Liability', name: 'Public Limited Liability'},
      {id: 'Private Limited Liability', name: 'Private Limited Liability'},
      // {id: 'Non profit organization', name: 'Non Profit Organization'}
    ];
  }
   /**
   * Get Business Categories
   */
  get getBusinessCategories() {
    return [
      {id: 'Beauty and Cosmetics', name: 'Beauty and Cosmetics'},
      {id: 'Beverages and Liquor', name: 'Beverages and Liquor'},
      {id: 'Books and Stationary', name: 'Books and Stationary'},
      {id: 'Building Materials', name: 'Building Materials'},
      {id: 'Cafe, Bars and Restaurants', name: 'Cafe, Bars and Restaurants'},
      {id: 'Fashion and Clothing', name: 'Fashion and Clothing'},
      {id: 'Frozen Foods', name: 'Frozen Foods'},
      {id: 'Furniture and Accessories', name: 'Furniture and Accessories'},
      {id: 'Health and Wellness', name: 'Health and Wellness'},
      {id: 'Media and Printing', name: 'Media and Printing'},
      {id: 'Pharmaceuticals', name: 'Pharmaceuticals'},
      {id: 'Provision Store', name: 'Provision Store'},
      {id: 'Supermarket', name: 'Supermarket'},
      {id: 'Travel and Holiday', name: 'Travel and Holiday'},
      {id: 'Other', name: 'Other'}
    ];
  }
   /**
   * Get Account Types
   */
  get getAccountTypes() {
    return [
      {id: 'Savings Account', name: 'Savings Account'},
      {id: 'Current Account', name: 'Current Account'}
    ];
  }
   /**
   * Get Mobile Money Networkds
   */
  get getMobileMoneyNetworks() {
    return [
      {id: 'MTN Mobile Money', name: 'MTN Mobile Money'},
      {id: 'Vodafone Cash', name: 'Vodafone Cash'},
      {id: 'TIGO Cash', name: 'TIGO Cash'},
      {id: 'Airtel Money', name: 'Airtel Money'}
    ];
  }
  get getNigerianBanks() {
    return [
      { id: '1', name: 'Access Bank', code: '044' },
      { id: '2', name: 'Citibank', code: '023' },
      { id: '3', name: 'Diamond Bank', code: '063' },
      { id: '4', name: 'Dynamic Standard Bank', code:  '' },
      { id: '5', name: 'Ecobank Nigeria', code:  '050' },
      { id: '6', name: 'Fidelity Bank Nigeria', code:  '070' },
      { id: '7', name: 'First Bank of Nigeria', code:  '011' },
      { id: '8', name: 'First City Monument Bank', code:  '214' },
      { id: '9', name: 'Guaranty Trust Bank', code:  '058' },
      { id: '10', name: 'Heritage Bank Plc', code:  '030' },
      { id: '11', name: 'Jaiz Bank', code:  '301' },
      { id: '12', name: 'Keystone Bank Limited', code:  '082' },
      { id: '13', name: 'Providus Bank Plc', code:  '101' },
      { id: '14', name: 'Polaris Bank', code:  '076' },
      { id: '15', name: 'Stanbic IBTC Bank Nigeria Limited', code:  '221' },
      { id: '16', name: 'Standard Chartered Bank', code:  '068' },
      { id: '17', name: 'Sterling Bank', code:  '232' },
      { id: '18', name: 'Suntrust Bank Nigeria Limited', code:  '100' },
      { id: '19', name: 'Union Bank of Nigeria', code:  '032' },
      { id: '20', name: 'United Bank for Africa', code:  '033' },
      { id: '21', name: 'Unity Bank Plc', code:  '215' },
      { id: '22', name: 'Wema Bank', code:  '035' },
      { id: '23', name: 'Zenith Bank', code:  '057' }
  ];

  }
  get getGhanaianBanks() {
    return [
      { id: '1', name: 'Access Bank', code: '044' },
      { id: '2', name: 'Agricultural Development Bank', code: '023' },
      { id: '3', name: 'Bank of Africa Ghana', code: '063' },
      { id: '4', name: 'Barclays Bank of Ghana', code:  '' },
      { id: '5', name: 'CAL Bank', code:  '050' },
      { id: '6', name: 'Consolidated Bank Ghana', code:  '070' },
      { id: '23', name: 'Diamond Bank', code:  '' },
      { id: '7', name: 'Ecobank Ghana', code:  '011' },
      { id: '8', name: 'FBNBank', code:  '214' },
      { id: '9', name: 'Fidelity Bank', code:  '058' },
      { id: '10', name: 'First Atlantic Bank', code:  '030' },
      { id: '22', name: 'First National Bank (Ghana)', code:  '035' },
      { id: '11', name: 'GCB Bank', code:  '301' },
      { id: '23', name: 'GHL Bank', code:  '057' },
      { id: '12', name: 'Guaranty Trust Bank (Ghana)', code:  '082' },
      { id: '13', name: 'National Investment Bank', code:  '101' },
      { id: '14', name: 'OmniBSIC Bank Ghana', code:  '076' },
      { id: '15', name: 'Prudential Bank', code:  '221' },
      { id: '16', name: 'Republic Bank (Ghana)', code:  '068' },
      { id: '17', name: 'Societe General (Ghana)', code:  '232' },
      { id: '18', name: 'Stanbic Bank Ghana', code:  '100' },
      { id: '19', name: 'Standard Chartered Bank (Ghana)', code:  '032' },
      { id: '20', name: 'United Bank for Africa (Ghana)', code:  '033' },
      { id: '21', name: 'Universal Merchant Bank', code:  '215' },
      { id: '22', name: 'Zenith Bank (Ghana)', code:  '035' }
  ];
  }
  /**
   * Load more data with next page url
   * @param nextPageUrl next page url
   * @param requestMethod request method of type RequestMethds
   * @param requestPayload request payload
   * @param callback ICallback function that returns an error or result
   */
  loadAllDataWithNextURL(nextPageUrl, requestMethod: RequestMethds, requestPayload, callback: ICallback) {
    if (nextPageUrl === null || nextPageUrl === '' || nextPageUrl === undefined) {
      return;
    }
    if (requestMethod === 'POST') {
    this.pageChangedObservable = this.dataProvider.httpPostNextPage(nextPageUrl, requestPayload);
    } else if (requestMethod === 'GET') {
      this.pageChangedObservable = this.dataProvider.httpGetNextPage(nextPageUrl);
    }
      this.pageChangedObservable.subscribe(result => {
        if (result) {
          callback(null, result);
          if (result.next !== null && result.next !== '' && result.next !== undefined) {
            this.loadAllDataWithNextURL(result.next, requestMethod, requestPayload, callback);
          }
        }
      }, error => {
        callback(error, null);
      });
  }
}
