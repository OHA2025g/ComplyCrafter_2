import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MSC3, MSC3View } from './msc3.model';

@Injectable({
  providedIn: 'root'
})
export class MSC3Service {
  private apiUrl = '/api/msc3';

  constructor(private http: HttpClient) { }

  getMSC3s(): Observable<MSC3View[]> {
    return this.http.get<MSC3View[]>(this.apiUrl);
  }

  getMSC3(id: number): Observable<MSC3View> {
    return this.http.get<MSC3View>(`${this.apiUrl}/${id}`);
  }

  createMSC3(msc3: MSC3): Observable<any> {
    return this.http.post(this.apiUrl, msc3);
  }

  updateMSC3(id: number, msc3: MSC3): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, msc3);
  }

  deleteMSC3(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getMSC3sByCompany(companyId: number): Observable<MSC3View[]> {
    return this.http.get<MSC3View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}