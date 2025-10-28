import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Phase3FormComponent } from './phase3-form.component';
import { ApiClientService } from '@frontend/data-access';

class ApiClientServiceStub {
  submitPhase3Form() {
    return of({});
  }
}

describe('Phase3FormComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Phase3FormComponent],
      providers: [
        { provide: ApiClientService, useClass: ApiClientServiceStub },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: { formKey: 'aoc4' }
            }
          }
        }
      ]
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Phase3FormComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
