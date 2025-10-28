import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Form24, Form24View } from './form24.model';

@Injectable({
  providedIn: 'root'
})
export class Form24Service {
  private apiUrl = '/api/form24';

  constructor(private http: HttpClient) { }

  getForm24s(): Observable<Form24View[]> {
    return this.http.get<Form24View[]>(this.apiUrl);
  }

  getForm24(id: number): Observable<Form24View> {
    return this.http.get<Form24View>(`${this.apiUrl}/${id}`);
  }

  createForm24(form24: Form24): Observable<any> {
    return this.http.post(this.apiUrl, form24);
  }

  updateForm24(id: number, form24: Form24): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, form24);
  }

  deleteForm24(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getForm24sByCompany(companyId: number): Observable<Form24View[]> {
    return this.http.get<Form24View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}