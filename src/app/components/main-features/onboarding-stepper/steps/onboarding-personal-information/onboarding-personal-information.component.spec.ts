import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingPersonalInformationComponent } from './onboarding-personal-information.component';

describe('OnboardingPersonalInformationComponent', () => {
  let component: OnboardingPersonalInformationComponent;
  let fixture: ComponentFixture<OnboardingPersonalInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardingPersonalInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingPersonalInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
