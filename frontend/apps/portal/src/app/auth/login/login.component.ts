import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CcCardComponent } from '@frontend/ui';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CcCardComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  form: FormGroup = this.fb.group({
    username: [null, [Validators.required]],
    password: [null, [Validators.required, Validators.minLength(8)]],
    rememberMe: [false]
  });

  submitting = false;
  error?: string;

  private readonly API_BASE_URL = 'http://localhost:8100';

  get f() { return this.form.controls; }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.error = undefined;

    try {
      const response: any = await this.http.post(
        `${this.API_BASE_URL}/auth/login`,
        {
          username: this.form.value.username,
          password: this.form.value.password
        }
      ).toPromise();

      // Store token
      if (response.access_token) {
        if (this.form.value.rememberMe) {
          localStorage.setItem('auth_token', response.access_token);
        } else {
          sessionStorage.setItem('auth_token', response.access_token);
        }
        
        // Store user info
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }

        // Navigate to forms directory
        this.router.navigate(['/forms']);
      }
    } catch (e: any) {
      this.error = e?.error?.detail || 'Login failed. Please check your credentials.';
    } finally {
      this.submitting = false;
    }
  }
}

