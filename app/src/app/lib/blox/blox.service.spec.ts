import { TestBed } from '@angular/core/testing';

import { BloxService } from './blox.service';

describe('BloxService', () => {
  let service: BloxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BloxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
