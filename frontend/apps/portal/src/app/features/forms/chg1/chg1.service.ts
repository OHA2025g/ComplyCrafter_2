import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CHG1, CHG1View } from './chg1.model';

@Injectable({
  providedIn: 'root'
})
export class CHG1Service {
  private apiUrl = '/api/chg1';

  constructor(private http: HttpClient) { }

  getCHG1s(): Observable<CHG1View[]> {
    return this.http.get<CHG1View[]>(this.apiUrl);
  }

  getCHG1(id: number): Observable<CHG1View> {
    return this.http.get<CHG1View>(`${this.apiUrl}/${id}`);
  }

  createCHG1(chg1: CHG1): Observable<any> {
    return this.http.post(this.apiUrl, chg1);
  }

  updateCHG1(id: number, chg1: CHG1): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, chg1);
  }

  deleteCHG1(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getCHG1sByCompany(companyId: number): Observable<CHG1View[]> {
    return this.http.get<CHG1View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}