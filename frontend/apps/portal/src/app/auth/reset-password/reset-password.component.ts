import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="card">
        <h1>Reset Password</h1>
        <p class="subtitle">
          Choose a new password to secure your account.
        </p>

        <div *ngIf="!token" class="status error">
          Reset token is missing or invalid. Please use the latest link from your email.
          <a [routerLink]="['/forgot-password']">Request a new link.</a>
        </div>

        <form *ngIf="token" [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <label>New password</label>
          <input
            type="password"
            formControlName="password"
            placeholder="Enter new password"
            [class.error]="passwordControl.invalid && (passwordControl.dirty || passwordControl.touched)"
          />
          <small *ngIf="passwordControl.errors?.['minlength']" class="error-text">
            Minimum 8 characters required.
          </small>
          <small *ngIf="passwordControl.errors?.['pattern']" class="error-text">
            Include at least one letter and one number.
          </small>

          <label>Confirm password</label>
          <input
            type="password"
            formControlName="confirmPassword"
            placeholder="Re-enter password"
            [class.error]="passwordMismatch"
          />
          <small *ngIf="passwordMismatch" class="error-text">
            Passwords must match.
          </small>

          <button type="submit" [disabled]="form.invalid || status === 'loading'">
            <span *ngIf="status !== 'loading'">Update password</span>
            <span *ngIf="status === 'loading'" class="spinner"></span>
          </button>
        </form>

        <div *ngIf="status === 'success'" class="status success">
          {{ message || 'Password updated successfully. You can now sign in.' }}
          <a [routerLink]="['/login']">Go to login →</a>
        </div>

        <div *ngIf="status === 'error'" class="status error">
          {{ message || 'Unable to update password. Please try again.' }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
      padding: 1rem;
    }
    .card {
      width: 100%;
      max-width: 460px;
      background: #fff;
      border-radius: 20px;
      padding: 2.5rem;
      box-shadow: 0 30px 80px rgba(0,0,0,0.25);
    }
    h1 {
      margin: 0;
      font-size: 2rem;
      color: #1a1a1a;
    }
    .subtitle {
      margin: 0.75rem 0 2rem;
      color: #555;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    label {
      font-weight: 600;
      color: #333;
      margin-top: 0.25rem;
    }
    input {
      border: 1px solid #ddd;
      border-radius: 12px;
      padding: 0.9rem 1rem;
      font-size: 1rem;
      transition: border 0.2s ease;
    }
    input:focus {
      border-color: #764ba2;
      outline: none;
      box-shadow: 0 0 0 3px rgba(118, 75, 162, 0.15);
    }
    input.error {
      border-color: #ff4d4f;
      background: #fff2f0;
    }
    .error-text {
      color: #ff4d4f;
      font-size: 0.85rem;
    }
    button {
      margin-top: 1rem;
      border: none;
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
      color: #fff;
      font-weight: 600;
      padding: 0.95rem;
      border-radius: 12px;
      cursor: pointer;
      transition: opacity 0.2s ease;
    }
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: #fff;
      border-radius: 50%;
      display: inline-block;
      animation: spin 0.8s linear infinite;
    }
    .status {
      margin-top: 1.5rem;
      padding: 1rem;
      border-radius: 12px;
      font-size: 0.95rem;
    }
    .status.success {
      background: #f0fff5;
      color: #1e7e34;
      border: 1px solid #c3e6cb;
    }
    .status.error {
      background: #fff5f5;
      color: #b71c1c;
      border: 1px solid #f5c6cb;
    }
    a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }
    a:hover {
      text-decoration: underline;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @media (max-width: 480px) {
      .card {
        padding: 2rem 1.5rem;
      }
    }
  `]
})
export class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  token: string | null = null;
  status: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  message?: string;

  form = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)]],
    confirmPassword: ['', Validators.required]
  });

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token');
    });
  }

  get passwordControl() {
    return this.form.get('password')!;
  }

  get passwordMismatch(): boolean {
    const password = this.form.value.password;
    const confirm = this.form.value.confirmPassword;
    return !!password && !!confirm && password !== confirm;
  }

  async submit(): Promise<void> {
    if (!this.token) {
      this.status = 'error';
      this.message = 'Reset token missing.';
      return;
    }
    if (this.form.invalid || this.passwordMismatch) {
      this.form.markAllAsTouched();
      return;
    }

    this.status = 'loading';
    this.message = undefined;
    try {
      const password = this.form.value.password as string;
      await this.authService.resetPassword(this.token, password);
      this.status = 'success';
      this.message = 'Password updated successfully.';
    } catch (error: any) {
      this.status = 'error';
      if (error?.status === 410) {
        this.message = 'Reset link has expired. Please request a new one.';
      } else if (error?.status === 404) {
        this.message = 'Reset link is invalid or already used.';
      } else if (error?.status === 400) {
        this.message = error?.error?.detail || 'Invalid request.';
      } else {
        this.message = 'Unable to update password right now.';
      }
    }
  }
}


