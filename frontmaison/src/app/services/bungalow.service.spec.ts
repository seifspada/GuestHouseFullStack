import { TestBed } from '@angular/core/testing';

import { BungalowService } from './bungalow.service';

describe('BungalowService', () => {
  let service: BungalowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BungalowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
