import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IngestService, IngestApiResponse, IngestedFileSummary } from '../services/ingest.service';

interface LocalFileItem {
  file: File;
  name: string;
  sizeFormatted: string;
  status: 'Pending' | 'Uploading' | 'Completed' | 'Success' | 'Error';
  errorMessage?: string;
}

@Component({
  selector: 'app-ingest',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid py-4">
      <!-- Header Banner -->
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 class="h3 mb-1 text-gray-800 fw-bold d-flex align-items-center">
            <i class="bi bi-cloud-arrow-up text-primary me-2 display-6"></i>
            PDF Document Ingestion Pipeline
          </h1>
          <p class="text-muted small mb-0">
            Upload PDF policies, manuals, or documents. The platform automatically cleans, chunks, embeds with HuggingFace, and indexes vectors into Pinecone for RAG retrieval.
          </p>
        </div>
        <span class="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill font-monospace small">
          <i class="bi bi-cpu me-1"></i> BAAI/bge-small-en-v1.5
        </span>
      </div>

      <div class="row g-4">
        <!-- Main Upload Card -->
        <div class="col-12 col-xl-7">
          <div class="card border-0 shadow-sm rounded-4 bg-white p-4">
            <h5 class="fw-bold text-dark mb-3">
              <i class="bi bi-file-earmark-pdf text-danger me-2"></i> Document Upload Payload
            </h5>

            <!-- Success Alert Banner -->
            <div *ngIf="uploadSuccessMessage" class="alert alert-success mb-4 rounded-3 d-flex align-items-center justify-content-between border-0 shadow-sm" role="alert" style="background-color: #d1fae5; color: #065f46;">
              <div class="d-flex align-items-center">
                <i class="bi bi-check-circle-fill fs-3 me-3 text-success"></i>
                <div>
                  <h6 class="fw-bold mb-0">{{ uploadSuccessMessage }}</h6>
                  <span class="small opacity-75">Document vectorized into Pinecone index. Ready for next upload!</span>
                </div>
              </div>
              <button type="button" class="btn-close" (click)="uploadSuccessMessage = null" aria-label="Close"></button>
            </div>

            <!-- Error Banner -->
            <div *ngIf="errorMessage" class="alert alert-danger mb-4 rounded-3 d-flex align-items-center justify-content-between" role="alert">
              <div class="d-flex align-items-center">
                <i class="bi bi-exclamation-triangle-fill fs-4 me-2"></i>
                <div>
                  <strong>Ingestion Error:</strong> {{ errorMessage }}
                </div>
              </div>
              <button type="button" class="btn-close" (click)="errorMessage = null" aria-label="Close"></button>
            </div>

            <!-- Drag & Drop Zone -->
            <div 
              class="drop-zone border border-2 rounded-4 p-5 text-center transition-all cursor-pointer position-relative mb-4"
              [class.drag-over]="isDragOver"
              (dragover)="onDragOver($event)"
              (dragleave)="onDragLeave($event)"
              (drop)="onDrop($event)"
              (click)="fileInput.click()"
            >
              <input 
                #fileInput 
                type="file" 
                multiple 
                accept=".pdf,application/pdf" 
                class="d-none" 
                (change)="onFileSelected($event)" 
              />
              
              <div class="mb-3">
                <div class="icon-pulse-container d-inline-flex p-3 rounded-circle mb-2" style="background: rgba(99, 102, 241, 0.15);">
                  <i class="bi bi-cloud-arrow-up-fill display-4 text-primary"></i>
                </div>
              </div>
              <h5 class="drop-zone-title mb-2">
                Drag & Drop PDF files here or <span class="text-primary text-decoration-underline">browse files</span>
              </h5>
              <p class="drop-zone-subtitle small mb-0">
                Supports high-resolution PDF document chunking, HuggingFace embeddings & Pinecone vector indexing.
              </p>
            </div>

            <!-- Selected File List -->
            <div *ngIf="selectedFiles.length > 0" class="mb-4">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="fw-bold text-secondary mb-0 small text-uppercase tracking-wider">
                  Selected Files for Ingestion ({{ selectedFiles.length }})
                </h6>
                <button (click)="clearFiles()" [disabled]="isIngesting" class="btn btn-link text-danger p-0 text-decoration-none small">
                  Clear Selection
                </button>
              </div>

              <div class="list-group list-group-flush rounded-3 border">
                <div *ngFor="let item of selectedFiles; let idx = index" class="list-group-item d-flex align-items-center justify-content-between py-3">
                  <div class="d-flex align-items-center overflow-hidden me-3">
                    <i class="bi bi-file-pdf-fill text-danger fs-3 me-3"></i>
                    <div>
                      <h6 class="mb-0 fw-semibold text-dark text-truncate" style="max-width: 320px;">{{ item.name }}</h6>
                      <span class="text-muted small">{{ item.sizeFormatted }}</span>
                    </div>
                  </div>

                  <div class="d-flex align-items-center">
                    <span class="badge rounded-pill me-2 px-3 py-1" [ngClass]="{
                      'bg-secondary-subtle text-secondary': item.status === 'Pending',
                      'bg-warning-subtle text-warning': item.status === 'Uploading',
                      'bg-success-subtle text-success': item.status === 'Completed' || item.status === 'Success',
                      'bg-danger-subtle text-danger': item.status === 'Error'
                    }">
                      <i class="bi me-1" [ngClass]="{
                        'bi-clock': item.status === 'Pending',
                        'bi-arrow-repeat spin': item.status === 'Uploading',
                        'bi-check-circle-fill': item.status === 'Completed' || item.status === 'Success',
                        'bi-exclamation-triangle-fill': item.status === 'Error'
                      }"></i>
                      {{ (item.status === 'Completed' || item.status === 'Success') ? 'Completed' : item.status }}
                    </span>

                    <button 
                      *ngIf="!isIngesting" 
                      (click)="removeFile(idx)" 
                      class="btn btn-sm btn-light text-secondary border-0 rounded-circle"
                      title="Remove file"
                    >
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ingest Action Button -->
            <div class="d-grid gap-2">
              <button 
                (click)="submitIngestion()" 
                [disabled]="selectedFiles.length === 0 || isIngesting" 
                class="btn btn-primary btn-lg fw-bold py-3 shadow-sm rounded-3 d-flex align-items-center justify-content-center"
              >
                <ng-container *ngIf="!isIngesting">
                  <i class="bi bi-box-arrow-in-down me-2"></i> Ingest & Vectorize PDFs
                </ng-container>
                <ng-container *ngIf="isIngesting">
                  <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Parsing & Vectorizing to Pinecone...
                </ng-container>
              </button>
            </div>

          </div>
        </div>

        <!-- Right Side: Pipeline Info & Ingested History -->
        <div class="col-12 col-xl-5">
          <!-- Ingested Documents History Card -->
          <div *ngIf="ingestedHistory.length > 0" class="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="fw-bold text-dark mb-0">
                <i class="bi bi-check2-square text-success me-2"></i> Ingested Documents ({{ ingestedHistory.length }})
              </h5>
              <span class="badge bg-success text-white px-3 py-1 rounded-pill small">
                Active in Pinecone
              </span>
            </div>

            <div class="list-group list-group-flush rounded-3 border mb-0" style="max-height: 280px; overflow-y: auto;">
              <div *ngFor="let fileRes of ingestedHistory" class="list-group-item p-3">
                <div class="d-flex justify-content-between align-items-start mb-1">
                  <span class="fw-bold text-dark"><i class="bi bi-file-pdf text-danger me-1"></i> {{ fileRes.filename }}</span>
                  <span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                    {{ fileRes.total_chunks }} Chunks
                  </span>
                </div>
                <div class="small text-muted font-monospace bg-light p-2 rounded text-break">
                  <i class="bi bi-folder-check me-1 text-primary"></i> {{ fileRes.saved_path }}
                </div>
              </div>
            </div>
          </div>

          <!-- Architecture & Info Card -->
          <div class="card border-0 shadow-sm rounded-4 bg-white p-4">
            <h5 class="fw-bold text-dark mb-3">
              <i class="bi bi-gear-wide-connected text-primary me-2"></i> RAG Ingestion Pipeline
            </h5>

            <div class="timeline ps-2">
              <div class="d-flex mb-3">
                <div class="me-3">
                  <span class="badge rounded-circle bg-primary-subtle text-primary p-2">1</span>
                </div>
                <div>
                  <h6 class="fw-bold text-dark mb-1">Hi-Res PDF Partitioning</h6>
                  <p class="text-muted small mb-0">Extracts structural elements like Titles, Narrative Text, and Tables using Unstructured PDF partitioner.</p>
                </div>
              </div>

              <div class="d-flex mb-3">
                <div class="me-3">
                  <span class="badge rounded-circle bg-primary-subtle text-primary p-2">2</span>
                </div>
                <div>
                  <h6 class="fw-bold text-dark mb-1">Section-Aware Chunking</h6>
                  <p class="text-muted small mb-0">Filters headers, merges table rows, and splits text based on numbered section headings.</p>
                </div>
              </div>

              <div class="d-flex mb-3">
                <div class="me-3">
                  <span class="badge rounded-circle bg-primary-subtle text-primary p-2">3</span>
                </div>
                <div>
                  <h6 class="fw-bold text-dark mb-1">HuggingFace Embeddings</h6>
                  <p class="text-muted small mb-0">Generates 384-dimensional dense vector embeddings using model <code>BAAI/bge-small-en-v1.5</code>.</p>
                </div>
              </div>

              <div class="d-flex">
                <div class="me-3">
                  <span class="badge rounded-circle bg-success-subtle text-success p-2">4</span>
                </div>
                <div>
                  <h6 class="fw-bold text-dark mb-1">Pinecone Upsert</h6>
                  <p class="text-muted small mb-0">Stores vectors and document section metadata in Pinecone index for hybrid retrieval.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .drop-zone {
      border: 2px dashed #6366f1 !important;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%) !important;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .drop-zone:hover, .drop-zone.drag-over {
      border-color: #818cf8 !important;
      background: rgba(99, 102, 241, 0.18) !important;
      box-shadow: 0 0 25px rgba(99, 102, 241, 0.25) !important;
      transform: translateY(-2px);
    }
    .drop-zone-title {
      color: #f8fafc !important;
      font-weight: 700;
      font-size: 1.1rem;
    }
    .drop-zone-subtitle {
      color: #94a3b8 !important;
    }
    .icon-pulse-container {
      transition: transform 0.2s ease;
    }
    .drop-zone:hover .icon-pulse-container {
      transform: scale(1.1);
    }
    .spin {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      100% { transform: rotate(360deg); }
    }
  `]
})
export class IngestComponent {
  @ViewChild('fileInput') fileInputRef!: ElementRef;

  selectedFiles: LocalFileItem[] = [];
  isDragOver = false;
  isIngesting = false;
  errorMessage: string | null = null;
  uploadSuccessMessage: string | null = null;
  ingestedHistory: IngestedFileSummary[] = [];

  constructor(private ingestService: IngestService) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    if (event.dataTransfer?.files) {
      this.addFiles(Array.from(event.dataTransfer.files));
    }
  }

  onFileSelected(event: any) {
    if (event.target.files) {
      this.addFiles(Array.from(event.target.files));
    }
  }

  private addFiles(files: File[]) {
    const pdfFiles = files.filter(f => f.name.toLowerCase().endsWith('.pdf'));
    if (pdfFiles.length === 0) {
      this.errorMessage = 'Please select valid PDF file(s).';
      return;
    }

    this.errorMessage = null;
    this.uploadSuccessMessage = null;

    // If existing list contains completed uploads, clear them out so new files start fresh
    if (this.selectedFiles.some(item => item.status === 'Completed' || item.status === 'Success')) {
      this.selectedFiles = [];
    }

    pdfFiles.forEach(file => {
      if (!this.selectedFiles.some(item => item.name === file.name)) {
        this.selectedFiles.push({
          file: file,
          name: file.name,
          sizeFormatted: this.formatBytes(file.size),
          status: 'Pending'
        });
      }
    });
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  clearFiles(resetMessages: boolean = true) {
    this.selectedFiles = [];
    if (resetMessages) {
      this.errorMessage = null;
      this.uploadSuccessMessage = null;
    }
    if (this.fileInputRef?.nativeElement) {
      this.fileInputRef.nativeElement.value = '';
    }
  }

  submitIngestion() {
    if (this.selectedFiles.length === 0 || this.isIngesting) return;

    this.isIngesting = true;
    this.errorMessage = null;
    this.uploadSuccessMessage = null;

    // Change file item badge status to Uploading
    this.selectedFiles.forEach(f => f.status = 'Uploading');

    const filesToUpload = this.selectedFiles.map(item => item.file);

    this.ingestService.uploadPdfFiles(filesToUpload).subscribe({
      next: (response: IngestApiResponse) => {
        // 1. Immediately stop the main loading spinner on button
        this.isIngesting = false;

        if (response && response.success) {
          // 2. Change file status from Uploading to Completed
          this.selectedFiles.forEach(f => f.status = 'Completed');

          // 3. Show clear success notification
          this.uploadSuccessMessage = 'Uploaded successfully!';

          // 4. Update the ingested history panel
          if (response.data?.processed_files) {
            this.ingestedHistory = [...response.data.processed_files, ...this.ingestedHistory];
          }

          // 5. Allow user to visually see the 'Completed' green badge for 2.5s, then auto-clear selection list for next upload
          setTimeout(() => {
            if (this.selectedFiles.every(f => f.status === 'Completed' || f.status === 'Success')) {
              this.selectedFiles = [];
              if (this.fileInputRef?.nativeElement) {
                this.fileInputRef.nativeElement.value = '';
              }
            }
          }, 2500);

        } else {
          this.errorMessage = response?.error?.message || 'Ingestion failed on backend server.';
          this.selectedFiles.forEach(f => f.status = 'Error');
        }
      },
      error: (err: any) => {
        // Immediately stop loading spinner on error
        this.isIngesting = false;
        this.errorMessage = err?.error?.message || err?.message || 'Could not connect to API server at http://localhost:8000/api/v1/ingest';
        this.selectedFiles.forEach(f => f.status = 'Error');
      }
    });
  }

  private formatBytes(bytes: number, decimals = 1): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
