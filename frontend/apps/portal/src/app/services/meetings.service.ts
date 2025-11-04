import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BoardMeeting {
  srNo: number;
  meetingNo: string;
  meetingDate: string;
  venue: string;
  attendees: number;
  status: string;
}

export interface AGMMeeting {
  srNo: number;
  financialYear: string;
  meetingDate: string;
  venue: string;
  shareholders: number;
  status: string;
}

export interface EGMMeeting {
  srNo: number;
  meetingNo: string;
  meetingDate: string;
  purpose: string;
  venue: string;
  status: string;
}

export interface CommitteeMeeting {
  srNo: number;
  meetingNo: string;
  committeeType: string;
  meetingDate: string;
  venue: string;
  members: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class MeetingsService {
  private baseUrl = 'http://localhost:8100/meetings';

  constructor(private http: HttpClient) {}

  // Board Meetings
  getBoardMeetings(companyId?: number): Observable<BoardMeeting[]> {
    const url = companyId ? `${this.baseUrl}/board?company_id=${companyId}` : `${this.baseUrl}/board`;
    return this.http.get<BoardMeeting[]>(url);
  }

  createBoardMeeting(data: BoardMeeting): Observable<any> {
    return this.http.post(`${this.baseUrl}/board`, data);
  }

  deleteBoardMeeting(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/board/${id}`);
  }

  // AGM
  getAGMMeetings(companyId?: number): Observable<AGMMeeting[]> {
    const url = companyId ? `${this.baseUrl}/agm?company_id=${companyId}` : `${this.baseUrl}/agm`;
    return this.http.get<AGMMeeting[]>(url);
  }

  createAGMMeeting(data: AGMMeeting): Observable<any> {
    return this.http.post(`${this.baseUrl}/agm`, data);
  }

  // EGM
  getEGMMeetings(companyId?: number): Observable<EGMMeeting[]> {
    const url = companyId ? `${this.baseUrl}/egm?company_id=${companyId}` : `${this.baseUrl}/egm`;
    return this.http.get<EGMMeeting[]>(url);
  }

  createEGMMeeting(data: EGMMeeting): Observable<any> {
    return this.http.post(`${this.baseUrl}/egm`, data);
  }

  // Committee Meetings
  getCommitteeMeetings(companyId?: number): Observable<CommitteeMeeting[]> {
    const url = companyId ? `${this.baseUrl}/committee?company_id=${companyId}` : `${this.baseUrl}/committee`;
    return this.http.get<CommitteeMeeting[]>(url);
  }

  createCommitteeMeeting(data: CommitteeMeeting): Observable<any> {
    return this.http.post(`${this.baseUrl}/committee`, data);
  }
}

