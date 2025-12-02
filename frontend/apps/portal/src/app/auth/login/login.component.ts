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
  template: `
    <div class="login-container">
      <!-- Left Section: Gradient Background with Logo -->
      <div class="left-section">
        <div class="logo-container">
          <img src="/images/comply_crafter_logo.png" alt="ComplyCrafter Logo" class="logo" />
          <h1 class="brand-name">ComplyCrafter</h1>
          <p class="welcome-text">Welcome Back!</p>
        </div>
      </div>
      
      <!-- Right Section: Login Form -->
      <div class="right-section">

        <form [formGroup]="form" (ngSubmit)="submit()" class="login-form">
          <div class="form-group" [class.has-error]="f['email'].invalid && f['email'].touched">
            <label for="email">
              <span class="icon">📧</span>
              Email
            </label>
            <input 
              type="email" 
              id="email" 
              formControlName="email"
              placeholder="Enter your email"
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
              placeholder="Enter your password"
              (input)="onPasswordInput()"
            />
            <div class="input-underline"></div>
            <div *ngIf="f['password'].invalid && f['password'].touched && !useCcpin" class="error-message">
              <span class="error-icon">⚠️</span>
              Password is required
            </div>
          </div>

          <div class="divider-small full-width">
            <span>OR</span>
          </div>

          <div class="form-group full-width" [class.has-error]="f['ccpin'].invalid && f['ccpin'].touched">
            <label for="ccpin">
              <span class="icon">🔑</span>
              CC PIN
            </label>
            <input 
              type="password" 
              id="ccpin" 
              formControlName="ccpin"
              placeholder="Enter 4-digit CC PIN"
              maxlength="4"
              (input)="onCcpinInput()"
            />
            <div class="input-underline"></div>
            <div *ngIf="f['ccpin'].invalid && f['ccpin'].touched && useCcpin" class="error-message">
              <span class="error-icon">⚠️</span>
              CC PIN must be exactly 4 digits
            </div>
          </div>

          <div class="form-options full-width">
            <label class="remember-me">
              <input type="checkbox" formControlName="rememberMe" />
              <span class="checkmark"></span>
              <span>Remember me</span>
            </label>
            <a [routerLink]="['/forgot-password']" class="forgot-password">Forgot password?</a>
          </div>

          <div class="form-group full-width">
            <button 
              type="submit" 
              class="btn-login"
              [disabled]="form.invalid || submitting"
            >
              <span *ngIf="!submitting">Sign In</span>
              <span *ngIf="submitting" class="loading-spinner"></span>
              <span *ngIf="submitting">Signing in...</span>
            </button>
          </div>

          <div *ngIf="error" class="alert-error full-width">
            <span class="error-icon">⚠️</span>
            {{ error }}
          </div>

          <div class="divider full-width">
            <span>OR</span>
          </div>

          <div class="signup-link full-width">
            Don't have an account? 
            <a [routerLink]="['/signup']">Create one now →</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .login-container {
      min-height: 100vh;
      display: flex;
      overflow: hidden;
    }
    
    /* Left Section: Gradient Background with Logo */
    .left-section {
      flex: 0 0 35%;
      background: linear-gradient(180deg, #11998e 0%, #38ef7d 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      position: relative;
    }
    
    .left-section .logo-container {
      text-align: center;
      background: white;
      padding: 2rem 2.5rem;
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    }
    
    .left-section .logo {
      width: 100px;
      height: 100px;
      margin: 0 auto 1rem;
      display: block;
    }
    
    .left-section .brand-name {
      font-size: 1.8rem;
      font-weight: 700;
      background: linear-gradient(135deg, #11998e, #38ef7d);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 0.75rem 0;
    }
    
    .left-section .welcome-text {
      font-size: 1.3rem;
      font-weight: 600;
      color: #11998e;
      margin: 0;
    }
    
    /* Right Section: White Background with Form */
    .right-section {
      flex: 1;
      background: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      overflow-y: auto;
    }
    
    .login-form { display: flex; flex-direction: column; gap: 1.25rem; max-width: 450px; width: 100%; }
    .form-group { position: relative; display: flex; flex-direction: column; }
    .form-group.full-width { width: 100%; }
    .form-group label { font-weight: 600; margin-bottom: 0.75rem; color: #333; font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem; }
    .form-group label .icon { font-size: 1.1rem; }
    .form-group input { padding: 0.85rem 1rem; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 0.95rem; transition: all 0.3s ease; background: #f8f9fa; }
    .form-group input:focus { outline: none; border-color: #11998e; background: white; box-shadow: 0 0 0 4px rgba(17, 153, 142, 0.1); }
    .form-group input::placeholder { color: #aaa; }
    .input-underline { height: 2px; background: linear-gradient(90deg, #11998e, #38ef7d); transform: scaleX(0); transition: transform 0.3s ease; }
    .form-group input:focus + .input-underline { transform: scaleX(1); }
    .form-group.has-error input { border-color: #ff4444; background: #fff5f5; }
    .form-options { display: flex; justify-content: space-between; align-items: center; margin: -0.5rem 0; }
    .remember-me { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; user-select: none; font-size: 0.9rem; color: #666; }
    .remember-me input[type="checkbox"] { display: none; }
    .checkmark { width: 20px; height: 20px; border: 2px solid #ddd; border-radius: 4px; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; }
    .remember-me input:checked + .checkmark { background: linear-gradient(135deg, #11998e, #38ef7d); border-color: #11998e; }
    .remember-me input:checked + .checkmark::after { content: '✓'; color: white; font-size: 14px; font-weight: bold; }
    .forgot-password { color: #11998e; text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: color 0.2s; }
    .forgot-password:hover { color: #38ef7d; text-decoration: underline; }
    .btn-login { padding: 0.85rem 2rem; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); border: none; border-radius: 10px; color: white; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(17, 153, 142, 0.4); position: relative; overflow: hidden; width: 100%; }
    .btn-login::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); transition: left 0.5s; }
    .btn-login:hover::before { left: 100%; }
    .btn-login:hover { transform: translateY(-2px); box-shadow: 0 6px 25px rgba(17, 153, 142, 0.5); }
    .btn-login:active { transform: translateY(0); }
    .btn-login:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
    .loading-spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; margin-right: 0.5rem; }
    .alert-error { padding: 1rem; background: #fff5f5; border: 1px solid #ffdddd; border-left: 4px solid #ff4444; border-radius: 8px; color: #cc0000; font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem; animation: fadeInUp 0.3s ease-out; }
    .error-icon { font-size: 1.2rem; }
    .divider { position: relative; text-align: center; margin: 1.5rem 0; }
    .divider-small { position: relative; text-align: center; margin: 0.5rem 0; }
    .divider-small::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #e0e0e0; }
    .divider-small span { position: relative; background: rgba(255, 255, 255, 0.95); padding: 0 1rem; color: #999; font-size: 0.75rem; font-weight: 500; }
    .divider::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #e0e0e0; }
    .divider span { position: relative; background: rgba(255, 255, 255, 0.95); padding: 0 1rem; color: #999; font-size: 0.85rem; font-weight: 500; }
    .signup-link { text-align: center; color: #666; font-size: 0.95rem; }
    .signup-link a { color: #11998e; text-decoration: none; font-weight: 600; transition: color 0.2s; }
    .signup-link a:hover { color: #38ef7d; text-decoration: underline; }
    @media (max-width: 968px) { 
      .login-container { flex-direction: column; }
      .left-section { flex: 0 0 auto; min-height: 200px; }
      .right-section { padding: 2rem; }
    }
  `]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
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

