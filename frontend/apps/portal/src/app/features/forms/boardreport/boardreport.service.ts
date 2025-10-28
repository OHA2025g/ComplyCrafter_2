import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BOARDREPORT, BOARDREPORTView } from './boardreport.model';

@Injectable({
  providedIn: 'root'
})
export class BOARDREPORTService {
  private apiUrl = '/api/boardreport';

  constructor(private http: HttpClient) { }

  getBOARDREPORTs(): Observable<BOARDREPORTView[]> {
    return this.http.get<BOARDREPORTView[]>(this.apiUrl);
  }

  getBOARDREPORT(id: number): Observable<BOARDREPORTView> {
    return this.http.get<BOARDREPORTView>(`${this.apiUrl}/${id}`);
  }

  createBOARDREPORT(boardreport: BOARDREPORT): Observable<any> {
    return this.http.post(this.apiUrl, boardreport);
  }

  updateBOARDREPORT(id: number, boardreport: BOARDREPORT): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, boardreport);
  }

  deleteBOARDREPORT(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getBOARDREPORTsByCompany(companyId: number): Observable<BOARDREPORTView[]> {
    return this.http.get<BOARDREPORTView[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}