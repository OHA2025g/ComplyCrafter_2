import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SH11, SH11View } from './sh11.model';

@Injectable({
  providedIn: 'root'
})
export class SH11Service {
  private apiUrl = '/api/sh11';

  constructor(private http: HttpClient) { }

  getSH11s(): Observable<SH11View[]> {
    return this.http.get<SH11View[]>(this.apiUrl);
  }

  getSH11(id: number): Observable<SH11View> {
    return this.http.get<SH11View>(`${this.apiUrl}/${id}`);
  }

  createSH11(sh11: SH11): Observable<any> {
    return this.http.post(this.apiUrl, sh11);
  }

  updateSH11(id: number, sh11: SH11): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, sh11);
  }

  deleteSH11(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getSH11sByCompany(companyId: number): Observable<SH11View[]> {
    return this.http.get<SH11View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}