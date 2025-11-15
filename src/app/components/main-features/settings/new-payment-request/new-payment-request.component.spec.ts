import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPaymentRequestComponent } from './new-payment-request.component';

describe('NewPaymentRequestComponent', () => {
  let component: NewPaymentRequestComponent;
  let fixture: ComponentFixture<NewPaymentRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPaymentRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPaymentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
