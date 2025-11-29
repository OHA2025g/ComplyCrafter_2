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
      <div class="background-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
      
      <div class="signup-card">
        <div class="signup-header">
          <div class="logo-container">
            <img src="/images/comply_crafter_logo.png" alt="ComplyCrafter Logo" class="logo" />
          </div>
          <h1>Join ComplyCrafter!</h1>
          <p>Create your account and start managing compliance</p>
        </div>

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

          <!-- Phone Number with OTP -->
          <div class="form-group" [class.has-error]="f['phoneNumber'].invalid && f['phoneNumber'].touched">
            <label for="phoneNumber">
              <span class="icon">📱</span>
              Phone Number
            </label>
            <div class="phone-input-group">
              <input 
                type="tel" 
                id="phoneNumber" 
                formControlName="phoneNumber"
                placeholder="Enter 10-digit phone number"
                maxlength="10"
                (input)="onPhoneInput($event)"
              />
              <button 
                type="button"
                class="btn-send-otp"
                (click)="sendOTP()"
                [disabled]="f['phoneNumber'].invalid || sendingOTP || otpCountdown > 0"
              >
                <span *ngIf="!sendingOTP && otpCountdown === 0">Send OTP</span>
                <span *ngIf="sendingOTP">Sending...</span>
                <span *ngIf="otpCountdown > 0">Resend ({{ formatCountdown(otpCountdown) }})</span>
              </button>
            </div>
            <div class="input-underline"></div>
            <div *ngIf="f['phoneNumber'].invalid && f['phoneNumber'].touched" class="error-message">
              <span class="error-icon">⚠️</span>
              Phone number must be exactly 10 digits
            </div>
            <div *ngIf="otpSent && !otpVerified" class="otp-info">
              <span class="info-icon">ℹ️</span>
              OTP sent! Please verify your phone number within 10 minutes.
            </div>
          </div>

          <!-- OTP Input -->
          <div class="form-group" *ngIf="otpSent && !otpVerified" [class.has-error]="f['otp'].invalid && f['otp'].touched">
            <label for="otp">
              <span class="icon">🔐</span>
              Enter OTP
              <span *ngIf="otpCountdown > 0" class="otp-timer">(Expires in {{ formatCountdown(otpCountdown) }})</span>
            </label>
            <input 
              type="text" 
              id="otp" 
              formControlName="otp"
              placeholder="Enter 6-digit OTP"
              maxlength="6"
              (input)="onOTPInput($event)"
            />
            <div class="input-underline"></div>
            <div *ngIf="f['otp'].invalid && f['otp'].touched" class="error-message">
              <span class="error-icon">⚠️</span>
              OTP must be 6 digits
            </div>
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

          <!-- Password -->
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

          <!-- CCPIN -->
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

          <!-- Confirm CCPIN -->
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

          <button 
            type="submit" 
            class="btn-signup"
            [disabled]="form.invalid || submitting || !otpVerified"
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
    .signup-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-radius: 24px; box-shadow: 0 30px 90px rgba(0, 0, 0, 0.4), 0 0 1px rgba(255, 255, 255, 0.5) inset; width: 100%; max-width: 520px; padding: 3rem 2.5rem; position: relative; z-index: 1; animation: fadeInUp 0.6s ease-out; max-height: 90vh; overflow-y: auto; }
    .signup-header { text-align: center; margin-bottom: 2rem; }
    .logo-container { margin-bottom: 1.5rem; }
    .logo { width: 90px; height: 90px; margin: 0 auto; filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15)); transition: transform 0.3s ease; }
    .logo:hover { transform: scale(1.05) rotate(5deg); }
    .signup-header h1 { font-size: 2.2rem; font-weight: 700; background: linear-gradient(135deg, #11998e, #38ef7d); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 0.5rem; }
    .signup-header p { color: #666; font-size: 0.95rem; }
    .signup-form { display: flex; flex-direction: column; gap: 1.2rem; }
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
    .phone-input-group { display: flex; gap: 0.5rem; }
    .phone-input-group input { flex: 1; }
    .btn-send-otp, .btn-verify-otp { padding: 1rem 1.5rem; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); border: none; border-radius: 12px; color: white; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; white-space: nowrap; }
    .btn-send-otp:hover:not(:disabled), .btn-verify-otp:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(17, 153, 142, 0.4); }
    .btn-send-otp:disabled, .btn-verify-otp:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-verify-otp { width: 100%; margin-top: 0.5rem; }
    .otp-info { margin-top: 0.5rem; padding: 0.75rem; background: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 8px; color: #1565c0; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; }
    .info-icon { font-size: 1rem; }
    .otp-timer { color: #ff9800; font-weight: 600; margin-left: auto; }
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
    @media (max-width: 640px) { .signup-card { padding: 2rem 1.5rem; } .signup-header h1 { font-size: 1.8rem; } .shape { display: none; } .phone-input-group { flex-direction: column; } }
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
