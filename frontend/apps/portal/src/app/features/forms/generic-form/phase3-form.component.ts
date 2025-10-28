import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ApiClientService } from '@frontend/data-access';
import { CcCardComponent } from '@frontend/ui';
import {
  FieldConfig,
  FieldControlType,
  GenericFormConfig,
  getPhase3Config
} from './phase3-form.config';

type ControlType = Exclude<FieldControlType, 'textarea'>;

@Component({
  selector: 'app-phase3-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, JsonPipe, CcCardComponent],
  templateUrl: './phase3-form.component.html',
  styleUrls: ['./phase3-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Phase3FormComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly apiClient = inject(ApiClientService);

  readonly config: GenericFormConfig = this.resolveConfig();
  readonly fields = this.config.fields;
  readonly form: FormGroup = this.buildForm();

  submitting = false;
  lastResponse?: unknown;
  errorMessage?: string;

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    this.errorMessage = undefined;
    try {
      const payload = this.buildPayload();
      const response = await firstValueFrom(this.apiClient.submitPhase3Form(this.config.apiPath, payload));
      this.lastResponse = response;
    } catch (error) {
      this.errorMessage = 'Submission failed. Please retry or contact support.';
    } finally {
      this.submitting = false;
    }
  }

  trackField(_: number, field: FieldConfig): string {
    return field.name;
  }

  controlType(field: FieldConfig): ControlType {
    return (field.controlType === 'textarea' ? 'text' : field.controlType) as ControlType;
  }

  private resolveConfig(): GenericFormConfig {
    const key = this.route.snapshot.data?.['formKey'] as string | undefined;
    return getPhase3Config(key);
  }

  private buildForm(): FormGroup {
    const group: Record<string, unknown> = {};
    for (const field of this.fields) {
      group[field.name] = field.required
        ? [null, Validators.required]
        : [null];
    }
    return this.fb.group(group);
  }

  private buildPayload(): Record<string, unknown> {
    const metadata: Record<string, unknown> = {};
    const submissionData: Record<string, unknown> = {};

    for (const field of this.fields) {
      const value = this.form.get(field.name)?.value;
      if (field.target === 'submission') {
        submissionData[field.name] = value;
      } else {
        metadata[field.name] = value;
      }
    }

    return {
      ...metadata,
      submission_data: submissionData
    };
  }
}
