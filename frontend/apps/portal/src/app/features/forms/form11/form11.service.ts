import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Form11, Form11View } from './form11.model';

@Injectable({
  providedIn: 'root'
})
export class Form11Service {
  private apiUrl = '/api/form11';

  constructor(private http: HttpClient) { }

  getForm11s(): Observable<Form11View[]> {
    return this.http.get<Form11View[]>(this.apiUrl);
  }

  getForm11(id: number): Observable<Form11View> {
    return this.http.get<Form11View>(`${this.apiUrl}/${id}`);
  }

  createForm11(form11: Form11): Observable<any> {
    return this.http.post(this.apiUrl, form11);
  }

  updateForm11(id: number, form11: Form11): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, form11);
  }

  deleteForm11(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getForm11sByCompany(companyId: number): Observable<Form11View[]> {
    return this.http.get<Form11View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}