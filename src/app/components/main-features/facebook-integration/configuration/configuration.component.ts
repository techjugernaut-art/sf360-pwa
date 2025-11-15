import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FacebookLoginDialogComponent } from '../facebook-login-dialog/facebook-login-dialog.component';
import { SocialAuthService, FacebookLoginProvider, SocialUser } from 'angularx-social-login';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html'
})
export class ConfigurationComponent implements OnInit {
  isProcessing = false;
  loginForm: FormGroup;
  socialUser: SocialUser;
  isLoggedin: boolean = null;
  
  constructor(
    private formBuilder: FormBuilder, 
    private dialog: MatDialog,
    private socialAuthService: SocialAuthService
  ) { 
    console.log(this.isLoggedin)
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });    
    
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.isLoggedin = (user != null);
    });
  }

  loginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.socialAuthService.signOut();
  }

  facebookLogin(user = null) {
    this.dialog.open(FacebookLoginDialogComponent, {data: {user: user}})
    .afterClosed().subscribe((isSuccess: boolean) => {
      //TODO close dialog only if success or close button is clicked
      if (isSuccess) {
        this.dialog.closeAll()
      }
    });
  }

}
