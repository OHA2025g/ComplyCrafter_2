import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CHG4, CHG4View } from './chg4.model';

@Injectable({
  providedIn: 'root'
})
export class CHG4Service {
  private apiUrl = '/api/chg4';

  constructor(private http: HttpClient) { }

  getCHG4s(): Observable<CHG4View[]> {
    return this.http.get<CHG4View[]>(this.apiUrl);
  }

  getCHG4(id: number): Observable<CHG4View> {
    return this.http.get<CHG4View>(`${this.apiUrl}/${id}`);
  }

  createCHG4(chg4: CHG4): Observable<any> {
    return this.http.post(this.apiUrl, chg4);
  }

  updateCHG4(id: number, chg4: CHG4): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, chg4);
  }

  deleteCHG4(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getCHG4sByCompany(companyId: number): Observable<CHG4View[]> {
    return this.http.get<CHG4View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}