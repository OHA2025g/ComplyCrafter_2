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
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly http: HttpClient = inject(HttpClient);
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
