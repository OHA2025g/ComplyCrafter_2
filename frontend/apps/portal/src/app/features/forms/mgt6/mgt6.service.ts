import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MGT6, MGT6View } from './mgt6.model';

@Injectable({
  providedIn: 'root'
})
export class MGT6Service {
  private apiUrl = '/api/mgt6';

  constructor(private http: HttpClient) { }

  getMGT6s(): Observable<MGT6View[]> {
    return this.http.get<MGT6View[]>(this.apiUrl);
  }

  getMGT6(id: number): Observable<MGT6View> {
    return this.http.get<MGT6View>(`${this.apiUrl}/${id}`);
  }

  createMGT6(mgt6: MGT6): Observable<any> {
    return this.http.post(this.apiUrl, mgt6);
  }

  updateMGT6(id: number, mgt6: MGT6): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, mgt6);
  }

  deleteMGT6(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getMGT6sByCompany(companyId: number): Observable<MGT6View[]> {
    return this.http.get<MGT6View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}