import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingIndustryInformationComponent } from './onboarding-industry-information.component';

describe('OnboardingIndustryInformationComponent', () => {
  let component: OnboardingIndustryInformationComponent;
  let fixture: ComponentFixture<OnboardingIndustryInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardingIndustryInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingIndustryInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
