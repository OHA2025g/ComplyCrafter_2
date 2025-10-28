import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RUN, RUNView } from './run.model';

@Injectable({
  providedIn: 'root'
})
export class RUNService {
  private apiUrl = '/api/run';

  constructor(private http: HttpClient) { }

  getRUNs(): Observable<RUNView[]> {
    return this.http.get<RUNView[]>(this.apiUrl);
  }

  getRUN(id: number): Observable<RUNView> {
    return this.http.get<RUNView>(`${this.apiUrl}/${id}`);
  }

  createRUN(run: RUN): Observable<any> {
    return this.http.post(this.apiUrl, run);
  }

  updateRUN(id: number, run: RUN): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, run);
  }

  deleteRUN(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getRUNsByCompany(companyId: number): Observable<RUNView[]> {
    return this.http.get<RUNView[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}