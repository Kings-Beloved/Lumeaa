import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompletePayment } from './complete-payment';

describe('CompletePayment', () => {
  let component: CompletePayment;
  let fixture: ComponentFixture<CompletePayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletePayment],
    }).compileComponents();

    fixture = TestBed.createComponent(CompletePayment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
