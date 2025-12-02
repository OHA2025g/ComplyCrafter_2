import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Import as raw for Vite compatibility
import template from './subscription-plans.component.html?raw';
import styles from './subscription-plans.component.scss?inline';

@Component({
  selector: 'app-subscription-plans',
  standalone: true,
  imports: [CommonModule],
  template,
  styles: [styles]
})
export class SubscriptionPlansComponent {
  private router = inject(Router);

  selectPlan(planType: string): void {
    console.log('Selected plan:', planType);
    alert(`You selected the ${planType} plan. Payment integration coming soon!`);
  }

  contactSales(): void {
    console.log('Contact sales clicked');
    alert('Contact Sales: sales@complycrafter.com or call +91-1234567890');
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }
}

