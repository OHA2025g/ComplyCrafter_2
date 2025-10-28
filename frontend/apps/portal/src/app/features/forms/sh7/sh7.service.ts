import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SH7, SH7View } from './sh7.model';

@Injectable({
  providedIn: 'root'
})
export class SH7Service {
  private apiUrl = '/api/sh7';

  constructor(private http: HttpClient) { }

  getSH7s(): Observable<SH7View[]> {
    return this.http.get<SH7View[]>(this.apiUrl);
  }

  getSH7(id: number): Observable<SH7View> {
    return this.http.get<SH7View>(`${this.apiUrl}/${id}`);
  }

  createSH7(sh7: SH7): Observable<any> {
    return this.http.post(this.apiUrl, sh7);
  }

  updateSH7(id: number, sh7: SH7): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, sh7);
  }

  deleteSH7(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getSH7sByCompany(companyId: number): Observable<SH7View[]> {
    return this.http.get<SH7View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}