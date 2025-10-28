import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RUNLLP, RUNLLPView } from './runllp.model';

@Injectable({
  providedIn: 'root'
})
export class RUNLLPService {
  private apiUrl = '/api/runllp';

  constructor(private http: HttpClient) { }

  getRUNLLPs(): Observable<RUNLLPView[]> {
    return this.http.get<RUNLLPView[]>(this.apiUrl);
  }

  getRUNLLP(id: number): Observable<RUNLLPView> {
    return this.http.get<RUNLLPView>(`${this.apiUrl}/${id}`);
  }

  createRUNLLP(runllp: RUNLLP): Observable<any> {
    return this.http.post(this.apiUrl, runllp);
  }

  updateRUNLLP(id: number, runllp: RUNLLP): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, runllp);
  }

  deleteRUNLLP(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getRUNLLPsByCompany(companyId: number): Observable<RUNLLPView[]> {
    return this.http.get<RUNLLPView[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}