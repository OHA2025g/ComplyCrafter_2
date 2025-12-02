import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../config/environment';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  useCcpin = false;
  submitting = false;
  error?: string;

  private readonly API_BASE_URL = environment.apiUrl;

  constructor(
    private readonly fb: FormBuilder,
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {
    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null],
      ccpin: [null],
      rememberMe: [false]
    });
  }

  get f() {
    return this.form.controls;
  }

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

  onCcpinInput(event: any): void {
    const value = event.target.value.replace(/\D/g, '') || '';
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

      const response: any = await firstValueFrom(
        this.http.post(`${this.API_BASE_URL}/auth/login`, loginData)
      );

      if (response.access_token) {
        const user = response.user || {
          username: this.form.value.email
        };
        
        this.authService.storeAuthData(
          response.access_token,
          user,
          this.form.value.rememberMe
        );

        this.router.navigate(['/dashboard']);
      }
    } catch (e: any) {
      this.error = e?.error?.detail || 'Login failed. Please check your credentials.';
    } finally {
      this.submitting = false;
    }
  }
}



