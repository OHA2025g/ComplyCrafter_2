import { TestBed } from '@angular/core/testing';
import { Ben2Component } from './ben2.component';

describe('Ben2Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Ben2Component]
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Ben2Component);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
