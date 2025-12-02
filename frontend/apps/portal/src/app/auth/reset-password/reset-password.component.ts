import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
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


