import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GNL3, GNL3View } from './gnl3.model';

@Injectable({
  providedIn: 'root'
})
export class GNL3Service {
  private apiUrl = '/api/gnl3';

  constructor(private http: HttpClient) { }

  getGNL3s(): Observable<GNL3View[]> {
    return this.http.get<GNL3View[]>(this.apiUrl);
  }

  getGNL3(id: number): Observable<GNL3View> {
    return this.http.get<GNL3View>(`${this.apiUrl}/${id}`);
  }

  createGNL3(gnl3: GNL3): Observable<any> {
    return this.http.post(this.apiUrl, gnl3);
  }

  updateGNL3(id: number, gnl3: GNL3): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, gnl3);
  }

  deleteGNL3(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getGNL3sByCompany(companyId: number): Observable<GNL3View[]> {
    return this.http.get<GNL3View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}