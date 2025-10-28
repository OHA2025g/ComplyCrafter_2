import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ApiClientService } from '@frontend/data-access';
import { CcCardComponent } from '@frontend/ui';
import { Dpt3FormModel } from './dpt3.model';

interface FieldConfig {
  name: keyof Dpt3FormModel;
  label: string;
  controlType: 'text' | 'number' | 'date' | 'email' | 'select';
  required: boolean;
}

interface RawField {
  name: keyof Dpt3FormModel;
  label: string;
  type: FieldConfig['controlType'];
  required: boolean;
}

@Component({
  selector: 'app-dpt3-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CcCardComponent],
  templateUrl: './dpt3.component.html',
  styleUrls: ['./dpt3.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dpt3Component {
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
    "name": "type",
    "label": "Type",
    "type": "text",
    "required": false
  },
  {
    "name": "formPurpose",
    "label": "FormPurpose",
    "type": "text",
    "required": false
  },
  {
    "name": "isGov",
    "label": "IsGov",
    "type": "text",
    "required": false
  },
  {
    "name": "companyObjects",
    "label": "CompanyObjects",
    "type": "text",
    "required": false
  },
  {
    "name": "depositAccepted",
    "label": "DepositAccepted",
    "type": "text",
    "required": false
  },
  {
    "name": "returnPeriod",
    "label": "ReturnPeriod",
    "type": "date",
    "required": false
  },
  {
    "name": "dateOfIssue",
    "label": "DateOfIssue",
    "type": "date",
    "required": false
  },
  {
    "name": "dateOfExpiry",
    "label": "DateOfExpiry",
    "type": "date",
    "required": false
  },
  {
    "name": "paidUpShareCapital",
    "label": "PaidUpShareCapital",
    "type": "number",
    "required": false
  },
  {
    "name": "freeReserves",
    "label": "FreeReserves",
    "type": "number",
    "required": false
  },
  {
    "name": "securitiesPremiumAccount",
    "label": "SecuritiesPremiumAccount",
    "type": "number",
    "required": false
  },
  {
    "name": "accumulatedLoss",
    "label": "AccumulatedLoss",
    "type": "number",
    "required": false
  },
  {
    "name": "deferredRevenueExpenditureBalance",
    "label": "DeferredRevenueExpenditureBalance",
    "type": "number",
    "required": false
  },
  {
    "name": "accumulatedUnprovidedDepreciation",
    "label": "AccumulatedUnprovidedDepreciation",
    "type": "number",
    "required": false
  },
  {
    "name": "miscellaneousExpense",
    "label": "MiscellaneousExpense",
    "type": "number",
    "required": false
  },
  {
    "name": "otherIntangibleAssets",
    "label": "OtherIntangibleAssets",
    "type": "number",
    "required": false
  },
  {
    "name": "netWorth",
    "label": "NetWorth",
    "type": "number",
    "required": false
  },
  {
    "name": "depositMaxLimit",
    "label": "DepositMaxLimit",
    "type": "number",
    "required": false
  },
  {
    "name": "totalDepositHoldersStart",
    "label": "TotalDepositHoldersStart",
    "type": "number",
    "required": false
  },
  {
    "name": "totalDepositHoldersEnd",
    "label": "TotalDepositHoldersEnd",
    "type": "number",
    "required": false
  },
  {
    "name": "existingDepositsStart",
    "label": "ExistingDepositsStart",
    "type": "number",
    "required": false
  },
  {
    "name": "depositsRenewed",
    "label": "DepositsRenewed",
    "type": "number",
    "required": false
  },
  {
    "name": "securedDeposits",
    "label": "SecuredDeposits",
    "type": "number",
    "required": false
  },
  {
    "name": "unsecuredDeposits",
    "label": "UnsecuredDeposits",
    "type": "number",
    "required": false
  },
  {
    "name": "depositsRepaid",
    "label": "DepositsRepaid",
    "type": "number",
    "required": false
  },
  {
    "name": "depositsOutstanding",
    "label": "DepositsOutstanding",
    "type": "number",
    "required": false
  },
  {
    "name": "maturedNotClaimed",
    "label": "MaturedNotClaimed",
    "type": "number",
    "required": false
  },
  {
    "name": "maturedClaimedNotPaid",
    "label": "MaturedClaimedNotPaid",
    "type": "number",
    "required": false
  },
  {
    "name": "depositsMaturingBeforeMarch",
    "label": "DepositsMaturingBeforeMarch",
    "type": "number",
    "required": false
  },
  {
    "name": "depositsMaturingFollowingNextYear",
    "label": "DepositsMaturingFollowingNextYear",
    "type": "number",
    "required": false
  },
  {
    "name": "amountRequiredInLiquidAssets",
    "label": "AmountRequiredInLiquidAssets",
    "type": "number",
    "required": false
  },
  {
    "name": "currentDepositsFreeFromCharge",
    "label": "CurrentDepositsFreeFromCharge",
    "type": "number",
    "required": false
  },
  {
    "name": "faceValueGovSecurities",
    "label": "FaceValueGovSecurities",
    "type": "number",
    "required": false
  },
  {
    "name": "marketValueGovSecurities",
    "label": "MarketValueGovSecurities",
    "type": "number",
    "required": false
  },
  {
    "name": "faceValueTrustSecurities",
    "label": "FaceValueTrustSecurities",
    "type": "number",
    "required": false
  },
  {
    "name": "marketValueTrustSecurities",
    "label": "MarketValueTrustSecurities",
    "type": "number",
    "required": false
  },
  {
    "name": "creditRatingAgency",
    "label": "CreditRatingAgency",
    "type": "text",
    "required": false
  },
  {
    "name": "creditRating",
    "label": "CreditRating",
    "type": "text",
    "required": false
  },
  {
    "name": "creditRatingDate",
    "label": "CreditRatingDate",
    "type": "date",
    "required": false
  },
  {
    "name": "gnlFormSrn",
    "label": "GnlFormSrn",
    "type": "text",
    "required": false
  },
  {
    "name": "auditorName",
    "label": "AuditorName",
    "type": "text",
    "required": false
  },
  {
    "name": "auditorDesignation",
    "label": "AuditorDesignation",
    "type": "text",
    "required": false
  },
  {
    "name": "membershipNumber",
    "label": "MembershipNumber",
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
    "name": "declarationDate",
    "label": "DeclarationDate",
    "type": "date",
    "required": false
  },
  {
    "name": "signatoryDesignation",
    "label": "SignatoryDesignation",
    "type": "text",
    "required": false
  },
  {
    "name": "signatoryId",
    "label": "SignatoryId",
    "type": "text",
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
  lastResponse?: Dpt3FormModel;

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
      const payload = this.form.value as Dpt3FormModel;
      const response = await firstValueFrom(this.api.saveDpt3(payload));
      this.lastResponse = (response as Dpt3FormModel) ?? payload;
    } finally {
      this.submitting = false;
    }
  }

  private formatLabel(label: string): string {
    return label.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ').toUpperCase().trim();
  }
}
