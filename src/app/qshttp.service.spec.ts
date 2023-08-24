import { TestBed } from '@angular/core/testing';

import { QshttpService } from './qshttp.service';

describe('QshttpService', () => {
  let service: QshttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QshttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
