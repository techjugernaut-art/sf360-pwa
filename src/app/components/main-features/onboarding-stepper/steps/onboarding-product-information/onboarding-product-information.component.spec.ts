import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingProductInformationComponent } from './onboarding-product-information.component';

describe('OnboardingProductInformationComponent', () => {
  let component: OnboardingProductInformationComponent;
  let fixture: ComponentFixture<OnboardingProductInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardingProductInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingProductInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
