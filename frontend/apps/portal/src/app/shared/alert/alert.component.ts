import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService, Alert } from './alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="alert-container">
        <div
        *ngFor="let alert of alerts"
        [class]="'alert alert-' + alert.type"
        [attr.data-alert-id]="alert.id"
        (click)="dismiss(alert.id)"
      >
        <div class="alert-icon">
          <span *ngIf="alert.type === 'success'">✓</span>
          <span *ngIf="alert.type === 'error'">✕</span>
          <span *ngIf="alert.type === 'warning'">⚠</span>
          <span *ngIf="alert.type === 'info'">ℹ</span>
        </div>
        <div class="alert-content">
          <div class="alert-title" *ngIf="alert.title">{{ alert.title }}</div>
          <div class="alert-message">{{ alert.message }}</div>
        </div>
        <button class="alert-close" (click)="dismiss(alert.id); $event.stopPropagation()" title="Close">
          ✕
        </button>
      </div>
    </div>
  `,
  styles: [`
    .alert-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 400px;
      pointer-events: none;
    }

    .alert {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      pointer-events: auto;
      animation: slideInRight 0.3s ease-out;
      transition: transform 0.2s ease-out, opacity 0.2s ease-out;
    }

    .alert:hover {
      transform: translateX(-4px);
    }

    .alert-icon {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-size: 14px;
      font-weight: bold;
    }

    .alert-content {
      flex: 1;
      min-width: 0;
    }

    .alert-title {
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 4px;
    }

    .alert-message {
      font-size: 14px;
      line-height: 1.4;
      word-wrap: break-word;
    }

    .alert-close {
      flex-shrink: 0;
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      opacity: 0.6;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.2s;
    }

    .alert-close:hover {
      opacity: 1;
    }

    /* Success Alert */
    .alert-success {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
    }

    .alert-success .alert-icon {
      background: rgba(255, 255, 255, 0.2);
    }

    /* Error Alert */
    .alert-error {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
    }

    .alert-error .alert-icon {
      background: rgba(255, 255, 255, 0.2);
    }

    /* Warning Alert */
    .alert-warning {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
    }

    .alert-warning .alert-icon {
      background: rgba(255, 255, 255, 0.2);
    }

    /* Info Alert */
    .alert-info {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
    }

    .alert-info .alert-icon {
      background: rgba(255, 255, 255, 0.2);
    }

    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }

    .alert.dismissing {
      animation: slideOutRight 0.3s ease-out forwards;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .alert-container {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
      }

      .alert {
        padding: 12px;
      }
    }
  `]
})
export class AlertComponent implements OnInit, OnDestroy {
  private alertService = inject(AlertService);
  alerts: Alert[] = [];
  private subscription?: Subscription;
  private timers: Map<string, any> = new Map();

  ngOnInit(): void {
    this.subscription = this.alertService.alerts$.subscribe(alert => {
      this.alerts.push(alert);

      // Auto-dismiss if duration is set
      if (alert.duration && alert.duration > 0) {
        const timer = setTimeout(() => {
          this.dismiss(alert.id);
        }, alert.duration);
        this.timers.set(alert.id, timer);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
  }

  dismiss(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }

    const alert = this.alerts.find(a => a.id === id);
    if (alert) {
      // Add dismissing class for animation
      setTimeout(() => {
        const alertElement = document.querySelector(`[data-alert-id="${id}"]`);
        if (alertElement) {
          alertElement.classList.add('dismissing');
          setTimeout(() => {
            this.alerts = this.alerts.filter(a => a.id !== id);
          }, 300);
        } else {
          this.alerts = this.alerts.filter(a => a.id !== id);
        }
      }, 0);
    }
  }
}

