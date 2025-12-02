import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface SubscriptionStatus {
  subscription_status: string;
  subscription_plan: string | null;
  trial_ends_at: string | null;
  subscription_expires_at: string | null;
  requires_subscription: boolean;
  days_remaining_in_trial: number | null;
  is_trial_active: boolean;
  is_subscription_active: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private readonly http = inject(HttpClient);
  private readonly API_BASE_URL = environment.apiUrl;

  /**
   * Get subscription status for a user
   */
  getSubscriptionStatus(userId: number): Observable<SubscriptionStatus> {
    return this.http.get<SubscriptionStatus>(
      `${this.API_BASE_URL}/subscription/status`,
      {
        params: { user_id: userId.toString() }
      }
    );
  }

  /**
   * Select a subscription plan
   */
  selectPlan(planId: string, userId: number): Observable<any> {
    return this.http.post(
      `${this.API_BASE_URL}/subscription/select-plan`,
      { plan: planId },
      {
        params: { user_id: userId.toString() }
      }
    );
  }

  /**
   * Cancel subscription
   */
  cancelSubscription(userId: number): Observable<any> {
    return this.http.post(
      `${this.API_BASE_URL}/subscription/cancel`,
      {},
      {
        params: { user_id: userId.toString() }
      }
    );
  }

  /**
   * Get available subscription plans with pricing
   */
  getAvailablePlans(): SubscriptionPlan[] {
    return [
      {
        id: 'starter',
        name: 'Starter',
        price: 999,
        period: 'month',
        features: [
          'Up to 3 active companies',
          'Access to 20 core ROC forms',
          'Basic company search',
          'Email support',
          'Standard compliance features'
        ]
      },
      {
        id: 'professional',
        name: 'Professional',
        price: 1999,
        period: 'month',
        popular: true,
        features: [
          'Unlimited companies',
          'All 62 ROC forms',
          'Meetings & agendas module',
          'Advanced company search',
          'Priority email & phone support',
          'Capital structure management',
          'Shareholder management',
          'Directors & KMP management'
        ]
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 4999,
        period: 'month',
        features: [
          'Everything in Professional',
          'Custom onboarding',
          'Dedicated account manager',
          'Advanced reporting & analytics',
          'API access',
          'Custom integrations',
          '24/7 priority support',
          'SLA guarantee'
        ]
      }
    ];
  }
}

