import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ApiClientService } from '@frontend/data-access';
import { CcCardComponent } from '@frontend/ui';
import { Ben2FormModel } from './ben2.model';

interface FieldConfig {
  name: keyof Ben2FormModel;
  label: string;
  controlType: 'text' | 'number' | 'date' | 'email' | 'select';
  required: boolean;
}

interface RawField {
  name: keyof Ben2FormModel;
  label: string;
  type: FieldConfig['controlType'];
  required: boolean;
}

@Component({
  selector: 'app-ben2-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CcCardComponent],
  templateUrl: './ben2.component.html',
  styleUrls: ['./ben2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Ben2Component {
  private readonly rawFields: RawField[] = [
  {
    "name": "refUser",
    "label": "RefUser",
    "type": "number",
    "required": false
  },
  {
    "name": "companyId",
    "label": "CompanyId",
    "type": "number",
    "required": false
  },
  {
    "name": "cin",
    "label": "Cin",
    "type": "text",
    "required": false
  },
  {
    "name": "companyName",
    "label": "CompanyName",
    "type": "text",
    "required": false
  },
  {
    "name": "companyAddress",
    "label": "CompanyAddress",
    "type": "text",
    "required": false
  },
  {
    "name": "companyEmail",
    "label": "CompanyEmail",
    "type": "email",
    "required": false
  },
  {
    "name": "reportingCompany",
    "label": "ReportingCompany",
    "type": "select",
    "required": false
  },
  {
    "name": "declarationOwnership",
    "label": "DeclarationOwnership",
    "type": "select",
    "required": false
  },
  {
    "name": "changeOwnership",
    "label": "ChangeOwnership",
    "type": "select",
    "required": false
  },
  {
    "name": "changeExiting",
    "label": "ChangeExiting",
    "type": "select",
    "required": false
  },
  {
    "name": "changeReportingCompany",
    "label": "ChangeReportingCompany",
    "type": "select",
    "required": false
  },
  {
    "name": "cinHoldingCompany",
    "label": "CinHoldingCompany",
    "type": "number",
    "required": false
  },
  {
    "name": "nameHoldingCompany",
    "label": "NameHoldingCompany",
    "type": "text",
    "required": false
  },
  {
    "name": "numberOfSignificantOwners",
    "label": "NumberOfSignificantOwners",
    "type": "number",
    "required": false
  },
  {
    "name": "copyAttachment",
    "label": "CopyAttachment",
    "type": "text",
    "required": false
  },
  {
    "name": "optionalAttachment",
    "label": "OptionalAttachment",
    "type": "text",
    "required": false
  },
  {
    "name": "resolutionNumber",
    "label": "ResolutionNumber",
    "type": "number",
    "required": false
  },
  {
    "name": "resolutionDate",
    "label": "ResolutionDate",
    "type": "date",
    "required": false
  },
  {
    "name": "designation",
    "label": "Designation",
    "type": "text",
    "required": false
  },
  {
    "name": "signitory",
    "label": "Signitory",
    "type": "text",
    "required": false
  },
  {
    "name": "dinPan",
    "label": "DinPan",
    "type": "text",
    "required": false
  },
  {
    "name": "category",
    "label": "Category",
    "type": "text",
    "required": false
  },
  {
    "name": "nameOfPcs",
    "label": "NameOfPcs",
    "type": "text",
    "required": false
  },
  {
    "name": "associateOrFellow",
    "label": "AssociateOrFellow",
    "type": "text",
    "required": false
  },
  {
    "name": "membershipNumber",
    "label": "MembershipNumber",
    "type": "number",
    "required": false
  },
  {
    "name": "refUserName",
    "label": "RefUserName",
    "type": "text",
    "required": false
  }
];
  readonly fields: FieldConfig[] = this.rawFields.map((field) => ({
    name: field.name,
    label: this.formatLabel(field.label),
    controlType: field.type,
    required: field.required
  }));

  readonly form = this.buildForm();
  submitting = false;
  lastResponse?: Ben2FormModel;

  constructor(private readonly fb: FormBuilder, private readonly api: ApiClientService) {}

  private buildForm() {
    const group: Record<string, unknown[]> = {};
    this.fields.forEach((field) => {
      group[field.name as string] = field.required ? [null, Validators.required] : [null];
    });
    return this.fb.group(group);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    try {
      const payload = this.form.value as unknown as Ben2FormModel;
      const response = await firstValueFrom(this.api.saveBen2(payload));
      this.lastResponse = (response as Ben2FormModel) ?? payload;
    } finally {
      this.submitting = false;
    }
  }

  private formatLabel(label: string): string {
    return label.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ').toUpperCase().trim();
  }
}
