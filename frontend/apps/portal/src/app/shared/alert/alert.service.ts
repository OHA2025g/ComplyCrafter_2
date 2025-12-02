import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface Alert {
  id: string;
  type: AlertType;
  message: string;
  title?: string;
  duration?: number; // Auto-dismiss after this many milliseconds (0 = don't auto-dismiss)
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new Subject<Alert>();
  public alerts$: Observable<Alert> = this.alertSubject.asObservable();

  private alertIdCounter = 0;

  /**
   * Show a success alert
   */
  success(message: string, title?: string, duration: number = 3000): void {
    this.show({
      id: this.generateId(),
      type: 'success',
      message,
      title: title || 'Success',
      duration
    });
  }

  /**
   * Show an error alert
   */
  error(message: string, title?: string, duration: number = 5000): void {
    this.show({
      id: this.generateId(),
      type: 'error',
      message,
      title: title || 'Error',
      duration
    });
  }

  /**
   * Show a warning alert
   */
  warning(message: string, title?: string, duration: number = 4000): void {
    this.show({
      id: this.generateId(),
      type: 'warning',
      message,
      title: title || 'Warning',
      duration
    });
  }

  /**
   * Show an info alert
   */
  info(message: string, title?: string, duration: number = 3000): void {
    this.show({
      id: this.generateId(),
      type: 'info',
      message,
      title: title || 'Info',
      duration
    });
  }

  /**
   * Show a custom alert
   */
  show(alert: Alert): void {
    this.alertSubject.next(alert);
  }

  private generateId(): string {
    return `alert-${Date.now()}-${++this.alertIdCounter}`;
  }
}

