import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { getFormConfig, FormConfig, FieldConfig } from './all-forms.config';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-generic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="form-container">
      <div class="form-header-card">
        <div class="header-content">
          <a [routerLink]="['/forms']" class="back-link">← Back to Forms</a>
          <h1>{{ formConfig?.title }}</h1>
          <div class="header-meta">
            <span class="form-code-badge">{{ formConfig?.code }}</span>
            <span class="phase-badge">Phase {{ formConfig?.phase || '3+' }}</span>
          </div>
          <p class="form-description">{{ formConfig?.description }}</p>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" *ngIf="formConfig" class="form-content">
        <div class="form-fields">
          <div *ngFor="let field of formConfig.fields" class="form-field">
            <label [for]="field.name" class="field-label">
              <span class="label-text">{{ field.label }}</span>
              <span *ngIf="field.required" class="required">*</span>
            </label>
            
            <input
              *ngIf="field.type !== 'textarea' && field.type !== 'select' && field.type !== 'checkbox'"
              [type]="field.type"
              [id]="field.name"
              [formControlName]="field.name"
              [placeholder]="field.placeholder || ''"
              class="field-input"
            />
            
            <textarea
              *ngIf="field.type === 'textarea'"
              [id]="field.name"
              [formControlName]="field.name"
              [placeholder]="field.placeholder || ''"
              rows="4"
              class="field-textarea"
            ></textarea>
            
            <select
              *ngIf="field.type === 'select' && field.options"
              [id]="field.name"
              [formControlName]="field.name"
              class="field-select"
            >
              <option value="">Select {{ field.label }}</option>
              <option *ngFor="let opt of field.options" [value]="opt.value">
                {{ opt.label }}
              </option>
            </select>
            
            <div *ngIf="field.type === 'checkbox'" class="field-checkbox">
              <input
                type="checkbox"
                [id]="field.name"
                [formControlName]="field.name"
              />
              <label [for]="field.name">{{ field.label }}</label>
            </div>
            
            <small *ngIf="field.helpText" class="field-help">{{ field.helpText }}</small>
            
            <div *ngIf="form.get(field.name)?.invalid && form.get(field.name)?.touched" class="field-error">
              <span *ngIf="form.get(field.name)?.errors?.['required']">
                {{ field.label }} is required
              </span>
              <span *ngIf="form.get(field.name)?.errors?.['email']">
                Please enter a valid email
              </span>
              <span *ngIf="form.get(field.name)?.errors?.['min']">
                Minimum value is {{ form.get(field.name)?.errors?.['min'].min }}
              </span>
              <span *ngIf="form.get(field.name)?.errors?.['max']">
                Maximum value is {{ form.get(field.name)?.errors?.['max'].max }}
              </span>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" (click)="onCancel()" class="btn btn-cancel" [disabled]="submitting">
            Cancel
          </button>
          <button type="submit" class="btn btn-submit" [disabled]="form.invalid || submitting">
            {{ submitting ? 'Submitting...' : 'Submit Form' }}
          </button>
        </div>

        <div *ngIf="submitSuccess" class="alert alert-success">
          ✓ Form submitted successfully! 
          <span *ngIf="submissionId">ID: {{ submissionId }}</span>
        </div>

        <div *ngIf="submitError" class="alert alert-error">
          ✗ {{ errorMessage || 'Failed to submit form. Please try again.' }}
        </div>
      </form>
    </div>
  `,
  styles: [`
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    .form-container { max-width: 950px; margin: 0 auto; padding: 2rem; animation: fadeInUp 0.5s ease-out; }
    .form-header-card { background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05)); border-radius: 16px; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 4px 16px rgba(0,0,0,0.05); }
    .back-link { color: #667eea; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem; transition: all 0.2s; margin-bottom: 1rem; }
    .back-link:hover { color: #764ba2; transform: translateX(-4px); }
    h1 { font-size: 2.2rem; font-weight: 800; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 0.5rem 0; }
    .header-meta { display: flex; gap: 1rem; margin: 1rem 0; }
    .form-code-badge { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 0.4rem 1rem; border-radius: 20px; font-weight: 700; font-size: 0.9rem; box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3); }
    .phase-badge { background: linear-gradient(135deg, #4facfe, #00f2fe); color: white; padding: 0.4rem 1rem; border-radius: 20px; font-weight: 700; font-size: 0.9rem; box-shadow: 0 2px 8px rgba(79, 172, 254, 0.3); }
    .form-description { color: #6c757d; font-size: 1.05rem; line-height: 1.6; margin: 0; }
    .form-content { background: white; border-radius: 16px; padding: 2.5rem; box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
    .form-fields { display: grid; gap: 1.75rem; }
    .form-field { display: flex; flex-direction: column; }
    .field-label { font-weight: 700; margin-bottom: 0.75rem; color: #2c3e50; font-size: 0.95rem; display: flex; align-items: center; justify-content: space-between; }
    .label-text { }
    .required { color: #ff4444; font-size: 1.1rem; font-weight: 800; }
    .field-input, .field-textarea, .field-select { padding: 1rem 1.25rem; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 1rem; transition: all 0.3s; background: #f8f9fa; }
    .field-input:focus, .field-textarea:focus, .field-select:focus { outline: none; border-color: #667eea; background: white; box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1); }
    .field-checkbox { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: #f8f9fa; border-radius: 12px; cursor: pointer; transition: all 0.2s; }
    .field-checkbox:hover { background: #e9ecef; }
    .field-checkbox input { width: 22px; height: 22px; cursor: pointer; accent-color: #667eea; }
    .field-help { color: #6c757d; font-size: 0.9rem; margin-top: 0.5rem; font-style: italic; }
    .field-error { color: #ff4444; font-size: 0.9rem; margin-top: 0.5rem; font-weight: 600; display: flex; align-items: center; gap: 0.25rem; }
    .field-error::before { content: '⚠️'; font-size: 1rem; }
    .form-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2.5rem; padding-top: 2rem; border-top: 2px solid #f0f0f0; }
    .btn { padding: 1rem 2.5rem; border: none; border-radius: 12px; font-size: 1rem; font-weight: 700; cursor: pointer; transition: all 0.3s; }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-cancel { background: #f8f9fa; color: #6c757d; border: 2px solid #e0e0e0; }
    .btn-cancel:hover:not(:disabled) { background: #e9ecef; transform: translateY(-2px); }
    .btn-submit { background: linear-gradient(135deg, #667eea, #764ba2); color: white; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); }
    .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4); }
    .alert { padding: 1.25rem; border-radius: 12px; margin-top: 1.5rem; font-weight: 600; display: flex; align-items: center; gap: 0.75rem; animation: fadeInUp 0.3s ease-out; }
    .alert-success { background: #f0fdf4; color: #166534; border: 2px solid #bbf7d0; border-left: 4px solid #22c55e; }
    .alert-success::before { content: '✓'; font-size: 1.5rem; background: linear-gradient(135deg, #11998e, #38ef7d); color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    .alert-error { background: #fff5f5; color: #cc0000; border: 2px solid #ffdddd; border-left: 4px solid #ff4444; }
    .alert-error::before { content: '✗'; font-size: 1.5rem; background: #ff4444; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    @media (max-width: 768px) { .form-container { padding: 1rem; } .form-header-card { padding: 1.5rem; } .form-content { padding: 1.5rem; } h1 { font-size: 1.75rem; } }
  `]
})
export class GenericFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  formConfig?: FormConfig;
  form!: FormGroup;
  submitting = false;
  submitSuccess = false;
  submitError = false;
  errorMessage = '';
  submissionId?: number;

  // Base API URL - adjust based on environment
  private readonly API_BASE_URL = environment.apiUrl;

  ngOnInit(): void {
    // Get form code from route - try both 'code' param and URL segment
    let formCode = this.route.snapshot.paramMap.get('code');
    
    // If not found in params, try getting from URL path
    if (!formCode) {
      const urlSegments = this.route.snapshot.url;
      if (urlSegments && urlSegments.length > 0) {
        formCode = urlSegments[urlSegments.length - 1].path;
      }
    }
    
    if (!formCode) {
      console.error('No form code provided in route', {
        params: this.route.snapshot.params,
        paramMap: this.route.snapshot.paramMap.keys,
        url: this.route.snapshot.url
      });
      this.router.navigate(['/forms']);
      return;
    }

    console.log('Loading form:', formCode);
    
    // Load form configuration
    this.formConfig = getFormConfig(formCode);
    
    if (!this.formConfig) {
      console.error(`Form configuration not found for: ${formCode}`);
      this.router.navigate(['/forms']);
      return;
    }

    // Build form dynamically based on configuration
    this.buildForm();
  }

  /**
   * Build reactive form based on field configuration
   */
  private buildForm(): void {
    if (!this.formConfig) return;

    const formControls: { [key: string]: any } = {};

    for (const field of this.formConfig.fields) {
      const validators = [];
      
      // Add required validator
      if (field.required) {
        validators.push(Validators.required);
      }

      // Add email validator
      if (field.controlType === 'email') {
        validators.push(Validators.email);
      }

      // Add pattern validator
      if (field.pattern) {
        validators.push(Validators.pattern(field.pattern));
      }

      // Add min/max validators for numbers
      if (field.controlType === 'number') {
        if (field.min !== undefined) {
          validators.push(Validators.min(field.min));
        }
        if (field.max !== undefined) {
          validators.push(Validators.max(field.max));
        }
      }

      // Initialize control with default value and validators
      formControls[field.name] = [
        field.controlType === 'checkbox' ? false : null,
        validators
      ];
    }

    this.form = this.fb.group(formControls);
  }

  /**
   * Get field configuration by name
   */
  getField(name: string): FieldConfig | undefined {
    return this.formConfig?.fields.find(f => f.name === name);
  }

  /**
   * Check if field has error
   */
  hasError(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  /**
   * Get error message for field
   */
  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    const field = this.getField(fieldName);

    if (!control || !field) return '';

    if (control.hasError('required')) {
      return `${field.label} is required`;
    }

    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }

    if (control.hasError('pattern')) {
      return `Invalid format for ${field.label}`;
    }

    if (control.hasError('min')) {
      return `${field.label} must be at least ${field.min}`;
    }

    if (control.hasError('max')) {
      return `${field.label} must be at most ${field.max}`;
    }

    return 'Invalid value';
  }

  /**
   * Submit form
   */
  async onSubmit(): Promise<void> {
    // Mark all fields as touched to show validation errors
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.formConfig) return;

    this.submitting = true;
    this.submitSuccess = false;
    this.submitError = false;
    this.errorMessage = '';

    try {
      const payload = this.form.value;
      
      // Add created_by field (mock user ID for now)
      const submissionData = {
        ...payload,
        created_by: 1, // This should come from auth service
        is_active: true
      };

      // Submit to backend API
      const endpoint = `${this.API_BASE_URL}${this.formConfig.apiEndpoint}`;
      
      const response = await this.http.post<any>(endpoint, submissionData).toPromise();
      
      this.submitSuccess = true;
      this.submissionId = response?.id;
      
      // Reset form after successful submission
      setTimeout(() => {
        this.form.reset();
        this.submitSuccess = false;
      }, 5000);

    } catch (error: any) {
      console.error('Form submission error:', error);
      this.submitError = true;
      this.errorMessage = error?.error?.detail || 'An error occurred while submitting the form. Please try again.';
    } finally {
      this.submitting = false;
    }
  }

  /**
   * Reset form
   */
  onReset(): void {
    this.form.reset();
    this.submitSuccess = false;
    this.submitError = false;
    this.errorMessage = '';
  }

  /**
   * Navigate back to forms list
   */
  goBack(): void {
    this.router.navigate(['/forms']);
  }
}

