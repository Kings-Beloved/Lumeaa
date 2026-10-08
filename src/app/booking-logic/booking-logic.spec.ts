import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingLogic } from './booking-logic';

describe('BookingLogic', () => {
  let component: BookingLogic;
  let fixture: ComponentFixture<BookingLogic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingLogic],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingLogic);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
