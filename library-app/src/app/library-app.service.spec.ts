import { TestBed } from '@angular/core/testing';

import { LibraryAppService } from './library-app.service';

describe('LibraryAppService', () => {
  let service: LibraryAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibraryAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
