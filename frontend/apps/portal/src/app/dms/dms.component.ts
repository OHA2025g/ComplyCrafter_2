import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Document {
  id: number;
  name: string;
  type: string;
  category: string;
  uploadDate: string;
  size: string;
  uploadedBy: string;
  status: string;
}

@Component({
  selector: 'app-dms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dms-container">
      <div class="content-card">
        <div class="table-controls">
          <div class="left-controls">
            <select [(ngModel)]="entriesPerPage" class="entries-select">
              <option [value]="10">10</option>
              <option [value]="25">25</option>
              <option [value]="50">50</option>
              <option [value]="100">100</option>
            </select>
            <span class="entries-label">entries per page</span>
          </div>
          <div class="right-controls">
            <button class="btn-add" (click)="uploadDocument()">
              <span>📤</span> Upload Document
            </button>
            <input 
              type="text" 
              [(ngModel)]="searchTerm" 
              (input)="filterData()" 
              placeholder="Search documents..." 
              class="search-input" 
            />
          </div>
        </div>

        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Document Name</th>
                <th>Type</th>
                <th>Category</th>
                <th>Upload Date</th>
                <th>Size</th>
                <th>Uploaded By</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let doc of getPaginatedData()">
                <td>{{ doc.id }}</td>
                <td class="name-cell">{{ doc.name }}</td>
                <td><span class="type-badge">{{ doc.type }}</span></td>
                <td>{{ doc.category }}</td>
                <td>{{ doc.uploadDate }}</td>
                <td>{{ doc.size }}</td>
                <td>{{ doc.uploadedBy }}</td>
                <td>
                  <span class="status-badge" [class.status-active]="doc.status === 'Active'" [class.status-archived]="doc.status === 'Archived'">
                    {{ doc.status }}
                  </span>
                </td>
                <td class="action-cell">
                  <button class="action-btn" title="View">👁️</button>
                  <button class="action-btn" title="Download">⬇️</button>
                  <button class="action-btn" title="Delete">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="table-footer" *ngIf="filteredData.length > 0">
          <div class="entries-info">
            Showing {{ getStartIndex() }} to {{ getEndIndex() }} of {{ filteredData.length }} entries
          </div>
          <div class="pagination">
            <button class="page-btn" [disabled]="currentPage === 1" (click)="currentPage = 1">««</button>
            <button class="page-btn" [disabled]="currentPage === 1" (click)="currentPage--">«</button>
            <button class="page-btn active">{{ currentPage }}</button>
            <button class="page-btn" [disabled]="currentPage >= getTotalPages()" (click)="currentPage++">»</button>
            <button class="page-btn" [disabled]="currentPage >= getTotalPages()" (click)="currentPage = getTotalPages()">»»</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    .dms-container { padding: 0; max-width: 100%; margin: 0; animation: fadeInUp 0.5s ease-out; }
    .content-card { background: transparent; border-radius: 0; padding: 1rem; box-shadow: none; }
    .table-controls { display: flex; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
    .left-controls, .right-controls { display: flex; align-items: center; gap: 0.75rem; }
    .entries-select { padding: 0.75rem 1rem; border: none; border-radius: 10px; background: #f8f9fa; }
    .entries-label { color: #6c757d; font-weight: 600; }
    .btn-add { background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 0.75rem 1.75rem; border-radius: 12px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); display: inline-flex; align-items: center; gap: 0.5rem; }
    .btn-add:hover { transform: translateY(-2px); box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4); }
    .search-input { padding: 0.75rem 1rem; border: none; border-radius: 10px; background: #f8f9fa; min-width: 200px; }
    .table-wrapper { overflow-x: auto; border-radius: 12px; border: 1px solid #e0e0e0; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .data-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; background: white; }
    .data-table thead { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
    .data-table th { padding: 0.85rem 1rem; text-align: left; font-weight: 600; font-size: 0.9rem; white-space: nowrap; border-bottom: 1px solid rgba(255,255,255,0.2); }
    .data-table tbody tr { transition: all 0.2s ease; background: #ffe5e5; }
    .data-table tbody tr:nth-child(even) { background: #e5f0ff; }
    .data-table tbody tr:hover { background: linear-gradient(135deg, rgba(102, 126, 234, 0.12), rgba(118, 75, 162, 0.12)); transform: scale(1.005); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .data-table td { padding: 0.85rem 1rem; border-bottom: 1px solid #f0f0f0; color: #333; font-size: 0.9rem; }
    .name-cell { font-weight: 600; color: #2c3e50; }
    .type-badge { background: linear-gradient(135deg, #4facfe, #00f2fe); color: white; padding: 0.25rem 0.6rem; border-radius: 12px; font-size: 0.8rem; font-weight: 600; }
    .status-badge { padding: 0.25rem 0.6rem; border-radius: 12px; font-size: 0.8rem; font-weight: 600; white-space: nowrap; display: inline-block; color: white; }
    .status-active { background: linear-gradient(135deg, #11998e, #38ef7d); }
    .status-archived { background: linear-gradient(135deg, #f093fb, #f5576c); }
    .action-cell { text-align: center; white-space: nowrap; }
    .action-column {
      text-align: center;
      white-space: nowrap;
    }
    .action-column .action-btn {
      display: inline-flex;
      margin: 0 0.25rem;
    }
    .action-btn { background: transparent; border: none; cursor: pointer; padding: 0.4rem; border-radius: 4px; transition: all 0.2s; font-size: 1.1rem; color: #667eea; display: inline-flex; align-items: center; justify-content: center; }
    .action-btn:hover { background: rgba(102, 126, 234, 0.1); transform: scale(1.1); }
    .table-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid #e0e0e0; flex-wrap: wrap; gap: 1rem; }
    .entries-info { color: #666; font-size: 0.95rem; font-weight: 600; }
    .pagination { display: flex; gap: 0.25rem; }
    .page-btn { padding: 0.3rem 0.6rem; border: none; background: white; border-radius: 3px; cursor: pointer; font-size: 0.8rem; color: #333; transition: all 0.15s; min-width: 28px; text-align: center; }
    .page-btn:hover:not(:disabled) { background: #e9ecef; }
    .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .page-btn.active { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
  `]
})
export class DMSComponent implements OnInit {
  documents: Document[] = [
    { id: 1, name: 'Annual Report 2024.pdf', type: 'PDF', category: 'Annual Reports', uploadDate: '2025-01-15', size: '2.5 MB', uploadedBy: 'Admin', status: 'Active' },
    { id: 2, name: 'Board Resolution.docx', type: 'DOCX', category: 'Resolutions', uploadDate: '2025-01-20', size: '1.2 MB', uploadedBy: 'Secretary', status: 'Active' },
    { id: 3, name: 'AGM Minutes.pdf', type: 'PDF', category: 'Meeting Minutes', uploadDate: '2025-01-10', size: '3.1 MB', uploadedBy: 'Admin', status: 'Archived' }
  ];
  filteredData: Document[] = [];
  entriesPerPage: number = 10;
  currentPage: number = 1;
  searchTerm: string = '';

  ngOnInit(): void {
    this.filteredData = [...this.documents];
  }

  filterData(): void {
    this.filteredData = this.searchTerm
      ? this.documents.filter(doc =>
          doc.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          doc.category.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          doc.type.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      : [...this.documents];
    this.currentPage = 1;
  }

  getPaginatedData(): Document[] {
    const start = (this.currentPage - 1) * this.entriesPerPage;
    const end = start + this.entriesPerPage;
    return this.filteredData.slice(start, end);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredData.length / this.entriesPerPage);
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.entriesPerPage + 1;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.entriesPerPage, this.filteredData.length);
  }

  uploadDocument(): void {
    alert('Upload document functionality');
  }
}

