import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { interval, Subscription } from 'rxjs';

function ccpinMatchValidator(control: AbstractControl): ValidationErrors | null {
  const ccpin = control.get('ccpin');
  const confirmCcpin = control.get('confirmCcpin');
  if (!ccpin || !confirmCcpin) return null;
  return ccpin.value === confirmCcpin.value ? null : { ccpinMismatch: true };
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="signup-container">
      <!-- Left Section: Gradient Background with Logo -->
      <div class="left-section">
        <div class="logo-container">
          <img src="/images/comply_crafter_logo.png" alt="ComplyCrafter Logo" class="logo" />
          <h1 class="brand-name">ComplyCrafter</h1>
          <p class="welcome-text">Join ComplyCrafter!</p>
          <p class="welcome-subtext">Create your account and start managing compliance</p>
        </div>
      </div>
      
      <!-- Right Section: Signup Form -->
      <div class="right-section">

        <form [formGroup]="form" (ngSubmit)="submit()" class="signup-form">
          <!-- First Name -->
          <div class="form-group" [class.has-error]="f['firstName'].invalid && f['firstName'].touched">
            <label for="firstName">
              <span class="icon">👤</span>
              First Name
            </label>
            <input 
              type="text" 
              id="firstName" 
              formControlName="firstName"
              placeholder="Enter your first name"
            />
            <div class="input-underline"></div>
            <div *ngIf="f['firstName'].invalid && f['firstName'].touched" class="error-message">
              <span class="error-icon">⚠️</span>
              First name is required
            </div>
          </div>

          <!-- Last Name -->
          <div class="form-group" [class.has-error]="f['lastName'].invalid && f['lastName'].touched">
            <label for="lastName">
              <span class="icon">👤</span>
              Last Name
            </label>
            <input 
              type="text" 
              id="lastName" 
              formControlName="lastName"
              placeholder="Enter your last name"
            />
            <div class="input-underline"></div>
            <div *ngIf="f['lastName'].invalid && f['lastName'].touched" class="error-message">
              <span class="error-icon">⚠️</span>
              Last name is required
            </div>
          </div>

          <!-- Email -->
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

          <!-- Profession -->
          <div class="form-group" [class.has-error]="f['profession'].invalid && f['profession'].touched">
            <label for="profession">
              <span class="icon">💼</span>
              Profession
            </label>
            <input 
              type="text" 
              id="profession" 
              formControlName="profession"
              placeholder="Enter your profession"
            />
            <div class="input-underline"></div>
            <div *ngIf="f['profession'].invalid && f['profession'].touched" class="error-message">
              <span class="error-icon">⚠️</span>
              Profession is required
            </div>
          </div>

          <!-- Firm Name -->
          <div class="form-group" [class.has-error]="f['firmName'].invalid && f['firmName'].touched">
            <label for="firmName">
              <span class="icon">🏢</span>
              Firm Name
            </label>
            <input 
              type="text" 
              id="firmName" 
              formControlName="firmName"
              placeholder="Enter your firm name"
            />
            <div class="input-underline"></div>
            <div *ngIf="f['firmName'].invalid && f['firmName'].touched" class="error-message">
              <span class="error-icon">⚠️</span>
              Firm name is required
            </div>
          </div>

          <!-- Phone Number -->
          <div class="form-group" [class.has-error]="f['phoneNumber'].invalid && f['phoneNumber'].touched">
            <label for="phoneNumber">
              <span class="icon">📱</span>
              Phone Number
            </label>
            <input 
              type="tel" 
              id="phoneNumber" 
              formControlName="phoneNumber"
              placeholder="Enter 10-digit phone"
              maxlength="10"
              (input)="onPhoneInput($event)"
            />
            <div class="input-underline"></div>
            <div *ngIf="f['phoneNumber'].invalid && f['phoneNumber'].touched" class="error-message">
              <span class="error-icon">⚠️</span>
              Phone must be 10 digits
            </div>
          </div>

          <!-- OTP Button (centered, full width) -->
          <div class="form-group full-width otp-button-container">
            <button 
              type="button"
              class="btn-send-otp-center"
              (click)="sendOTP()"
              [disabled]="f['phoneNumber'].invalid || sendingOTP || otpCountdown > 0"
            >
              <span *ngIf="!sendingOTP && otpCountdown === 0">Send OTP</span>
              <span *ngIf="sendingOTP">Sending...</span>
              <span *ngIf="otpCountdown > 0">Resend ({{ formatCountdown(otpCountdown) }})</span>
            </button>
            <div *ngIf="otpSent && !otpVerified" class="otp-info">
              <span class="info-icon">ℹ️</span>
              OTP sent! Please verify your phone number within 10 minutes.
            </div>
          </div>

          <!-- OTP Input (if OTP sent) -->
          <div class="form-group full-width" *ngIf="otpSent && !otpVerified" [class.has-error]="f['otp'].invalid && f['otp'].touched">
            <label for="otp">
              <span class="icon">🔐</span>
              Enter OTP
              <span *ngIf="otpCountdown > 0" class="otp-timer">(Expires in {{ formatCountdown(otpCountdown) }})</span>
            </label>
            <div class="otp-verify-group">
              <input 
                type="text" 
                id="otp" 
                formControlName="otp"
                placeholder="Enter 6-digit OTP"
                maxlength="6"
                (input)="onOTPInput($event)"
              />
              <button 
                type="button"
                class="btn-verify-otp"
                (click)="verifyOTP()"
                [disabled]="f['otp'].invalid || verifyingOTP"
              >
                <span *ngIf="!verifyingOTP">Verify OTP</span>
                <span *ngIf="verifyingOTP">Verifying...</span>
              </button>
            </div>
            <div class="input-underline"></div>
            <div *ngIf="f['otp'].invalid && f['otp'].touched" class="error-message">
              <span class="error-icon">⚠️</span>
              OTP must be 6 digits
            </div>
          </div>

          <!-- Password (above OR) -->
          <div class="form-group full-width" [class.has-error]="f['password'].invalid && f['password'].touched">
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

          <!-- <div class="divider-small full-width">
            <span>OR</span>
          </div> -->

          <!-- CCPIN (below OR, inline) -->
          <div class="form-group" [class.has-error]="(f['ccpin'].invalid || form.hasError('ccpinMismatch')) && f['ccpin'].touched">
            <label for="ccpin">
              <span class="icon">🔑</span>
              Create CCPIN (4 digits)
            </label>
            <input 
              type="password" 
              id="ccpin" 
              formControlName="ccpin"
              placeholder="Enter 4-digit CCPIN"
              maxlength="4"
              (input)="onCcpinInput($event)"
            />
            <div class="input-underline"></div>
            <div *ngIf="f['ccpin'].invalid && f['ccpin'].touched" class="error-message">
              <span class="error-icon">⚠️</span>
              CCPIN must be exactly 4 digits
            </div>
          </div>

          <!-- Confirm CCPIN (inline with CCPIN) -->
          <div class="form-group" [class.has-error]="(f['confirmCcpin'].invalid || form.hasError('ccpinMismatch')) && f['confirmCcpin'].touched">
            <label for="confirmCcpin">
              <span class="icon">🔑</span>
              Confirm CCPIN
            </label>
            <input 
              type="password" 
              id="confirmCcpin" 
              formControlName="confirmCcpin"
              placeholder="Re-enter 4-digit CCPIN"
              maxlength="4"
              (input)="onCcpinInput($event)"
            />
            <div class="input-underline"></div>
            <div *ngIf="form.hasError('ccpinMismatch') && f['confirmCcpin'].touched" class="error-message">
              <span class="error-icon">⚠️</span>
              CCPINs do not match
            </div>
          </div>

          <div class="form-group full-width">
            <button 
              type="submit" 
              class="btn-signup"
              [disabled]="form.invalid || submitting || !otpVerified"
            >
              <span *ngIf="!submitting">Create Account</span>
              <span *ngIf="submitting" class="loading-spinner"></span>
              <span *ngIf="submitting">Creating account...</span>
            </button>
          </div>

          <div *ngIf="error" class="alert-error full-width">
            <span class="error-icon">⚠️</span>
            {{ error }}
          </div>

          <div *ngIf="success" class="alert-success full-width">
            <span class="success-icon">✓</span>
            Account created successfully! Redirecting to login...
          </div>

          <!-- <div class="divider full-width">
            <span>OR</span>
          </div> -->

          <div class="login-link full-width">
            Already have an account? 
            <a [routerLink]="['/login']">Sign in here →</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    
    .signup-container { min-height: 100vh; display: flex; overflow: hidden; }
    
    /* Left Section: Gradient Background with Logo */
    .left-section { flex: 0 0 35%; background: linear-gradient(180deg, #11998e 0%, #38ef7d 100%); display: flex; align-items: center; justify-content: center; padding: 2rem; position: relative; }
    .left-section .logo-container { text-align: center; background: white; padding: 2rem 2.5rem; border-radius: 20px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2); }
    .left-section .logo { width: 100px; height: 100px; margin: 0 auto 1rem; display: block; }
    .left-section .brand-name { font-size: 1.8rem; font-weight: 700; background: linear-gradient(135deg, #11998e, #38ef7d); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 0 0 0.75rem 0; }
    .left-section .welcome-text { font-size: 1.3rem; font-weight: 600; color: #11998e; margin: 0 0 0.5rem 0; }
    .left-section .welcome-subtext { font-size: 0.9rem; color: #666; margin: 0; }
    
    /* Right Section: White Background with Form */
    .right-section { flex: 1; background: white; display: flex; align-items: center; justify-content: center; padding: 2rem; overflow-y: auto; }
    .signup-form { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; max-width: 700px; width: 100%; }
    .form-group { position: relative; display: flex; flex-direction: column; }
    .form-group.full-width { grid-column: span 2; }
    .form-group label { font-weight: 600; margin-bottom: 0.25rem; color: #333; font-size: 0.85rem; display: flex; align-items: center; gap: 0.3rem; }
    .form-group label .icon { font-size: 1rem; }
    .form-group input { padding: 0.5rem 0.75rem; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 0.9rem; transition: all 0.3s ease; background: #f8f9fa; }
    .form-group input:focus { outline: none; border-color: #11998e; background: white; box-shadow: 0 0 0 4px rgba(17, 153, 142, 0.1); }
    .form-group input::placeholder { color: #aaa; }
    .input-underline { height: 2px; background: linear-gradient(90deg, #11998e, #38ef7d); transform: scaleX(0); transition: transform 0.3s ease; }
    .form-group input:focus + .input-underline { transform: scaleX(1); }
    .form-group.has-error input { border-color: #ff4444; background: #fff5f5; }
    .error-message { color: #ff4444; font-size: 0.75rem; margin-top: 0.25rem; display: flex; align-items: center; gap: 0.25rem; }
    .error-icon { font-size: 1rem; }
    .otp-button-container { display: flex; flex-direction: column; align-items: center; gap: 0.35rem; }
    .btn-send-otp-center { padding: 0.5rem 1.5rem; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); border: none; border-radius: 10px; color: white; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; white-space: nowrap; min-width: 180px; }
    .btn-send-otp-center:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(17, 153, 142, 0.4); }
    .btn-send-otp-center:disabled { opacity: 0.6; cursor: not-allowed; }
    .otp-verify-group { display: flex; gap: 0.5rem; width: 100%; }
    .otp-verify-group input { flex: 1; }
    .btn-verify-otp { padding: 0.5rem 1rem; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); border: none; border-radius: 10px; color: white; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; white-space: nowrap; }
    .btn-verify-otp:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(17, 153, 142, 0.4); }
    .btn-verify-otp:disabled { opacity: 0.6; cursor: not-allowed; }
    .otp-info { margin-top: 0.35rem; padding: 0.5rem; background: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 8px; color: #1565c0; font-size: 0.75rem; display: flex; align-items: center; gap: 0.4rem; width: 100%; }
    .info-icon { font-size: 1rem; }
    .otp-timer { color: #ff9800; font-weight: 600; margin-left: auto; }
    .btn-signup { padding: 0.6rem 2rem; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); border: none; border-radius: 10px; color: white; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(17, 153, 142, 0.4); position: relative; overflow: hidden; }
    .btn-signup::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); transition: left 0.5s; }
    .btn-signup:hover::before { left: 100%; }
    .btn-signup:hover { transform: translateY(-2px); box-shadow: 0 6px 25px rgba(17, 153, 142, 0.5); }
    .btn-signup:active { transform: translateY(0); }
    .btn-signup:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
    .loading-spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; margin-right: 0.5rem; }
    .alert-error { padding: 0.6rem; background: #fff5f5; border: 1px solid #ffdddd; border-left: 4px solid #ff4444; border-radius: 8px; color: #cc0000; font-size: 0.8rem; display: flex; align-items: center; gap: 0.4rem; animation: fadeInUp 0.3s ease-out; }
    .alert-success { padding: 0.6rem; background: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #22c55e; border-radius: 8px; color: #166534; font-size: 0.8rem; display: flex; align-items: center; gap: 0.4rem; animation: fadeInUp 0.3s ease-out; }
    .success-icon { font-size: 1.2rem; }
    .divider { position: relative; text-align: center; margin: 0.5rem 0; }
    .divider::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #e0e0e0; }
    .divider span { position: relative; background: rgba(255, 255, 255, 0.95); padding: 0 1rem; color: #999; font-size: 0.85rem; font-weight: 500; }
    .login-link { text-align: center; color: #666; font-size: 0.95rem; }
    .login-link a { color: #11998e; text-decoration: none; font-weight: 600; transition: color 0.2s; }
    .login-link a:hover { color: #38ef7d; text-decoration: underline; }
    .divider-small { position: relative; text-align: center; margin: 0.35rem 0; }
    .divider-small::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #e0e0e0; }
    .divider-small span { position: relative; background: rgba(255, 255, 255, 0.95); padding: 0 1rem; color: #999; font-size: 0.75rem; font-weight: 500; }
    @media (max-width: 968px) { 
      .signup-container { flex-direction: column; }
      .left-section { flex: 0 0 auto; min-height: 200px; }
      .right-section { padding: 1.5rem; }
      .signup-form { grid-template-columns: 1fr; }
    }
  `]
})
export class SignupComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  form: FormGroup = this.fb.group({
    firstName: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    lastName: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    email: [null, [Validators.required, Validators.email]],
    profession: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    firmName: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(200)]],
    phoneNumber: [null, [Validators.required, Validators.pattern(/^\d{10}$/)]],
    otp: [null, [Validators.pattern(/^\d{6}$/)]],
    password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(128)]],
    ccpin: [null, [Validators.required, Validators.pattern(/^\d{4}$/)]],
    confirmCcpin: [null, [Validators.required, Validators.pattern(/^\d{4}$/)]],
  }, { validators: ccpinMatchValidator });

  submitting = false;
  success = false;
  error?: string;
  otpSent = false;
  otpVerified = false;
  sendingOTP = false;
  verifyingOTP = false;
  otpCountdown = 0;
  private countdownSubscription?: Subscription;
  private readonly MOBILOGIC_TEMPLATE_GENERIC = '1207175405837058152';
  private readonly MOBILOGIC_TEMPLATE_NAMED = '1207175405379469327';

  private readonly API_BASE_URL = environment.apiUrl;

  get f() { return this.form.controls; }

  ngOnDestroy(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  onPhoneInput(event: any): void {
    const value = event.target.value.replace(/\D/g, '');
    this.form.patchValue({ phoneNumber: value }, { emitEvent: false });
  }

  onOTPInput(event: any): void {
    const value = event.target.value.replace(/\D/g, '');
    this.form.patchValue({ otp: value }, { emitEvent: false });
  }

  onCcpinInput(event: any): void {
    const value = event.target.value.replace(/\D/g, '');
    const controlName = event.target.id === 'ccpin' ? 'ccpin' : 'confirmCcpin';
    this.form.patchValue({ [controlName]: value }, { emitEvent: false });
  }

  async sendOTP(): Promise<void> {
    if (this.f['phoneNumber'].invalid) {
      this.f['phoneNumber'].markAsTouched();
      return;
    }

    this.sendingOTP = true;
    this.error = undefined;

    try {
      const recipientName = this.buildRecipientName();
      const templateId = recipientName ? this.MOBILOGIC_TEMPLATE_NAMED : this.MOBILOGIC_TEMPLATE_GENERIC;
      const payload: { phone_number: string; template_id: string; name?: string } = {
        phone_number: this.form.value.phoneNumber,
        template_id: templateId
      };
      if (recipientName) {
        payload.name = recipientName;
      }

      await this.http.post(`${this.API_BASE_URL}/auth/send-otp`, {
        ...payload
      }).toPromise();
      
      this.otpSent = true;
      this.otpCountdown = 600; // 10 minutes in seconds
      this.startCountdown();
    } catch (e: any) {
      this.error = e?.error?.detail || 'Failed to send OTP. Please try again.';
    } finally {
      this.sendingOTP = false;
    }
  }

  async verifyOTP(): Promise<void> {
    if (this.f['otp'].invalid) {
      this.f['otp'].markAsTouched();
      return;
    }

    this.verifyingOTP = true;
    this.error = undefined;

    try {
      await this.http.post(`${this.API_BASE_URL}/auth/verify-otp`, {
        phone_number: this.form.value.phoneNumber,
        otp: this.form.value.otp
      }).toPromise();
      
      this.otpVerified = true;
      if (this.countdownSubscription) {
        this.countdownSubscription.unsubscribe();
      }
    } catch (e: any) {
      this.error = e?.error?.detail || 'Invalid OTP. Please try again.';
    } finally {
      this.verifyingOTP = false;
    }
  }

  startCountdown(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
    this.countdownSubscription = interval(1000).subscribe(() => {
      if (this.otpCountdown > 0) {
        this.otpCountdown--;
      } else {
        if (this.countdownSubscription) {
          this.countdownSubscription.unsubscribe();
        }
      }
    });
  }

  formatCountdown(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  private buildRecipientName(): string | undefined {
    const first = (this.form.value.firstName || '').trim();
    const last = (this.form.value.lastName || '').trim();
    const full = `${first} ${last}`.trim();
    return full.length ? full : undefined;
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.otpVerified) {
      this.error = 'Please verify your phone number with OTP before signing up.';
      return;
    }

    this.submitting = true;
    this.success = false;
    this.error = undefined;

    try {
      const signupData = {
        email: this.form.value.email,
        password: this.form.value.password,
        first_name: this.form.value.firstName,
        last_name: this.form.value.lastName,
        profession: this.form.value.profession,
        firm_name: this.form.value.firmName,
        phone_number: this.form.value.phoneNumber,
        ccpin: this.form.value.ccpin,
        confirm_ccpin: this.form.value.confirmCcpin,
      };

      await this.http.post(`${this.API_BASE_URL}/auth/signup`, signupData).toPromise();
      this.success = true;
      setTimeout(() => this.router.navigate(['/login']), 1500);
    } catch (e: any) {
      this.error = e?.error?.detail || 'Signup failed. Please try again.';
    } finally {
      this.submitting = false;
    }
  }
}
