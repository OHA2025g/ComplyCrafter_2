import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthorizedCapital {
  srNo: number;
  shareClass: string;
  authorizedShares: number;
  faceValue: number;
  totalAmount: number;
  amendmentDate: string;
}

export interface PaidUpCapital {
  srNo: number;
  shareClass: string;
  paidUpShares: number;
  faceValue: number;
  totalAmount: number;
  subscriptionDate: string;
}

export interface ShareCapital {
  srNo: number;
  shareClass: string;
  authorizedShares: number;
  paidUpShares: number;
  faceValue: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class CapitalService {
  private baseUrl = `${environment.apiUrl}/capital`;

  constructor(private http: HttpClient) {}

  // Authorized Capital
  getAuthorizedCapital(companyId?: number): Observable<AuthorizedCapital[]> {
    const url = companyId ? `${this.baseUrl}/authorized?company_id=${companyId}` : `${this.baseUrl}/authorized`;
    return this.http.get<AuthorizedCapital[]>(url);
  }

  createAuthorizedCapital(data: AuthorizedCapital): Observable<any> {
    return this.http.post(`${this.baseUrl}/authorized`, data);
  }

  // Paid-up Capital
  getPaidUpCapital(companyId?: number): Observable<PaidUpCapital[]> {
    const url = companyId ? `${this.baseUrl}/paid-up?company_id=${companyId}` : `${this.baseUrl}/paid-up`;
    return this.http.get<PaidUpCapital[]>(url);
  }

  createPaidUpCapital(data: PaidUpCapital): Observable<any> {
    return this.http.post(`${this.baseUrl}/paid-up`, data);
  }

  // Share Capital
  getShareCapital(companyId?: number): Observable<ShareCapital[]> {
    const url = companyId ? `${this.baseUrl}/share?company_id=${companyId}` : `${this.baseUrl}/share`;
    return this.http.get<ShareCapital[]>(url);
  }

  createShareCapital(data: ShareCapital): Observable<any> {
    return this.http.post(`${this.baseUrl}/share`, data);
  }
}

