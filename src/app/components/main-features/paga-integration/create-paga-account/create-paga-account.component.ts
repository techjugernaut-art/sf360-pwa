import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { PagaApiCallsService } from 'src/app/services/network-calls/paga-api-calls.service';
import { AppUtilsService } from 'src/app/services/app-utils.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import * as moment from 'moment';

@Component({
  selector: 'app-create-paga-account',
  templateUrl: './create-paga-account.component.html',
  styleUrls: ['./create-paga-account.component.scss']
})
export class CreatePagaAccountComponent implements OnInit {
  pageHeaderOptions: IPageHeader;
  storeId;
  accountFormGroup: FormGroup;
  isProcessing = false;
  countryCode;
  myShops;
  pagaBanks;
  canLinkBankCtrl: FormControl = new FormControl(false)
  shopName: any;


  constructor(
    private formBuilder: FormBuilder,
    private pageApiCalls: PagaApiCallsService,
    private appUtils: AppUtilsService,
    private notificationService: NotificationsService,
    private constantValues: ConstantValuesService,
    private shopsService: ShopsService
  ) { }

  ngOnInit() {
    this.pageHeaderOptions = { pageTitle: 'Create Paga Account', hideFilterPanel: true };

    this.accountFormGroup = this.formBuilder.group({
      referenceNumber: [moment().unix.toString()], //A unique reference number for this request.This same reference number will be returned in the response.
      phoneNumber: ['09102200402'],
      firstName: ['Josh', Validators.required],
      lastName: ['Shine', Validators.required],
      accountName: ['Shine Enterprise', Validators.required],
      financialIdentificationNumber: ['00123456789'], //THIS IS SAME AS Bank verification Number (BVN)
      accountReference: [''], //  Validators.required, Validators.minLength(12), Validators.maxLength(30) THIS SHOULD BE KUDIGO GENERATED MERCHANT UNIQUE ID [ASK GID]
      callbackUrl: ['http://localhost:4200/dashboard'],
      // email: ['', [Validators.email]],
      // creditBankId: ['',],
      // creditBankAccountNumber: [''],
    })
    // this.canLinkBankCtrl.valueChanges.subscribe(value => {

    //   console.log(value)
    //   this.creditBankId.clearAsyncValidators()
    //   this.creditBankId.setValidators([Validators.nullValidator])
    //   this.creditBankAccountNumber.clearAsyncValidators()
    //   this.creditBankAccountNumber.setValidators([Validators.nullValidator])
    //   if(value == true){
    //     this.creditBankId.setValidators([Validators.required]);
    //     this.creditBankAccountNumber.setValidators([Validators.required]);
    //   }else if(value == false){
    //     this.creditBankId.setValidators([Validators.nullValidator])
    //     this.creditBankId.updateValueAndValidity()
    //     this.creditBankAccountNumber.setValidators([Validators.nullValidator])
    //     this.creditBankAccountNumber.updateValueAndValidity()
    //   }
    // })

    this.accountReference.valueChanges.subscribe(res => {
      this.myShops.find(data => {
        if(res !== null && res !== undefined && res !== ''){
          if(data.paga_unique_code == res){
            this.shopName = data.business_name
            // this.accountReference.setValue(data?.paga_unique_code)
            this.referenceNumber.setValue(data?.merchant_code)
          }
        } else if(res === null && res === undefined && res === ''){
            this.shopsService.generatePagaUniqueCode((error, result)=>{
              this.accountReference.setValue(result.results.paga_unique_code)
              this.referenceNumber.setValue(data?.merchant_code)
            })
        }

      })
    })
    this.getPagaBanks();
    this.getMyShops();
  }

  /**
  * Get paga banks
  */
  getPagaBanks(){
    this.isProcessing = true;
    // this.pageApiCalls.getPagaBanks(this.referenceId, (error, result) => {
    //   this.isProcessing = false;
    //   console.log(result, 'RESULT')
    //   this.pagaBanks = result
    // })
  }

  /**
  * Get shops of current loged in user
  */
   getMyShops() {
    this.isProcessing = true;
    this.shopsService.getMyShop({ shop_id: '' }, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.status === 'success') {
        this.myShops = result.results;
      }
    });
  }

  generateShopCode(){
    this.shopsService.generatePagaUniqueCode((error, result)=>{
      console.log(result, 'RESULT')
    })
  }

  /**
   * Submit paga account detail to paga server
   * @param data
   */
  onSubmit(data) {
    console.log(data, 'DATA')
    if(data.accountReference === null){
      console.log('HIT FIRST FUNCTION')
      this.isProcessing = true;
      this.shopsService.generatePagaUniqueCode((error, result)=>{
        this.isProcessing = false;
        // data.phoneNumber = this.countryCode + this.appUtils.removeFirstZero(this.phoneNumber.value);
        data.accountReference = result.results.paga_unique_code;
        this.pageApiCalls.createPersistentPaymentAccount(data, (error, result) => {
          this.isProcessing = false;
          console.log(result, 'RESULT')
          console.log(error, 'ERROR')
          // this.notificationService.snackBarMessage('Account successfully created');
        })
    })
    // console.log(data, 'DATA')
    } else if (data.accountReference !== null){
      console.log('HIT SECOND FUNCTION')
      this.isProcessing = true;
      this.pageApiCalls.createPersistentPaymentAccount(data, (error, result) => {
        this.isProcessing = false;
        console.log(result, 'RESULT')
        console.log(error, 'error')
        // this.notificationService.snackBarMessage('Account successfully created');
      })
    }
  }

  /**
 * Country code selected
 * @param countryInfo country info
 */
  onCountry(countryInfo) {
    if (countryInfo !== undefined && countryInfo !== null) {
      this.countryCode = '+' + (countryInfo.callingCodes[0] as string);
    }
  }

  get referenceNumber() { return this.accountFormGroup.get('referenceNumber') };
  get phoneNumber() { return this.accountFormGroup.get('phoneNumber') };
  get accountName() { return this.accountFormGroup.get('accountName') };
  get firstName() { return this.accountFormGroup.get('firstName') };
  get lastName() { return this.accountFormGroup.get('lastName') };
  get financialIdentificationNumber() { return this.accountFormGroup.get('financialIdentificationNumber') };
  get email() { return this.accountFormGroup.get('email') };
  get accountReference() { return this.accountFormGroup.get('accountReference') };
  get creditBankId() { return this.accountFormGroup.get('creditBankId') };
  get creditBankAccountNumber() { return this.accountFormGroup.get('creditBankAccountNumber') };

}
