import { TestBed } from '@angular/core/testing';
import { Pas3Component } from './pas3.component';

describe('Pas3Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Pas3Component]
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Pas3Component);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
