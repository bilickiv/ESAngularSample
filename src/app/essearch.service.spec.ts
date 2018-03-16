import { TestBed, inject } from '@angular/core/testing';

import { EssearchService } from './essearch.service';

describe('EssearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EssearchService]
    });
  });

  it('should be created', inject([EssearchService], (service: EssearchService) => {
    expect(service).toBeTruthy();
  }));
});
