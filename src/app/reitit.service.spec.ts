import { TestBed } from '@angular/core/testing';

import { ReititService } from './reitit.service';

describe('ReititService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReititService = TestBed.get(ReititService);
    expect(service).toBeTruthy();
  });
});
