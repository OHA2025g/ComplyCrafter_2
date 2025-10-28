import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Form28, Form28View } from './form28.model';

@Injectable({
  providedIn: 'root'
})
export class Form28Service {
  private apiUrl = '/api/form28';

  constructor(private http: HttpClient) { }

  getForm28s(): Observable<Form28View[]> {
    return this.http.get<Form28View[]>(this.apiUrl);
  }

  getForm28(id: number): Observable<Form28View> {
    return this.http.get<Form28View>(`${this.apiUrl}/${id}`);
  }

  createForm28(form28: Form28): Observable<any> {
    return this.http.post(this.apiUrl, form28);
  }

  updateForm28(id: number, form28: Form28): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, form28);
  }

  deleteForm28(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getForm28sByCompany(companyId: number): Observable<Form28View[]> {
    return this.http.get<Form28View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}