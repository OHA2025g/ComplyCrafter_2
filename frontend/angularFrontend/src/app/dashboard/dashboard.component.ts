import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../config/environment';
import { firstValueFrom } from 'rxjs';

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
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  events: CalendarEvent[] = [];
  loading = false;
  currentMonth = 'April 2025';
  weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  calendarDates: any[] = [];

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.generateCalendar();
  }

  async loadDashboardData(): Promise<void> {
    this.loading = true;
    try {
      const statsResponse: any = await firstValueFrom(
        this.http.get(`${environment.apiUrl}/dashboard/stats`)
      );
      this.stats = statsResponse;

      const eventsResponse: any = await firstValueFrom(
        this.http.get(`${environment.apiUrl}/dashboard/events`)
      );
      this.events = eventsResponse;
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
      this.stats = { clients_count: 0, meetings_count: 0 };
      this.events = [];
    } finally {
      this.loading = false;
    }
  }

  generateCalendar(): void {
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



