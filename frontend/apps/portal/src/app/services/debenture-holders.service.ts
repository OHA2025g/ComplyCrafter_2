import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DebentureHolder {
  srNo: number;
  holderName: string;
  debentureNo: string;
  debentureType: string;
  units: number;
  faceValue: number;
  issueDate: string;
  maturityDate: string;
  interestRate: number;
  status: string;
  pan: string;
  companyCin: string;
}

@Injectable({
  providedIn: 'root'
})
export class DebentureHoldersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/debenture-holders`;

  getAll(companyId?: number, companyCin?: string): Observable<DebentureHolder[]> {
    let url = this.apiUrl;
    const params: string[] = [];
    
    if (companyId) params.push(`company_id=${companyId}`);
    if (companyCin) params.push(`company_cin=${companyCin}`);
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    return this.http.get<DebentureHolder[]>(url);
  }

  create(holder: any): Observable<any> {
    return this.http.post(this.apiUrl, holder);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

