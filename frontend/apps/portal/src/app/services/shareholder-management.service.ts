import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ShareholderTransaction {
  srNo: number;
  shareholderName: string;
  folioNo: string;
  transactionType: string;
  shares: number;
  transactionDate: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShareholderManagementService {
  private apiUrl = 'http://localhost:8100/shareholder-management';

  constructor(private http: HttpClient) {}

  getAll(companyId?: number): Observable<ShareholderTransaction[]> {
    const url = companyId ? `${this.apiUrl}?company_id=${companyId}` : this.apiUrl;
    return this.http.get<ShareholderTransaction[]>(url);
  }

  create(transaction: ShareholderTransaction): Observable<any> {
    return this.http.post(this.apiUrl, transaction);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

