import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GNL2, GNL2View } from './gnl2.model';

@Injectable({
  providedIn: 'root'
})
export class GNL2Service {
  private apiUrl = '/api/gnl2';

  constructor(private http: HttpClient) { }

  getGNL2s(): Observable<GNL2View[]> {
    return this.http.get<GNL2View[]>(this.apiUrl);
  }

  getGNL2(id: number): Observable<GNL2View> {
    return this.http.get<GNL2View>(`${this.apiUrl}/${id}`);
  }

  createGNL2(gnl2: GNL2): Observable<any> {
    return this.http.post(this.apiUrl, gnl2);
  }

  updateGNL2(id: number, gnl2: GNL2): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, gnl2);
  }

  deleteGNL2(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getGNL2sByCompany(companyId: number): Observable<GNL2View[]> {
    return this.http.get<GNL2View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}