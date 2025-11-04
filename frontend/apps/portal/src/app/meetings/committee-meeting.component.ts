import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CommitteeMeeting {
  srNo: number;
  meetingNo: string;
  committeeType: string;
  meetingDate: string;
  venue: string;
  members: number;
  status: string;
}

@Component({
  selector: 'app-committee-meeting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="meeting-container">
      <div class="page-header">
        <h1>👥 Committee Meeting</h1>
        <p class="subtitle">Manage committee meetings (Audit, Nomination, etc.)</p>
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
              <tr><th>Sr No</th><th>Meeting No</th><th>Committee Type</th><th>Meeting Date</th><th>Venue</th><th>Members</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let meeting of getPaginatedData()">
                <td>{{ meeting.srNo }}</td>
                <td><span class="meeting-badge">{{ meeting.meetingNo }}</span></td>
                <td><span class="committee-badge">{{ meeting.committeeType }}</span></td>
                <td>{{ meeting.meetingDate }}</td>
                <td>{{ meeting.venue }}</td>
                <td>{{ meeting.members }}</td>
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
    .meeting-container { padding: 2rem; max-width: 1600px; margin: 0 auto; animation: fadeInUp 0.5s ease-out; }
    .page-header { background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05)); border-radius: 16px; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 4px 16px rgba(0,0,0,0.05); }
    .page-header h1 { font-size: 2.3rem; font-weight: 800; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 0; }
    .subtitle { color: #6c757d; margin: 0.5rem 0 0 0; }
    .content-card { background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
    .table-controls { display: flex; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
    .left-controls, .right-controls { display: flex; align-items: center; gap: 0.75rem; }
    .entries-select { padding: 0.75rem 1rem; border: 2px solid #e0e0e0; border-radius: 10px; background: #f8f9fa; }
    .btn-add { background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 0.75rem 1.75rem; border-radius: 12px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); }
    .search-input { padding: 0.75rem 1rem; border: 2px solid #e0e0e0; border-radius: 10px; background: #f8f9fa; min-width: 200px; }
    .table-wrapper { overflow-x: auto; border-radius: 12px; border: 2px solid #f0f0f0; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table thead { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
    .data-table th { padding: 1rem; text-align: left; font-weight: 700; }
    .data-table tbody tr { background: white; }
    .data-table tbody tr:nth-child(even) { background: #f8f9fa; }
    .data-table tbody tr:hover { background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08)); }
    .data-table td { padding: 1rem; border-bottom: 1px solid #e0e0e0; }
    .meeting-badge { background: linear-gradient(135deg, #4facfe, #00f2fe); color: white; padding: 0.35rem 0.85rem; border-radius: 20px; font-size: 0.85rem; font-weight: 700; }
    .committee-badge { background: linear-gradient(135deg, #f093fb, #f5576c); color: white; padding: 0.35rem 0.85rem; border-radius: 20px; font-size: 0.85rem; font-weight: 700; }
    .status-badge { padding: 0.35rem 0.85rem; border-radius: 20px; font-size: 0.85rem; font-weight: 700; color: white; }
    .status-completed { background: linear-gradient(135deg, #11998e, #38ef7d); }
    .status-scheduled { background: linear-gradient(135deg, #667eea, #764ba2); }
    .action-cell { text-align: center; }
    .action-btn { background: transparent; border: none; cursor: pointer; font-size: 1.3rem; padding: 0.5rem; border-radius: 8px; transition: all 0.2s; }
    .action-btn:hover { background: rgba(102, 126, 234, 0.15); transform: scale(1.15); }
  `]
})
export class CommitteeMeetingComponent implements OnInit {
  meetings: CommitteeMeeting[] = [
    { srNo: 1, meetingNo: 'AC-2025-001', committeeType: 'Audit Committee', meetingDate: '2025-01-10', venue: 'Board Room', members: 4, status: 'Completed' },
    { srNo: 2, meetingNo: 'NRC-2025-001', committeeType: 'Nomination & Remuneration', meetingDate: '2025-02-15', venue: 'Conference Hall', members: 3, status: 'Scheduled' },
    { srNo: 3, meetingNo: 'SRC-2025-001', committeeType: 'Stakeholders Relationship', meetingDate: '2025-03-05', venue: 'Virtual Meeting', members: 3, status: 'Scheduled' }
  ];
  filteredData: CommitteeMeeting[] = [];
  entriesPerPage: number = 10;
  searchTerm: string = '';

  ngOnInit(): void { this.filteredData = [...this.meetings]; }
  filterData(): void {
    this.filteredData = this.searchTerm ? this.meetings.filter(m => m.meetingNo.toLowerCase().includes(this.searchTerm.toLowerCase()) || m.committeeType.toLowerCase().includes(this.searchTerm.toLowerCase())) : [...this.meetings];
  }
  getPaginatedData(): CommitteeMeeting[] { return this.filteredData; }
  addMeeting(): void { alert('Add committee meeting'); }
}

