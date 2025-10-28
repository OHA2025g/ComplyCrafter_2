import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CHG6, CHG6View } from './chg6.model';

@Injectable({
  providedIn: 'root'
})
export class CHG6Service {
  private apiUrl = '/api/chg6';

  constructor(private http: HttpClient) { }

  getCHG6s(): Observable<CHG6View[]> {
    return this.http.get<CHG6View[]>(this.apiUrl);
  }

  getCHG6(id: number): Observable<CHG6View> {
    return this.http.get<CHG6View>(`${this.apiUrl}/${id}`);
  }

  createCHG6(chg6: CHG6): Observable<any> {
    return this.http.post(this.apiUrl, chg6);
  }

  updateCHG6(id: number, chg6: CHG6): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, chg6);
  }

  deleteCHG6(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getCHG6sByCompany(companyId: number): Observable<CHG6View[]> {
    return this.http.get<CHG6View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}