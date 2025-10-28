import { TestBed } from '@angular/core/testing';
import { Adt1Component } from './adt1.component';

describe('Adt1Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Adt1Component]
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Adt1Component);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
