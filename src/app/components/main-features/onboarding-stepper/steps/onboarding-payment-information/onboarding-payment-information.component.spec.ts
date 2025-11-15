import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingPaymentInformationComponent } from './onboarding-payment-information.component';

describe('OnboardingPaymentInformationComponent', () => {
  let component: OnboardingPaymentInformationComponent;
  let fixture: ComponentFixture<OnboardingPaymentInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardingPaymentInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingPaymentInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
