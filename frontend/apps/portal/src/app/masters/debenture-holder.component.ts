import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface DebentureHolder {
  srNo: number;
  holderName: string;
  type: string;
  category: string;
  subCategory: string;
  underSubCategory: string;
}

@Component({
  selector: 'app-debenture-holder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="debenture-holder-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>📑 Debenture Holder</h1>
          <p class="subtitle">Manage debenture holder information</p>
        </div>
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
            <button class="btn-add" (click)="addDebentureHolder()">
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
                <th>Debenture Holder's Name</th>
                <th>Type</th>
                <th>Category</th>
                <th>Sub Category</th>
                <th>Under Sub Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let holder of getPaginatedData(); let i = index">
                <td>{{ holder.srNo }}</td>
                <td>{{ holder.holderName }}</td>
                <td>{{ holder.type }}</td>
                <td>{{ holder.category }}</td>
                <td>{{ holder.subCategory }}</td>
                <td>{{ holder.underSubCategory }}</td>
                <td class="action-cell">
                  <button class="action-btn" (click)="viewHolder(holder)" title="View">👁️</button>
                  <button class="action-btn" (click)="editHolder(holder)" title="Edit">✏️</button>
                  <button class="action-btn" (click)="deleteHolder(holder)" title="Delete">🗑️</button>
                </td>
              </tr>
              <tr *ngIf="getFilteredData().length === 0">
                <td colspan="7" class="no-data">No debenture holders found</td>
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
            <button 
              (click)="currentPage = 1" 
              [disabled]="currentPage === 1" 
              class="page-btn"
              title="First Page">
              ⏮️
            </button>
            <button 
              (click)="currentPage = currentPage - 1" 
              [disabled]="currentPage === 1" 
              class="page-btn"
              title="Previous Page">
              ◀
            </button>
            
            <button 
              *ngFor="let page of getVisiblePages()" 
              (click)="currentPage = page"
              [class.active]="page === currentPage"
              class="page-btn page-number">
              {{ page }}
            </button>
            
            <button 
              (click)="currentPage = currentPage + 1" 
              [disabled]="currentPage === getTotalPages()" 
              class="page-btn"
              title="Next Page">
              ▶
            </button>
            <button 
              (click)="currentPage = getTotalPages()" 
              [disabled]="currentPage === getTotalPages()" 
              class="page-btn"
              title="Last Page">
              ⏭️
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .debenture-holder-container {
      padding: 2rem;
      max-width: 1600px;
      margin: 0 auto;
      animation: fadeInUp 0.5s ease-out;
    }

    /* Header Styles */
    .page-header {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 16px rgba(0,0,0,0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-content h1 {
      font-size: 2.3rem;
      font-weight: 800;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
    }

    .subtitle {
      color: #6c757d;
      margin: 0.5rem 0 0 0;
      font-size: 1rem;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    .btn-outline {
      background: transparent;
      border: 2px solid #667eea;
      color: #667eea;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      white-space: nowrap;
    }

    .btn-outline:hover {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    /* Content Card */
    .content-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    }

    /* Table Controls */
    .table-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .left-controls {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .entries-select {
      padding: 0.75rem 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 1rem;
      background: #f8f9fa;
      transition: all 0.3s;
      cursor: pointer;
    }

    .entries-select:focus {
      outline: none;
      border-color: #667eea;
      background: white;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }

    .entries-label {
      color: #6c757d;
      font-weight: 600;
    }

    .right-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .btn-add {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      padding: 0.75rem 1.75rem;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      white-space: nowrap;
    }

    .btn-add:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
    }

    .add-icon {
      font-size: 1.3rem;
      font-weight: 700;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .search-box label {
      font-weight: 600;
      color: #2c3e50;
      white-space: nowrap;
    }

    .search-input {
      padding: 0.75rem 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 1rem;
      background: #f8f9fa;
      transition: all 0.3s;
      min-width: 200px;
    }

    .search-input:focus {
      outline: none;
      border-color: #667eea;
      background: white;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }

    /* Table Styles */
    .table-wrapper {
      overflow-x: auto;
      margin-bottom: 1.5rem;
      border-radius: 12px;
      border: 2px solid #f0f0f0;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table thead {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }

    .data-table th {
      padding: 1rem;
      text-align: left;
      font-weight: 700;
      font-size: 0.95rem;
      white-space: nowrap;
    }

    .data-table tbody tr {
      transition: all 0.2s;
      background: white;
    }

    .data-table tbody tr:nth-child(even) {
      background: #f8f9fa;
    }

    .data-table tbody tr:hover {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08));
      transform: scale(1.01);
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .data-table td {
      padding: 1rem;
      border-bottom: 1px solid #e0e0e0;
      font-size: 0.95rem;
      color: #2c3e50;
    }

    .action-cell {
      text-align: center;
      white-space: nowrap;
    }

    .action-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 1.3rem;
      padding: 0.5rem;
      border-radius: 8px;
      transition: all 0.2s;
      margin: 0 0.15rem;
    }

    .action-btn:hover {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
      transform: scale(1.15);
    }

    .no-data {
      text-align: center;
      padding: 3rem !important;
      color: #6c757d;
      font-style: italic;
      font-size: 1.1rem;
    }

    /* Table Footer */
    .table-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 2px solid #f0f0f0;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .entries-info {
      color: #6c757d;
      font-size: 0.95rem;
      font-weight: 600;
    }

    /* Pagination */
    .pagination {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .page-btn {
      padding: 0.5rem 0.85rem;
      border: 2px solid #e0e0e0;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 600;
      color: #667eea;
      transition: all 0.2s;
      min-width: 38px;
      text-align: center;
    }

    .page-btn:hover:not(:disabled) {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border-color: transparent;
      transform: translateY(-1px);
    }

    .page-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .page-btn.active {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border-color: transparent;
    }

    .page-number {
      min-width: 42px;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .header-actions {
        width: 100%;
        justify-content: flex-start;
      }

      .table-controls {
        flex-direction: column;
        align-items: flex-start;
      }

      .right-controls {
        width: 100%;
        flex-wrap: wrap;
      }

      .search-input {
        flex: 1;
        min-width: 150px;
      }
    }

    @media (max-width: 768px) {
      .debenture-holder-container {
        padding: 1rem;
      }

      .page-header {
        padding: 1.5rem;
      }

      .header-content h1 {
        font-size: 1.8rem;
      }

      .content-card {
        padding: 1.5rem;
      }

      .table-wrapper {
        overflow-x: scroll;
      }

      .data-table th,
      .data-table td {
        padding: 0.75rem;
        font-size: 0.85rem;
      }
    }
  `]
})
export class DebentureHolderComponent implements OnInit {
  // Sample Data matching the image
  debentureHolders: DebentureHolder[] = [
    {
      srNo: 1,
      holderName: 'Shareholder string string',
      type: 'Shareholder',
      category: 'Foreign',
      subCategory: 'Non Institutions',
      underSubCategory: 'Minor'
    },
    {
      srNo: 2,
      holderName: 'Shareholder string string',
      type: 'None',
      category: 'Indian',
      subCategory: 'Institutions',
      underSubCategory: 'Government Company'
    }
  ];

  filteredData: DebentureHolder[] = [];
  entriesPerPage: number = 10;
  currentPage: number = 1;
  searchTerm: string = '';

  ngOnInit(): void {
    this.filteredData = [...this.debentureHolders];
  }

  filterData(): void {
    if (!this.searchTerm.trim()) {
      this.filteredData = [...this.debentureHolders];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredData = this.debentureHolders.filter(holder =>
        holder.holderName.toLowerCase().includes(term) ||
        holder.type.toLowerCase().includes(term) ||
        holder.category.toLowerCase().includes(term) ||
        holder.subCategory.toLowerCase().includes(term) ||
        holder.underSubCategory.toLowerCase().includes(term) ||
        holder.srNo.toString().includes(term)
      );
    }
    this.currentPage = 1; // Reset to first page after filtering
  }

  getFilteredData(): DebentureHolder[] {
    return this.filteredData;
  }

  getPaginatedData(): DebentureHolder[] {
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
    
    // Show up to 5 page numbers at a time
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);
    
    // Adjust start if we're near the end
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

  // Action Methods
  addDebentureHolder(): void {
    alert('Add new Debenture Holder\n\nThis will open a form to add a new debenture holder.');
    console.log('Add debenture holder clicked');
  }

  viewHolder(holder: DebentureHolder): void {
    alert(`View Debenture Holder Details\n\nName: ${holder.holderName}\nType: ${holder.type}\nCategory: ${holder.category}\nSub Category: ${holder.subCategory}\nUnder Sub Category: ${holder.underSubCategory}`);
    console.log('View holder:', holder);
  }

  editHolder(holder: DebentureHolder): void {
    alert(`Edit Debenture Holder: ${holder.holderName}\n\nThis will open an edit form.`);
    console.log('Edit holder:', holder);
  }

  deleteHolder(holder: DebentureHolder): void {
    if (confirm(`Are you sure you want to delete "${holder.holderName}"?`)) {
      const index = this.debentureHolders.findIndex(h => h.srNo === holder.srNo);
      if (index > -1) {
        this.debentureHolders.splice(index, 1);
        this.filterData(); // Refresh filtered data
        console.log('Deleted holder:', holder);
      }
    }
  }
}

