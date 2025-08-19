import { TestBed } from '@angular/core/testing';

import { ServiceUsageService } from './service-usage.service';

describe('ServiceUsageService', () => {
  let service: ServiceUsageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceUsageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
