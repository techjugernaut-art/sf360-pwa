import { NotificationsService } from 'src/app/services/notifications.service';
import { AppUtilsService } from './../../../../../services/app-utils.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { WhatsAppEnableOrDisableActions } from 'src/app/utils/enums';

@Component({
  selector: 'app-enable-disable-whatsapp-communication',
  templateUrl: './enable-disable-whatsapp-communication.component.html',
  styleUrls: ['./enable-disable-whatsapp-communication.component.scss']
})
export class EnableDisableWhatsappCommunicationComponent implements OnInit {

  formGroup: FormGroup;
  confirmWhatsAppNumberformGroup: FormGroup;
  modalTitle = 'WhatsApp Communication';
  phoneCode: string;
  isProcessing: boolean;
  shopInfo;
  isConfirmWhatsAppNumber: boolean;
  whatsComAction = WhatsAppEnableOrDisableActions;
  action: WhatsAppEnableOrDisableActions;

  constructor(
    private dialogRef: MatDialogRef<EnableDisableWhatsappCommunicationComponent>,
    private shopsService: ShopsService,
    private appUtils: AppUtilsService,
    private notificationsService: NotificationsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      whatsapp_number: new FormControl('', [Validators.required]),
      shop_id: new FormControl(''),
    });
    this.confirmWhatsAppNumberformGroup = new FormGroup({
      verification_code: new FormControl('', [Validators.required]),
      shop_id: new FormControl(''),
    });
    if (this.data !== null && this.data !== undefined) {
      this.shop_id.setValue(this.data.shop_id);
      this.confirmation_shop_id.setValue(this.data.shop_id);
      this.shopInfo = this.data.shop;
      this.action = this.data.action;
    }
  }
  /**
 * On Primary Phone Number code selected
 * @param countryInfo counry information
 */
  onPhoneCodeCliked(countryInfo) {
    if (countryInfo !== undefined && countryInfo !== null) {
      this.phoneCode = '+' + (countryInfo.callingCodes[0] as string);
    }
  }
  /**
   * On submit
   * @param agentForm Agent info formgroup
   */
  omSubmit(agentForm: FormGroup) {
    if (agentForm.valid) {
      if (this.shopInfo.send_communications_via_whatsapp === false) {
        this.enableWhatsApp(agentForm.value);
      } else {
        this.isProcessing = true;
        const data = agentForm.value;
        data.whatsapp_number = this.phoneCode + this.appUtils.removeFirstZero(this.whatsapp_number.value);
        this.addPhoneNumber(data);
      }
    }
  }
  /**
 * Verify WhatsApp number
 * @param verificationFormGroup verifiction form
 */
  verifyPhoneNumber(verificationFormGroup: FormGroup) {
    if (verificationFormGroup.valid) {
      this.isProcessing = true;
      this.shopsService.verifyWhatsAppPhoneNumber(verificationFormGroup.value, (error, result) => {
        this.isProcessing = false;
        if (result !== null && result.status === 'success') {
          this.notificationsService.snackBarMessage('WhatsApp Number successfully added.');
          this.dialogRef.close(result.results);
        }
      });
    }
  }
  /**
  * On submit
  * @param agentForm Agent info formgroup
  */
  addPhoneNumber(data) {
    this.isProcessing = true;
    this.shopsService.addWhatsAppPhoneNumber(data, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.status === 'success') {
        this.isConfirmWhatsAppNumber = true;
        this.modalTitle = 'VERIFY WHATSAPP NUMBER';
      }
    });
  }
  /**
   * On submit
   * @param agentForm Agent info formgroup
   */
  enableWhatsApp(data) {
    this.isProcessing = true;
    data.whatsapp_number = this.phoneCode + this.appUtils.removeFirstZero(this.whatsapp_number.value);
    this.shopsService.addWhatsAppPhoneNumber(data, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.status === 'success') {
        this.addPhoneNumber(data);
      }
    });
  }
  /**
  * Disable whatsapp communication for shop
  */
  disableWhatsApp() {
    this.isProcessing = true;
    this.shopsService.disableWhatsAppCommunication({ shop_id: this.shopInfo.id }, (error, result) => {
      this.isProcessing = false;
      if (result !== null && result.status === 'success') {
        this.notificationsService.snackBarMessage('WhatsApp Communication successfully disabled.');
        this.dialogRef.close(result.results);
      }
    });
  }
  cancel() {
    this.dialogRef.close(null);
  }

  get whatsapp_number() { return this.formGroup.get('whatsapp_number'); }
  get shop_id() { return this.formGroup.get('shop_id'); }

  get verification_code() { return this.confirmWhatsAppNumberformGroup.get('verification_code'); }
  get confirmation_shop_id() { return this.confirmWhatsAppNumberformGroup.get('shop_id'); }
}
