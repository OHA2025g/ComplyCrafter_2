import { TestBed } from '@angular/core/testing';
import { Dpt3Component } from './dpt3.component';

describe('Dpt3Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Dpt3Component]
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Dpt3Component);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
