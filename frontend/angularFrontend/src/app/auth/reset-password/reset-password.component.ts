import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  password = '';
  confirmPassword = '';
  submitting = false;
  success = false;
  error?: string;
  token: string | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.token = this.route.snapshot.queryParams['token'];
  }

  async submit(): Promise<void> {
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (this.password.length < 8) {
      this.error = 'Password must be at least 8 characters';
      return;
    }

    if (!this.token) {
      this.error = 'Invalid reset token';
      return;
    }

    this.submitting = true;
    this.error = undefined;

    try {
      await this.authService.resetPassword(this.token, this.password);
      this.success = true;
      setTimeout(() => this.router.navigate(['/login']), 2000);
    } catch (e: any) {
      this.error = e?.error?.detail || 'Failed to reset password. Please try again.';
    } finally {
      this.submitting = false;
    }
  }
}



