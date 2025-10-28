import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { STK2, STK2View } from './stk2.model';

@Injectable({
  providedIn: 'root'
})
export class STK2Service {
  private apiUrl = '/api/stk2';

  constructor(private http: HttpClient) { }

  getSTK2s(): Observable<STK2View[]> {
    return this.http.get<STK2View[]>(this.apiUrl);
  }

  getSTK2(id: number): Observable<STK2View> {
    return this.http.get<STK2View>(`${this.apiUrl}/${id}`);
  }

  createSTK2(stk2: STK2): Observable<any> {
    return this.http.post(this.apiUrl, stk2);
  }

  updateSTK2(id: number, stk2: STK2): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, stk2);
  }

  deleteSTK2(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getSTK2sByCompany(companyId: number): Observable<STK2View[]> {
    return this.http.get<STK2View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}