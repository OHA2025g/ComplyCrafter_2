
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  private readonly baseUrl = '/api';

  constructor(private readonly http: HttpClient) {}

  health(): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(`${this.baseUrl}/healthz`);
  }

  saveAdt1(payload: unknown): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/forms/adt1`, payload);
  }

  saveBen2(payload: unknown): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/forms/ben2`, payload);
  }

  savePas3(payload: unknown): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/forms/pas3`, payload);
  }

  saveDpt3(payload: unknown): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/forms/dpt3`, payload);
  }

  submitPhase3Form(apiPath: string, payload: unknown): Observable<unknown> {
    return this.http.post(`${this.baseUrl}${apiPath}`, payload);
  }
}
