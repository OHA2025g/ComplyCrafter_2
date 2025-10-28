import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PAS6, PAS6View } from './pas6.model';

@Injectable({
  providedIn: 'root'
})
export class PAS6Service {
  private apiUrl = '/api/pas6';

  constructor(private http: HttpClient) { }

  getPAS6s(): Observable<PAS6View[]> {
    return this.http.get<PAS6View[]>(this.apiUrl);
  }

  getPAS6(id: number): Observable<PAS6View> {
    return this.http.get<PAS6View>(`${this.apiUrl}/${id}`);
  }

  createPAS6(pas6: PAS6): Observable<any> {
    return this.http.post(this.apiUrl, pas6);
  }

  updatePAS6(id: number, pas6: PAS6): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, pas6);
  }

  deletePAS6(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getPAS6sByCompany(companyId: number): Observable<PAS6View[]> {
    return this.http.get<PAS6View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}