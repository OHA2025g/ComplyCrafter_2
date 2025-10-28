import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CHG9, CHG9View } from './chg9.model';

@Injectable({
  providedIn: 'root'
})
export class CHG9Service {
  private apiUrl = '/api/chg9';

  constructor(private http: HttpClient) { }

  getCHG9s(): Observable<CHG9View[]> {
    return this.http.get<CHG9View[]>(this.apiUrl);
  }

  getCHG9(id: number): Observable<CHG9View> {
    return this.http.get<CHG9View>(`${this.apiUrl}/${id}`);
  }

  createCHG9(chg9: CHG9): Observable<any> {
    return this.http.post(this.apiUrl, chg9);
  }

  updateCHG9(id: number, chg9: CHG9): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, chg9);
  }

  deleteCHG9(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getCHG9sByCompany(companyId: number): Observable<CHG9View[]> {
    return this.http.get<CHG9View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}