export type FieldControlType = 'text' | 'email' | 'number' | 'date' | 'textarea' | 'select';

export type FieldTarget = 'metadata' | 'submission';

export interface FieldConfig {
  name: string;
  label: string;
  controlType: FieldControlType;
  required?: boolean;
  target?: FieldTarget;
  options?: string[];
}

export interface GenericFormConfig {
  code: string;
  heading: string;
  description: string;
  apiPath: string;
  submitLabel?: string;
  successMessage?: string;
  fields: FieldConfig[];
}

const baseFields = (overrides: FieldConfig[] = []): FieldConfig[] => {
  const base: FieldConfig[] = [
    {
      name: 'cin',
      label: 'CIN',
      controlType: 'text',
      required: true
    },
    {
      name: 'company_name',
      label: 'Company Name',
      controlType: 'text',
      required: true
    },
    {
      name: 'contact_email',
      label: 'Contact Email',
      controlType: 'email',
      required: true
    },
    {
      name: 'filing_period',
      label: 'Filing Period',
      controlType: 'text',
      required: true
    }
  ];
  return [...base, ...overrides];
};

const submissionField = (name: string, label: string, controlType: FieldControlType = 'textarea'): FieldConfig => ({
  name,
  label,
  controlType,
  target: 'submission',
  required: true
});

export const PHASE3_FORM_CONFIG: Record<string, GenericFormConfig> = {
  aoc4: {
    code: 'aoc4',
    heading: 'AOC4 Filing',
    description: 'Submit annual financial statements and attachments for MCA AOC-4 filings.',
    apiPath: '/forms/aoc4',
    fields: baseFields([
      submissionField('financial_summary', 'Financial Summary'),
      submissionField('attachments', 'Attachment Notes')
    ])
  },
  aoc4cfs: {
    code: 'aoc4cfs',
    heading: 'AOC4 CFS Filing',
    description: 'Consolidated financial statements for entities that require AOC-4 CFS submissions.',
    apiPath: '/forms/aoc4cfs',
    fields: baseFields([
      submissionField('consolidated_summary', 'Consolidated Summary'),
      submissionField('auditor_comments', 'Auditor Comments')
    ])
  },
  mgt7a: {
    code: 'mgt7a',
    heading: 'MGT7A Filing',
    description: 'Annual return for OPCs and small companies.',
    apiPath: '/forms/mgt7a',
    fields: baseFields([
      {
        name: 'filing_period',
        label: 'Financial Year',
        controlType: 'text',
        required: true
      },
      submissionField('shareholding_pattern', 'Shareholding Pattern'),
      submissionField('certification_notes', 'Certification Notes')
    ])
  },
  msme: {
    code: 'msme',
    heading: 'MSME Form I',
    description: 'Outstanding payments disclosures for Micro and Small Enterprises.',
    apiPath: '/forms/msme',
    fields: baseFields([
      {
        name: 'filing_period',
        label: 'Half-Year Period',
        controlType: 'select',
        required: true,
        options: ['April to September', 'October to March']
      },
      submissionField('outstanding_details', 'Outstanding Details'),
      submissionField('declaration', 'Declaration')
    ])
  },
  msme1: {
    code: 'msme1',
    heading: 'MSME-1 Additional Return',
    description: 'Follow-up MSME disclosure for payments beyond 45 days.',
    apiPath: '/forms/msme1',
    fields: baseFields([
      submissionField('invoice_summary', 'Invoice Summary'),
      submissionField('delay_reason', 'Reason for Delay')
    ])
  },
  ndh1: {
    code: 'ndh1',
    heading: 'NDH-1 Return',
    description: 'Return of statutory compliances for Nidhi companies.',
    apiPath: '/forms/ndh1',
    fields: baseFields([
      submissionField('member_data', 'Member Data'),
      submissionField('ratio_computation', 'Ratio Computation')
    ])
  },
  ndh2: {
    code: 'ndh2',
    heading: 'NDH-2 Application',
    description: 'Extension application for Nidhi companies to comply with NDH provisions.',
    apiPath: '/forms/ndh2',
    fields: baseFields([
      submissionField('extension_reason', 'Extension Reason'),
      submissionField('supporting_details', 'Supporting Details')
    ])
  }
};

export const getPhase3Config = (key: string | undefined): GenericFormConfig => {
  if (!key || !PHASE3_FORM_CONFIG[key]) {
    throw new Error(`Unknown Phase 3 form config: ${key ?? 'undefined'}`);
  }
  return PHASE3_FORM_CONFIG[key];
};
