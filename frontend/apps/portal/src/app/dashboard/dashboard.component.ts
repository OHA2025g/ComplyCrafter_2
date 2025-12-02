import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';

interface DashboardStats {
  clients_count: number;
  meetings_count: number;
}

interface CalendarEvent {
  id: number;
  title: string;
  start_date: string;
  end_date?: string;
  start_time?: string;
  is_all_day: boolean;
  is_repeating: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly API_BASE_URL = environment.apiUrl;

  stats: DashboardStats | null = null;
  events: CalendarEvent[] = [];
  loading = false;

  currentMonth = 'April 2025';
  weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  calendarDates: any[] = [];

  ngOnInit(): void {
    this.loadDashboardData();
    this.generateCalendar();
  }

  async loadDashboardData(): Promise<void> {
    this.loading = true;
    try {
      // Load stats
      const statsResponse: any = await this.http.get(
        `${this.API_BASE_URL}/dashboard/stats`
      ).toPromise();
      this.stats = statsResponse;

      // Load events
      const eventsResponse: any = await this.http.get(
        `${this.API_BASE_URL}/dashboard/events`
      ).toPromise();
      this.events = eventsResponse;

    } catch (e) {
      console.error('Failed to load dashboard data:', e);
      // Use default values if API fails
      this.stats = { clients_count: 0, meetings_count: 0 };
      this.events = [];
    } finally {
      this.loading = false;
    }
  }

  generateCalendar(): void {
    // Generate calendar dates for current month
    // This is a simplified version - you can enhance it
    this.calendarDates = [];
    const today = new Date();
    
    for (let i = 0; i < 35; i++) {
      this.calendarDates.push({
        day: (i % 30) + 1,
        isCurrentMonth: true,
        isToday: i === 12,
        events: []
      });
    }
  }

  goToToday(): void {
    this.currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    this.generateCalendar();
  }

  previousMonth(): void {
    // Navigate to previous month
  }

  nextMonth(): void {
    // Navigate to next month
  }
}
