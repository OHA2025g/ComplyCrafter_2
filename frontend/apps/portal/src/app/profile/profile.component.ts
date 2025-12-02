import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SubscriptionService, SubscriptionStatus, SubscriptionPlan } from '../services/subscription.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <div>
          <h1 class="profile-title">User Profile</h1>
          <p class="profile-subtitle">Manage your account and subscription</p>
        </div>
        <button routerLink="/dashboard" class="btn-back">
          ← Back to Dashboard
        </button>
      </div>

      <!-- Tabs Navigation -->
      <div class="tabs-container">
        <button 
          class="tab-button" 
          [class.active]="activeTab === 'account'"
          (click)="activeTab = 'account'">
          <span class="tab-icon">👤</span>
          Account Information
        </button>
        <button 
          class="tab-button" 
          [class.active]="activeTab === 'subscription'"
          (click)="activeTab = 'subscription'">
          <span class="tab-icon">💳</span>
          Subscription
          <span *ngIf="subscriptionStatus?.requires_subscription" class="tab-badge">!</span>
        </button>
      </div>

      <!-- Account Information Tab -->
      <div class="tab-content" *ngIf="activeTab === 'account'">
        <div class="info-card">
          <div class="card-header">
            <h2>Account Information</h2>
          </div>
          <div class="card-body">
            <div class="info-row">
              <span class="info-label">Name:</span>
              <span class="info-value">{{ getUserFullName() }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">{{ user?.email || 'N/A' }}</span>
            </div>
            <div class="info-row" *ngIf="user?.created_at">
              <span class="info-label">Member Since:</span>
              <span class="info-value">{{ formatDate(user.created_at) }}</span>
            </div>
            <div class="info-row" *ngIf="user?.profession">
              <span class="info-label">Profession:</span>
              <span class="info-value">{{ user.profession }}</span>
            </div>
            <div class="info-row" *ngIf="user?.firm_name">
              <span class="info-label">Firm Name:</span>
              <span class="info-value">{{ user.firm_name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Subscription Tab -->
      <div class="tab-content" *ngIf="activeTab === 'subscription'">
        <!-- Current Subscription Status Card -->
        <div class="info-card subscription-card">
          <div class="card-header">
            <h2>Current Subscription Status</h2>
            <span class="status-badge" [class]="getStatusClass()">
              {{ getStatusLabel() }}
            </span>
          </div>
          <div class="card-body">
            <div *ngIf="loading" class="loading">Loading subscription status...</div>
            
            <div *ngIf="!loading && subscriptionStatus">
              <div class="subscription-info">
                <div class="info-row">
                  <span class="info-label">Plan:</span>
                  <span class="info-value plan-name">
                    {{ subscriptionStatus.subscription_plan ? capitalize(subscriptionStatus.subscription_plan) : 'Trial' }}
                  </span>
                </div>
                
                <!-- Trial Status -->
                <div *ngIf="subscriptionStatus.is_trial_active" class="trial-status-box">
                  <div class="trial-header">
                    <span class="trial-icon">⏰</span>
                    <strong>Trial Period Active</strong>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Trial Days Remaining:</span>
                    <span class="info-value highlight large">
                      {{ subscriptionStatus.days_remaining_in_trial }} days
                    </span>
                  </div>
                  <div class="info-row" *ngIf="subscriptionStatus.trial_ends_at">
                    <span class="info-label">Trial Ends On:</span>
                    <span class="info-value">{{ formatDate(subscriptionStatus.trial_ends_at) }}</span>
                  </div>
                </div>

                <!-- Trial Expired Warning -->
                <div class="warning-box expired" *ngIf="subscriptionStatus.requires_subscription && !subscriptionStatus.is_trial_active">
                  <div class="warning-header">
                    <span class="warning-icon">⚠️</span>
                    <strong>Trial Period Ended</strong>
                  </div>
                  <p>Your 14-day trial period has ended on {{ formatDate(subscriptionStatus.trial_ends_at) }}.</p>
                  <p class="warning-action">Please select a subscription plan below to continue using ComplyCrafter.</p>
                </div>

                <!-- Active Subscription Info -->
                <div *ngIf="subscriptionStatus.is_subscription_active && !subscriptionStatus.is_trial_active" class="active-subscription-box">
                  <div class="active-header">
                    <span class="active-icon">✓</span>
                    <strong>Active Subscription</strong>
                  </div>
                  <div class="info-row" *ngIf="subscriptionStatus.subscription_expires_at">
                    <span class="info-label">Subscription Expires:</span>
                    <span class="info-value">{{ formatDate(subscriptionStatus.subscription_expires_at) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div *ngIf="!loading && !subscriptionStatus" class="error-message">
              Failed to load subscription status. Please try again.
            </div>
          </div>
        </div>

        <!-- Available Subscription Plans -->
        <div class="info-card plans-card">
          <div class="card-header">
            <h2>Choose Your Subscription Plan</h2>
            <p class="card-subtitle">Select the plan that best fits your compliance needs</p>
          </div>
          <div class="card-body">
            <div class="plans-grid">
              <div 
                *ngFor="let plan of availablePlans" 
                class="plan-card"
                [class.popular]="plan.popular"
                [class.current-plan]="isCurrentPlan(plan.id)">
                <div class="plan-badge" *ngIf="plan.popular">Most Popular</div>
                <div class="current-badge" *ngIf="isCurrentPlan(plan.id)">Current Plan</div>
                
                <div class="plan-header">
                  <h3 class="plan-name">{{ plan.name }}</h3>
                  <div class="plan-price">
                    <span class="currency">₹</span>
                    <span class="amount">{{ formatPrice(plan.price) }}</span>
                    <span class="period">/{{ plan.period }}</span>
                  </div>
                </div>

                <ul class="plan-features">
                  <li *ngFor="let feature of plan.features">
                    <span class="check-icon">✓</span>
                    {{ feature }}
                  </li>
                </ul>

                <button 
                  class="btn-select-plan"
                  [class.btn-current]="isCurrentPlan(plan.id)"
                  [disabled]="isCurrentPlan(plan.id) || processing"
                  (click)="selectPlan(plan.id)">
                  <span *ngIf="!processing || selectedPlanId !== plan.id">
                    {{ isCurrentPlan(plan.id) ? 'Current Plan' : 'Subscribe Now' }}
                  </span>
                  <span *ngIf="processing && selectedPlanId === plan.id" class="spinner">
                    Processing...
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .profile-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .profile-title {
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
    }

    .profile-subtitle {
      color: #6c757d;
      font-size: 1rem;
      margin-top: 0.5rem;
    }

    .btn-back {
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      border: 2px solid #667eea;
      background: transparent;
      color: #667eea;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-back:hover {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      transform: translateY(-2px);
    }

    /* Tabs */
    .tabs-container {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      border-bottom: 2px solid #e0e0e0;
    }

    .tab-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      background: transparent;
      border: none;
      border-bottom: 3px solid transparent;
      color: #6c757d;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
    }

    .tab-button:hover {
      color: #667eea;
      background: rgba(102, 126, 234, 0.05);
    }

    .tab-button.active {
      color: #667eea;
      border-bottom-color: #667eea;
      background: rgba(102, 126, 234, 0.05);
    }

    .tab-icon {
      font-size: 1.2rem;
    }

    .tab-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #ef4444;
      color: white;
      font-size: 0.75rem;
      font-weight: 700;
      margin-left: 0.5rem;
    }

    .tab-content {
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .info-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
      overflow: hidden;
      margin-bottom: 2rem;
    }

    .card-header {
      padding: 1.5rem 2rem;
      border-bottom: 2px solid #f0f0f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-header h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #2c3e50;
      margin: 0;
    }

    .card-subtitle {
      color: #6c757d;
      font-size: 0.9rem;
      margin: 0.5rem 0 0 0;
    }

    .card-body {
      padding: 2rem;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .info-label {
      font-weight: 600;
      color: #6c757d;
    }

    .info-value {
      color: #2c3e50;
      font-weight: 500;
    }

    .info-value.highlight {
      color: #667eea;
      font-weight: 700;
    }

    .info-value.highlight.large {
      font-size: 1.5rem;
    }

    .plan-name {
      text-transform: capitalize;
      font-weight: 700;
    }

    .status-badge {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.trial {
      background: #e3f2fd;
      color: #1976d2;
    }

    .status-badge.active {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .status-badge.expired {
      background: #ffebee;
      color: #c62828;
    }

    /* Trial Status Box */
    .trial-status-box {
      margin-top: 1rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
      border-radius: 12px;
      border-left: 4px solid #1976d2;
    }

    .trial-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      font-size: 1.1rem;
      color: #1976d2;
    }

    .trial-icon {
      font-size: 1.5rem;
    }

    /* Warning Box */
    .warning-box {
      margin-top: 1.5rem;
      padding: 1.5rem;
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      border-radius: 8px;
    }

    .warning-box.expired {
      background: #ffebee;
      border-left-color: #ef4444;
    }

    .warning-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      color: #856404;
      font-size: 1.1rem;
    }

    .warning-box.expired .warning-header {
      color: #c62828;
    }

    .warning-icon {
      font-size: 1.5rem;
    }

    .warning-box p {
      margin: 0.5rem 0;
      color: #856404;
      font-size: 0.95rem;
    }

    .warning-box.expired p {
      color: #c62828;
    }

    .warning-action {
      font-weight: 600;
      margin-top: 0.75rem !important;
    }

    /* Active Subscription Box */
    .active-subscription-box {
      margin-top: 1rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
      border-radius: 12px;
      border-left: 4px solid #2e7d32;
    }

    .active-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      font-size: 1.1rem;
      color: #2e7d32;
    }

    .active-icon {
      font-size: 1.5rem;
      color: #2e7d32;
    }

    .plans-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-top: 1rem;
    }

    .plan-card {
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: 16px;
      padding: 2rem;
      position: relative;
      transition: all 0.3s ease;
    }

    .plan-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    }

    .plan-card.popular {
      border-color: #667eea;
      border-width: 3px;
    }

    .plan-card.current-plan {
      border-color: #22c55e;
      background: #f0fdf4;
    }

    .plan-badge {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 0.5rem 1.5rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    .current-badge {
      position: absolute;
      top: -12px;
      right: 1rem;
      background: #22c55e;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .plan-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .plan-header .plan-name {
      font-size: 1.75rem;
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    .plan-price {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 0.25rem;
    }

    .currency {
      font-size: 1.25rem;
      color: #6c757d;
    }

    .amount {
      font-size: 2.5rem;
      font-weight: 800;
      color: #2c3e50;
    }

    .period {
      font-size: 1rem;
      color: #6c757d;
    }

    .plan-features {
      list-style: none;
      padding: 0;
      margin: 0 0 2rem 0;
    }

    .plan-features li {
      padding: 0.75rem 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #2c3e50;
    }

    .check-icon {
      color: #22c55e;
      font-weight: 700;
      font-size: 1.2rem;
    }

    .btn-select-plan {
      width: 100%;
      padding: 1rem;
      border-radius: 12px;
      border: none;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-select-plan:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .btn-select-plan:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-select-plan.btn-current {
      background: #22c55e;
    }

    .loading, .error-message {
      text-align: center;
      padding: 2rem;
      color: #6c757d;
    }

    .error-message {
      color: #ef4444;
    }

    .spinner {
      display: inline-block;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    @media (max-width: 768px) {
      .profile-container {
        padding: 1rem;
      }
      .tabs-container {
        flex-direction: column;
      }
      .tab-button {
        width: 100%;
        justify-content: center;
      }
      .plans-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private subscriptionService = inject(SubscriptionService);

  activeTab: 'account' | 'subscription' = 'account';
  user: any = null;
  subscriptionStatus: SubscriptionStatus | null = null;
  availablePlans: SubscriptionPlan[] = [];
  loading = false;
  processing = false;
  selectedPlanId: string | null = null;

  ngOnInit(): void {
    this.loadUserData();
    this.loadSubscriptionStatus();
    this.availablePlans = this.subscriptionService.getAvailablePlans();
    
    // Auto-switch to subscription tab if trial expired
    this.checkTrialStatus();
  }

  loadUserData(): void {
    this.user = this.authService.getCurrentUser();
  }

  async loadSubscriptionStatus(): Promise<void> {
    this.loading = true;
    try {
      const userId = this.user?.id;
      if (!userId) {
        console.error('User ID not found');
        return;
      }

      this.subscriptionStatus = await this.subscriptionService.getSubscriptionStatus(+userId).toPromise() || null;
    } catch (error) {
      console.error('Failed to load subscription status:', error);
    } finally {
      this.loading = false;
    }
  }

  checkTrialStatus(): void {
    // Check if trial has expired and switch to subscription tab
    setTimeout(() => {
      if (this.subscriptionStatus?.requires_subscription && !this.subscriptionStatus.is_trial_active) {
        this.activeTab = 'subscription';
      }
    }, 500);
  }

  async selectPlan(planId: string): Promise<void> {
    if (this.processing) return;

    this.processing = true;
    this.selectedPlanId = planId;

    try {
      const userId = this.user?.id;
      if (!userId) {
        console.error('User ID not found');
        return;
      }

      await this.subscriptionService.selectPlan(planId, +userId).toPromise();
      
      // Reload subscription status
      await this.loadSubscriptionStatus();
      
      // Show success message
      alert(`Successfully subscribed to ${this.capitalize(planId)} plan!`);
    } catch (error: any) {
      console.error('Failed to select plan:', error);
      alert(`Failed to subscribe: ${error?.error?.detail || error?.message || 'Unknown error'}`);
    } finally {
      this.processing = false;
      this.selectedPlanId = null;
    }
  }

  isCurrentPlan(planId: string): boolean {
    return this.subscriptionStatus?.subscription_plan === planId;
  }

  getStatusLabel(): string {
    if (!this.subscriptionStatus) return 'Unknown';
    if (this.subscriptionStatus.is_trial_active) return 'Trial';
    if (this.subscriptionStatus.is_subscription_active) return 'Active';
    return 'Expired';
  }

  getStatusClass(): string {
    if (!this.subscriptionStatus) return 'status-badge';
    if (this.subscriptionStatus.is_trial_active) return 'status-badge trial';
    if (this.subscriptionStatus.is_subscription_active) return 'status-badge active';
    return 'status-badge expired';
  }

  getUserFullName(): string {
    if (this.user?.first_name && this.user?.last_name) {
      return `${this.user.first_name} ${this.user.last_name}`;
    } else if (this.user?.first_name) {
      return this.user.first_name;
    } else if (this.user?.username) {
      return this.user.username;
    }
    return 'N/A';
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN').format(price);
  }

  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
