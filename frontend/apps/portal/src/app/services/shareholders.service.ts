import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Shareholder {
  srNo: number;
  shareholderName: string;
  folioNo: string;
  category: string;
  subCategory: string;
  underSubCategory: string;
  sharesHeld: number;
  pan: string;
  status: string;
  companyCin: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShareholdersService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8100/shareholders';

  getAll(companyId?: number, companyCin?: string): Observable<Shareholder[]> {
    let url = this.apiUrl;
    const params: string[] = [];
    
    if (companyId) params.push(`company_id=${companyId}`);
    if (companyCin) params.push(`company_cin=${companyCin}`);
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    return this.http.get<Shareholder[]>(url);
  }

  create(shareholder: any): Observable<any> {
    return this.http.post(this.apiUrl, shareholder);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

