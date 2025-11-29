import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Shareholder {
  id: number;
  name: string;
  category: string;
  subCategory: string;
  underSubCategory: string;
}

@Component({
  selector: 'app-shareholder-master',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="shareholder-container">
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
            <button class="btn-add" (click)="addShareholder()">
              <span>+</span> Add
            </button>
            <div class="search-wrapper">
              <span class="search-label">Search:</span>
              <input 
                type="text" 
                [(ngModel)]="searchTerm" 
                (input)="filterData()"
                placeholder="Search shareholders..."
                class="search-input"
              />
            </div>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Shareholder's Name</th>
                <th>Category</th>
                <th>Sub Category</th>
                <th>Under Sub Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let shareholder of paginatedData; let i = index">
                <td>{{ (currentPage - 1) * entriesPerPage + i + 1 }}</td>
                <td class="name-cell">{{ shareholder.name }}</td>
                <td>{{ shareholder.category }}</td>
                <td>{{ shareholder.subCategory }}</td>
                <td>{{ shareholder.underSubCategory }}</td>
                <td class="action-cell">
                  <button class="action-btn btn-view" (click)="viewShareholder(shareholder)" title="View">
                    <span>👁️</span>
                  </button>
                  <button class="action-btn btn-edit" (click)="editShareholder(shareholder)" title="Edit">
                    <span>✏️</span>
                  </button>
                  <button class="action-btn btn-delete" (click)="deleteShareholder(shareholder)" title="Delete">
                    <span>🗑️</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="table-footer">
          <div class="showing-entries">
            Showing {{ ((currentPage - 1) * entriesPerPage) + 1 }} to {{ Math.min(currentPage * entriesPerPage, filteredData.length) }} of {{ filteredData.length }} entries
          </div>

          <div class="pagination">
            <button class="page-btn" (click)="goToFirstPage()" [disabled]="currentPage === 1">
              <span>⏮️</span>
            </button>
            <button class="page-btn" (click)="previousPage()" [disabled]="currentPage === 1">
              <span>◀</span>
            </button>
            <button 
              *ngFor="let page of visiblePages" 
              class="page-btn page-number" 
              [class.active]="page === currentPage"
              (click)="goToPage(page)">
              {{ page }}
            </button>
            <button class="page-btn" (click)="nextPage()" [disabled]="currentPage === totalPages">
              <span>▶</span>
            </button>
            <button class="page-btn" (click)="goToLastPage()" [disabled]="currentPage === totalPages">
              <span>⏭️</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    
    .shareholder-container { padding: 0; max-width: 100%; margin: 0; animation: fadeInUp 0.5s ease-out; }
    
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; background: transparent; border-radius: 0; padding: 0 1rem; box-shadow: none; }
    
    h1 { font-size: 1.75rem; font-weight: 700; color: #333; margin: 0; }
    
    .header-actions { display: flex; gap: 1rem; }
    
    .btn-secondary { background: white; border: none; color: #6c757d; padding: 0.75rem 1.5rem; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.3s; display: inline-flex; align-items: center; gap: 0.5rem; }
    .btn-secondary:hover { color: #667eea; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15); }
    
    .table-container { background: transparent; border-radius: 0; padding: 0 1rem; box-shadow: none; }
    
    .table-controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
    
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
    
    .table-wrapper { overflow-x: auto; margin: 1.5rem 0; border-radius: 8px; border: 1px solid #e0e0e0; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); }
    
    .data-table { width: 100%; border-collapse: collapse; border-radius: 8px; overflow: hidden; }
    
    .data-table thead { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
    
    .data-table th { padding: 1rem; text-align: left; font-weight: 700; font-size: 0.95rem; letter-spacing: 0.3px; border-bottom: 2px solid rgba(255,255,255,0.2); }
    
    .data-table tbody tr { transition: all 0.2s; background: #ffe5e5; /* Light pink */ }
    
    .data-table tbody tr:nth-child(even) { background: #e5f0ff; /* Light blue */ }
    
    .data-table tbody tr:hover { background: linear-gradient(135deg, rgba(102, 126, 234, 0.12), rgba(118, 75, 162, 0.12)); transform: scale(1.01); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    
    .data-table td { padding: 1rem; color: #333; font-size: 0.95rem; border-bottom: 1px solid rgba(0, 0, 0, 0.05); }
    
    .name-cell { font-weight: 600; color: #2c3e50; }
    
    .action-cell { 
      display: flex; 
      gap: 0.5rem; 
      justify-content: center; 
      white-space: nowrap;
    }
    
    .action-column {
      text-align: center;
      white-space: nowrap;
    }
    
    .action-column .action-btn {
      display: inline-flex;
      margin: 0 0.25rem;
    }
    
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
export class ShareholderMasterComponent implements OnInit {
  // Sample data matching .NET version
  allData: Shareholder[] = [
    {
      id: 1,
      name: 'Director string string',
      category: 'Indian',
      subCategory: 'Non Institutions',
      underSubCategory: 'Minor'
    },
    {
      id: 2,
      name: 'Farhan Director M Kazi',
      category: 'Indian',
      subCategory: 'Non Institutions',
      underSubCategory: 'Individual'
    },
    {
      id: 3,
      name: 'Shareholder string string',
      category: 'Foreign',
      subCategory: 'Non Institutions',
      underSubCategory: 'HUF'
    }
  ];

  filteredData: Shareholder[] = [];
  paginatedData: Shareholder[] = [];
  
  searchTerm: string = '';
  entriesPerPage: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;
  visiblePages: number[] = [];
  
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
        item.category.toLowerCase().includes(term) ||
        item.subCategory.toLowerCase().includes(term) ||
        item.underSubCategory.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredData.length / this.entriesPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
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

  addShareholder(): void {
    alert('Add Shareholder feature coming soon!');
  }

  viewShareholder(shareholder: Shareholder): void {
    alert(`View: ${shareholder.name}`);
  }

  editShareholder(shareholder: Shareholder): void {
    alert(`Edit: ${shareholder.name}`);
  }

  deleteShareholder(shareholder: Shareholder): void {
    if (confirm(`Delete shareholder: ${shareholder.name}?`)) {
      const index = this.allData.findIndex(s => s.id === shareholder.id);
      if (index > -1) {
        this.allData.splice(index, 1);
        this.filterData();
      }
    }
  }
}

