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
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <div>
          <h1 class="dashboard-title">Dashboard</h1>
          <p class="dashboard-subtitle">Welcome back! Here's your overview</p>
        </div>
        <div class="header-actions">
          <button class="btn-beautiful btn-outline">
            <span>📊</span> Export Report
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card stat-clients">
          <div class="stat-background"></div>
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-label">Total Clients</div>
            <div class="stat-value">{{ stats?.clients_count || 0 }}</div>
            <div class="stat-change positive">↑ 12% from last month</div>
          </div>
        </div>

        <div class="stat-card stat-meetings">
          <div class="stat-background"></div>
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-label">Meetings Scheduled</div>
            <div class="stat-value">{{ stats?.meetings_count || 0 }}</div>
            <div class="stat-change neutral">This month</div>
          </div>
        </div>
        
        <div class="stat-card stat-forms">
          <div class="stat-background"></div>
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-label">Forms Available</div>
            <div class="stat-value">62</div>
            <div class="stat-change positive">All Active</div>
          </div>
        </div>
        
        <div class="stat-card stat-compliance">
          <div class="stat-background"></div>
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-label">Compliance Rate</div>
            <div class="stat-value">98%</div>
            <div class="stat-change positive">↑ 3% this week</div>
          </div>
        </div>
      </div>

      <!-- Calendar Section -->
      <div class="calendar-section">
        <div class="calendar-header">
          <h2>{{ currentMonth }}</h2>
          <div class="calendar-controls">
            <button (click)="goToToday()" class="btn-today">today</button>
            <button (click)="previousMonth()" class="btn-nav">◀</button>
            <button (click)="nextMonth()" class="btn-nav">▶</button>
          </div>
        </div>

        <div class="calendar-grid">
          <div class="calendar-day-header" *ngFor="let day of weekDays">{{ day }}</div>
          
          <div *ngFor="let date of calendarDates" 
               class="calendar-date"
               [class.other-month]="!date.isCurrentMonth"
               [class.today]="date.isToday">
            <span class="date-number">{{ date.day }}</span>
            <div class="events-list">
              <div *ngFor="let event of date.events" 
                   class="event-item"
                   [class.all-day]="event.is_all_day">
                <span class="event-time" *ngIf="event.start_time && !event.is_all_day">
                  {{ event.start_time }}
                </span>
                {{ event.title }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="loading" class="loading">Loading dashboard data...</div>
    </div>
  `,
  styles: [`
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
    @keyframes countUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    
    .dashboard-container { padding: 2rem; max-width: 1400px; margin: 0 auto; animation: fadeInUp 0.5s ease-out; }
    .dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .dashboard-title { font-size: 2.5rem; font-weight: 700; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 0; }
    .dashboard-subtitle { color: #6c757d; font-size: 1rem; margin-top: 0.5rem; }
    .header-actions { display: flex; gap: 1rem; }
    .btn-beautiful { padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 600; border: none; cursor: pointer; transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 0.5rem; }
    .btn-outline { background: transparent; border: 2px solid #667eea; color: #667eea; }
    .btn-outline:hover { background: linear-gradient(135deg, #667eea, #764ba2); color: white; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); }
    
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem; }
    .stat-card { background: white; border-radius: 16px; padding: 2rem; display: flex; align-items: flex-start; gap: 1.5rem; box-shadow: 0 4px 16px rgba(0,0,0,0.08); transition: all 0.3s ease; position: relative; overflow: hidden; animation: fadeInUp 0.6s ease-out; }
    .stat-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px; opacity: 0; transition: opacity 0.3s; }
    .stat-card:hover { transform: translateY(-4px); box-shadow: 0 8px 32px rgba(0,0,0,0.12); }
    .stat-card:hover::before { opacity: 1; }
    
    .stat-clients::before { background: linear-gradient(90deg, #667eea, #764ba2); }
    .stat-clients .stat-icon { background: linear-gradient(135deg, #667eea, #764ba2); box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3); }
    .stat-clients .stat-value { color: #667eea; }
    
    .stat-meetings::before { background: linear-gradient(90deg, #f093fb, #f5576c); }
    .stat-meetings .stat-icon { background: linear-gradient(135deg, #f093fb, #f5576c); box-shadow: 0 8px 24px rgba(240, 147, 251, 0.3); }
    .stat-meetings .stat-value { color: #f093fb; }
    
    .stat-forms::before { background: linear-gradient(90deg, #4facfe, #00f2fe); }
    .stat-forms .stat-icon { background: linear-gradient(135deg, #4facfe, #00f2fe); box-shadow: 0 8px 24px rgba(79, 172, 254, 0.3); }
    .stat-forms .stat-value { color: #4facfe; }
    
    .stat-compliance::before { background: linear-gradient(90deg, #11998e, #38ef7d); }
    .stat-compliance .stat-icon { background: linear-gradient(135deg, #11998e, #38ef7d); box-shadow: 0 8px 24px rgba(17, 153, 142, 0.3); }
    .stat-compliance .stat-value { color: #11998e; }
    
    .stat-background { position: absolute; right: -20px; top: -20px; width: 150px; height: 150px; opacity: 0.03; background: currentColor; border-radius: 50%; }
    .stat-icon { width: 64px; height: 64px; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; }
    .stat-icon svg { width: 34px; height: 34px; }
    .stat-content { flex: 1; }
    .stat-label { font-size: 0.875rem; color: #6c757d; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.75rem; }
    .stat-value { font-size: 2.75rem; font-weight: 800; line-height: 1; margin-bottom: 0.5rem; animation: countUp 0.6s ease-out; }
    .stat-change { font-size: 0.85rem; display: flex; align-items: center; gap: 0.25rem; font-weight: 600; }
    .stat-change.positive { color: #22c55e; }
    .stat-change.neutral { color: #6c757d; }
    .stat-change.negative { color: #ef4444; }
    .calendar-section { background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 4px 16px rgba(0,0,0,0.08); animation: fadeInUp 0.7s ease-out; }
    .calendar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 2px solid #f0f0f0; }
    .calendar-header h2 { font-size: 1.75rem; font-weight: 700; color: #2c3e50; margin: 0; }
    .calendar-controls { display: flex; gap: 0.5rem; }
    .btn-today, .btn-nav { padding: 0.5rem 1rem; border: 2px solid #e0e0e0; background: white; border-radius: 8px; cursor: pointer; font-size: 0.9rem; font-weight: 600; color: #667eea; transition: all 0.2s; }
    .btn-today:hover, .btn-nav:hover { background: linear-gradient(135deg, #667eea, #764ba2); color: white; border-color: transparent; transform: translateY(-1px); }
    .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; background: #f0f0f0; border: 2px solid #f0f0f0; border-radius: 12px; overflow: hidden; }
    .calendar-day-header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 1rem; text-align: center; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.5px; }
    .calendar-date { background: white; min-height: 100px; padding: 0.75rem; position: relative; transition: all 0.2s; cursor: pointer; }
    .calendar-date:hover { background: #f8f9fa; transform: scale(1.02); }
    .calendar-date.other-month { background: #fafafa; opacity: 0.5; }
    .calendar-date.today { background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1)); border: 2px solid #667eea; }
    .calendar-date.today .date-number { background: linear-gradient(135deg, #667eea, #764ba2); color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; }
    .date-number { font-size: 0.9rem; color: #666; font-weight: 600; position: absolute; top: 0.75rem; right: 0.75rem; }
    .events-list { margin-top: 2rem; display: flex; flex-direction: column; gap: 0.35rem; }
    .event-item { background: linear-gradient(135deg, #4facfe, #00f2fe); color: white; padding: 0.35rem 0.65rem; border-radius: 6px; font-size: 0.75rem; cursor: pointer; transition: all 0.2s; font-weight: 600; }
    .event-item:hover { transform: translateX(3px); box-shadow: 0 2px 8px rgba(79, 172, 254, 0.3); }
    .event-item.all-day { background: linear-gradient(135deg, #f093fb, #f5576c); }
    .event-time { font-weight: 700; margin-right: 0.35rem; opacity: 0.9; }
    .loading { text-align: center; padding: 3rem; color: #6c757d; font-size: 1.1rem; animation: pulse 2s infinite; }
  `]
})
export class DashboardComponent implements OnInit {
  private readonly http = inject(HttpClient);
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
