import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CHG8, CHG8View } from './chg8.model';

@Injectable({
  providedIn: 'root'
})
export class CHG8Service {
  private apiUrl = '/api/chg8';

  constructor(private http: HttpClient) { }

  getCHG8s(): Observable<CHG8View[]> {
    return this.http.get<CHG8View[]>(this.apiUrl);
  }

  getCHG8(id: number): Observable<CHG8View> {
    return this.http.get<CHG8View>(`${this.apiUrl}/${id}`);
  }

  createCHG8(chg8: CHG8): Observable<any> {
    return this.http.post(this.apiUrl, chg8);
  }

  updateCHG8(id: number, chg8: CHG8): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, chg8);
  }

  deleteCHG8(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getCHG8sByCompany(companyId: number): Observable<CHG8View[]> {
    return this.http.get<CHG8View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}