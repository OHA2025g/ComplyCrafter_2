import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CHARGE, CHARGEView } from './charge.model';

@Injectable({
  providedIn: 'root'
})
export class CHARGEService {
  private apiUrl = '/api/charge';

  constructor(private http: HttpClient) { }

  getCHARGEs(): Observable<CHARGEView[]> {
    return this.http.get<CHARGEView[]>(this.apiUrl);
  }

  getCHARGE(id: number): Observable<CHARGEView> {
    return this.http.get<CHARGEView>(`${this.apiUrl}/${id}`);
  }

  createCHARGE(charge: CHARGE): Observable<any> {
    return this.http.post(this.apiUrl, charge);
  }

  updateCHARGE(id: number, charge: CHARGE): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, charge);
  }

  deleteCHARGE(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getCHARGEsByCompany(companyId: number): Observable<CHARGEView[]> {
    return this.http.get<CHARGEView[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}