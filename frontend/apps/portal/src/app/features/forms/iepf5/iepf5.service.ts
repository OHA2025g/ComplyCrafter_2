import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEPF5, IEPF5View } from './iepf5.model';

@Injectable({
  providedIn: 'root'
})
export class IEPF5Service {
  private apiUrl = '/api/iepf5';

  constructor(private http: HttpClient) { }

  getIEPF5s(): Observable<IEPF5View[]> {
    return this.http.get<IEPF5View[]>(this.apiUrl);
  }

  getIEPF5(id: number): Observable<IEPF5View> {
    return this.http.get<IEPF5View>(`${this.apiUrl}/${id}`);
  }

  createIEPF5(iepf5: IEPF5): Observable<any> {
    return this.http.post(this.apiUrl, iepf5);
  }

  updateIEPF5(id: number, iepf5: IEPF5): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, iepf5);
  }

  deleteIEPF5(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getIEPF5sByCompany(companyId: number): Observable<IEPF5View[]> {
    return this.http.get<IEPF5View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}