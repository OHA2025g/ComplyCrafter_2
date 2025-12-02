import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
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


