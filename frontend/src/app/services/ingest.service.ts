import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IngestedFileSummary {
  filename: string;
  status: string;
  total_chunks: number;
  saved_path: string;
}

export interface IngestResponseData {
  message: string;
  processed_files: IngestedFileSummary[];
}

export interface IngestErrorResponse {
  code: string;
  message: string;
}

export interface IngestApiResponse {
  success: boolean;
  data?: IngestResponseData | null;
  error?: IngestErrorResponse | null;
}

@Injectable({
  providedIn: 'root'
})
export class IngestService {
  private apiUrl = 'http://localhost:8000/api/v1/ingest';

  constructor(private http: HttpClient) {}

  uploadPdfFiles(files: File[]): Observable<IngestApiResponse> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file, file.name);
    });
    return this.http.post<IngestApiResponse>(this.apiUrl, formData);
  }
}
