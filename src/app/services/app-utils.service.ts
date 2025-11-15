import { Title } from '@angular/platform-browser';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { Injectable, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ExportDocumentsService } from './export-documents.service';
import { NgxGtagEventService } from 'ngx-gtag';
import { SHA512  } from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AppUtilsService implements OnInit {
  constructor(
    private exportDocument: ExportDocumentsService,
    private ngxGtagEventService: NgxGtagEventService,
    private constantValues: ConstantValuesService,
    private title: Title
  ) { }
  ngOnInit() {
  }
  setPageTitle(appName, pageName) {
    this.title.setTitle(pageName + ' | ' + appName);
  }
  /**
   * Steps through a date 'step' times and return an array of dates
   * @param step number of days you want backdate
   */
  getDateLabelsByEndAndStartDate(startDate, endDate) {
    const datelabels = [];
    for (const m = moment(startDate, "DD-MM-YYYY"); m.diff(moment(endDate, "DD-MM-YYYY"), 'days') <= 0; m.add(1, 'days')) {

      datelabels.push(m.format('YYYY-MM-DD'));
    }
    return datelabels;
  }
  /**
   * Remove space(s) from text
   * @param text text to trim
   */
  removeWhitespace(text: string) {
    if (text !== undefined && text !== null && text !== '') { return text.replace(/\s/g, ''); }
    return '';
  }
  /**
 * Replace space(s) from text with underscores
 * @param text text to trim
 */
  replaceWhitespaceWithUnderscore(text: string) {
    if (text !== undefined && text !== null && text !== '') { return text.replace(/\s/g, '_'); }
    return '';
  }
   /**
 * Replace space(s) from text with underscores
 * @param text text to trim
 */
replaceUnderscoreWithWhitespace(text: string) {
  if (text !== undefined && text !== null && text !== '') { return text.replace(/_/g, ' '); }
  return '';
}
  /**
  * Remove space(s) from text
  * @param text text to trim
  */
  removeSpecialCharacters(text: string) {
    if (text !== undefined && text !== null && text !== '') { return text.replace(/{/g, '').replace(/}/g, ''); }
    return '';
  }
  /**
* Remove space(s) from text
* @param text text to trim
*/
  columnNamesForProductUpload(text: string) {
    if (text !== undefined && text !== null && text !== '') { return text.replace(/{/g, '').replace(/}/g, ''); }
    return '';
  }
  /**
   * Remove first zero in a phone number
   * @param phoneNumber phone number
   */
  removeFirstZero(phoneNumber: string) {
    let phone = phoneNumber;
    if (phoneNumber.length > 0) {
      if (phoneNumber.startsWith('0', 0)) {
        phone = phoneNumber.substring(1);
      }
    }
    return phone;
  }
  /**
  * Export transaction as excell file
  * @param transactions transactions
  */
  exportTransactionsAsExcel(transactions: any[], csvData: any[]) {
    transactions.forEach(data => {
      let responseCode = data.payment_response_code;
      if (data.payment_method === 'CARD' && (data.payment_response_code === '' || data.payment_response_code === undefined)) {
        responseCode = 'INVESTIGATE';
      }
      csvData.push({
        'Trans Date/Time': moment(data.time_created).format('MM/DD/YYYY, HH:MM:SS'),
        'Trans ID': data.transaction_id,
        'Trans Type': data.payment_method,
        'Currency': data.myshop.currency,
        'Trans Amount': data.credit_amt,
        'TRANSACTION STATUS': data.transaction_status
      });
    });
    this.exportDocument.exportAsCSV('transactions_' + moment().unix().toString(), csvData);
  }

  /**
  * Export transaction as excell file
  * @param transactions transactions
  */
  exportSalesSummaryAsExcel(dataSet: any[], csvData: any[]) {
    dataSet.forEach(data => {
      csvData.push({
        'Trans Date/Time': moment(data.time_created).format('MM/DD/YYYY, HH:MM:SS'),
        'Trans ID': data.transaction_id,
        'Trans Type': data.payment_method,
        'Currency': data.myshop.currency,
        'Trans Amount': data.credit_amt,
        'TRANSACTION STATUS': data.transaction_status
      });
    });
    this.exportDocument.exportAsCSV('transactions_' + moment().unix().toString(), csvData);
  }
  /**
   * Returns full name of transaction type
   * @param value transaction type
   */
  getTransactionTypeFullName(value: string) {
    if (value === 'OP') {
      return 'Order Payment';
    } else if (value === 'SB') {
      return 'Subscription Payment';
    } else if (value === 'CP') {
      return 'Credit Payment';
    }
    return value;
  }
  /**
  * Returns full name of network codes
  * @param value network code
  */
  getNetworkFullName(value: string) {
    if (value === 'MTN') {
      return 'MTN';
    } else if (value === 'AIR') {
      return 'AIRTEL';
    } else if (value === 'TIG') {
      return 'TIGO';
    } else if (value === 'VOD') {
      return 'VODAFONE';
    } else if (value === 'GLO') {
      return 'GLO';
    }
    return value;
  }
  /**
   * Track user's events and log unto google analytics
   * @param action event action
   * @param event_category event category
   */
  trackUserEvents(action, event_category, event_label = event_category) {
    this.ngxGtagEventService.event({
      action: action,
      options: { 'event_category': event_category, 'event_label': event_label }
    });
  }
  /**
   * Padding text to maintain a fix length of string
   * @param text text to padd
   * @param padChar character to use for padding eg. 0
   * @param size Padding length
   */
  padLeft(text: string, padChar: string, size: number): string {
    return (String(padChar).repeat(size) + text).substr((size * -1), size);
  }
  /**
   * Get Store's Complete Online Address with protocol and domain prepended and appended
   * @param onlineAddress Store's online address
   */
  getCompleteStoreOnlineAddress(onlineAddress) {
    return this.constantValues.STOREFRONT_MALL_URL_PROTOCOL + onlineAddress + '.' + this.constantValues.STOREFRONT_MALL_URL;
  }
  /**
   * Get Store's Complete Online Address with domain appended
   * @param onlineAddress Store's online address
   */
  getCompleteStoreOnlineAddressWithoutProtocl(onlineAddress) {
    return onlineAddress + '.' + this.constantValues.STOREFRONT_MALL_URL;
  }
  /**
   * Replace space(s) hyphen
   * @param text text to trim
   */
  replaceWhitespaceWithHyphen(text: string) {
    if (text !== undefined && text !== null && text !== '') { return text.replace(/\s/g, ''); }
    return '';
  }
  /**
  * Remove space(s) from text
  * @param text text to trim
  */
 removeComma(text: string) {
  if (text !== undefined && text !== null && text !== '') { return text.replace(/,/g, ''); }
  return '';
}
  formatStringValue(text: string) {
    const strings = (text !== null && text !== undefined && text !== '') ? text.split(' ') : ['', ''];
    const nonComma = this.removeComma(strings[1]);
    return !isNaN(Number(nonComma)) ? Number(nonComma) : 0;;
  }
  /**
   * Generate receipt url
   *
   * @param {string} shopId shop id
   * @param {string} orderId order id
   * @returns receipt url
   */
  generateReceiptUrl(shopId: string, orderId: string) {
    const base64String = btoa(shopId + '-' + orderId);
    return this.constantValues.RECEIPT_BASE_URL + base64String;
  }
  /**
   * Get current user loaction
   */
  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resp => {
        resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
      },
        err => {
          reject(err);
        });
    });
  }

  get getNigeriaStates() {
    return [
      'Abia',
      'Adamawa',
      'Anambra',
      'Akwa Ibom',
      'Bauchi',
      'Bayelsa',
      'Benue',
      'Borno',
      'Cross River',
      'Delta',
      'Ebonyi',
      'Enugu',
      'Edo',
      'Ekiti',
      'FCT - Abuja',
      'Gombe',
      'Imo',
      'Jigawa',
      'Kaduna',
      'Kano',
      'Katsina',
      'Kebbi',
      'Kogi',
      'Kwara',
      'Lagos',
      'Nasarawa',
      'Niger',
      'Ogun',
      'Ondo',
      'Osun',
      'Oyo',
      'Plateau',
      'Rivers',
      'Sokoto',
      'Taraba',
      'Yobe',
      'Zamfara'
    ];
  }
  /**
   * Get regions of Ghana
   */
  get getGhanaRegions() {
    return [
      'Ahafo',
      'Ashanti',
      'Bono East',
      'Brong Ahafo',
      'Central',
      'Eastern',
      'Greater Accra',
      'North East',
      'Northern',
      'Oti',
      'Savannah',
      'Upper East',
      'Upper West',
      'Volta',
      'Western North',
      'Western'
    ];
  }

  /**
   * Get provinces of Ghana
   */
  get getSouthAfricaProvinces() {
    return ['Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape']
  }

  get getKenyaProvinces() {
    return ['Central', 'Coast', 'Eastern', 'Nairobi', 'North Eastern', 'Nyanza', 'Rift Valley', 'Western']
  }

  get getNigerRegions() {
    return ['Agadez', 'Diffa', 'Dosso', 'Maradi', 'Niamey', 'Tahoua', 'Tillabéri', 'Zinder']
  }

  get getBurkinaFasoProvinces() {
    return ['Balé', 'Bam', 'Banwa', 'Bazèga', 'Bougouriba', 'Boulgou', 'Boulkiemdé', 'Comoé', 'Ganzourgou']
  }

  get getTogoRegions() {
    return ['Centrale', 'Kara', 'Maritime', 'Plateaux', 'Savanes']
  }

  get getBeninDepartments() {
    return ['Alibori', 'Atakora', 'Atlantique', 'Borgou', 'Collines', 'Kouffo', 'Donga', 'Littoral', 'Mono', 'Ouémé', 'Plateau', 'Zou']
  }

  get getCameroonRegions() {
    return ['Adamawa', 'Centre', 'East', 'Far North', 'Littoral', 'North', 'Northwest', 'South', 'Southwest', 'West']
  }

  get getLiberiaCounties() {
    return ['Bomi', 'Bong', 'Gbarpolu', 'Grand Bassa', 'Grand Cape Mount', 'Grand Gedeh', 'Grand Kru', 'Lofa', 'Margibi', 'Maryland', 'Montserrado', 'Nimba', 'River Cess', 'River Gee', 'Sinoe']
  }

  get getIvoryCoastRegions() {
    return ['Abidjan', 'Bas-Sassandra', 'Comoé', 'Denguélé', 'Gôh-Djiboua', 'Lacs', 'Lagunes', 'Montagnes', 'Sassandra-Marahoué', 'Savanes', 'Vallée du Bandama', 'Woroba', 'Yamoussoukro', 'Zanzan']
  }

  get getSenegalRegions() {
    return ['Dakar', 'Diourbel', 'Fatick', 'Kaolack', 'Kolda', 'Louga', 'Matam', 'Saint-Louis', 'Tambacounda', 'Thiès', 'Ziguinchor']
  }

  get getLibyaDistricts() {
    return ['Tripoli', 'Misurata', 'Benghazi', 'Derna']
  }

  get getMaliRegions() {
    return ['Bamako', 'Gao', 'Kayes', 'Kidal', 'Mopti', 'Ségou', 'Sto', 'Tombouctou', 'Zouerate']
  }


pagaHashing(body: any) {
  const hashParams = ["referenceNumber","accountReference","financialIdentificationNumber","creditBankId","creditBankAccountNumber","callbackUrl"];

  let hashData = "";
  hashParams.forEach(val => {
      const node = body[val] || "";
      hashData += node;
  });
  hashData += this.constantValues.PAGA_HASH_KEY;
  const hash = SHA512(hashData).toString();
  return hash;
}
}

