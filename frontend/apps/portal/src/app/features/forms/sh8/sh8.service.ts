import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SH8, SH8View } from './sh8.model';

@Injectable({
  providedIn: 'root'
})
export class SH8Service {
  private apiUrl = '/api/sh8';

  constructor(private http: HttpClient) { }

  getSH8s(): Observable<SH8View[]> {
    return this.http.get<SH8View[]>(this.apiUrl);
  }

  getSH8(id: number): Observable<SH8View> {
    return this.http.get<SH8View>(`${this.apiUrl}/${id}`);
  }

  createSH8(sh8: SH8): Observable<any> {
    return this.http.post(this.apiUrl, sh8);
  }

  updateSH8(id: number, sh8: SH8): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, sh8);
  }

  deleteSH8(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getSH8sByCompany(companyId: number): Observable<SH8View[]> {
    return this.http.get<SH8View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}