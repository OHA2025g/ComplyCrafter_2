import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MR1, MR1View } from './mr1.model';

@Injectable({
  providedIn: 'root'
})
export class MR1Service {
  private apiUrl = '/api/mr1';

  constructor(private http: HttpClient) { }

  getMR1s(): Observable<MR1View[]> {
    return this.http.get<MR1View[]>(this.apiUrl);
  }

  getMR1(id: number): Observable<MR1View> {
    return this.http.get<MR1View>(`${this.apiUrl}/${id}`);
  }

  createMR1(mr1: MR1): Observable<any> {
    return this.http.post(this.apiUrl, mr1);
  }

  updateMR1(id: number, mr1: MR1): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, mr1);
  }

  deleteMR1(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getMR1sByCompany(companyId: number): Observable<MR1View[]> {
    return this.http.get<MR1View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}