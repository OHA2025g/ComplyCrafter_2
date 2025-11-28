import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logout-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="!isLoading && onCancel()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-icon">🚪</div>
          <h2>Logout</h2>
        </div>
        
        <div class="modal-body">
          <div *ngIf="!isLoading">
            <p>Do you want to logout?</p>
          </div>
          <div *ngIf="isLoading" class="loading-container">
            <div class="spinner"></div>
            <p class="loading-text">Logging out...</p>
          </div>
        </div>
        
        <div class="modal-footer" *ngIf="!isLoading">
          <button class="btn-no" (click)="onCancel()">
            No
          </button>
          <button class="btn-yes" (click)="onConfirm()">
            Yes
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .modal-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      max-width: 450px;
      width: 90%;
      animation: slideUp 0.3s ease-out;
      border: 1px solid #e0e0e0;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-header {
      padding: 2rem 2rem 1rem;
      text-align: center;
      border-bottom: 1px solid #e9ecef;
    }

    .modal-icon {
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: #333;
    }

    .modal-body {
      padding: 1.5rem 2rem;
      text-align: center;
    }

    .modal-body p {
      margin: 0;
      font-size: 1.1rem;
      color: #666;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1rem 0;
      gap: 1.5rem;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #dc3545;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-text {
      margin: 0;
      font-size: 1rem;
      color: #666;
      font-weight: 500;
    }

    .modal-footer {
      padding: 1rem 2rem 2rem;
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .btn-yes,
    .btn-no {
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 100px;
    }

    .btn-yes {
      background: #dc3545;
      color: white;
    }

    .btn-yes:hover {
      background: #c82333;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
    }

    .btn-yes:active {
      transform: translateY(0);
    }

    .btn-no {
      background: #5dade2;
      color: white;
    }

    .btn-no:hover {
      background: #3498db;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(93, 173, 226, 0.3);
    }

    .btn-no:active {
      transform: translateY(0);
    }

    @media (max-width: 480px) {
      .modal-container {
        width: 95%;
      }

      .modal-header,
      .modal-body,
      .modal-footer {
        padding-left: 1.5rem;
        padding-right: 1.5rem;
      }

      .modal-footer {
        flex-direction: column;
      }

      .btn-yes,
      .btn-no {
        width: 100%;
      }
    }
  `]
})
export class LogoutModalComponent {
  @Input() isLoading = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    if (!this.isLoading) {
      this.cancel.emit();
    }
  }
}

