import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GNL1, GNL1View } from './gnl1.model';

@Injectable({
  providedIn: 'root'
})
export class GNL1Service {
  private apiUrl = '/api/gnl1';

  constructor(private http: HttpClient) { }

  getGNL1s(): Observable<GNL1View[]> {
    return this.http.get<GNL1View[]>(this.apiUrl);
  }

  getGNL1(id: number): Observable<GNL1View> {
    return this.http.get<GNL1View>(`${this.apiUrl}/${id}`);
  }

  createGNL1(gnl1: GNL1): Observable<any> {
    return this.http.post(this.apiUrl, gnl1);
  }

  updateGNL1(id: number, gnl1: GNL1): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, gnl1);
  }

  deleteGNL1(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getGNL1sByCompany(companyId: number): Observable<GNL1View[]> {
    return this.http.get<GNL1View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}