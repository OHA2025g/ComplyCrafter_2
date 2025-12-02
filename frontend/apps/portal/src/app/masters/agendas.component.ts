import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AgendasService, Agenda } from '../services/agendas.service';

@Component({
  selector: 'app-agendas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="agendas-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-actions">
          <button class="btn-outline">✕ Clear Company</button>
          <button class="btn-outline">🔍 Switch Company</button>
        </div>
      </div>

      <!-- Main Content Card -->
      <div class="content-card">
        <!-- Table Controls -->
        <div class="table-controls">
          <div class="left-controls">
            <select [(ngModel)]="entriesPerPage" (change)="currentPage = 1" class="entries-select">
              <option [value]="10">10</option>
              <option [value]="25">25</option>
              <option [value]="50">50</option>
              <option [value]="100">100</option>
            </select>
            <span class="entries-label">entries per page</span>
          </div>
          
          <div class="right-controls">
            <button class="btn-add" (click)="addAgenda()">
              <span class="add-icon">+</span>
              <span>Add</span>
            </button>
            <div class="search-box">
              <label>Search:</label>
              <input 
                type="text" 
                [(ngModel)]="searchTerm"
                (input)="filterData()"
                placeholder=""
                class="search-input"
              />
            </div>
          </div>
        </div>

        <!-- Data Table -->
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Agenda Title</th>
                <th>Description</th>
                <th>Meeting Type</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let agenda of getPaginatedData(); let i = index">
                <td>{{ agenda.srNo }}</td>
                <td>{{ agenda.agendaTitle }}</td>
                <td>{{ agenda.description }}</td>
                <td><span class="meeting-type-badge">{{ agenda.meetingType }}</span></td>
                <td><span class="status-badge" [class.status-active]="agenda.status === 'Active'" [class.status-pending]="agenda.status === 'Pending'">{{ agenda.status }}</span></td>
                <td>{{ agenda.createdDate }}</td>
                <td class="action-cell">
                  <button class="action-btn" (click)="viewAgenda(agenda)" title="View">👁️</button>
                  <button class="action-btn" (click)="editAgenda(agenda)" title="Edit">✏️</button>
                  <button class="action-btn" (click)="deleteAgenda(agenda)" title="Delete">🗑️</button>
                </td>
              </tr>
              <tr *ngIf="getFilteredData().length === 0">
                <td colspan="7" class="no-data">No agendas found</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Table Footer with Pagination -->
        <div class="table-footer">
          <div class="entries-info">
            Showing {{ getStartEntry() }} to {{ getEndEntry() }} of {{ getFilteredData().length }} entries
          </div>
          
          <div class="pagination">
            <button (click)="currentPage = 1" [disabled]="currentPage === 1" class="page-btn" title="First Page">⏮️</button>
            <button (click)="currentPage = currentPage - 1" [disabled]="currentPage === 1" class="page-btn" title="Previous Page">◀</button>
            <button *ngFor="let page of getVisiblePages()" (click)="currentPage = page" [class.active]="page === currentPage" class="page-btn page-number">{{ page }}</button>
            <button (click)="currentPage = currentPage + 1" [disabled]="currentPage === getTotalPages()" class="page-btn" title="Next Page">▶</button>
            <button (click)="currentPage = getTotalPages()" [disabled]="currentPage === getTotalPages()" class="page-btn" title="Last Page">⏭️</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    .agendas-container { padding: 0; max-width: 100%; margin: 0; animation: fadeInUp 0.5s ease-out; }
    .page-header { background: transparent; border-radius: 0; padding: 0 1rem; margin-bottom: 0.75rem; box-shadow: none; display: flex; justify-content: space-between; align-items: center; }
    .header-content h1 { font-size: 1.75rem; font-weight: 700; color: #333; margin: 0; }
    .subtitle { color: #6c757d; margin: 0.5rem 0 0 0; font-size: 1rem; }
    .header-actions { display: flex; gap: 1rem; }
    .btn-outline { background: transparent; border: none; color: #667eea; padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.3s; white-space: nowrap; }
    .btn-outline:hover { background: linear-gradient(135deg, #667eea, #764ba2); color: white; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); }
    .content-card { background: transparent; border-radius: 0; padding: 0 1rem; box-shadow: none; }
    .table-controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; gap: 0.75rem; flex-wrap: wrap; }
    .left-controls { display: flex; align-items: center; gap: 0.75rem; }
    .entries-select { padding: 0.75rem 1rem; border: none; border-radius: 10px; font-size: 1rem; background: #f8f9fa; transition: all 0.3s; cursor: pointer; }
    .entries-select:focus { outline: none; background: white; box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1); }
    .entries-label { color: #6c757d; font-weight: 600; }
    .right-controls { display: flex; align-items: center; gap: 1rem; }
    .btn-add { background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 0.75rem 1.75rem; border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); display: flex; align-items: center; gap: 0.5rem; white-space: nowrap; }
    .btn-add:hover { transform: translateY(-2px); box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4); }
    .add-icon { font-size: 1.3rem; font-weight: 700; }
    .search-box { display: flex; align-items: center; gap: 0.5rem; }
    .search-box label { font-weight: 600; color: #2c3e50; white-space: nowrap; }
    .search-input { padding: 0.75rem 1rem; border: none; border-radius: 10px; font-size: 1rem; background: #f8f9fa; transition: all 0.3s; min-width: 200px; }
    .search-input:focus { outline: none; background: white; box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1); }
    .table-wrapper { overflow-x: auto; margin-bottom: 1.5rem; border-radius: 12px; border: 2px solid #f0f0f0; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table thead { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
    .data-table th { padding: 1rem; text-align: left; font-weight: 700; font-size: 0.95rem; white-space: nowrap; }
    .data-table tbody tr { transition: all 0.2s; background: #ffe5e5; /* Light pink */ }
    .data-table tbody tr:nth-child(even) { background: #e5f0ff; /* Light blue */ }
    .data-table tbody tr:hover { background: linear-gradient(135deg, rgba(102, 126, 234, 0.12), rgba(118, 75, 162, 0.12)); transform: scale(1.01); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .data-table td { padding: 1rem; border-bottom: 1px solid #e0e0e0; font-size: 0.95rem; color: #2c3e50; }
    .meeting-type-badge { background: linear-gradient(135deg, #4facfe, #00f2fe); color: white; padding: 0.35rem 0.85rem; border-radius: 20px; font-size: 0.85rem; font-weight: 700; white-space: nowrap; }
    .status-badge { padding: 0.35rem 0.85rem; border-radius: 20px; font-size: 0.85rem; font-weight: 700; white-space: nowrap; }
    .status-active { background: linear-gradient(135deg, #11998e, #38ef7d); color: white; }
    .status-pending { background: linear-gradient(135deg, #f093fb, #f5576c); color: white; }
    .action-cell { text-align: center; white-space: nowrap; }
    .action-column {
      text-align: center;
      white-space: nowrap;
    }
    .action-column .action-btn {
      display: inline-flex;
      margin: 0 0.25rem;
    }
    .action-btn { background: transparent; border: none; cursor: pointer; font-size: 1.3rem; padding: 0.5rem; border-radius: 8px; transition: all 0.2s; margin: 0 0.25rem; display: inline-flex; align-items: center; justify-content: center; }
    .action-btn:hover { background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15)); transform: scale(1.15); }
    .no-data { text-align: center; padding: 3rem !important; color: #6c757d; font-style: italic; font-size: 1.1rem; }
    .table-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 2px solid #f0f0f0; flex-wrap: wrap; gap: 1rem; }
    .entries-info { color: #6c757d; font-size: 0.95rem; font-weight: 600; }
    .pagination { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .page-btn { padding: 0.5rem 0.85rem; border: none; background: white; border-radius: 8px; cursor: pointer; font-size: 0.9rem; font-weight: 600; color: #667eea; transition: all 0.2s; min-width: 38px; text-align: center; }
    .page-btn:hover:not(:disabled) { background: linear-gradient(135deg, #667eea, #764ba2); color: white; border-color: transparent; transform: translateY(-1px); }
    .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .page-btn.active { background: linear-gradient(135deg, #667eea, #764ba2); color: white; border-color: transparent; }
    .page-number { min-width: 42px; }
    @media (max-width: 1024px) { .page-header { flex-direction: column; align-items: flex-start; gap: 1rem; } .header-actions { width: 100%; justify-content: flex-start; } .table-controls { flex-direction: column; align-items: flex-start; } .right-controls { width: 100%; flex-wrap: wrap; } .search-input { flex: 1; min-width: 150px; } }
  `]
})
export class AgendasComponent implements OnInit {
  agendas: Agenda[] = [];
  filteredData: Agenda[] = [];
  entriesPerPage: number = 10;
  currentPage: number = 1;
  searchTerm: string = '';
  isLoading: boolean = false;

  constructor(private agendasService: AgendasService) {}

  ngOnInit(): void {
    this.loadAgendas();
  }

  loadAgendas(): void {
    this.isLoading = true;
    this.agendasService.getAll().subscribe({
      next: (data) => {
        this.agendas = data;
        this.filteredData = [...this.agendas];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading agendas:', error);
        this.isLoading = false;
        // Fallback to empty array
        this.agendas = [];
        this.filteredData = [];
      }
    });
  }

  filterData(): void {
    if (!this.searchTerm.trim()) {
      this.filteredData = [...this.agendas];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredData = this.agendas.filter(agenda =>
        agenda.agendaTitle.toLowerCase().includes(term) ||
        agenda.description.toLowerCase().includes(term) ||
        agenda.meetingType.toLowerCase().includes(term) ||
        agenda.status.toLowerCase().includes(term) ||
        agenda.srNo.toString().includes(term)
      );
    }
    this.currentPage = 1;
  }

  getFilteredData(): Agenda[] {
    return this.filteredData;
  }

  getPaginatedData(): Agenda[] {
    const start = (this.currentPage - 1) * this.entriesPerPage;
    const end = start + this.entriesPerPage;
    return this.filteredData.slice(start, end);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredData.length / this.entriesPerPage) || 1;
  }

  getVisiblePages(): number[] {
    const total = this.getTotalPages();
    const current = this.currentPage;
    const pages: number[] = [];
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);
    start = Math.max(1, end - 4);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  getStartEntry(): number {
    if (this.filteredData.length === 0) return 0;
    return (this.currentPage - 1) * this.entriesPerPage + 1;
  }

  getEndEntry(): number {
    const end = this.currentPage * this.entriesPerPage;
    return Math.min(end, this.filteredData.length);
  }

  addAgenda(): void {
    alert('Add new Agenda\n\nThis will open a form to add a new agenda item.');
  }

  viewAgenda(agenda: Agenda): void {
    alert(`View Agenda\n\nTitle: ${agenda.agendaTitle}\nDescription: ${agenda.description}\nMeeting Type: ${agenda.meetingType}\nStatus: ${agenda.status}`);
  }

  editAgenda(agenda: Agenda): void {
    alert(`Edit Agenda: ${agenda.agendaTitle}`);
  }

  deleteAgenda(agenda: Agenda): void {
    if (confirm(`Delete "${agenda.agendaTitle}"?`)) {
      if (agenda.id) {
        this.agendasService.delete(agenda.id).subscribe({
          next: () => {
            // Remove from local array
            const index = this.agendas.findIndex(a => a.id === agenda.id);
            if (index > -1) {
              this.agendas.splice(index, 1);
              this.filterData();
            }
          },
          error: (error) => {
            console.error('Error deleting agenda:', error);
            alert('Error deleting agenda. Please try again.');
          }
        });
      }
    }
  }
}

