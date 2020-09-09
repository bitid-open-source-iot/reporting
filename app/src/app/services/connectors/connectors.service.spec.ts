import { TestBed } from '@angular/core/testing';

import { ConnectorsService } from './connectors.service';

describe('ConnectorsService', () => {
  let service: ConnectorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
