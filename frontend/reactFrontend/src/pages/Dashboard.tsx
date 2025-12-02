import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import { environment } from '../config/environment';
import './Dashboard.css';

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

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState('April 2025');
  const [calendarDates, setCalendarDates] = useState<any[]>([]);

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  useEffect(() => {
    loadDashboardData();
    generateCalendar();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const statsResponse = await axiosInstance.get(`${environment.apiUrl}/dashboard/stats`);
      setStats(statsResponse.data);

      const eventsResponse = await axiosInstance.get(`${environment.apiUrl}/dashboard/events`);
      setEvents(eventsResponse.data);
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
      setStats({ clients_count: 0, meetings_count: 0 });
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const generateCalendar = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 35; i++) {
      dates.push({
        day: (i % 30) + 1,
        isCurrentMonth: true,
        isToday: i === 12,
        events: []
      });
    }
    setCalendarDates(dates);
  };

  const goToToday = () => {
    setCurrentMonth(new Date().toLocaleString('default', { month: 'long', year: 'numeric' }));
    generateCalendar();
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back! Here's your overview</p>
        </div>
        <div className="header-actions">
          <button className="btn-beautiful btn-outline">
            <span>📊</span> Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-clients">
          <div className="stat-background"></div>
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Clients</div>
            <div className="stat-value">{stats?.clients_count || 0}</div>
            <div className="stat-change positive">↑ 12% from last month</div>
          </div>
        </div>

        <div className="stat-card stat-meetings">
          <div className="stat-background"></div>
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Meetings Scheduled</div>
            <div className="stat-value">{stats?.meetings_count || 0}</div>
            <div className="stat-change neutral">This month</div>
          </div>
        </div>
        
        <div className="stat-card stat-forms">
          <div className="stat-background"></div>
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Forms Available</div>
            <div className="stat-value">62</div>
            <div className="stat-change positive">All Active</div>
          </div>
        </div>
        
        <div className="stat-card stat-compliance">
          <div className="stat-background"></div>
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Compliance Rate</div>
            <div className="stat-value">98%</div>
            <div className="stat-change positive">↑ 3% this week</div>
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="calendar-section">
        <div className="calendar-header">
          <h2>{currentMonth}</h2>
          <div className="calendar-controls">
            <button onClick={goToToday} className="btn-today">today</button>
            <button className="btn-nav">◀</button>
            <button className="btn-nav">▶</button>
          </div>
        </div>

        <div className="calendar-grid">
          {weekDays.map(day => (
            <div key={day} className="calendar-day-header">{day}</div>
          ))}
          
          {calendarDates.map((date, idx) => (
            <div 
              key={idx}
              className={`calendar-date ${!date.isCurrentMonth ? 'other-month' : ''} ${date.isToday ? 'today' : ''}`}
            >
              <span className="date-number">{date.day}</span>
              <div className="events-list">
                {date.events.map((event: CalendarEvent, eventIdx: number) => (
                  <div 
                    key={eventIdx}
                    className={`event-item ${event.is_all_day ? 'all-day' : ''}`}
                  >
                    {event.start_time && !event.is_all_day && (
                      <span className="event-time">{event.start_time}</span>
                    )}
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {loading && <div className="loading">Loading dashboard data...</div>}
    </div>
  );
};

export default Dashboard;



