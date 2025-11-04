import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Agenda {
  id?: number;
  srNo?: number;
  agendaTitle: string;
  description: string;
  meetingType: string;
  status: string;
  createdDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class AgendasService {
  private apiUrl = 'http://localhost:8100/agendas';

  constructor(private http: HttpClient) {}

  getAll(companyId?: number): Observable<Agenda[]> {
    const url = companyId ? `${this.apiUrl}?company_id=${companyId}` : this.apiUrl;
    return this.http.get<Agenda[]>(url);
  }

  getById(id: number): Observable<Agenda> {
    return this.http.get<Agenda>(`${this.apiUrl}/${id}`);
  }

  create(agenda: Agenda): Observable<any> {
    return this.http.post(this.apiUrl, agenda);
  }

  update(id: number, agenda: Agenda): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, agenda);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

