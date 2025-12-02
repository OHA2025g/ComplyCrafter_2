import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ALL_FORMS_CONFIG, FormConfig, getAllCategories } from '../generic-form/all-forms.config';

interface CategoryGroup {
  name: string;
  forms: FormConfig[];
}

@Component({
  selector: 'app-forms-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="forms-container">
      <header class="forms-header">
        <div class="header-top">
          <div class="header-content">
            <h1>📝 Forms Directory</h1>
            <p class="subtitle">Explore all <span class="highlight">{{ allForms.length }}</span> MCA Compliance Forms</p>
          </div>
          <a [routerLink]="['/company-search']" class="btn-company-search">
            <span class="icon">🏢</span>
            <span>Search & Add Company</span>
          </a>
        </div>
        
        <div class="filters">
          <div class="search-wrapper">
            <span class="search-icon">🔍</span>
            <input 
              type="text" 
              [(ngModel)]="searchTerm" 
              (input)="applyFilters()"
              placeholder="Search forms by name or code..."
              class="search-input"
            />
          </div>
          
          <select [(ngModel)]="selectedCategory" (change)="applyFilters()" class="category-select">
            <option *ngFor="let cat of categories" [value]="cat">
              {{ cat }} ({{ getFormCountByCategory(cat) }})
            </option>
          </select>
        </div>
      </header>

      <div class="results-badge">
        <span class="badge">{{ filteredForms.length }} of {{ allForms.length }} forms</span>
      </div>

      <div *ngFor="let group of categoryGroups; let i = index" class="category-accordion" [style.animation-delay.ms]="i * 50">
        <div class="accordion-header" (click)="toggleCategory(group.name)">
          <div class="accordion-title">
            <span class="category-icon">📂</span>
            <h2>{{ group.name }}</h2>
            <span class="form-count-badge">{{ group.forms.length }}</span>
          </div>
          <span class="accordion-icon" [class.expanded]="expandedCategory === group.name">
            {{ expandedCategory === group.name ? '▼' : '▶' }}
          </span>
        </div>
        
        <div class="accordion-content" [class.expanded]="expandedCategory === group.name">
          <div class="forms-grid">
            <a *ngFor="let form of group.forms; let j = index" 
               [routerLink]="['/forms', form.code]" 
               class="form-card"
               [style.animation-delay.ms]="j * 30">
              <div class="form-gradient-bg"></div>
              <div class="form-header">
                <h3 class="form-code">{{ form.code }}</h3>
                <span class="form-phase phase-{{ form.phase || 3 }}">
                  Phase {{ form.phase || '3+' }}
                </span>
              </div>
              <p class="form-title">{{ form.title }}</p>
              <p class="form-description">{{ form.description }}</p>
              <div class="btn-open">
                <span>Open Form</span>
                <span class="arrow">→</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div *ngIf="filteredForms.length === 0" class="no-results">
        <div class="no-results-icon">🔍</div>
        <p>No forms found matching your criteria</p>
        <button (click)="searchTerm = ''; selectedCategory = 'All'; applyFilters()" class="btn-reset">
          Clear Filters
        </button>
      </div>
    </div>
  `,
  styles: [`
    .forms-container {
      padding: 0;
      max-width: 100%;
      margin: 0;
    }
    .forms-header {
      margin-bottom: 2rem;
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 1.5rem;
    }
    h1 {
      font-size: 2.5rem;
      color: #1f3c88;
      margin-bottom: 0.5rem;
    }
    .btn-company-search {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      padding: 0.875rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      white-space: nowrap;
      transition: transform 0.2s;
    }
    .btn-company-search:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102,126,234,0.3);
    }
    .subtitle {
      color: #666;
      font-size: 1.1rem;
      margin-bottom: 1.5rem;
    }
    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .search-input {
      flex: 1;
      padding: 0.75rem;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
    }
    .category-select {
      padding: 0.75rem;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      background: white;
      min-width: 200px;
    }
    .results-count {
      color: #666;
      margin-bottom: 2rem;
      font-size: 0.95rem;
    }
    .category-accordion {
      margin-bottom: 1rem;
      background: white;
      border-radius: 10px;
      border: 2px solid #e0e0e0;
      overflow: hidden;
      transition: all 0.3s;
    }
    .category-accordion:hover {
      border-color: #667eea;
    }
    .accordion-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      cursor: pointer;
      background: #f8f9fa;
      transition: background 0.2s;
    }
    .accordion-header:hover {
      background: #e9ecef;
    }
    .accordion-title {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .accordion-title h2 {
      font-size: 1.5rem;
      color: #1f3c88;
      margin: 0;
    }
    .form-count {
      background: #e3f2fd;
      color: #1565c0;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.9rem;
      font-weight: 600;
    }
    .accordion-icon {
      font-size: 1.2rem;
      color: #667eea;
      transition: transform 0.3s;
    }
    .accordion-icon.expanded {
      transform: rotate(0deg);
    }
    .accordion-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.4s ease-out, padding 0.4s ease-out;
      padding: 0 1.5rem;
    }
    .accordion-content.expanded {
      max-height: 10000px;
      padding: 1.5rem;
      transition: max-height 0.5s ease-in, padding 0.3s ease-in;
    }
    .forms-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .form-card {
      display: block;
      text-decoration: none;
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      color: inherit;
    }
    .form-card:hover {
      border-color: #1f3c88;
      box-shadow: 0 4px 12px rgba(31,60,136,0.2);
      transform: translateY(-2px);
    }
    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }
    .form-code {
      font-size: 1.3rem;
      color: #1f3c88;
      font-weight: 700;
      margin: 0;
    }
    .form-phase {
      background: #e3f2fd;
      color: #1565c0;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
    }
    .form-title {
      font-weight: 600;
      color: #333;
      margin-bottom: 0.5rem;
      font-size: 1rem;
    }
    .form-description {
      color: #666;
      font-size: 0.9rem;
      line-height: 1.4;
      margin-bottom: 1rem;
    }
    .btn-open {
      background: #1f3c88;
      color: white;
      padding: 0.65rem 1.25rem;
      border-radius: 6px;
      font-size: 0.95rem;
      transition: background 0.2s;
      font-weight: 600;
      text-align: center;
      display: block;
      margin-top: 0.5rem;
    }
    .form-card:hover .btn-open {
      background: #152a5e;
    }
    .no-results {
      text-align: center;
      padding: 3rem;
      color: #666;
    }
    .no-results p {
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }
    .btn-reset {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      padding: 0.875rem 2rem;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }
    .btn-reset:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
    }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    .forms-container { animation: fadeInUp 0.5s ease-out; }
    .header-content { }
    h1 { background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 800; }
    .highlight { color: #667eea; font-weight: 800; }
    .search-wrapper { position: relative; }
    .search-icon { position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%); font-size: 1.2rem; color: #adb5bd; pointer-events: none; }
    .search-input { padding-left: 3.5rem; border-radius: 12px; background: white; border-color: #e0e0e0; transition: all 0.3s; }
    .search-input:focus { border-color: #667eea; box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1); outline: none; }
    .category-select { border-radius: 12px; border-color: #e0e0e0; font-weight: 600; transition: all 0.3s; }
    .category-select:focus { border-color: #667eea; box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1); outline: none; }
    .results-badge { margin-bottom: 1.5rem; }
    .badge { background: linear-gradient(135deg, #4facfe, #00f2fe); color: white; padding: 0.5rem 1.25rem; border-radius: 20px; font-weight: 700; display: inline-block; box-shadow: 0 2px 8px rgba(79, 172, 254, 0.3); }
    .category-accordion { box-shadow: 0 4px 16px rgba(0,0,0,0.08); border-radius: 16px; border: none; animation: fadeInUp 0.6s ease-out; }
    .category-accordion:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.12); transform: translateY(-2px); }
    .accordion-header { background: linear-gradient(135deg, rgba(102, 126, 234, 0.03), rgba(118, 75, 162, 0.03)); border-bottom: 2px solid transparent; padding: 1.75rem 2rem; }
    .accordion-header:hover { background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08)); border-bottom-color: #667eea; }
    .category-icon { font-size: 1.5rem; }
    .accordion-title h2 { color: #2c3e50; font-weight: 700; }
    .form-count-badge { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 0.35rem 0.85rem; border-radius: 20px; font-size: 0.85rem; font-weight: 700; box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3); }
    .accordion-icon { color: #667eea; font-weight: 700; font-size: 1.3rem; }
    .accordion-icon.expanded { transform: rotate(90deg); }
    .accordion-content.expanded { padding: 2rem; }
    .forms-grid { grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); }
    .form-card { border-radius: 16px; border-color: #f0f0f0; box-shadow: 0 2px 8px rgba(0,0,0,0.06); padding: 1.75rem; position: relative; overflow: hidden; animation: fadeInUp 0.5s ease-out; }
    .form-gradient-bg { position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: linear-gradient(90deg, #667eea, #764ba2); opacity: 0; transition: opacity 0.3s; }
    .form-card:hover .form-gradient-bg { opacity: 1; }
    .form-card:hover { border-color: #667eea; box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15); transform: translateY(-4px); }
    .form-code { color: #667eea; font-weight: 800; font-size: 1.4rem; }
    .form-phase { padding: 0.4rem 0.85rem; border-radius: 20px; font-weight: 700; color: white; box-shadow: 0 2px 6px rgba(0,0,0,0.15); }
    .phase-1 { background: linear-gradient(135deg, #11998e, #38ef7d); }
    .phase-2 { background: linear-gradient(135deg, #4facfe, #00f2fe); }
    .phase-3 { background: linear-gradient(135deg, #f093fb, #f5576c); }
    .form-title { font-weight: 700; color: #2c3e50; margin-bottom: 0.75rem; font-size: 1.05rem; }
    .form-description { color: #6c757d; line-height: 1.6; }
    .btn-open { background: linear-gradient(135deg, #667eea, #764ba2); padding: 0.75rem 1.5rem; border-radius: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.5rem; box-shadow: 0 2px 8px rgba(102, 126, 234, 0.25); }
    .btn-open .arrow { transition: transform 0.3s; font-size: 1.2rem; }
    .form-card:hover .btn-open { box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4); }
    .form-card:hover .btn-open .arrow { transform: translateX(4px); }
    .no-results { padding: 4rem 2rem; background: white; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
    .no-results-icon { font-size: 4rem; margin-bottom: 1rem; opacity: 0.5; }
    .no-results p { font-size: 1.2rem; color: #6c757d; font-weight: 600; }
    @media (max-width: 768px) { h1 { font-size: 2rem; } .filters { flex-direction: column; } .header-top { flex-direction: column; } .forms-grid { grid-template-columns: 1fr; } }
  `]
})
export class FormsListComponent implements OnInit {
  allForms: FormConfig[] = [];
  filteredForms: FormConfig[] = [];
  categoryGroups: CategoryGroup[] = [];
  
  categories: string[] = [];
  selectedCategory = 'All';
  searchTerm = '';
  expandedCategory: string | null = null;

  ngOnInit(): void {
    // Load all forms
    this.allForms = Object.values(ALL_FORMS_CONFIG);
    this.filteredForms = [...this.allForms];

    // Get all categories
    this.categories = ['All', ...getAllCategories()];

    // Group by categories
    this.updateCategoryGroups();
  }

  /**
   * Filter forms by search term and category
   */
  applyFilters(): void {
    let filtered = [...this.allForms];

    // Filter by category
    if (this.selectedCategory && this.selectedCategory !== 'All') {
      filtered = filtered.filter(form => form.category === this.selectedCategory);
    }

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(form =>
        form.code.toLowerCase().includes(term) ||
        form.title.toLowerCase().includes(term) ||
        form.description.toLowerCase().includes(term)
      );
    }

    this.filteredForms = filtered;
    this.updateCategoryGroups();
  }

  /**
   * Update category groups based on filtered forms
   */
  private updateCategoryGroups(): void {
    const groups: Map<string, FormConfig[]> = new Map();

    for (const form of this.filteredForms) {
      const category = form.category || 'Other';
      if (!groups.has(category)) {
        groups.set(category, []);
      }
      groups.get(category)!.push(form);
    }

    this.categoryGroups = Array.from(groups.entries())
      .map(([name, forms]) => ({ name, forms }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Select category
   */
  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  /**
   * Toggle accordion category
   */
  toggleCategory(category: string): void {
    if (this.expandedCategory === category) {
      this.expandedCategory = null; // Collapse if already expanded
    } else {
      this.expandedCategory = category; // Expand this category
    }
  }

  /**
   * Get form count by category
   */
  getFormCountByCategory(category: string): number {
    if (category === 'All') {
      return this.allForms.length;
    }
    return this.allForms.filter(f => f.category === category).length;
  }
}

