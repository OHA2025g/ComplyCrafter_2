import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MGT14, MGT14View } from './mgt14.model';

@Injectable({
  providedIn: 'root'
})
export class MGT14Service {
  private apiUrl = '/api/mgt14';

  constructor(private http: HttpClient) { }

  getMGT14s(): Observable<MGT14View[]> {
    return this.http.get<MGT14View[]>(this.apiUrl);
  }

  getMGT14(id: number): Observable<MGT14View> {
    return this.http.get<MGT14View>(`${this.apiUrl}/${id}`);
  }

  createMGT14(mgt14: MGT14): Observable<any> {
    return this.http.post(this.apiUrl, mgt14);
  }

  updateMGT14(id: number, mgt14: MGT14): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, mgt14);
  }

  deleteMGT14(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getMGT14sByCompany(companyId: number): Observable<MGT14View[]> {
    return this.http.get<MGT14View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}