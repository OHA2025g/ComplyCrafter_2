import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="signup-container">
      <div class="background-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
      
      <div class="signup-card">
        <div class="signup-header">
          <div class="logo-container">
            <img src="/assets/images/comply_crafter_logo.png" alt="ComplyCrafter Logo" class="logo" />
          </div>
          <h1>Join ComplyCrafter!</h1>
          <p>Create your account and start managing compliance</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" class="signup-form">
          <div class="form-group" [class.has-error]="f['username'].invalid && f['username'].touched">
            <label for="username">
              <span class="icon">👤</span>
              Username
            </label>
            <input 
              type="text" 
              id="username" 
              formControlName="username"
              placeholder="Choose a unique username"
            />
            <div class="input-underline"></div>
            <div *ngIf="f['username'].invalid && f['username'].touched" class="error-message">
              <span class="error-icon">⚠️</span>
              Username must be 3-150 characters
            </div>
          </div>

          <div class="form-group" [class.has-error]="f['email'].invalid && f['email'].touched">
            <label for="email">
              <span class="icon">📧</span>
              Email Address
            </label>
            <input 
              type="email" 
              id="email" 
              formControlName="email"
              placeholder="your@email.com"
            />
            <div class="input-underline"></div>
            <div *ngIf="f['email'].invalid && f['email'].touched" class="error-message">
              <span class="error-icon">⚠️</span>
              Please enter a valid email address
            </div>
          </div>

          <div class="form-group" [class.has-error]="f['password'].invalid && f['password'].touched">
            <label for="password">
              <span class="icon">🔒</span>
              Password
            </label>
            <input 
              type="password" 
              id="password" 
              formControlName="password"
              placeholder="Create a strong password (min 8 chars)"
            />
            <div class="input-underline"></div>
            <div *ngIf="f['password'].invalid && f['password'].touched" class="error-message">
              <span class="error-icon">⚠️</span>
              Password must be at least 8 characters
            </div>
          </div>

          <button 
            type="submit" 
            class="btn-signup"
            [disabled]="form.invalid || submitting"
          >
            <span *ngIf="!submitting">Create Account</span>
            <span *ngIf="submitting" class="loading-spinner"></span>
            <span *ngIf="submitting">Creating account...</span>
          </button>

          <div *ngIf="error" class="alert-error">
            <span class="error-icon">⚠️</span>
            {{ error }}
          </div>

          <div *ngIf="success" class="alert-success">
            <span class="success-icon">✓</span>
            Account created successfully! Redirecting to login...
          </div>

          <div class="divider">
            <span>OR</span>
          </div>

          <div class="login-link">
            Already have an account? 
            <a [routerLink]="['/login']">Sign in here →</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(5deg); } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .signup-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 1rem; position: relative; overflow: hidden; }
    .background-shapes { position: absolute; width: 100%; height: 100%; overflow: hidden; z-index: 0; }
    .shape { position: absolute; opacity: 0.1; animation: float 20s infinite ease-in-out; }
    .shape-1 { width: 300px; height: 300px; background: white; border-radius: 50%; top: -100px; right: -100px; animation-delay: 0s; }
    .shape-2 { width: 200px; height: 200px; background: white; border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; bottom: -50px; left: -50px; animation-delay: 5s; }
    .shape-3 { width: 150px; height: 150px; background: white; border-radius: 50%; top: 50%; left: 10%; animation-delay: 10s; }
    .signup-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-radius: 24px; box-shadow: 0 30px 90px rgba(0, 0, 0, 0.4), 0 0 1px rgba(255, 255, 255, 0.5) inset; width: 100%; max-width: 480px; padding: 3rem 2.5rem; position: relative; z-index: 1; animation: fadeInUp 0.6s ease-out; }
    .signup-header { text-align: center; margin-bottom: 2.5rem; }
    .logo-container { margin-bottom: 1.5rem; }
    .logo { width: 90px; height: 90px; margin: 0 auto; filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15)); transition: transform 0.3s ease; }
    .logo:hover { transform: scale(1.05) rotate(5deg); }
    .signup-header h1 { font-size: 2.2rem; font-weight: 700; background: linear-gradient(135deg, #11998e, #38ef7d); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 0.5rem; }
    .signup-header p { color: #666; font-size: 0.95rem; }
    .signup-form { display: flex; flex-direction: column; gap: 1.4rem; }
    .form-group { position: relative; display: flex; flex-direction: column; }
    .form-group label { font-weight: 600; margin-bottom: 0.75rem; color: #333; font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem; }
    .form-group label .icon { font-size: 1.1rem; }
    .form-group input { padding: 1rem 1.25rem; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 1rem; transition: all 0.3s ease; background: #f8f9fa; }
    .form-group input:focus { outline: none; border-color: #11998e; background: white; box-shadow: 0 0 0 4px rgba(17, 153, 142, 0.1); }
    .form-group input::placeholder { color: #aaa; }
    .input-underline { height: 2px; background: linear-gradient(90deg, #11998e, #38ef7d); transform: scaleX(0); transition: transform 0.3s ease; }
    .form-group input:focus + .input-underline { transform: scaleX(1); }
    .form-group.has-error input { border-color: #ff4444; background: #fff5f5; }
    .error-message { color: #ff4444; font-size: 0.85rem; margin-top: 0.5rem; display: flex; align-items: center; gap: 0.25rem; }
    .error-icon { font-size: 1rem; }
    .btn-signup { padding: 1rem 2rem; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); border: none; border-radius: 12px; color: white; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(17, 153, 142, 0.4); position: relative; overflow: hidden; margin-top: 0.5rem; }
    .btn-signup::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); transition: left 0.5s; }
    .btn-signup:hover::before { left: 100%; }
    .btn-signup:hover { transform: translateY(-2px); box-shadow: 0 6px 25px rgba(17, 153, 142, 0.5); }
    .btn-signup:active { transform: translateY(0); }
    .btn-signup:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
    .loading-spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; margin-right: 0.5rem; }
    .alert-error { padding: 1rem; background: #fff5f5; border: 1px solid #ffdddd; border-left: 4px solid #ff4444; border-radius: 8px; color: #cc0000; font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem; animation: fadeInUp 0.3s ease-out; }
    .alert-success { padding: 1rem; background: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #22c55e; border-radius: 8px; color: #166534; font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem; animation: fadeInUp 0.3s ease-out; }
    .success-icon { font-size: 1.2rem; }
    .divider { position: relative; text-align: center; margin: 1.5rem 0; }
    .divider::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #e0e0e0; }
    .divider span { position: relative; background: rgba(255, 255, 255, 0.95); padding: 0 1rem; color: #999; font-size: 0.85rem; font-weight: 500; }
    .login-link { text-align: center; color: #666; font-size: 0.95rem; }
    .login-link a { color: #11998e; text-decoration: none; font-weight: 600; transition: color 0.2s; }
    .login-link a:hover { color: #38ef7d; text-decoration: underline; }
    @media (max-width: 640px) { .signup-card { padding: 2rem 1.5rem; } .signup-header h1 { font-size: 1.8rem; } .shape { display: none; } }
  `]
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

  private readonly API_BASE_URL = environment.apiUrl;

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
      setTimeout(() => this.router.navigate(['/login']), 1500);
    } catch (e: any) {
      this.error = e?.error?.detail || 'Signup failed. Please try again.';
    } finally {
      this.submitting = false;
    }
  }
}
