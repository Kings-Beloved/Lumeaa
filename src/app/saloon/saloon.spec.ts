import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Saloon } from './saloon';

describe('Saloon', () => {
  let component: Saloon;
  let fixture: ComponentFixture<Saloon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Saloon],
    }).compileComponents();

    fixture = TestBed.createComponent(Saloon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
