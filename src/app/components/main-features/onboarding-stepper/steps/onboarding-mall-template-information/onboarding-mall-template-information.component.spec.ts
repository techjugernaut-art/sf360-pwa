import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingMallTemplateInformationComponent } from './onboarding-mall-template-information.component';

describe('OnboardingMallTemplateInformationComponent', () => {
  let component: OnboardingMallTemplateInformationComponent;
  let fixture: ComponentFixture<OnboardingMallTemplateInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardingMallTemplateInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingMallTemplateInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
