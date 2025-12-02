import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http: HttpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  form: FormGroup = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null],
    ccpin: [null],
    rememberMe: [false]
  });

  submitting = false;
  error?: string;
  useCcpin = false;

  private readonly API_BASE_URL = environment.apiUrl;

  get f() { return this.form.controls; }

  onPasswordInput(): void {
    if (this.form.value.password) {
      this.useCcpin = false;
      this.form.patchValue({ ccpin: null });
      this.f['ccpin'].clearValidators();
      this.f['ccpin'].updateValueAndValidity();
      this.f['password'].setValidators([Validators.required, Validators.minLength(8)]);
      this.f['password'].updateValueAndValidity();
    }
  }

  onCcpinInput(): void {
    const value = this.form.value.ccpin?.replace(/\D/g, '') || '';
    this.form.patchValue({ ccpin: value }, { emitEvent: false });
    
    if (value.length > 0) {
      this.useCcpin = true;
      this.form.patchValue({ password: null });
      this.f['password'].clearValidators();
      this.f['password'].updateValueAndValidity();
      this.f['ccpin'].setValidators([Validators.required, Validators.pattern(/^\d{4}$/)]);
      this.f['ccpin'].updateValueAndValidity();
    }
  }

  async submit(): Promise<void> {
    const hasPassword = this.form.value.password && this.form.value.password.length > 0;
    const hasCcpin = this.form.value.ccpin && this.form.value.ccpin.length === 4;

    if (!hasPassword && !hasCcpin) {
      this.error = 'Please enter either password or CC PIN';
      this.form.markAllAsTouched();
      return;
    }

    if (this.f['email'].invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.error = undefined;

    try {
      const loginData: any = {
        email: this.form.value.email
      };

      if (hasPassword) {
        loginData.password = this.form.value.password;
      } else if (hasCcpin) {
        loginData.ccpin = this.form.value.ccpin;
      }

      const response: any = await this.http.post(
        `${this.API_BASE_URL}/auth/login`,
        loginData
      ).toPromise();

      // Store authentication data using AuthService
      if (response.access_token) {
        const user = response.user || {
          username: this.form.value.email
        };
        
        this.authService.storeAuthData(
          response.access_token,
          user,
          this.form.value.rememberMe
        );

        // Navigate to dashboard after successful login
        this.router.navigate(['/dashboard']);
      }
    } catch (e: any) {
      this.error = e?.error?.detail || 'Login failed. Please check your credentials.';
    } finally {
      this.submitting = false;
    }
  }
}

