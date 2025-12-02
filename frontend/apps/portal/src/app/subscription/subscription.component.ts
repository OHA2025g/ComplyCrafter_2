import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

interface PlanCard {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlight?: boolean;
}

@Component({
  standalone: true,
  selector: 'cc-subscription',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col">
      <header class="w-full border-b bg-white">
        <div class="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-xl font-semibold text-slate-800">ComplyCrafter</span>
            <span class="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
              14-day trial ended
            </span>
          </div>
          <button
            type="button"
            class="text-sm text-slate-600 hover:text-slate-900 underline underline-offset-2"
            (click)="goBackToApp()"
          >
            Continue in limited mode
          </button>
        </div>
      </header>

      <main class="flex-1">
        <section class="mx-auto max-w-6xl px-4 py-10">
          <div class="max-w-3xl">
            <h1 class="text-3xl font-bold text-slate-900 mb-2">
              Choose a plan to keep using ComplyCrafter
            </h1>
            <p class="text-slate-600">
              Your 14-day trial has expired. Select a subscription to keep creating and managing compliance forms.
            </p>
          </div>

          <div class="mt-8 grid gap-6 md:grid-cols-3">
            <article
              *ngFor="let plan of plans"
              class="relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm"
              [ngClass]="{
                'border-emerald-500 ring-2 ring-emerald-200': plan.highlight,
                'border-slate-200': !plan.highlight
              }"
            >
              <div class="mb-4 flex items-center justify-between">
                <h2 class="text-lg font-semibold text-slate-900">{{ plan.name }}</h2>
                <span
                  *ngIf="plan.highlight"
                  class="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-emerald-700"
                >
                  Most Popular
                </span>
              </div>

              <div class="mb-4">
                <div class="flex items-baseline gap-1">
                  <span class="text-3xl font-bold text-slate-900">{{ plan.price }}</span>
                  <span class="text-sm text-slate-500">/{{ plan.period }}</span>
                </div>
              </div>

              <ul class="mb-6 space-y-2 text-sm text-slate-600">
                <li *ngFor="let f of plan.features" class="flex items-start gap-2">
                  <span class="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span>{{ f }}</span>
                </li>
              </ul>

              <button
                type="button"
                class="mt-auto w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors"
                [ngClass]="{
                  'bg-emerald-600 text-white hover:bg-emerald-700': plan.highlight,
                  'bg-slate-900 text-white hover:bg-slate-800': !plan.highlight
                }"
                (click)="selectPlan(plan)"
              >
                Select {{ plan.name }}
              </button>
            </article>
          </div>
        </section>
      </main>
    </div>
  `,
})
export class SubscriptionComponent {
  plans: PlanCard[] = [
    {
      name: 'Starter',
      price: '₹999',
      period: 'month',
      features: [
        'Up to 3 active companies',
        'Access to 20 core ROC forms',
        'Email support',
      ],
    },
    {
      name: 'Professional',
      price: '₹1,999',
      period: 'month',
      highlight: true,
      features: [
        'Unlimited companies',
        'All 62 ROC forms',
        'Meetings & agendas module',
        'Priority email & phone support',
      ],
    },
    {
      name: 'Enterprise',
      price: 'Contact us',
      period: 'year',
      features: [
        'Custom onboarding',
        'Dedicated account manager',
        'Advanced reporting & APIs',
      ],
    },
  ];

  constructor(private readonly router: Router) {}

  selectPlan(plan: PlanCard): void {
    // Placeholder: In a real app this would go to a payment/upgrade flow
    console.log('Selected plan:', plan.name);
    // For now, just navigate back to dashboard
    this.router.navigate(['/dashboard']);
  }

  goBackToApp(): void {
    this.router.navigate(['/dashboard']);
  }
}


