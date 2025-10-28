import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Form4, Form4View } from './form4.model';

@Injectable({
  providedIn: 'root'
})
export class Form4Service {
  private apiUrl = '/api/form4';

  constructor(private http: HttpClient) { }

  getForm4s(): Observable<Form4View[]> {
    return this.http.get<Form4View[]>(this.apiUrl);
  }

  getForm4(id: number): Observable<Form4View> {
    return this.http.get<Form4View>(`${this.apiUrl}/${id}`);
  }

  createForm4(form4: Form4): Observable<any> {
    return this.http.post(this.apiUrl, form4);
  }

  updateForm4(id: number, form4: Form4): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, form4);
  }

  deleteForm4(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getForm4sByCompany(companyId: number): Observable<Form4View[]> {
    return this.http.get<Form4View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}