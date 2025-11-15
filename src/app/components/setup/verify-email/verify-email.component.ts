import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ShopsService } from 'src/app/services/network-calls/shops.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  templateUrl: './verify-email.component.html',
})
export class VerifyEmailComponent implements OnInit {
  isProcessing = false;
  loginFormGroup: FormGroup;
  partnerLoginFormGroup: FormGroup;
  wild_string = '';

  constructor(
    private notificationService: NotificationsService,
    private router: Router,
    private route: ActivatedRoute,
    private shopsService: ShopsService,
  ) { }

  ngOnInit() {
   this.route.queryParams.subscribe(param => {
    this.wild_string = param['wild_string'];
    this.onSubmit();
   });
  }
  onSubmit(){
    this.shopsService.verifyEmail({unique_code: this.wild_string}, (error, result) => {
      if(result.response_code === '100'){
        this.notificationService.snackBarMessage(result.message)
        this.router.navigate(['/login']);
      }
    })
  }

  get email() { return this.partnerLoginFormGroup.get('email'); }

}
