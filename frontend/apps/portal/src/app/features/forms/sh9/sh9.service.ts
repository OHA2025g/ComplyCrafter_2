import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SH9, SH9View } from './sh9.model';

@Injectable({
  providedIn: 'root'
})
export class SH9Service {
  private apiUrl = '/api/sh9';

  constructor(private http: HttpClient) { }

  getSH9s(): Observable<SH9View[]> {
    return this.http.get<SH9View[]>(this.apiUrl);
  }

  getSH9(id: number): Observable<SH9View> {
    return this.http.get<SH9View>(`${this.apiUrl}/${id}`);
  }

  createSH9(sh9: SH9): Observable<any> {
    return this.http.post(this.apiUrl, sh9);
  }

  updateSH9(id: number, sh9: SH9): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, sh9);
  }

  deleteSH9(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getSH9sByCompany(companyId: number): Observable<SH9View[]> {
    return this.http.get<SH9View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}