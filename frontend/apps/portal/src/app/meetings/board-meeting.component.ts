import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface BoardMeeting {
  srNo: number;
  meetingNo: string;
  meetingDate: string;
  venue: string;
  attendees: number;
  status: string;
}

@Component({
  selector: 'app-board-meeting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="meeting-container">
      <div class="page-header">
        <h1>🤝 Board Meeting</h1>
        <p class="subtitle">Manage board meetings and resolutions</p>
      </div>
      <div class="content-card">
        <div class="table-controls">
          <div class="left-controls">
            <select [(ngModel)]="entriesPerPage" class="entries-select"><option [value]="10">10</option></select>
            <span>entries per page</span>
          </div>
          <div class="right-controls">
            <button class="btn-add" (click)="addMeeting()">+ Add Meeting</button>
            <input type="text" [(ngModel)]="searchTerm" (input)="filterData()" placeholder="Search..." class="search-input" />
          </div>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr><th>Sr No</th><th>Meeting No</th><th>Meeting Date</th><th>Venue</th><th>Attendees</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let meeting of getPaginatedData()">
                <td>{{ meeting.srNo }}</td>
                <td><span class="meeting-badge">{{ meeting.meetingNo }}</span></td>
                <td>{{ meeting.meetingDate }}</td>
                <td>{{ meeting.venue }}</td>
                <td>{{ meeting.attendees }}</td>
                <td><span class="status-badge" [class.status-completed]="meeting.status === 'Completed'" [class.status-scheduled]="meeting.status === 'Scheduled'">{{ meeting.status }}</span></td>
                <td class="action-cell">
                  <button class="action-btn" title="View">👁️</button>
                  <button class="action-btn" title="Edit">✏️</button>
                  <button class="action-btn" title="Minutes">📝</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    .meeting-container { padding: 0; max-width: 100%; margin: 0; animation: fadeInUp 0.5s ease-out; }
    .content-card { background: transparent; border-radius: 0; padding: 1rem; box-shadow: none; }
    .table-controls { display: flex; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
    .left-controls, .right-controls { display: flex; align-items: center; gap: 0.75rem; }
    .entries-select { padding: 0.75rem 1rem; border: none; border-radius: 10px; background: #f8f9fa; }
    .btn-add { background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 0.75rem 1.75rem; border-radius: 12px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); }
    .search-input { padding: 0.75rem 1rem; border: none; border-radius: 10px; background: #f8f9fa; min-width: 200px; }
    .table-wrapper { overflow-x: auto; border-radius: 12px; border: 2px solid #f0f0f0; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table thead { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
    .data-table th { padding: 1rem; text-align: left; font-weight: 700; }
    .data-table tbody tr { background: #ffe5e5; /* Light pink */ }
    .data-table tbody tr:nth-child(even) { background: #e5f0ff; /* Light blue */ }
    .data-table tbody tr:hover { background: linear-gradient(135deg, rgba(102, 126, 234, 0.12), rgba(118, 75, 162, 0.12)); transform: scale(1.01); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .data-table td { padding: 1rem; border-bottom: 1px solid #e0e0e0; }
    .meeting-badge { background: linear-gradient(135deg, #4facfe, #00f2fe); color: white; padding: 0.35rem 0.85rem; border-radius: 20px; font-size: 0.85rem; font-weight: 700; }
    .status-badge { padding: 0.35rem 0.85rem; border-radius: 20px; font-size: 0.85rem; font-weight: 700; color: white; }
    .status-completed { background: linear-gradient(135deg, #11998e, #38ef7d); }
    .status-scheduled { background: linear-gradient(135deg, #f093fb, #f5576c); }
    .action-cell { text-align: center; white-space: nowrap; }
    .action-column {
      text-align: center;
      white-space: nowrap;
    }
    .action-column .action-btn {
      display: inline-flex;
      margin: 0 0.25rem;
    }
    .action-btn { background: transparent; border: none; cursor: pointer; font-size: 1.3rem; padding: 0.5rem; border-radius: 8px; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; }
    .action-btn:hover { background: rgba(102, 126, 234, 0.15); transform: scale(1.15); }
  `]
})
export class BoardMeetingComponent implements OnInit {
  meetings: BoardMeeting[] = [
    { srNo: 1, meetingNo: 'BM-2025-001', meetingDate: '2025-01-15', venue: 'Board Room', attendees: 8, status: 'Completed' },
    { srNo: 2, meetingNo: 'BM-2025-002', meetingDate: '2025-02-20', venue: 'Conference Hall', attendees: 7, status: 'Scheduled' },
    { srNo: 3, meetingNo: 'BM-2025-003', meetingDate: '2025-03-10', venue: 'Virtual Meeting', attendees: 9, status: 'Scheduled' }
  ];
  filteredData: BoardMeeting[] = [];
  entriesPerPage: number = 10;
  searchTerm: string = '';

  ngOnInit(): void { this.filteredData = [...this.meetings]; }
  filterData(): void {
    this.filteredData = this.searchTerm ? this.meetings.filter(m => m.meetingNo.toLowerCase().includes(this.searchTerm.toLowerCase()) || m.venue.toLowerCase().includes(this.searchTerm.toLowerCase())) : [...this.meetings];
  }
  getPaginatedData(): BoardMeeting[] { return this.filteredData; }
  addMeeting(): void { alert('Add board meeting'); }
}

