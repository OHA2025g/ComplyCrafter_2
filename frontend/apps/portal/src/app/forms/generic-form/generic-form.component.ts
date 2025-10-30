import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { getFormConfig, FormConfig, FieldConfig } from './all-forms.config';
import { CcCardComponent } from '@frontend/ui';

@Component({
  selector: 'app-generic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CcCardComponent],
  templateUrl: './generic-form.component.html',
  styleUrls: ['./generic-form.component.scss']
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
  private readonly API_BASE_URL = 'http://localhost:8100';

  ngOnInit(): void {
    // Get form code from route
    const formCode = this.route.snapshot.paramMap.get('code');
    
    if (!formCode) {
      console.error('No form code provided in route');
      this.router.navigate(['/forms']);
      return;
    }

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

