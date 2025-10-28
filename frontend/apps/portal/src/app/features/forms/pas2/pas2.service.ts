import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PAS2, PAS2View } from './pas2.model';

@Injectable({
  providedIn: 'root'
})
export class PAS2Service {
  private apiUrl = '/api/pas2';

  constructor(private http: HttpClient) { }

  getPAS2s(): Observable<PAS2View[]> {
    return this.http.get<PAS2View[]>(this.apiUrl);
  }

  getPAS2(id: number): Observable<PAS2View> {
    return this.http.get<PAS2View>(`${this.apiUrl}/${id}`);
  }

  createPAS2(pas2: PAS2): Observable<any> {
    return this.http.post(this.apiUrl, pas2);
  }

  updatePAS2(id: number, pas2: PAS2): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, pas2);
  }

  deletePAS2(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getPAS2sByCompany(companyId: number): Observable<PAS2View[]> {
    return this.http.get<PAS2View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}