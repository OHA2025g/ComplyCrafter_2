import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DPT4, DPT4View } from './dpt4.model';

@Injectable({
  providedIn: 'root'
})
export class DPT4Service {
  private apiUrl = '/api/dpt4';

  constructor(private http: HttpClient) { }

  getDPT4s(): Observable<DPT4View[]> {
    return this.http.get<DPT4View[]>(this.apiUrl);
  }

  getDPT4(id: number): Observable<DPT4View> {
    return this.http.get<DPT4View>(`${this.apiUrl}/${id}`);
  }

  createDPT4(dpt4: DPT4): Observable<any> {
    return this.http.post(this.apiUrl, dpt4);
  }

  updateDPT4(id: number, dpt4: DPT4): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dpt4);
  }

  deleteDPT4(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getDPT4sByCompany(companyId: number): Observable<DPT4View[]> {
    return this.http.get<DPT4View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}