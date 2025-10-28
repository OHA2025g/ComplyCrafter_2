import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEPF2, IEPF2View } from './iepf2.model';

@Injectable({
  providedIn: 'root'
})
export class IEPF2Service {
  private apiUrl = '/api/iepf2';

  constructor(private http: HttpClient) { }

  getIEPF2s(): Observable<IEPF2View[]> {
    return this.http.get<IEPF2View[]>(this.apiUrl);
  }

  getIEPF2(id: number): Observable<IEPF2View> {
    return this.http.get<IEPF2View>(`${this.apiUrl}/${id}`);
  }

  createIEPF2(iepf2: IEPF2): Observable<any> {
    return this.http.post(this.apiUrl, iepf2);
  }

  updateIEPF2(id: number, iepf2: IEPF2): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, iepf2);
  }

  deleteIEPF2(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getIEPF2sByCompany(companyId: number): Observable<IEPF2View[]> {
    return this.http.get<IEPF2View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}