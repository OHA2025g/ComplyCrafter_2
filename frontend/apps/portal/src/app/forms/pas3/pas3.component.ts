import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ApiClientService } from '@frontend/data-access';
import { CcCardComponent } from '@frontend/ui';
import { Pas3FormModel } from './pas3.model';

interface FieldConfig {
  name: keyof Pas3FormModel;
  label: string;
  controlType: 'text' | 'number' | 'date' | 'email' | 'select';
  required: boolean;
}

interface RawField {
  name: keyof Pas3FormModel;
  label: string;
  type: FieldConfig['controlType'];
  required: boolean;
}

@Component({
  selector: 'app-pas3-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CcCardComponent],
  templateUrl: './pas3.component.html',
  styleUrls: ['./pas3.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Pas3Component {
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
    "name": "numberOfAllotments",
    "label": "NumberOfAllotments",
    "type": "number",
    "required": false
  },
  {
    "name": "noOfClassesPreference",
    "label": "NoOfClassesPreference",
    "type": "number",
    "required": false
  },
  {
    "name": "noOfClassesEquity",
    "label": "NoOfClassesEquity",
    "type": "number",
    "required": false
  },
  {
    "name": "noOfUnclassified",
    "label": "NoOfUnclassified",
    "type": "number",
    "required": false
  },
  {
    "name": "totalUnclassified",
    "label": "TotalUnclassified",
    "type": "number",
    "required": false
  },
  {
    "name": "debentures",
    "label": "Debentures",
    "type": "number",
    "required": false
  },
  {
    "name": "loanSecured",
    "label": "LoanSecured",
    "type": "number",
    "required": false
  },
  {
    "name": "others",
    "label": "others",
    "type": "number",
    "required": false
  },
  {
    "name": "equityAuthorizedCapital",
    "label": "EquityAuthorizedCapital",
    "type": "text",
    "required": false
  },
  {
    "name": "equityPaidupCapital",
    "label": "EquityPaidupCapital",
    "type": "text",
    "required": false
  },
  {
    "name": "allotteesList",
    "label": "AllotteesList",
    "type": "text",
    "required": false
  },
  {
    "name": "anotherAttachment",
    "label": "AnotherAttachment",
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
    "type": "text",
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
    "name": "signatory",
    "label": "Signatory",
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
    "name": "assososiateOrFellow",
    "label": "AssososiateOrFellow",
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
    "name": "equityShareList",
    "label": "EquityShareList",
    "type": "text",
    "required": false
  },
  {
    "name": "preferenceShareList",
    "label": "PreferenceShareList",
    "type": "text",
    "required": false
  },
  {
    "name": "refUserName",
    "label": "RefUserName",
    "type": "text",
    "required": false
  },
  {
    "name": "id",
    "label": "Id",
    "type": "number",
    "required": true
  },
  {
    "name": "parentId",
    "label": "ParentId",
    "type": "number",
    "required": false
  },
  {
    "name": "type",
    "label": "Type",
    "type": "text",
    "required": false
  },
  {
    "name": "classOfShares",
    "label": "ClassOfShares",
    "type": "text",
    "required": false
  },
  {
    "name": "authorizedCapital",
    "label": "AuthorizedCapital",
    "type": "number",
    "required": false
  },
  {
    "name": "issuedCapital",
    "label": "IssuedCapital",
    "type": "number",
    "required": false
  },
  {
    "name": "subscribedCapital",
    "label": "SubscribedCapital",
    "type": "number",
    "required": false
  },
  {
    "name": "paidUpCapital",
    "label": "PaidUpCapital",
    "type": "number",
    "required": false
  },
  {
    "name": "nominalAmountPerShare",
    "label": "NominalAmountPerShare",
    "type": "number",
    "required": false
  },
  {
    "name": "nominalAmountPerShareIssue",
    "label": "NominalAmountPerShareIssue",
    "type": "number",
    "required": false
  },
  {
    "name": "nominalAmountPerShareSub",
    "label": "NominalAmountPerShareSub",
    "type": "number",
    "required": false
  },
  {
    "name": "nominalAmountPerSharePaid",
    "label": "NominalAmountPerSharePaid",
    "type": "number",
    "required": false
  },
  {
    "name": "totalAmountShares",
    "label": "TotalAmountShares",
    "type": "number",
    "required": false
  },
  {
    "name": "totalAmountSharesIssue",
    "label": "TotalAmountSharesIssue",
    "type": "number",
    "required": false
  },
  {
    "name": "totalAmountSharesSub",
    "label": "TotalAmountSharesSub",
    "type": "number",
    "required": false
  },
  {
    "name": "totalAmountSharesPaid",
    "label": "TotalAmountSharesPaid",
    "type": "number",
    "required": false
  },
  {
    "name": "deletedOn",
    "label": "DeletedOn",
    "type": "date",
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
  lastResponse?: Pas3FormModel;

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
      const payload = this.form.value as unknown as Pas3FormModel;
      const response = await firstValueFrom(this.api.savePas3(payload));
      this.lastResponse = (response as Pas3FormModel) ?? payload;
    } finally {
      this.submitting = false;
    }
  }

  private formatLabel(label: string): string {
    return label.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ').toUpperCase().trim();
  }
}
