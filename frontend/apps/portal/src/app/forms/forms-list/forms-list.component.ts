import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ALL_FORMS_CONFIG, FormConfig, getAllCategories } from '../generic-form/all-forms.config';
import { CcCardComponent } from '@frontend/ui';

interface CategoryGroup {
  name: string;
  forms: FormConfig[];
}

@Component({
  selector: 'app-forms-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CcCardComponent],
  templateUrl: './forms-list.component.html',
  styleUrls: ['./forms-list.component.scss']
})
export class FormsListComponent implements OnInit {
  allForms: FormConfig[] = [];
  filteredForms: FormConfig[] = [];
  categoryGroups: CategoryGroup[] = [];
  
  categories: string[] = [];
  selectedCategory = 'All';
  searchTerm = '';

  constructor(private router: Router) {}

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
   * Navigate to form
   */
  openForm(formCode: string): void {
    this.router.navigate(['/forms', formCode]);
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

