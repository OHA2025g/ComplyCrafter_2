import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DIR5, DIR5View } from './dir5.model';

@Injectable({
  providedIn: 'root'
})
export class DIR5Service {
  private apiUrl = '/api/dir5';

  constructor(private http: HttpClient) { }

  getDIR5s(): Observable<DIR5View[]> {
    return this.http.get<DIR5View[]>(this.apiUrl);
  }

  getDIR5(id: number): Observable<DIR5View> {
    return this.http.get<DIR5View>(`${this.apiUrl}/${id}`);
  }

  createDIR5(dir5: DIR5): Observable<any> {
    return this.http.post(this.apiUrl, dir5);
  }

  updateDIR5(id: number, dir5: DIR5): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dir5);
  }

  deleteDIR5(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getDIR5sByCompany(companyId: number): Observable<DIR5View[]> {
    return this.http.get<DIR5View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}