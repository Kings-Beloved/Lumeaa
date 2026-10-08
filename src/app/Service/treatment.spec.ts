import { TestBed } from '@angular/core/testing';
import { Treatment } from './treatment';

describe('Treatment', () => {
  let service: Treatment;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Treatment);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
