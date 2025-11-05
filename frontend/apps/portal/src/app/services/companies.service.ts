import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Company {
  id?: number;
  srNo?: number;
  cin: string;
  name: string;
  incorporationDate?: string;
  entityType: string;
  status: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/companies`;

  getAll(userId?: number, isActive?: boolean): Observable<Company[]> {
    let url = this.apiUrl + '/';  // Add trailing slash for base route
    const params: string[] = [];
    
    if (userId) {
      params.push(`user_id=${userId}`);
    }
    if (isActive !== undefined) {
      params.push(`is_active=${isActive}`);
    }
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    return this.http.get<Company[]>(url);
  }

  getById(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/${id}`);
  }

  add(company: Company): Observable<any> {
    return this.http.post(this.apiUrl + '/', company);  // Add trailing slash for base route
  }

  update(id: number, company: Partial<Company>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, company);
  }

  delete(id: number, softDelete: boolean = true): Observable<any> {
    const url = softDelete 
      ? `${this.apiUrl}/${id}?soft_delete=true`
      : `${this.apiUrl}/${id}?soft_delete=false`;
    return this.http.delete(url);
  }

  activate(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/activate`, {});
  }
}

