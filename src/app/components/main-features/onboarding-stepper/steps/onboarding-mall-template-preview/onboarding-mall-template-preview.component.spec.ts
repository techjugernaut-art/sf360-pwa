import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingMallTemplatePreviewComponent } from './onboarding-mall-template-preview.component';

describe('OnboardingMallTemplatePreviewComponent', () => {
  let component: OnboardingMallTemplatePreviewComponent;
  let fixture: ComponentFixture<OnboardingMallTemplatePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardingMallTemplatePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingMallTemplatePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
