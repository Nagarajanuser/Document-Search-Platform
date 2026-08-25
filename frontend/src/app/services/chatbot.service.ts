import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatData {
  question: string;
  answer: string;
  sources?: any[];
  session_id?: string | null;
}

export interface ChatResponse {
  success?: boolean;
  data?: ChatData;
  error?: string | null;
  question?: string;
  answer?: string;
  session_id?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'http://localhost:8000/api/v1/ask';

  constructor(private http: HttpClient) {}

  askQuestion(question: string, session_id: string | null = null): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.apiUrl, { question, session_id });
  }
}
