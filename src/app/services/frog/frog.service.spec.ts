import { TestBed } from '@angular/core/testing';

import { FrogService } from './frog.service';

describe('FrogService', () => {
  let service: FrogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
