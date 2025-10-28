import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DIR9, DIR9View } from './dir9.model';

@Injectable({
  providedIn: 'root'
})
export class DIR9Service {
  private apiUrl = '/api/dir9';

  constructor(private http: HttpClient) { }

  getDIR9s(): Observable<DIR9View[]> {
    return this.http.get<DIR9View[]>(this.apiUrl);
  }

  getDIR9(id: number): Observable<DIR9View> {
    return this.http.get<DIR9View>(`${this.apiUrl}/${id}`);
  }

  createDIR9(dir9: DIR9): Observable<any> {
    return this.http.post(this.apiUrl, dir9);
  }

  updateDIR9(id: number, dir9: DIR9): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dir9);
  }

  deleteDIR9(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getDIR9sByCompany(companyId: number): Observable<DIR9View[]> {
    return this.http.get<DIR9View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}