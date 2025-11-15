import { NotificationsService } from './../../../../services/notifications.service';
import { ConstantValuesService } from './../../../../services/constant-values.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { passwordMatch } from 'src/app/utils/validators.validator';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataProviderService } from '../../../../services/data-provider.service';
import { AppUtilsService } from 'src/app/services/app-utils.service';

@Component({
  selector: 'app-add-agent-dialog',
  templateUrl: './add-agent-dialog.component.html',
  styleUrls: ['./add-agent-dialog.component.scss']
})
export class AddAgentDialogComponent implements OnInit {
addAgentFormGroup: FormGroup;
modalTitle = 'Add New Agent';
  phoneCode: string;
  isProcessing: boolean;
  myShops = [];
  constructor(
    private dialogRef: MatDialogRef<AddAgentDialogComponent>,
    private constantValues: ConstantValuesService,
    private dataProvider: DataProviderService,
    private notificationService: NotificationsService,
    private appUtils: AppUtilsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.addAgentFormGroup = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
      // tslint:disable-next-line:max-line-length
      confirm_password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6), passwordMatch('password', 'confirm_password')]),
      email: new FormControl('', [Validators.email]),
      // last_name: new FormControl('', [Validators.required]),
      // first_name: new FormControl('', [Validators.required]),
      user_type: new FormControl('', [Validators.required]),
      phone_number: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      shop_id: new FormControl('', [Validators.required]),
    });
    this.getMyShops();
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
   * Create/Update Agent
   * @param agentForm Agent info formgroup
   */
  onAddAgent(agentForm: FormGroup) {
    if (agentForm.valid) {
      this.isProcessing = true;
      agentForm.value.phone_number = this.phoneCode + this.appUtils.removeFirstZero(this.phone_number.value);
      this.dataProvider.create(this.constantValues.ADD_SHOP_AGENT_ENDPOINT, agentForm.value).subscribe(result => {
        if (result) {
          this.notificationService.snackBarErrorMessage('Agent successfully created');
          this.dialogRef.close(true);
        }
      }, error => {
        this.isProcessing =  false;
        this.notificationService.snackBarErrorMessage(error.detail);
      });
    }
  }
  cancel() {
    this.dialogRef.close(false);
  }
  /**
   * Get shops of current loged in user
   */
  getMyShops() {
    this.dataProvider.getAll(this.constantValues.GET_SHOPS_ENDPOINT, { shop_id: '' }).subscribe(result => {
      if (result.status === 'success') {
        this.myShops = result.results;
      }
    }, () => {
    });
  }
  onEditable(agent) {

  }
  get password() { return this.addAgentFormGroup.get('password'); }
  get confirm_password() { return this.addAgentFormGroup.get('confirm_password'); }
  get phone_number() { return this.addAgentFormGroup.get('phone_number'); }
  get user_type() { return this.addAgentFormGroup.get('user_type'); }
  get gender() { return this.addAgentFormGroup.get('gender'); }
  get shop_id() { return this.addAgentFormGroup.get('shop_id'); }
  get email() { return this.addAgentFormGroup.get('email'); }
}
