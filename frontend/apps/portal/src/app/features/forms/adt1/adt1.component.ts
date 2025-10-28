import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiClientService } from '@frontend/data-access';
import { CcCardComponent } from '@frontend/ui';
import { Adt1FormModel } from './adt1.model';

@Component({
  selector: 'app-adt1-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CcCardComponent],
  templateUrl: './adt1.component.html',
  styleUrls: ['./adt1.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Adt1Component {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiClientService);

  form: FormGroup = this.fb.group({
    refUser: [null],
    companyId: [null, Validators.required],
    cin: [null, Validators.required],
    companyName: [null, Validators.required],
    companyAddress: [null],
    companyEmail: [null, Validators.email],
    fallingSection: [null],
    appointmentNature: [null],
    isAuditorAppointed: [null],
    auditorNumber: [null],
    annualGeneralMeeting: [null],
    agmDate: [null],
    appointmentDate: [null],
    isCasualVacancy: [null],
    srnOfRelevantForm: [null],
    personVacated: [null],
    vacancyDate: [null],
    casualVacancyReasons: [null],
    membershipNumber: [null],
    auditorSerial: [null],
    auditorMemberNo: [null],
    resolutionNumber: [null],
    resolutionDate: [null],
    signedBy: [null],
    designation: [null],
    din: [null],
    refUserName: [null]
  });

  submitting = false;
  lastResponse?: Adt1FormModel;

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    try {
      const payload: Adt1FormModel = this.form.value as Adt1FormModel;
      const response = await this.api.saveAdt1(payload).toPromise();
      this.lastResponse = (response as Adt1FormModel) ?? payload;
    } finally {
      this.submitting = false;
    }
  }
}
