/**
 * Complete Form Configurations for All 51 Phase 3+ Forms
 * This file contains field definitions and metadata for all MCA forms
 */

export type FieldControlType = 'text' | 'email' | 'number' | 'date' | 'textarea' | 'select' | 'checkbox' | 'tel';

export interface FieldConfig {
  name: string;
  label: string;
  controlType: FieldControlType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  rows?: number; // for textarea
  min?: number; // for number/date
  max?: number; // for number/date
  pattern?: string; // for validation
  hint?: string; // help text
}

export interface FormConfig {
  code: string;
  title: string;
  description: string;
  apiEndpoint: string;
  fields: FieldConfig[];
  submitLabel?: string;
  successMessage?: string;
  category?: string;
  phase?: number;
}

// Base company fields used across all forms
const baseCompanyFields: FieldConfig[] = [
  {
    name: 'cin',
    label: 'Corporate Identity Number (CIN)',
    controlType: 'text',
    required: true,
    pattern: '[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}',
    placeholder: 'e.g., U12345AB2020PTC123456',
    hint: 'Enter 21-character CIN'
  },
  {
    name: 'company_name',
    label: 'Company Name',
    controlType: 'text',
    required: true,
    placeholder: 'Enter company name'
  },
  {
    name: 'company_address',
    label: 'Registered Office Address',
    controlType: 'textarea',
    required: true,
    rows: 3
  },
  {
    name: 'company_email',
    label: 'Company Email',
    controlType: 'email',
    required: true,
    placeholder: 'company@example.com'
  }
];

// All 51 Phase 3+ Forms Configurations
export const ALL_FORMS_CONFIG: Record<string, FormConfig> = {
  
  // ==================== BOARD REPORT ====================
  boardreport: {
    code: 'boardreport',
    title: 'Board Report',
    description: 'Annual Board Report as required under Companies Act',
    apiEndpoint: '/forms/boardreport',
    category: 'Reports',
    fields: [
      ...baseCompanyFields,
      {
        name: 'financial_year',
        label: 'Financial Year',
        controlType: 'text',
        required: true,
        placeholder: '2024-2025'
      },
      {
        name: 'report_date',
        label: 'Report Date',
        controlType: 'date',
        required: true
      },
      {
        name: 'business_activities',
        label: 'State of Company Affairs',
        controlType: 'textarea',
        required: true,
        rows: 5,
        hint: 'Describe business activities and state of affairs'
      },
      {
        name: 'dividend_details',
        label: 'Dividend Details',
        controlType: 'textarea',
        rows: 3
      },
      {
        name: 'reserves_details',
        label: 'Reserves and Surplus',
        controlType: 'textarea',
        rows: 3
      },
      {
        name: 'director_changes',
        label: 'Changes in Directors',
        controlType: 'textarea',
        rows: 3
      },
      {
        name: 'key_managerial_personnel',
        label: 'Key Managerial Personnel',
        controlType: 'textarea',
        rows: 3
      }
    ]
  },

  // ==================== CHARGE FORMS ====================
  charge: {
    code: 'charge',
    title: 'CHARGE - Creation/Modification of Charge',
    description: 'Registration of charge for secured loans and borrowings',
    apiEndpoint: '/forms/charge',
    category: 'Charges',
    fields: [
      ...baseCompanyFields,
      {
        name: 'charge_holder_name',
        label: 'Charge Holder Name',
        controlType: 'text',
        required: true
      },
      {
        name: 'charge_amount',
        label: 'Charge Amount (INR)',
        controlType: 'number',
        required: true,
        min: 0
      },
      {
        name: 'charge_date',
        label: 'Date of Creation of Charge',
        controlType: 'date',
        required: true
      },
      {
        name: 'charge_description',
        label: 'Description of Charge',
        controlType: 'textarea',
        required: true,
        rows: 4
      },
      {
        name: 'property_details',
        label: 'Property/Assets Details',
        controlType: 'textarea',
        required: true,
        rows: 4
      }
    ]
  },

  chg1: {
    code: 'chg1',
    title: 'CHG-1 - Registration of Creation/Modification of Charge',
    description: 'For registration of creation or modification of charge',
    apiEndpoint: '/forms/chg1',
    category: 'Charges',
    fields: [
      ...baseCompanyFields,
      {
        name: 'charge_id',
        label: 'Charge ID (if modification)',
        controlType: 'text'
      },
      {
        name: 'instrument_type',
        label: 'Instrument Type',
        controlType: 'select',
        required: true,
        options: ['Deed of Hypothecation', 'Deed of Pledge', 'Mortgage Deed', 'Loan Agreement', 'Other']
      },
      {
        name: 'charge_holder_name',
        label: 'Charge Holder Name',
        controlType: 'text',
        required: true
      },
      {
        name: 'charge_amount',
        label: 'Amount Secured (INR)',
        controlType: 'number',
        required: true,
        min: 0
      },
      {
        name: 'charge_creation_date',
        label: 'Date of Creation',
        controlType: 'date',
        required: true
      },
      {
        name: 'assets_under_charge',
        label: 'Assets Under Charge',
        controlType: 'textarea',
        required: true,
        rows: 5
      }
    ]
  },

  chg4: {
    code: 'chg4',
    title: 'CHG-4 - Satisfaction of Charge',
    description: 'For filing satisfaction of charge when loan is repaid',
    apiEndpoint: '/forms/chg4',
    category: 'Charges',
    fields: [
      ...baseCompanyFields,
      {
        name: 'charge_id',
        label: 'Charge ID',
        controlType: 'text',
        required: true,
        hint: 'Enter existing charge registration number'
      },
      {
        name: 'satisfaction_date',
        label: 'Date of Satisfaction',
        controlType: 'date',
        required: true
      },
      {
        name: 'outstanding_amount',
        label: 'Outstanding Amount at Satisfaction (INR)',
        controlType: 'number',
        required: true,
        min: 0
      },
      {
        name: 'satisfaction_details',
        label: 'Details of Satisfaction',
        controlType: 'textarea',
        required: true,
        rows: 4
      }
    ]
  },

  chg6: {
    code: 'chg6',
    title: 'CHG-6 - Rectification of Particulars of Charge',
    description: 'For rectification of errors in charge registration',
    apiEndpoint: '/forms/chg6',
    category: 'Charges',
    fields: [
      ...baseCompanyFields,
      {
        name: 'charge_id',
        label: 'Charge ID to Rectify',
        controlType: 'text',
        required: true
      },
      {
        name: 'error_description',
        label: 'Description of Error',
        controlType: 'textarea',
        required: true,
        rows: 3
      },
      {
        name: 'correct_particulars',
        label: 'Correct Particulars',
        controlType: 'textarea',
        required: true,
        rows: 3
      },
      {
        name: 'reason_for_rectification',
        label: 'Reason for Rectification',
        controlType: 'textarea',
        required: true,
        rows: 3
      }
    ]
  },

  chg8: {
    code: 'chg8',
    title: 'CHG-8 - Notice of Appointment of Receiver/Manager',
    description: 'Notice of appointment or cessation of receiver or manager',
    apiEndpoint: '/forms/chg8',
    category: 'Charges',
    fields: [
      ...baseCompanyFields,
      {
        name: 'charge_id',
        label: 'Charge ID',
        controlType: 'text',
        required: true
      },
      {
        name: 'receiver_name',
        label: 'Name of Receiver/Manager',
        controlType: 'text',
        required: true
      },
      {
        name: 'appointment_date',
        label: 'Date of Appointment',
        controlType: 'date',
        required: true
      },
      {
        name: 'appointment_details',
        label: 'Details of Appointment',
        controlType: 'textarea',
        required: true,
        rows: 4
      }
    ]
  },

  chg9: {
    code: 'chg9',
    title: 'CHG-9 - Notice of Payment of Other Amount',
    description: 'Notice for payment of amount other than charge satisfaction',
    apiEndpoint: '/forms/chg9',
    category: 'Charges',
    fields: [
      ...baseCompanyFields,
      {
        name: 'charge_id',
        label: 'Charge ID',
        controlType: 'text',
        required: true
      },
      {
        name: 'payment_date',
        label: 'Date of Payment',
        controlType: 'date',
        required: true
      },
      {
        name: 'amount_paid',
        label: 'Amount Paid (INR)',
        controlType: 'number',
        required: true,
        min: 0
      },
      {
        name: 'payment_details',
        label: 'Payment Details',
        controlType: 'textarea',
        required: true,
        rows: 3
      }
    ]
  },

  // ==================== DIRECTOR FORMS ====================
  dir3: {
    code: 'dir3',
    title: 'DIR-3 - Application for Director Identification Number (DIN)',
    description: 'Application for allotment of Director Identification Number',
    apiEndpoint: '/forms/dir3',
    category: 'Directors',
    fields: [
      {
        name: 'applicant_name',
        label: 'Applicant Name',
        controlType: 'text',
        required: true
      },
      {
        name: 'father_name',
        label: 'Father Name',
        controlType: 'text',
        required: true
      },
      {
        name: 'date_of_birth',
        label: 'Date of Birth',
        controlType: 'date',
        required: true
      },
      {
        name: 'gender',
        label: 'Gender',
        controlType: 'select',
        required: true,
        options: ['Male', 'Female', 'Other']
      },
      {
        name: 'pan_number',
        label: 'PAN Number',
        controlType: 'text',
        required: true,
        pattern: '[A-Z]{5}[0-9]{4}[A-Z]{1}',
        placeholder: 'AAAAA1234A'
      },
      {
        name: 'mobile_number',
        label: 'Mobile Number',
        controlType: 'tel',
        required: true,
        pattern: '[0-9]{10}',
        placeholder: '9876543210'
      },
      {
        name: 'email',
        label: 'Email Address',
        controlType: 'email',
        required: true
      },
      {
        name: 'residential_address',
        label: 'Residential Address',
        controlType: 'textarea',
        required: true,
        rows: 3
      }
    ]
  },

  dir5: {
    code: 'dir5',
    title: 'DIR-5 - Application for Surrender of DIN',
    description: 'Application for voluntary surrender of Director Identification Number',
    apiEndpoint: '/forms/dir5',
    category: 'Directors',
    fields: [
      {
        name: 'din',
        label: 'DIN to Surrender',
        controlType: 'text',
        required: true,
        pattern: '[0-9]{8}',
        placeholder: '12345678'
      },
      {
        name: 'director_name',
        label: 'Director Name',
        controlType: 'text',
        required: true
      },
      {
        name: 'pan_number',
        label: 'PAN Number',
        controlType: 'text',
        required: true,
        pattern: '[A-Z]{5}[0-9]{4}[A-Z]{1}'
      },
      {
        name: 'reason_for_surrender',
        label: 'Reason for Surrender',
        controlType: 'textarea',
        required: true,
        rows: 4,
        hint: 'Provide detailed reason for surrendering DIN'
      }
    ]
  },

  dir6: {
    code: 'dir6',
    title: 'DIR-6 - Intimation of Change in Particulars',
    description: 'Intimation of change in name, address or other particulars of director',
    apiEndpoint: '/forms/dir6',
    category: 'Directors',
    fields: [
      ...baseCompanyFields,
      {
        name: 'din',
        label: 'Director Identification Number (DIN)',
        controlType: 'text',
        required: true,
        pattern: '[0-9]{8}'
      },
      {
        name: 'director_name',
        label: 'Director Name',
        controlType: 'text',
        required: true
      },
      {
        name: 'change_type',
        label: 'Type of Change',
        controlType: 'select',
        required: true,
        options: ['Name Change', 'Address Change', 'Contact Details', 'Other Particulars']
      },
      {
        name: 'old_particulars',
        label: 'Old Particulars',
        controlType: 'textarea',
        required: true,
        rows: 3
      },
      {
        name: 'new_particulars',
        label: 'New Particulars',
        controlType: 'textarea',
        required: true,
        rows: 3
      },
      {
        name: 'effective_date',
        label: 'Effective Date of Change',
        controlType: 'date',
        required: true
      }
    ]
  },

  dir9: {
    code: 'dir9',
    title: 'DIR-9 - Return of Disqualification of Directors',
    description: 'Return filed by company on disqualification of director',
    apiEndpoint: '/forms/dir9',
    category: 'Directors',
    fields: [
      ...baseCompanyFields,
      {
        name: 'din',
        label: 'Director Identification Number (DIN)',
        controlType: 'text',
        required: true,
        pattern: '[0-9]{8}'
      },
      {
        name: 'director_name',
        label: 'Director Name',
        controlType: 'text',
        required: true
      },
      {
        name: 'disqualification_reason',
        label: 'Reason for Disqualification',
        controlType: 'textarea',
        required: true,
        rows: 4
      },
      {
        name: 'disqualification_date',
        label: 'Date of Disqualification',
        controlType: 'date',
        required: true
      },
      {
        name: 'order_details',
        label: 'Order/Judgment Details',
        controlType: 'textarea',
        required: true,
        rows: 3
      }
    ]
  },

  dir11: {
    code: 'dir11',
    title: 'DIR-11 - Notice of Resignation',
    description: 'Notice of resignation of director to Registrar',
    apiEndpoint: '/forms/dir11',
    category: 'Directors',
    fields: [
      ...baseCompanyFields,
      {
        name: 'din',
        label: 'Director Identification Number (DIN)',
        controlType: 'text',
        required: true,
        pattern: '[0-9]{8}'
      },
      {
        name: 'director_name',
        label: 'Director Name',
        controlType: 'text',
        required: true
      },
      {
        name: 'designation',
        label: 'Designation',
        controlType: 'select',
        required: true,
        options: ['Director', 'Managing Director', 'Whole-time Director', 'Independent Director', 'Non-Executive Director']
      },
      {
        name: 'resignation_date',
        label: 'Date of Resignation',
        controlType: 'date',
        required: true
      },
      {
        name: 'resignation_reason',
        label: 'Reason for Resignation',
        controlType: 'textarea',
        rows: 4
      }
    ]
  },

  dir12: {
    code: 'dir12',
    title: 'DIR-12 - Particulars of Appointment of Directors',
    description: 'Return for particulars of appointment of directors and key managerial personnel',
    apiEndpoint: '/forms/dir12',
    category: 'Directors',
    fields: [
      ...baseCompanyFields,
      {
        name: 'din',
        label: 'Director Identification Number (DIN)',
        controlType: 'text',
        required: true,
        pattern: '[0-9]{8}'
      },
      {
        name: 'director_name',
        label: 'Director Name',
        controlType: 'text',
        required: true
      },
      {
        name: 'pan_number',
        label: 'PAN Number',
        controlType: 'text',
        required: true,
        pattern: '[A-Z]{5}[0-9]{4}[A-Z]{1}'
      },
      {
        name: 'appointment_date',
        label: 'Date of Appointment',
        controlType: 'date',
        required: true
      },
      {
        name: 'designation',
        label: 'Designation',
        controlType: 'select',
        required: true,
        options: ['Director', 'Managing Director', 'Whole-time Director', 'CFO', 'Company Secretary', 'CEO']
      },
      {
        name: 'appointment_details',
        label: 'Details of Appointment',
        controlType: 'textarea',
        required: true,
        rows: 3
      }
    ]
  },

  // ==================== DPT-4 ====================
  dpt4: {
    code: 'dpt4',
    title: 'DPT-4 - Return of Deposits and Particulars',
    description: 'Statement of outstanding deposits',
    apiEndpoint: '/forms/dpt4',
    category: 'Deposits',
    fields: [
      ...baseCompanyFields,
      {
        name: 'financial_year',
        label: 'Financial Year Ending',
        controlType: 'date',
        required: true
      },
      {
        name: 'total_deposits',
        label: 'Total Deposits Outstanding (INR)',
        controlType: 'number',
        required: true,
        min: 0
      },
      {
        name: 'deposits_matured',
        label: 'Deposits Matured and Claimed (INR)',
        controlType: 'number',
        required: true,
        min: 0
      },
      {
        name: 'deposits_renewed',
        label: 'Deposits Renewed (INR)',
        controlType: 'number',
        required: true,
        min: 0
      },
      {
        name: 'deposit_details',
        label: 'Details of Deposits',
        controlType: 'textarea',
        required: true,
        rows: 5
      }
    ]
  },

  // ==================== FORM SERIES ====================
  form3: {
    code: 'form3',
    title: 'FORM-3 - Application for Conversion',
    description: 'Application for conversion of company from one class to another',
    apiEndpoint: '/forms/form3',
    category: 'Company Changes',
    fields: [
      ...baseCompanyFields,
      {
        name: 'current_type',
        label: 'Current Company Type',
        controlType: 'select',
        required: true,
        options: ['Private Limited', 'Public Limited', 'OPC', 'Section 8 Company']
      },
      {
        name: 'proposed_type',
        label: 'Proposed Company Type',
        controlType: 'select',
        required: true,
        options: ['Private Limited', 'Public Limited', 'OPC', 'Section 8 Company']
      },
      {
        name: 'conversion_reason',
        label: 'Reason for Conversion',
        controlType: 'textarea',
        required: true,
        rows: 4
      },
      {
        name: 'resolution_date',
        label: 'Date of Resolution',
        controlType: 'date',
        required: true
      }
    ]
  },

  form4: {
    code: 'form4',
    title: 'FORM-4 - Notice of Order of Court/Tribunal',
    description: 'Notice of order of court or tribunal or any other competent authority',
    apiEndpoint: '/forms/form4',
    category: 'Legal',
    fields: [
      ...baseCompanyFields,
      {
        name: 'court_name',
        label: 'Name of Court/Tribunal',
        controlType: 'text',
        required: true
      },
      {
        name: 'order_date',
        label: 'Date of Order',
        controlType: 'date',
        required: true
      },
      {
        name: 'case_number',
        label: 'Case/Petition Number',
        controlType: 'text',
        required: true
      },
      {
        name: 'order_summary',
        label: 'Summary of Order',
        controlType: 'textarea',
        required: true,
        rows: 5
      }
    ]
  },

  form5: {
    code: 'form5',
    title: 'FORM-5 - Return of Appointment of Managing or Whole-time Director',
    description: 'Return for appointment of managing director or whole-time director or manager',
    apiEndpoint: '/forms/form5',
    category: 'Directors',
    fields: [
      ...baseCompanyFields,
      {
        name: 'din',
        label: 'Director Identification Number (DIN)',
        controlType: 'text',
        required: true,
        pattern: '[0-9]{8}'
      },
      {
        name: 'director_name',
        label: 'Name',
        controlType: 'text',
        required: true
      },
      {
        name: 'designation',
        label: 'Designation',
        controlType: 'select',
        required: true,
        options: ['Managing Director', 'Whole-time Director', 'Manager']
      },
      {
        name: 'appointment_date',
        label: 'Date of Appointment',
        controlType: 'date',
        required: true
      },
      {
        name: 'tenure_period',
        label: 'Period of Appointment (in years)',
        controlType: 'number',
        required: true,
        min: 1,
        max: 5
      },
      {
        name: 'remuneration_details',
        label: 'Remuneration Details',
        controlType: 'textarea',
        required: true,
        rows: 4
      }
    ]
  },

  form11: {
    code: 'form11',
    title: 'FORM-11 - Notice of Situation of Registered Office',
    description: 'Notice of address at which registered office is situated',
    apiEndpoint: '/forms/form11',
    category: 'Company Changes',
    fields: [
      ...baseCompanyFields,
      {
        name: 'office_type',
        label: 'Type of Address Change',
        controlType: 'select',
        required: true,
        options: ['Initial Address', 'Change within Local Limits', 'Change outside Local Limits']
      },
      {
        name: 'new_address',
        label: 'New Registered Office Address',
        controlType: 'textarea',
        required: true,
        rows: 3
      },
      {
        name: 'effective_date',
        label: 'Effective Date',
        controlType: 'date',
        required: true
      }
    ]
  },

  form12: {
    code: 'form12',
    title: 'FORM-12 - Application for Extension of Time',
    description: 'Application for extension of time to hold AGM',
    apiEndpoint: '/forms/form12',
    category: 'Meetings',
    fields: [
      ...baseCompanyFields,
      {
        name: 'financial_year',
        label: 'Financial Year',
        controlType: 'text',
        required: true,
        placeholder: '2024-2025'
      },
      {
        name: 'extension_period',
        label: 'Extension Period Requested (months)',
        controlType: 'number',
        required: true,
        min: 1,
        max: 3
      },
      {
        name: 'reason_for_extension',
        label: 'Reason for Extension',
        controlType: 'textarea',
        required: true,
        rows: 5
      }
    ]
  },

  form15: {
    code: 'form15',
    title: 'FORM-15 - Consent of Director',
    description: 'Consent to act as director',
    apiEndpoint: '/forms/form15',
    category: 'Directors',
    fields: [
      ...baseCompanyFields,
      {
        name: 'din',
        label: 'Director Identification Number (DIN)',
        controlType: 'text',
        required: true,
        pattern: '[0-9]{8}'
      },
      {
        name: 'director_name',
        label: 'Director Name',
        controlType: 'text',
        required: true
      },
      {
        name: 'consent_date',
        label: 'Date of Consent',
        controlType: 'date',
        required: true
      },
      {
        name: 'declaration',
        label: 'Declaration',
        controlType: 'textarea',
        required: true,
        rows: 4,
        hint: 'I hereby consent to act as director of the company'
      }
    ]
  },

  form22: {
    code: 'form22',
    title: 'FORM-22 - Notice of Defect',
    description: 'Notice of defect in documents filed with Registrar',
    apiEndpoint: '/forms/form22',
    category: 'Compliance',
    fields: [
      ...baseCompanyFields,
      {
        name: 'srn_number',
        label: 'SRN of Defective Filing',
        controlType: 'text',
        required: true
      },
      {
        name: 'form_name',
        label: 'Form Name',
        controlType: 'text',
        required: true
      },
      {
        name: 'defect_details',
        label: 'Details of Defect',
        controlType: 'textarea',
        required: true,
        rows: 4
      },
      {
        name: 'corrective_action',
        label: 'Corrective Action Taken',
        controlType: 'textarea',
        required: true,
        rows: 4
      }
    ]
  },

  form23: {
    code: 'form23',
    title: 'FORM-23 - Application for Compounding of Offence',
    description: 'Application for compounding of offences under Companies Act',
    apiEndpoint: '/forms/form23',
    category: 'Legal',
    fields: [
      ...baseCompanyFields,
      {
        name: 'offence_section',
        label: 'Section of Companies Act',
        controlType: 'text',
        required: true
      },
      {
        name: 'offence_details',
        label: 'Details of Offence',
        controlType: 'textarea',
        required: true,
        rows: 5
      },
      {
        name: 'circumstances',
        label: 'Circumstances of Offence',
        controlType: 'textarea',
        required: true,
        rows: 4
      },
      {
        name: 'compounding_fee_offered',
        label: 'Compounding Fee Offered (INR)',
        controlType: 'number',
        required: true,
        min: 0
      }
    ]
  },

  form24: {
    code: 'form24',
    title: 'FORM-24 - Application for Adjudication',
    description: 'Application for adjudication of penalties',
    apiEndpoint: '/forms/form24',
    category: 'Legal',
    fields: [
      ...baseCompanyFields,
      {
        name: 'default_section',
        label: 'Section in Default',
        controlType: 'text',
        required: true
      },
      {
        name: 'default_details',
        label: 'Details of Default',
        controlType: 'textarea',
        required: true,
        rows: 5
      },
      {
        name: 'mitigating_circumstances',
        label: 'Mitigating Circumstances',
        controlType: 'textarea',
        required: true,
        rows: 4
      }
    ]
  },

  form28: {
    code: 'form28',
    title: 'FORM-28 - Notice of Appointment/Cessation of Liquidator',
    description: 'Notice of appointment or cessation of liquidator',
    apiEndpoint: '/forms/form28',
    category: 'Winding Up',
    fields: [
      ...baseCompanyFields,
      {
        name: 'action_type',
        label: 'Type of Action',
        controlType: 'select',
        required: true,
        options: ['Appointment', 'Cessation']
      },
      {
        name: 'liquidator_name',
        label: 'Liquidator Name',
        controlType: 'text',
        required: true
      },
      {
        name: 'liquidator_address',
        label: 'Liquidator Address',
        controlType: 'textarea',
        required: true,
        rows: 3
      },
      {
        name: 'action_date',
        label: 'Date of Appointment/Cessation',
        controlType: 'date',
        required: true
      },
      {
        name: 'order_details',
        label: 'Order/Resolution Details',
        controlType: 'textarea',
        required: true,
        rows: 3
      }
    ]
  },

  // ==================== GNL FORMS ====================
  gnl1: {
    code: 'gnl1',
    title: 'GNL-1 - Application for Change of Name',
    description: 'Application for change of name by existing company',
    apiEndpoint: '/forms/gnl1',
    category: 'Company Changes',
    fields: [
      ...baseCompanyFields,
      {
        name: 'proposed_name',
        label: 'Proposed New Name',
        controlType: 'text',
        required: true
      },
      {
        name: 'reason_for_change',
        label: 'Reason for Change of Name',
        controlType: 'textarea',
        required: true,
        rows: 4
      },
      {
        name: 'resolution_date',
        label: 'Date of Special Resolution',
        controlType: 'date',
        required: true
      },
      {
        name: 'approval_authority',
        label: 'Approval from Authority (if required)',
        controlType: 'text'
      }
    ]
  },

  gnl2: {
    code: 'gnl2',
    title: 'GNL-2 - Application for Approval of Central Government',
    description: 'Application for approval or sanction of Central Government',
    apiEndpoint: '/forms/gnl2',
    category: 'Government Approvals',
    fields: [
      ...baseCompanyFields,
      {
        name: 'approval_type',
        label: 'Type of Approval Sought',
        controlType: 'select',
        required: true,
        options: ['Name Change', 'Conversion', 'Amalgamation', 'Compromise/Arrangement', 'Other']
      },
      {
        name: 'purpose',
        label: 'Purpose of Application',
        controlType: 'textarea',
        required: true,
        rows: 5
      },
      {
        name: 'supporting_documents',
        label: 'List of Supporting Documents',
        controlType: 'textarea',
        required: true,
        rows: 3
      }
    ]
  },

  gnl3: {
    code: 'gnl3',
    title: 'GNL-3 - Application for Compounding',
    description: 'Application for compounding of offences',
    apiEndpoint: '/forms/gnl3',
    category: 'Legal',
    fields: [
      ...baseCompanyFields,
      {
        name: 'offence_section',
        label: 'Section Number',
        controlType: 'text',
        required: true
      },
      {
        name: 'offence_description',
        label: 'Description of Offence',
        controlType: 'textarea',
        required: true,
        rows: 5
      },
      {
        name: 'compounding_amount',
        label: 'Amount Offered for Compounding (INR)',
        controlType: 'number',
        required: true,
        min: 0
      }
    ]
  },

  // ==================== IEPF FORMS ====================
  iepf2: {
    code: 'iepf2',
    title: 'IEPF-2 - Statement of Unclaimed and Unpaid Amounts',
    description: 'Statement of amounts credited to Investor Education and Protection Fund',
    apiEndpoint: '/forms/iepf2',
    category: 'IEPF',
    fields: [
      ...baseCompanyFields,
      {
        name: 'financial_year',
        label: 'Financial Year',
        controlType: 'text',
        required: true,
        placeholder: '2024-2025'
      },
      {
        name: 'unclaimed_dividend',
        label: 'Unclaimed Dividend (INR)',
        controlType: 'number',
        required: true,
        min: 0
      },
      {
        name: 'matured_deposits',
        label: 'Matured Deposits (INR)',
        controlType: 'number',
        required: true,
        min: 0
      },
      {
        name: 'matured_debentures',
        label: 'Matured Debentures (INR)',
        controlType: 'number',
        required: true,
        min: 0
      },
      {
        name: 'details',
        label: 'Details of Amounts',
        controlType: 'textarea',
        required: true,
        rows: 5
      }
    ]
  },

  iepf5: {
    code: 'iepf5',
    title: 'IEPF-5 - E-verification Report for IEPF Forms',
    description: 'E-verification report for forms filed under IEPF',
    apiEndpoint: '/forms/iepf5',
    category: 'IEPF',
    fields: [
      ...baseCompanyFields,
      {
        name: 'verification_type',
        label: 'Type of Verification',
        controlType: 'select',
        required: true,
        options: ['Dividend', 'Shares', 'Deposits', 'Debentures']
      },
      {
        name: 'verification_details',
        label: 'Verification Details',
        controlType: 'textarea',
        required: true,
        rows: 5
      },
      {
        name: 'certified_by',
        label: 'Certified By',
        controlType: 'text',
        required: true
      }
    ]
  },

  // ==================== INC FORMS ====================
  inc4: {
    code: 'inc4',
    title: 'INC-4 - Application for Incorporation of Company',
    description: 'Application for incorporation of a company',
    apiEndpoint: '/forms/inc4',
    category: 'Incorporation',
    fields: [
      {
        name: 'proposed_name',
        label: 'Proposed Company Name',
        controlType: 'text',
        required: true
      },
      {
        name: 'company_type',
        label: 'Type of Company',
        controlType: 'select',
        required: true,
        options: ['Private Limited', 'Public Limited', 'OPC', 'Section 8 Company']
      },
      {
        name: 'authorized_capital',
        label: 'Authorized Capital (INR)',
        controlType: 'number',
        required: true,
        min: 100000
      },
      {
        name: 'main_objects',
        label: 'Main Objects of Company',
        controlType: 'textarea',
        required: true,
        rows: 5
      },
      {
        name: 'registered_address',
        label: 'Registered Office Address',
        controlType: 'textarea',
        required: true,
        rows: 3
      },
      {
        name: 'email',
        label: 'Email Address',
        controlType: 'email',
        required: true
      }
    ]
  },

  inc12: {
    code: 'inc12',
    title: 'INC-12 - Application for Change in Registered Office',
    description: 'Application for change in situation of registered office from one state to another',
    apiEndpoint: '/forms/inc12',
    category: 'Company Changes',
    fields: [
      ...baseCompanyFields,
      {
        name: 'current_state',
        label: 'Current State',
        controlType: 'text',
        required: true
      },
      {
        name: 'proposed_state',
        label: 'Proposed State',
        controlType: 'text',
        required: true
      },
      {
        name: 'new_address',
        label: 'New Registered Office Address',
        controlType: 'textarea',
        required: true,
        rows: 3
      },
      {
        name: 'resolution_date',
        label: 'Date of Special Resolution',
        controlType: 'date',
        required: true
      },
      {
        name: 'reason',
        label: 'Reason for Change',
        controlType: 'textarea',
        required: true,
        rows: 4
      }
    ]
  },

  inc20a: {
    code: 'inc20a',
    title: 'INC-20A - Declaration for Commencement of Business',
    description: 'Declaration of commencement of business',
    apiEndpoint: '/forms/inc20a',
    category: 'Incorporation',
    fields: [
      ...baseCompanyFields,
      {
        name: 'date_of_incorporation',
        label: 'Date of Incorporation',
        controlType: 'date',
        required: true
      },
      {
        name: 'commencement_date',
        label: 'Date of Commencement',
        controlType: 'date',
        required: true
      },
      {
        name: 'paid_up_capital',
        label: 'Paid-up Capital (INR)',
        controlType: 'number',
        required: true,
        min: 0
      },
      {
        name: 'bank_account_details',
        label: 'Bank Account Details',
        controlType: 'textarea',
        required: true,
        rows: 3
      },
      {
        name: 'declaration',
        label: 'Declaration of Commencement',
        controlType: 'textarea',
        required: true,
        rows: 4
      }
    ]
  },

  inc22: {
    code: 'inc22',
    title: 'INC-22 - Notice of Situation/Change of Registered Office',
    description: 'Notice of situation or change in situation of registered office',
    apiEndpoint: '/forms/inc22',
    category: 'Company Changes',
    fields: [
      ...baseCompanyFields,
      {
        name: 'change_type',
        label: 'Type of Change',
        controlType: 'select',
        required: true,
        options: ['Initial Address', 'Within Same City/Town/Village', 'Within Same State', 'From One State to Another']
      },
      {
        name: 'new_address',
        label: 'New Address',
        controlType: 'textarea',
        required: true,
        rows: 3
      },
      {
        name: 'effective_date',
        label: 'Effective Date',
        controlType: 'date',
        required: true
      },
      {
        name: 'resolution_date',
        label: 'Date of Resolution (if applicable)',
        controlType: 'date'
      }
    ]
  },

  inc23: {
    code: 'inc23',
    title: 'INC-23 - Application for Reservation of Name',
    description: 'Application for reservation of name by foreign company',
    apiEndpoint: '/forms/inc23',
    category: 'Incorporation',
    fields: [
      {
        name: 'proposed_name_1',
        label: 'Proposed Name - Option 1',
        controlType: 'text',
        required: true
      },
      {
        name: 'proposed_name_2',
        label: 'Proposed Name - Option 2',
        controlType: 'text'
      },
      {
        name: 'foreign_company_name',
        label: 'Name of Foreign Company',
        controlType: 'text',
        required: true
      },
      {
        name: 'country_of_incorporation',
        label: 'Country of Incorporation',
        controlType: 'text',
        required: true
      },
      {
        name: 'main_objects',
        label: 'Main Objects',
        controlType: 'textarea',
        required: true,
        rows: 4
      }
    ]
  },

  inc24: {
    code: 'inc24',
    title: 'INC-24 - Application for Conversion of Section 8 Company',
    description: 'Application for conversion to or from Section 8 company',
    apiEndpoint: '/forms/inc24',
    category: 'Company Changes',
    fields: [
      ...baseCompanyFields,
      {
        name: 'conversion_type',
        label: 'Conversion Type',
        controlType: 'select',
        required: true,
        options: ['To Section 8', 'From Section 8 to Other']
      },
      {
        name: 'reason',
        label: 'Reason for Conversion',
        controlType: 'textarea',
        required: true,
        rows: 5
      },
      {
        name: 'objects',
        label: 'Charitable/Welfare Objects',
        controlType: 'textarea',
        required: true,
        rows: 4
      },
      {
        name: 'resolution_date',
        label: 'Date of Special Resolution',
        controlType: 'date',
        required: true
      }
    ]
  },

  inc28: {
    code: 'inc28',
    title: 'INC-28 - Notice of Order of Court/Tribunal',
    description: 'Notice of order of court or tribunal for change in name',
    apiEndpoint: '/forms/inc28',
    category: 'Legal',
    fields: [
      ...baseCompanyFields,
      {
        name: 'court_name',
        label: 'Name of Court/Tribunal',
        controlType: 'text',
        required: true
      },
      {
        name: 'order_date',
        label: 'Date of Order',
        controlType: 'date',
        required: true
      },
      {
        name: 'case_number',
        label: 'Case Number',
        controlType: 'text',
        required: true
      },
      {
        name: 'new_name',
        label: 'New Name as per Order',
        controlType: 'text',
        required: true
      },
      {
        name: 'order_details',
        label: 'Details of Order',
        controlType: 'textarea',
        required: true,
        rows: 4
      }
    ]
  },

  // ==================== MGT FORMS ====================
  mgt6: {
    code: 'mgt6',
    title: 'MGT-6 - Return of Statutory Compliance',
    description: 'Return of compliance for half-year',
    apiEndpoint: '/forms/mgt6',
    category: 'Compliance',
    fields: [
      ...baseCompanyFields,
      {
        name: 'half_year_period',
        label: 'Half-Year Period',
        controlType: 'select',
        required: true,
        options: ['April to September', 'October to March']
      },
      {
        name: 'financial_year',
        label: 'Financial Year',
        controlType: 'text',
        required: true,
        placeholder: '2024-2025'
      },
      {
        name: 'compliance_certificate',
        label: 'Compliance Certificate Details',
        controlType: 'textarea',
        required: true,
        rows: 5
      },
      {
        name: 'certifying_professional',
        label: 'Name of Certifying Professional',
        controlType: 'text',
        required: true
      }
    ]
  },

  mgt8: {
    code: 'mgt8',
    title: 'MGT-8 - Return of AGM/EGM',
    description: 'Return of annual general meeting or extraordinary general meeting',
    apiEndpoint: '/forms/mgt8',
    category: 'Meetings',
    fields: [
      ...baseCompanyFields,
      {
        name: 'meeting_type',
        label: 'Type of Meeting',
        controlType: 'select',
        required: true,
        options: ['Annual General Meeting', 'Extraordinary General Meeting']
      },
      {
        name: 'meeting_date',
        label: 'Date of Meeting',
        controlType: 'date',
        required: true
      },
      {
        name: 'meeting_venue',
        label: 'Venue of Meeting',
        controlType: 'textarea',
        required: true,
        rows: 2
      },
      {
        name: 'resolutions_passed',
        label: 'Summary of Resolutions Passed',
        controlType: 'textarea',
        required: true,
        rows: 5
      },
      {
        name: 'attendance',
        label: 'Number of Members Present',
        controlType: 'number',
        required: true,
        min: 1
      }
    ]
  },

  mgt9: {
    code: 'mgt9',
    title: 'MGT-9 - Annual Return',
    description: 'Extract of annual return (not required for small companies)',
    apiEndpoint: '/forms/mgt9',
    category: 'Annual Returns',
    fields: [
      ...baseCompanyFields,
      {
        name: 'financial_year',
        label: 'Financial Year Ending',
        controlType: 'date',
        required: true
      },
      {
        name: 'total_members',
        label: 'Total Number of Members',
        controlType: 'number',
        required: true,
        min: 1
      },
      {
        name: 'shareholding_pattern',
        label: 'Shareholding Pattern',
        controlType: 'textarea',
        required: true,
        rows: 5
      },
      {
        name: 'directors_details',
        label: 'Details of Directors and KMP',
        controlType: 'textarea',
        required: true,
        rows: 5
      }
    ]
  },

  mgt14: {
    code: 'mgt14',
    title: 'MGT-14 - Filing of Resolutions',
    description: 'Filing of resolutions and agreements to Registrar',
    apiEndpoint: '/forms/mgt14',
    category: 'Compliance',
    fields: [
      ...baseCompanyFields,
      {
        name: 'resolution_type',
        label: 'Type of Resolution',
        controlType: 'select',
        required: true,
        options: ['Ordinary Resolution', 'Special Resolution', 'Board Resolution', 'Agreement']
      },
      {
        name: 'resolution_date',
        label: 'Date of Resolution/Agreement',
        controlType: 'date',
        required: true
      },
      {
        name: 'subject_matter',
        label: 'Subject Matter',
        controlType: 'textarea',
        required: true,
        rows: 4
      },
      {
        name: 'resolution_details',
        label: 'Details of Resolution',
        controlType: 'textarea',
        required: true,
        rows: 5
      }
    ]
  },

  // ==================== MR1 ====================
  mr1: {
    code: 'mr1',
    title: 'MR-1 - Return of Appointment of Managing Director',
    description: 'Return of appointment of managing director, whole-time director or manager',
    apiEndpoint: '/forms/mr1',
    category: 'Directors',
    fields: [
      ...baseCompanyFields,
      {
        name: 'din',
        label: 'Director Identification Number (DIN)',
        controlType: 'text',
        required: true,
        pattern: '[0-9]{8}'
      },
      {
        name: 'name',
        label: 'Name',
        controlType: 'text',
        required: true
      },
      {
        name: 'designation',
        label: 'Designation',
        controlType: 'select',
        required: true,
        options: ['Managing Director', 'Whole-time Director', 'Manager']
      },
      {
        name: 'appointment_date',
        label: 'Date of Appointment',
        controlType: 'date',
        required: true
      },
      {
        name: 'remuneration',
        label: 'Remuneration Per Annum (INR)',
        controlType: 'number',
        required: true,
        min: 0
      },
      {
        name: 'terms_conditions',
        label: 'Terms and Conditions',
        controlType: 'textarea',
        required: true,
        rows: 5
      }
    ]
  },

  // ==================== MSC3 ====================
  msc3: {
    code: 'msc3',
    title: 'MSC-3 - Application for Status of Dormant Company',
    description: 'Application for obtaining status of a dormant company',
    apiEndpoint: '/forms/msc3',
    category: 'Company Changes',
    fields: [
      ...baseCompanyFields,
      {
        name: 'reason',
        label: 'Reason for Seeking Dormant Status',
        controlType: 'textarea',
        required: true,
        rows: 5
      },
      {
        name: 'last_agt_date',
        label: 'Date of Last AGM',
        controlType: 'date',
        required: true
      },
      {
        name: 'no_significant_transactions',
        label: 'Declaration of No Significant Transactions',
        controlType: 'checkbox',
        required: true
      },
      {
        name: 'resolution_date',
        label: 'Date of Board Resolution',
        controlType: 'date',
        required: true
      }
    ]
  },

  // ==================== PAS FORMS ====================
  pas2: {
    code: 'pas2',
    title: 'PAS-2 - Return of Allotment (Application Money)',
    description: 'Return of allotment for shares or application money',
    apiEndpoint: '/forms/pas2',
    category: 'Shares',
    fields: [
      ...baseCompanyFields,
      {
        name: 'allotment_date',
        label: 'Date of Allotment',
        controlType: 'date',
        required: true
      },
      {
        name: 'shares_allotted',
        label: 'Number of Shares Allotted',
        controlType: 'number',
        required: true,
        min: 1
      },
      {
        name: 'face_value',
        label: 'Face Value per Share (INR)',
        controlType: 'number',
        required: true,
        min: 0
      },
      {
        name: 'issue_price',
        label: 'Issue Price per Share (INR)',
        controlType: 'number',
        required: true,
        min: 0
      },
      {
        name: 'allottee_details',
        label: 'Details of Allottees',
        controlType: 'textarea',
        required: true,
        rows: 5
      }
    ]
  },

  pas6: {
    code: 'pas6',
    title: 'PAS-6 - Reconciliation of Share Capital Audit Report',
    description: 'Reconciliation of share capital audit report',
    apiEndpoint: '/forms/pas6',
    category: 'Shares',
    fields: [
      ...baseCompanyFields,
      {
        name: 'quarter',
        label: 'Quarter',
        controlType: 'select',
        required: true,
        options: ['Q1 (Apr-Jun)', 'Q2 (Jul-Sep)', 'Q3 (Oct-Dec)', 'Q4 (Jan-Mar)']
      },
      {
        name: 'financial_year',
        label: 'Financial Year',
        controlType: 'text',
        required: true,
        placeholder: '2024-2025'
      },
      {
        name: 'issued_capital',
        label: 'Total Issued Capital (INR)',
        controlType: 'number',
        required: true,
        min: 0
      },
      {
        name: 'listed_capital',
        label: 'Listed Capital on Stock Exchange (INR)',
        controlType: 'number',
        required: true,
        min: 0
      },
      {
        name: 'reconciliation_details',
        label: 'Reconciliation Details',
        controlType: 'textarea',
        required: true,
        rows: 5
      }
    ]
  },

  // ==================== RUN FORMS ====================
  run: {
    code: 'run',
    title: 'RUN - Application for Reservation of Name',
    description: 'Application for reservation of unique name',
    apiEndpoint: '/forms/run',
    category: 'Incorporation',
    fields: [
      {
        name: 'proposed_name_1',
        label: 'Proposed Name - Option 1',
        controlType: 'text',
        required: true
      },
      {
        name: 'proposed_name_2',
        label: 'Proposed Name - Option 2',
        controlType: 'text'
      },
      {
        name: 'company_type',
        label: 'Type of Company',
        controlType: 'select',
        required: true,
        options: ['Private Limited', 'Public Limited', 'OPC', 'Section 8 Company', 'Producer Company']
      },
      {
        name: 'main_objects',
        label: 'Main Objects',
        controlType: 'textarea',
        required: true,
        rows: 4
      },
      {
        name: 'applicant_email',
        label: 'Applicant Email',
        controlType: 'email',
        required: true
      }
    ]
  },

  runllp: {
    code: 'runllp',
    title: 'RUN-LLP - Reservation of Name for LLP',
    description: 'Application for reservation of unique name for Limited Liability Partnership',
    apiEndpoint: '/forms/runllp',
    category: 'LLP',
    fields: [
      {
        name: 'proposed_name_1',
        label: 'Proposed LLP Name - Option 1',
        controlType: 'text',
        required: true
      },
      {
        name: 'proposed_name_2',
        label: 'Proposed LLP Name - Option 2',
        controlType: 'text'
      },
      {
        name: 'main_business',
        label: 'Main Business Activity',
        controlType: 'textarea',
        required: true,
        rows: 4
      },
      {
        name: 'applicant_email',
        label: 'Applicant Email',
        controlType: 'email',
        required: true
      }
    ]
  },

  // ==================== SH FORMS ====================
  sh7: {
    code: 'sh7',
    title: 'SH-7 - Notice to Registrar of any Alteration of Share Capital',
    description: 'Notice for consolidation, division, sub-division or cancellation of shares',
    apiEndpoint: '/forms/sh7',
    category: 'Shares',
    fields: [
      ...baseCompanyFields,
      {
        name: 'alteration_type',
        label: 'Type of Alteration',
        controlType: 'select',
        required: true,
        options: ['Consolidation', 'Division', 'Sub-division', 'Cancellation', 'Conversion']
      },
      {
        name: 'resolution_date',
        label: 'Date of Resolution',
        controlType: 'date',
        required: true
      },
      {
        name: 'old_share_capital',
        label: 'Old Share Capital (INR)',
        controlType: 'number',
        required: true,
        min: 0
      },
      {
        name: 'new_share_capital',
        label: 'New Share Capital (INR)',
        controlType: 'number',
        required: true,
        min: 0
      },
      {
        name: 'alteration_details',
        label: 'Details of Alteration',
        controlType: 'textarea',
        required: true,
        rows: 5
      }
    ]
  },

  sh8: {
    code: 'sh8',
    title: 'SH-8 - Notice of Redemption of Preference Shares',
    description: 'Notice for redemption of preference shares',
    apiEndpoint: '/forms/sh8',
    category: 'Shares',
    fields: [
      ...baseCompanyFields,
      {
        name: 'redemption_date',
        label: 'Date of Redemption',
        controlType: 'date',
        required: true
      },
      {
        name: 'shares_redeemed',
        label: 'Number of Shares Redeemed',
        controlType: 'number',
        required: true,
        min: 1
      },
      {
        name: 'redemption_amount',
        label: 'Total Redemption Amount (INR)',
        controlType: 'number',
        required: true,
        min: 0
      },
      {
        name: 'source_of_redemption',
        label: 'Source of Redemption',
        controlType: 'select',
        required: true,
        options: ['Profits', 'Fresh Issue', 'Capital Reduction', 'Securities Premium']
      },
      {
        name: 'redemption_details',
        label: 'Redemption Details',
        controlType: 'textarea',
        required: true,
        rows: 4
      }
    ]
  },

  sh9: {
    code: 'sh9',
    title: 'SH-9 - Declaration of Solvency for Buy-back',
    description: 'Declaration of solvency by directors for buy-back of shares',
    apiEndpoint: '/forms/sh9',
    category: 'Shares',
    fields: [
      ...baseCompanyFields,
      {
        name: 'buyback_date',
        label: 'Date of Buy-back',
        controlType: 'date',
        required: true
      },
      {
        name: 'shares_to_buyback',
        label: 'Number of Shares for Buy-back',
        controlType: 'number',
        required: true,
        min: 1
      },
      {
        name: 'buyback_amount',
        label: 'Total Buy-back Amount (INR)',
        controlType: 'number',
        required: true,
        min: 0
      },
      {
        name: 'solvency_declaration',
        label: 'Solvency Declaration',
        controlType: 'textarea',
        required: true,
        rows: 5,
        hint: 'Declaration that company will be able to pay debts as they become due'
      },
      {
        name: 'source_of_funds',
        label: 'Source of Funds for Buy-back',
        controlType: 'textarea',
        required: true,
        rows: 3
      }
    ]
  },

  sh11: {
    code: 'sh11',
    title: 'SH-11 - Return of Buy-back',
    description: 'Return for completion of buy-back of shares',
    apiEndpoint: '/forms/sh11',
    category: 'Shares',
    fields: [
      ...baseCompanyFields,
      {
        name: 'buyback_completion_date',
        label: 'Date of Completion of Buy-back',
        controlType: 'date',
        required: true
      },
      {
        name: 'shares_bought_back',
        label: 'Total Shares Bought Back',
        controlType: 'number',
        required: true,
        min: 1
      },
      {
        name: 'consideration_paid',
        label: 'Total Consideration Paid (INR)',
        controlType: 'number',
        required: true,
        min: 0
      },
      {
        name: 'buyback_summary',
        label: 'Summary of Buy-back',
        controlType: 'textarea',
        required: true,
        rows: 5
      }
    ]
  },

  // ==================== STK2 ====================
  stk2: {
    code: 'stk2',
    title: 'STK-2 - Return of Unclaimed/Unpaid Amounts',
    description: 'Half-yearly return of unclaimed and unpaid amounts',
    apiEndpoint: '/forms/stk2',
    category: 'Compliance',
    fields: [
      ...baseCompanyFields,
      {
        name: 'half_year_period',
        label: 'Half-Year Period Ending',
        controlType: 'date',
        required: true
      },
      {
        name: 'unclaimed_dividend',
        label: 'Unclaimed Dividend (INR)',
        controlType: 'number',
        required: true,
        min: 0
      },
      {
        name: 'unclaimed_deposits',
        label: 'Unclaimed Deposits (INR)',
        controlType: 'number',
        required: true,
        min: 0
      },
      {
        name: 'unclaimed_debentures',
        label: 'Unclaimed Debentures (INR)',
        controlType: 'number',
        required: true,
        min: 0
      },
      {
        name: 'details_of_amounts',
        label: 'Details of Unclaimed Amounts',
        controlType: 'textarea',
        required: true,
        rows: 5
      }
    ]
  },

  // ==================== PHASE 1 & 2 FORMS ====================
  
  adt1: {
    code: 'adt1',
    title: 'ADT-1 - Appointment of Auditors',
    description: 'Notice of appointment of auditors',
    apiEndpoint: '/forms/adt1',
    category: 'Auditors',
    phase: 1,
    fields: [...baseCompanyFields]
  },

  ben2: {
    code: 'ben2',
    title: 'BEN-2 - Beneficial Interest Register',
    description: 'Register of significant beneficial owners',
    apiEndpoint: '/forms/ben2',
    category: 'Beneficial Ownership',
    phase: 1,
    fields: [...baseCompanyFields]
  },

  pas3: {
    code: 'pas3',
    title: 'PAS-3 - Return of Allotment',
    description: 'Return of allotment of securities',
    apiEndpoint: '/forms/pas3',
    category: 'Share Allotment',
    phase: 1,
    fields: [...baseCompanyFields]
  },

  dpt3: {
    code: 'dpt3',
    title: 'DPT-3 - Return of Deposits',
    description: 'Return of deposits',
    apiEndpoint: '/forms/dpt3',
    category: 'Deposits',
    phase: 1,
    fields: [...baseCompanyFields]
  },

  aoc4: {
    code: 'aoc4',
    title: 'AOC-4 - Financial Statements',
    description: 'Filing of financial statements',
    apiEndpoint: '/forms/aoc4',
    category: 'Annual Returns',
    phase: 2,
    fields: [...baseCompanyFields]
  },

  aoc4cfs: {
    code: 'aoc4cfs',
    title: 'AOC-4 CFS - Consolidated Financial Statements',
    description: 'Consolidated financial statements',
    apiEndpoint: '/forms/aoc4cfs',
    category: 'Annual Returns',
    phase: 2,
    fields: [...baseCompanyFields]
  },

  mgt7a: {
    code: 'mgt7a',
    title: 'MGT-7A - Annual Return',
    description: 'Annual return for small companies',
    apiEndpoint: '/forms/mgt7a',
    category: 'Annual Returns',
    phase: 2,
    fields: [...baseCompanyFields]
  },

  msme: {
    code: 'msme',
    title: 'MSME Form-I - Half-yearly Return',
    description: 'Half-yearly return of MSME payments',
    apiEndpoint: '/forms/msme',
    category: 'MSME',
    phase: 2,
    fields: [...baseCompanyFields]
  },

  msme1: {
    code: 'msme1',
    title: 'MSME-1 - Memorandum',
    description: 'Memorandum of MSME information',
    apiEndpoint: '/forms/msme1',
    category: 'MSME',
    phase: 2,
    fields: [...baseCompanyFields]
  },

  ndh1: {
    code: 'ndh1',
    title: 'NDH-1 - Nidhi Compliances',
    description: 'Statutory compliances by Nidhi',
    apiEndpoint: '/forms/ndh1',
    category: 'Nidhi',
    phase: 2,
    fields: [...baseCompanyFields]
  },

  ndh2: {
    code: 'ndh2',
    title: 'NDH-2 - Nidhi Half-yearly',
    description: 'Half-yearly return by Nidhi',
    apiEndpoint: '/forms/ndh2',
    category: 'Nidhi',
    phase: 2,
    fields: [...baseCompanyFields]
  }
};

/**
 * Get form configuration by form code
 */
export function getFormConfig(formCode: string): FormConfig | undefined {
  return ALL_FORMS_CONFIG[formCode.toLowerCase()];
}

/**
 * Get all form codes
 */
export function getAllFormCodes(): string[] {
  return Object.keys(ALL_FORMS_CONFIG);
}

/**
 * Get forms by category
 */
export function getFormsByCategory(category: string): FormConfig[] {
  return Object.values(ALL_FORMS_CONFIG).filter(config => config.category === category);
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  const categories = new Set(Object.values(ALL_FORMS_CONFIG).map(c => c.category || 'Other'));
  return Array.from(categories).sort();
}

