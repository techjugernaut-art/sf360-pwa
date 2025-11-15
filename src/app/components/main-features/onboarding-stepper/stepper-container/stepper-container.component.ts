import { Component, OnInit } from '@angular/core';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import { fader } from 'src/app/utils/animations.animator';
import { Title } from '@angular/platform-browser';
import { ConstantValuesService } from 'src/app/services/constant-values.service';

@Component({
  selector: 'app-stepper-container',
  templateUrl: './stepper-container.component.html',
  styleUrls: ['./stepper-container.component.scss'],
  animations: [fader]
})
export class StepperContainerComponent implements OnInit {

  steps = [
    {state: '', detail_state: '', step: '1', heading: 'Personal Information', desc: 'Your personal information'},
    {state: '', detail_state: '', step: '2', heading: 'Industry', desc: 'Industry of your business'},
    {state: '', detail_state: '', step: '3', heading: 'Business Information', desc: 'This is your business registration information'},
    // {state: '', detail_state: '', step: '4', heading: 'Products', desc: 'Setup your products to sell'},
    // tslint:disable-next-line: max-line-length
    // {state: '', detail_state: '', step: '4', heading: 'Customize Storefront Mall', desc: 'Customize Storefront Mall for your business need'},
    // {state: '', detail_state: '', step: '6', heading: 'Preview Storefront Mall', desc: 'This is how your StoreFront Mall looks like'},
    // {state: '', detail_state: '', step: '4', heading: 'Subscription Payment', desc: 'Subscription Payment get your listed on StoreFront Mall'}
  ];

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    private constantValues: ConstantValuesService
  ) { }

  ngOnInit() {
    this.title.setTitle(this.constantValues.APP_NAME + ' | Onboarding');
    this.route.queryParams.subscribe(param => {
      this.setActiveStep(+param['step']);
    });
  }
  prepareOutlet(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
  setActiveStep(currentStep) {
    const active = currentStep - 1;
    for (let index = 0; index < this.steps.length; index++) {
      this.steps[index].detail_state = '';
      if (index < active) {
        this.steps[index].state = 'step-indicator-visited';
      } else if (index === active) {
        this.steps[index].state = 'step-indicator-active';
        this.steps[index].detail_state = 'step-detail-active';
      } else {
        this.steps[index].state = '';
      }
    }
  }
}
