import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineStoreNewPaymentRequestComponent } from './online-store-new-payment-request.component';

describe('OnlineStoreNewPaymentRequestComponent', () => {
  let component: OnlineStoreNewPaymentRequestComponent;
  let fixture: ComponentFixture<OnlineStoreNewPaymentRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineStoreNewPaymentRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineStoreNewPaymentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
