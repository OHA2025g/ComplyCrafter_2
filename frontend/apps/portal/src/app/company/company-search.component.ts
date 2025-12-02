import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';

interface CompanyResult {
  company_name: string;
  cin: string;
  company_status?: string;
  company_class?: string;
  registration_date?: string;
}

@Component({
  selector: 'app-company-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="company-search-container">
      <div class="search-header">
        <a [routerLink]="['/forms']" class="back-link">← Back to Forms</a>
        <h1>🏢 Company Search & Registration</h1>
        <p>Search companies from <span class="highlight">MCA database</span> and add to your account</p>
      </div>

      <div class="search-section">
        <form [formGroup]="searchForm" (ngSubmit)="searchCompany()" class="search-form">
          <div class="search-input-group">
            <span class="search-icon-prefix">🔍</span>
            <input 
              type="text" 
              formControlName="query"
              placeholder="Enter company name (e.g., ILLUMINATI INNOVATION)"
              class="search-input"
            />
            <button 
              type="submit" 
              class="btn-search"
              [disabled]="searchForm.invalid || searching"
            >
              <span *ngIf="!searching">Search Company</span>
              <span *ngIf="searching" class="spinner-inline"></span>
              <span *ngIf="searching">Searching...</span>
            </button>
          </div>
        </form>

        <div *ngIf="searching" class="loading">
          <div class="spinner"></div>
          <p>Searching MCA database...</p>
        </div>

        <div *ngIf="searchError" class="alert-error">
          {{ searchError }}
        </div>

        <div *ngIf="searchResults.length > 0" class="results-section">
          <h2>Search Results ({{ searchResults.length }} companies found)</h2>
          
          <div class="results-grid">
            <div *ngFor="let company of searchResults" class="company-card">
              <div class="company-header">
                <h3>{{ company.company_name }}</h3>
                <span class="company-status" [class.active]="company.company_status === 'Active'">
                  {{ company.company_status || 'Unknown' }}
                </span>
              </div>
              
              <div class="company-details">
                <div class="detail-row">
                  <span class="label">CIN:</span>
                  <span class="value">{{ company.cin }}</span>
                </div>
                <div class="detail-row" *ngIf="company.company_class">
                  <span class="label">Class:</span>
                  <span class="value">{{ company.company_class }}</span>
                </div>
                <div class="detail-row" *ngIf="company.registration_date">
                  <span class="label">Registration:</span>
                  <span class="value">{{ company.registration_date }}</span>
                </div>
              </div>
              
              <button 
                (click)="addCompany(company)" 
                class="btn-add"
                [disabled]="adding === company.cin"
              >
                {{ adding === company.cin ? 'Adding...' : '✓ Add to My Companies' }}
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="addSuccess" class="alert-success">
          ✓ Company added successfully! You can now use it in forms.
        </div>
      </div>

      <div class="my-companies-section" *ngIf="myCompanies.length > 0">
        <h2>My Companies ({{ myCompanies.length }})</h2>
        
        <div class="companies-list">
          <div *ngFor="let company of myCompanies" class="my-company-item">
            <div class="company-info">
              <h4>{{ company.company_name }}</h4>
              <p class="cin">{{ company.cin }}</p>
            </div>
            <button class="btn-use">Use in Forms</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .company-search-container { max-width: 1200px; margin: 0 auto; padding: 2rem; animation: fadeInUp 0.5s ease-out; }
    .search-header { background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05)); border-radius: 16px; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 4px 16px rgba(0,0,0,0.05); }
    .back-link { color: #667eea; text-decoration: none; font-weight: 600; transition: all 0.2s; margin-bottom: 1rem; display: inline-block; }
    .back-link:hover { color: #764ba2; transform: translateX(-4px); }
    h1 { font-size: 2.3rem; font-weight: 800; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 0.5rem 0; }
    .search-header p { color: #6c757d; margin: 0.5rem 0 0 0; font-size: 1.05rem; }
    .highlight { color: #667eea; font-weight: 700; }
    .search-section { background: white; border-radius: 16px; padding: 2.5rem; box-shadow: 0 4px 16px rgba(0,0,0,0.08); margin-bottom: 2rem; }
    .search-form { margin-bottom: 2rem; }
    .search-input-group { display: flex; gap: 1rem; position: relative; }
    .search-icon-prefix { position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%); font-size: 1.3rem; color: #adb5bd; pointer-events: none; }
    .search-input { flex: 1; padding: 1rem 1.25rem 1rem 3.5rem; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 1rem; transition: all 0.3s; background: #f8f9fa; }
    .search-input:focus { outline: none; border-color: #667eea; background: white; box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1); }
    .btn-search { background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 1rem 2.5rem; border-radius: 12px; font-size: 1rem; font-weight: 700; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); transition: all 0.3s; }
    .btn-search:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4); }
    .btn-search:disabled { opacity: 0.6; cursor: not-allowed; }
    .spinner-inline { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; margin-right: 0.5rem; }
    .loading { text-align: center; padding: 3rem; color: #6c757d; }
    .spinner { border: 4px solid #f0f0f0; border-top-color: #667eea; border-radius: 50%; width: 48px; height: 48px; animation: spin 1s linear infinite; margin: 0 auto 1rem; }
    .alert-error { background: #fff5f5; color: #cc0000; padding: 1.25rem; border-radius: 12px; border: 2px solid #ffdddd; border-left: 4px solid #ff4444; font-weight: 600; }
    .alert-success { background: #f0fdf4; color: #166534; padding: 1.25rem; border-radius: 12px; border: 2px solid #bbf7d0; border-left: 4px solid #22c55e; margin-top: 1rem; font-weight: 600; }
    .results-section h2 { font-size: 1.6rem; font-weight: 700; color: #2c3e50; margin-bottom: 1.5rem; }
    .results-grid { display: grid; gap: 1.5rem; }
    .company-card { background: white; border: 2px solid #f0f0f0; border-radius: 16px; padding: 1.75rem; transition: all 0.3s; position: relative; overflow: hidden; animation: fadeInUp 0.5s ease-out; }
    .company-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: linear-gradient(90deg, #667eea, #764ba2); opacity: 0; transition: opacity 0.3s; }
    .company-card:hover { border-color: #667eea; box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15); transform: translateY(-2px); }
    .company-card:hover::before { opacity: 1; }
    .company-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem; gap: 1rem; }
    .company-header h3 { font-size: 1.3rem; color: #2c3e50; margin: 0; flex: 1; font-weight: 700; }
    .company-status { padding: 0.4rem 0.85rem; border-radius: 20px; font-size: 0.85rem; font-weight: 700; color: white; box-shadow: 0 2px 6px rgba(0,0,0,0.15); }
    .company-status.active { background: linear-gradient(135deg, #11998e, #38ef7d); }
    .company-status { background: linear-gradient(135deg, #f093fb, #f5576c); }
    .company-details { margin-bottom: 1.5rem; display: grid; gap: 0.75rem; }
    .detail-row { display: flex; background: #f8f9fa; padding: 0.75rem; border-radius: 8px; }
    .detail-row .label { font-weight: 700; width: 140px; color: #6c757d; font-size: 0.9rem; }
    .detail-row .value { color: #2c3e50; font-family: 'Courier New', monospace; font-weight: 600; }
    .btn-add { background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 1rem 2rem; border-radius: 12px; font-size: 1rem; font-weight: 700; cursor: pointer; width: 100%; transition: all 0.3s; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); }
    .btn-add:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4); }
    .btn-add:disabled { opacity: 0.6; cursor: not-allowed; }
    .my-companies-section { background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 4px 16px rgba(0,0,0,0.08); animation: fadeInUp 0.6s ease-out; }
    .my-companies-section h2 { font-size: 1.6rem; font-weight: 700; color: #2c3e50; margin-bottom: 1.5rem; }
    .companies-list { display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
    .my-company-item { background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05)); border: 2px solid #f0f0f0; border-radius: 12px; padding: 1.5rem; transition: all 0.3s; }
    .my-company-item:hover { border-color: #667eea; box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15); transform: translateY(-2px); }
    .company-info h4 { margin: 0 0 0.5rem 0; color: #2c3e50; font-weight: 700; font-size: 1.15rem; }
    .company-info .cin { margin: 0; color: #6c757d; font-size: 0.9rem; font-family: 'Courier New', monospace; font-weight: 600; }
    .btn-use { background: linear-gradient(135deg, #4facfe, #00f2fe); color: white; border: none; padding: 0.65rem 1.75rem; border-radius: 10px; cursor: pointer; font-weight: 700; transition: all 0.3s; box-shadow: 0 2px 8px rgba(79, 172, 254, 0.3); }
    .btn-use:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(79, 172, 254, 0.4); }
    @media (max-width: 768px) { .search-input-group { flex-direction: column; } .search-input { padding-left: 3.5rem; } .companies-list { grid-template-columns: 1fr; } }
  `]
})
export class CompanySearchComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http: HttpClient = inject(HttpClient);

  searchForm: FormGroup = this.fb.group({
    query: ['', [Validators.required, Validators.minLength(3)]]
  });

  searching = false;
  searchError = '';
  searchResults: CompanyResult[] = [];
  
  adding = '';
  addSuccess = false;
  myCompanies: CompanyResult[] = [];

  private readonly API_BASE_URL = environment.apiUrl;

  async searchCompany(): Promise<void> {
    if (this.searchForm.invalid) {
      return;
    }

    this.searching = true;
    this.searchError = '';
    this.searchResults = [];
    this.addSuccess = false;

    try {
      const query = this.searchForm.value.query;
      const response: any = await this.http.get(
        `${this.API_BASE_URL}/mca/search?query=${encodeURIComponent(query)}`,
        { 
          // Allow up to 60 seconds for MCA API (it's slow)
          // Note: Angular HttpClient timeout is handled differently, but this documents intent
        }
      ).toPromise();

      // Check response structure
      if (response.source === 'api_timeout') {
        this.searchError = '⏱️ Search timed out. The MCA API is slow. Please try a more specific search term or try again in a moment.';
        return;
      }
      
      if (response.source === 'api_error') {
        this.searchError = `❌ MCA API Error: ${response.error || 'Unable to reach MCA service'}. Please try again.`;
        return;
      }

      this.searchResults = response.results || [];
      
      if (this.searchResults.length === 0) {
        if (response.source === 'cache') {
          this.searchError = '🔍 No companies found in cache. Searching MCA API (this may take 30-60 seconds)...';
          // The backend will handle live API call on next attempt
        } else {
          this.searchError = '🔍 No companies found. Try different search terms or check the company name spelling.';
        }
      } else {
        // Success - show results
        console.log(`✅ Found ${this.searchResults.length} companies (source: ${response.source})`);
      }
    } catch (e: any) {
      console.error('Search error:', e);
      
      // Better error messages based on error type
      if (e.status === 0) {
        this.searchError = '❌ Cannot connect to backend service. Please check if the forms service is running.';
      } else if (e.status === 504 || e.status === 408) {
        this.searchError = '⏱️ Request timed out. The MCA API is slow for new searches. Please try again or search for a cached company first.';
      } else if (e.error?.detail) {
        this.searchError = e.error.detail;
      } else {
        this.searchError = `❌ Search failed (${e.status || 'Unknown error'}). Please try again.`;
      }
    } finally {
      this.searching = false;
    }
  }

  async addCompany(company: CompanyResult): Promise<void> {
    this.adding = company.cin;
    this.addSuccess = false;

    try {
      // Add company to user's companies list
      await this.http.post(`${this.API_BASE_URL}/companies/`, {
        cin: company.cin,
        company_name: company.company_name,
        company_status: company.company_status,
        company_class: company.company_class
      }).toPromise();

      this.addSuccess = true;
      this.myCompanies.push(company);
      
      // Remove from search results
      this.searchResults = this.searchResults.filter(c => c.cin !== company.cin);
    } catch (e: any) {
      this.searchError = e?.error?.detail || 'Failed to add company.';
    } finally {
      this.adding = '';
    }
  }
}

