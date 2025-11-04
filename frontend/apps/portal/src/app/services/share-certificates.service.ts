import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ShareCertificate {
  srNo: number;
  certificateNo: string;
  certificateType: string;
  folioNo: string;
  shareholderName: string;
  distinctiveNoFrom: string;
  distinctiveNoTo: string;
  shares: number;
  faceValue: number;
  issueDate: string;
  status: string;
  companyCin: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShareCertificatesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8100/share-certificates';

  getAll(companyId?: number, companyCin?: string, certificateType?: string): Observable<ShareCertificate[]> {
    let url = this.apiUrl;
    const params: string[] = [];
    
    if (companyId) params.push(`company_id=${companyId}`);
    if (companyCin) params.push(`company_cin=${companyCin}`);
    if (certificateType) params.push(`certificate_type=${certificateType}`);
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    return this.http.get<ShareCertificate[]>(url);
  }

  create(certificate: any): Observable<any> {
    return this.http.post(this.apiUrl, certificate);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

