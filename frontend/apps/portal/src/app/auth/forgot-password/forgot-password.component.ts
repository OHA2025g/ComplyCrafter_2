import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="card">
        <h1>Forgot Password</h1>
        <p class="subtitle">
          Enter the email associated with your account and we'll send you a secure reset link.
        </p>

        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <label>Email address</label>
          <input
            type="email"
            formControlName="email"
            placeholder="yourname@company.com"
            [class.error]="shouldShowError"
          />
          <small *ngIf="shouldShowError" class="error-text">
            Please enter a valid email address.
          </small>

          <button type="submit" [disabled]="form.invalid || status === 'loading'">
            <span *ngIf="status !== 'loading'">Send reset link</span>
            <span *ngIf="status === 'loading'" class="spinner"></span>
          </button>
        </form>

        <div *ngIf="status === 'success'" class="status success">
          {{ message || 'If that account exists, we have emailed a reset link.' }}
        </div>

        <div *ngIf="status === 'error'" class="status error">
          {{ message || 'Unable to send reset link. Please try again.' }}
        </div>

        <a [routerLink]="['/login']" class="back-link">← Back to login</a>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem;
    }
    .card {
      width: 100%;
      max-width: 420px;
      background: #fff;
      border-radius: 20px;
      padding: 2.5rem;
      box-shadow: 0 30px 80px rgba(0,0,0,0.25);
      text-align: center;
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
      text-align: left;
    }
    label {
      font-weight: 600;
      color: #333;
    }
    input {
      border: 1px solid #ddd;
      border-radius: 12px;
      padding: 0.9rem 1rem;
      font-size: 1rem;
      transition: border 0.2s ease;
    }
    input:focus {
      border-color: #667eea;
      outline: none;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
      padding: 0.9rem 1rem;
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
    .back-link {
      display: inline-block;
      margin-top: 1.5rem;
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }
    .back-link:hover {
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
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  status: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  message?: string;

  get shouldShowError(): boolean {
    const control = this.form.get('email');
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.status = 'loading';
    this.message = undefined;
    try {
      const email = this.form.value.email as string;
      await this.authService.requestPasswordReset(email);
      this.status = 'success';
      this.message = 'Reset link sent to your email.';
    } catch (error: any) {
      this.status = 'error';
      if (error?.status === 404) {
        this.message = 'Email does not exist in our records.';
      } else if (error?.status === 400) {
        this.message = error?.error?.detail || 'Invalid email.';
      } else {
        this.message = 'Something went wrong while sending the reset link.';
      }
    }
  }
}


