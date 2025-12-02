import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email = '';
  submitting = false;
  success = false;
  error?: string;

  constructor(private readonly authService: AuthService) {}

  async submit(): Promise<void> {
    this.submitting = true;
    this.error = undefined;

    try {
      await this.authService.requestPasswordReset(this.email);
      this.success = true;
    } catch (e: any) {
      this.error = e?.error?.detail || 'Failed to send reset email. Please try again.';
    } finally {
      this.submitting = false;
    }
  }
}
