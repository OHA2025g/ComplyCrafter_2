import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MGT9, MGT9View } from './mgt9.model';

@Injectable({
  providedIn: 'root'
})
export class MGT9Service {
  private apiUrl = '/api/mgt9';

  constructor(private http: HttpClient) { }

  getMGT9s(): Observable<MGT9View[]> {
    return this.http.get<MGT9View[]>(this.apiUrl);
  }

  getMGT9(id: number): Observable<MGT9View> {
    return this.http.get<MGT9View>(`${this.apiUrl}/${id}`);
  }

  createMGT9(mgt9: MGT9): Observable<any> {
    return this.http.post(this.apiUrl, mgt9);
  }

  updateMGT9(id: number, mgt9: MGT9): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, mgt9);
  }

  deleteMGT9(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getMGT9sByCompany(companyId: number): Observable<MGT9View[]> {
    return this.http.get<MGT9View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}