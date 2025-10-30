import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CcCardComponent } from '@frontend/ui';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CcCardComponent],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  form: FormGroup = this.fb.group({
    username: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(128)]],
  });

  submitting = false;
  success = false;
  error?: string;

  private readonly API_BASE_URL = 'http://localhost:8100';

  get f() { return this.form.controls; }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    this.success = false;
    this.error = undefined;

    try {
      await this.http.post(`${this.API_BASE_URL}/auth/signup`, this.form.value).toPromise();
      this.success = true;
      setTimeout(() => this.router.navigate(['/forms']), 1500);
    } catch (e: any) {
      this.error = e?.error?.detail || 'Signup failed. Please try again.';
    } finally {
      this.submitting = false;
    }
  }
}
