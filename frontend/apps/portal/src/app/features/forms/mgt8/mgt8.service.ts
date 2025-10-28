import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MGT8, MGT8View } from './mgt8.model';

@Injectable({
  providedIn: 'root'
})
export class MGT8Service {
  private apiUrl = '/api/mgt8';

  constructor(private http: HttpClient) { }

  getMGT8s(): Observable<MGT8View[]> {
    return this.http.get<MGT8View[]>(this.apiUrl);
  }

  getMGT8(id: number): Observable<MGT8View> {
    return this.http.get<MGT8View>(`${this.apiUrl}/${id}`);
  }

  createMGT8(mgt8: MGT8): Observable<any> {
    return this.http.post(this.apiUrl, mgt8);
  }

  updateMGT8(id: number, mgt8: MGT8): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, mgt8);
  }

  deleteMGT8(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getMGT8sByCompany(companyId: number): Observable<MGT8View[]> {
    return this.http.get<MGT8View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}