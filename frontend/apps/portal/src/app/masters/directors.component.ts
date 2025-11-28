import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Director {
  id: number;
  name: string;
  contact: string;
  dscExpiry: string;
  dscStatus: string;
  dinStatus: string;
}

@Component({
  selector: 'app-directors-master',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="directors-container">
      <div class="page-header">
        <div class="header-actions">
          <button class="btn-secondary">
            <span>✕</span> Clear Company
          </button>
          <button class="btn-secondary">
            <span>🔍</span> Switch Company
          </button>
        </div>
      </div>

      <div class="table-container">
        <div class="table-controls">
          <div class="left-controls">
            <select [(ngModel)]="entriesPerPage" (change)="updatePagination()" class="entries-select">
              <option [value]="10">10</option>
              <option [value]="25">25</option>
              <option [value]="50">50</option>
              <option [value]="100">100</option>
            </select>
            <span class="entries-label">entries per page</span>
          </div>

          <div class="right-controls">
            <button class="btn-add" (click)="addDirector()">
              <span>+</span> Add
            </button>
            <div class="search-wrapper">
              <span class="search-label">Search:</span>
              <input 
                type="text" 
                [(ngModel)]="searchTerm" 
                (input)="filterData()"
                placeholder="Search directors..."
                class="search-input"
              />
            </div>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th (click)="sortBy('id')">
                  Sr No
                  <span class="sort-icon">{{ getSortIcon('id') }}</span>
                </th>
                <th (click)="sortBy('name')">
                  Director
                  <span class="sort-icon">{{ getSortIcon('name') }}</span>
                </th>
                <th (click)="sortBy('contact')">
                  Contact
                  <span class="sort-icon">{{ getSortIcon('contact') }}</span>
                </th>
                <th (click)="sortBy('dscExpiry')">
                  DSC Expiry
                  <span class="sort-icon">{{ getSortIcon('dscExpiry') }}</span>
                </th>
                <th (click)="sortBy('dscStatus')">
                  DSC Status
                  <span class="sort-icon">{{ getSortIcon('dscStatus') }}</span>
                </th>
                <th (click)="sortBy('dinStatus')">
                  DIN Status
                  <span class="sort-icon">{{ getSortIcon('dinStatus') }}</span>
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngIf="paginatedData.length === 0">
                <td colspan="7" class="no-data">
                  <div class="no-data-message">
                    <span class="icon">📋</span>
                    <p>No data available in table</p>
                  </div>
                </td>
              </tr>
              <tr *ngFor="let director of paginatedData; let i = index">
                <td>{{ (currentPage - 1) * entriesPerPage + i + 1 }}</td>
                <td class="name-cell">{{ director.name }}</td>
                <td>{{ director.contact }}</td>
                <td>{{ director.dscExpiry }}</td>
                <td>
                  <span class="status-badge" [class.status-active]="director.dscStatus === 'Active'" [class.status-expired]="director.dscStatus === 'Expired'">
                    {{ director.dscStatus }}
                  </span>
                </td>
                <td>
                  <span class="status-badge" [class.status-active]="director.dinStatus === 'Active'" [class.status-inactive]="director.dinStatus === 'Inactive'">
                    {{ director.dinStatus }}
                  </span>
                </td>
                <td class="action-cell">
                  <button class="action-btn btn-view" (click)="viewDirector(director)" title="View">
                    <span>👁️</span>
                  </button>
                  <button class="action-btn btn-edit" (click)="editDirector(director)" title="Edit">
                    <span>✏️</span>
                  </button>
                  <button class="action-btn btn-delete" (click)="deleteDirector(director)" title="Delete">
                    <span>🗑️</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="table-footer">
          <div class="showing-entries">
            Showing {{ paginatedData.length > 0 ? ((currentPage - 1) * entriesPerPage) + 1 : 0 }} to {{ Math.min(currentPage * entriesPerPage, filteredData.length) }} of {{ filteredData.length }} entries
          </div>

          <div class="pagination">
            <button class="page-btn" (click)="goToFirstPage()" [disabled]="currentPage === 1 || totalPages === 0">
              <span>⏮️</span>
            </button>
            <button class="page-btn" (click)="previousPage()" [disabled]="currentPage === 1 || totalPages === 0">
              <span>◀</span>
            </button>
            <button 
              *ngFor="let page of visiblePages" 
              class="page-btn page-number" 
              [class.active]="page === currentPage"
              (click)="goToPage(page)">
              {{ page }}
            </button>
            <button class="page-btn" (click)="nextPage()" [disabled]="currentPage === totalPages || totalPages === 0">
              <span>▶</span>
            </button>
            <button class="page-btn" (click)="goToLastPage()" [disabled]="currentPage === totalPages || totalPages === 0">
              <span>⏭️</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    
    .directors-container { padding: 0; max-width: 100%; margin: 0; animation: fadeInUp 0.5s ease-out; }
    
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; background: transparent; border-radius: 0; padding: 0 1rem; box-shadow: none; }
    
    h1 { font-size: 1.75rem; font-weight: 700; color: #333; margin: 0; }
    
    .header-actions { display: flex; gap: 1rem; }
    
    .btn-secondary { background: white; border: none; color: #6c757d; padding: 0.75rem 1.5rem; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.3s; display: inline-flex; align-items: center; gap: 0.5rem; }
    .btn-secondary:hover { color: #667eea; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15); }
    
    .table-container { background: transparent; border-radius: 0; padding: 0 1rem; box-shadow: none; }
    
    .table-controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.75rem; }
    
    .left-controls { display: flex; align-items: center; gap: 0.75rem; }
    
    .entries-select { padding: 0.65rem 1rem; border: none; border-radius: 10px; font-weight: 600; color: #495057; cursor: pointer; transition: all 0.3s; background: white; }
    .entries-select:focus { outline: none; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); }
    
    .entries-label { color: #6c757d; font-weight: 500; }
    
    .right-controls { display: flex; align-items: center; gap: 1rem; }
    
    .btn-add { background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 0.75rem 1.75rem; border-radius: 10px; font-weight: 700; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); display: inline-flex; align-items: center; gap: 0.5rem; }
    .btn-add:hover { transform: translateY(-2px); box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4); }
    .btn-add span { font-size: 1.3rem; }
    
    .search-wrapper { display: flex; align-items: center; gap: 0.75rem; }
    
    .search-label { color: #6c757d; font-weight: 600; }
    
    .search-input { padding: 0.65rem 1rem; border: none; border-radius: 10px; font-size: 0.95rem; transition: all 0.3s; min-width: 250px; }
    .search-input:focus { outline: none; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); }
    
    .table-wrapper { overflow-x: auto; margin: 1.5rem 0; border-radius: 12px; border: 2px solid #f0f0f0; }
    
    .data-table { width: 100%; border-collapse: collapse; }
    
    .data-table thead { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
    
    .data-table th { padding: 1rem 1.25rem; text-align: left; font-weight: 700; font-size: 0.95rem; letter-spacing: 0.3px; border-bottom: 2px solid rgba(255,255,255,0.3); cursor: pointer; user-select: none; transition: all 0.2s; }
    .data-table th:hover { background: rgba(255,255,255,0.1); }
    
    .sort-icon { margin-left: 0.5rem; font-size: 0.75rem; opacity: 0.7; }
    
    .data-table tbody tr { transition: all 0.2s; background: #ffe5e5; /* Light pink */ }
    
    .data-table tbody tr:nth-child(even) { background: #e5f0ff; /* Light blue */ }
    
    .data-table tbody tr:hover { background: linear-gradient(135deg, rgba(102, 126, 234, 0.12), rgba(118, 75, 162, 0.12)); transform: scale(1.01); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    
    .data-table td { padding: 1rem 1.25rem; color: #495057; font-size: 0.95rem; border-bottom: 1px solid #e9ecef; }
    
    .name-cell { font-weight: 600; color: #2c3e50; }
    
    .no-data { text-align: center; padding: 3rem; }
    
    .no-data-message { display: flex; flex-direction: column; align-items: center; gap: 1rem; color: #6c757d; }
    .no-data-message .icon { font-size: 3rem; opacity: 0.5; }
    .no-data-message p { font-size: 1.1rem; margin: 0; }
    
    .status-badge { padding: 0.35rem 0.85rem; border-radius: 20px; font-size: 0.85rem; font-weight: 700; color: white; }
    .status-active { background: linear-gradient(135deg, #11998e, #38ef7d); }
    .status-expired { background: linear-gradient(135deg, #f093fb, #f5576c); }
    .status-inactive { background: linear-gradient(135deg, #ff6b6b, #feca57); }
    
    .action-cell { display: flex; gap: 0.5rem; justify-content: center; }
    
    .action-btn { background: transparent; border: none; cursor: pointer; padding: 0.5rem; border-radius: 8px; transition: all 0.2s; font-size: 1.2rem; }
    
    .btn-view { color: #4facfe; }
    .btn-view:hover { background: rgba(79, 172, 254, 0.15); transform: scale(1.15); }
    
    .btn-edit { color: #11998e; }
    .btn-edit:hover { background: rgba(17, 153, 142, 0.15); transform: scale(1.15); }
    
    .btn-delete { color: #ff4444; }
    .btn-delete:hover { background: rgba(255, 68, 68, 0.15); transform: scale(1.15); }
    
    .table-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; flex-wrap: wrap; gap: 1rem; }
    
    .showing-entries { color: #6c757d; font-weight: 600; }
    
    .pagination { display: flex; gap: 0.5rem; }
    
    .page-btn { background: white; border: none; color: #495057; padding: 0.5rem 0.75rem; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.2s; min-width: 40px; display: flex; align-items: center; justify-content: center; }
    
    .page-btn:hover:not(:disabled) { border-color: #667eea; color: #667eea; background: rgba(102, 126, 234, 0.05); }
    
    .page-btn.active { background: linear-gradient(135deg, #667eea, #764ba2); color: white; border-color: transparent; box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3); }
    
    .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    
    @media (max-width: 768px) {
      .page-header { flex-direction: column; align-items: stretch; }
      .header-actions { justify-content: flex-end; }
      .table-controls { flex-direction: column; align-items: stretch; }
      .right-controls { flex-direction: column; align-items: stretch; }
      .table-wrapper { border-radius: 8px; }
      .data-table th, .data-table td { padding: 0.75rem; font-size: 0.85rem; }
    }
  `]
})
export class DirectorsMasterComponent implements OnInit {
  // Sample data (empty initially like in screenshot)
  allData: Director[] = [
    // Uncomment to add sample data:
    // {
    //   id: 1,
    //   name: 'John Doe',
    //   contact: '+91 98765 43210',
    //   dscExpiry: '31-Dec-2025',
    //   dscStatus: 'Active',
    //   dinStatus: 'Active'
    // }
  ];

  filteredData: Director[] = [];
  paginatedData: Director[] = [];
  
  searchTerm: string = '';
  entriesPerPage: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;
  visiblePages: number[] = [];
  
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  Math = Math;

  ngOnInit(): void {
    this.filteredData = [...this.allData];
    this.updatePagination();
  }

  filterData(): void {
    if (!this.searchTerm.trim()) {
      this.filteredData = [...this.allData];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredData = this.allData.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.contact.toLowerCase().includes(term) ||
        item.dscExpiry.toLowerCase().includes(term) ||
        item.dscStatus.toLowerCase().includes(term) ||
        item.dinStatus.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredData.sort((a: any, b: any) => {
      const aVal = a[column];
      const bVal = b[column];
      
      if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.updatePagination();
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return '↕️';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  updatePagination(): void {
    this.totalPages = this.filteredData.length > 0 ? Math.ceil(this.filteredData.length / this.entriesPerPage) : 0;
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
    if (this.totalPages === 0) {
      this.currentPage = 1;
    }
    
    const startIndex = (this.currentPage - 1) * this.entriesPerPage;
    const endIndex = startIndex + this.entriesPerPage;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);
    
    this.updateVisiblePages();
  }

  updateVisiblePages(): void {
    const pages: number[] = [];
    const maxVisible = 5;
    
    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        for (let i = 1; i <= maxVisible; i++) {
          pages.push(i);
        }
      } else if (this.currentPage >= this.totalPages - 2) {
        for (let i = this.totalPages - maxVisible + 1; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = this.currentPage - 2; i <= this.currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    this.visiblePages = pages;
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  goToFirstPage(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  goToLastPage(): void {
    this.currentPage = this.totalPages;
    this.updatePagination();
  }

  addDirector(): void {
    alert('Add Director/KMP feature coming soon!');
  }

  viewDirector(director: Director): void {
    alert(`View: ${director.name}`);
  }

  editDirector(director: Director): void {
    alert(`Edit: ${director.name}`);
  }

  deleteDirector(director: Director): void {
    if (confirm(`Delete director: ${director.name}?`)) {
      const index = this.allData.findIndex(d => d.id === director.id);
      if (index > -1) {
        this.allData.splice(index, 1);
        this.filterData();
      }
    }
  }
}

