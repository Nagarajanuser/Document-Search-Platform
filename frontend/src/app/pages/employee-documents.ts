import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IngestService } from '../services/ingest.service';

interface DocumentFile {
  name: string;
  category: string;
  uploadedDate: string;
  status: 'Verified' | 'Pending Verification' | 'Expired';
  size: string;
}

@Component({
  selector: 'app-employee-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid py-4">
      <!-- Title -->
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 class="h3 mb-0 text-gray-800 fw-bold">Employee Documents</h1>
          <p class="text-muted small mb-0">Upload official documents, check verification statuses, and read handbook guidelines.</p>
        </div>
      </div>

      <div class="row g-4">
        <!-- Upload & List -->
        <div class="col-12 col-lg-8">
          <!-- Upload Area -->
          <div class="card border-0 shadow-sm rounded-3 p-4 bg-white mb-4">
            <h5 class="fw-bold mb-3 text-secondary"><i class="bi bi-cloud-arrow-up text-primary me-2"></i> Submit New Document</h5>
            
            <!-- Default Upload Box -->
            <div *ngIf="!uploadSuccess" class="border border-dashed border-primary border-2 bg-light-subtle rounded-3 p-4 text-center my-3" style="border-style: dashed !important; background-color: #f8fafc;">
              <i class="bi bi-file-earmark-arrow-up text-primary display-4 mb-2 d-block"></i>
              <h6 class="fw-bold mb-1">Select file to upload</h6>
              <p class="text-muted small mb-3">Acceptable format: PDF up to 10MB</p>
              
              <div class="d-inline-block">
                <input type="file" id="fileUpload" class="d-none" [disabled]="isUploading" (change)="onFileSelected($event)">
                <label for="fileUpload" class="btn btn-primary btn-sm fw-bold px-4 cursor-pointer" [class.disabled]="isUploading">
                  <span *ngIf="isUploading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {{ isUploading ? 'Uploading & Ingesting...' : 'Browse Files' }}
                </label>
              </div>
            </div>

            <!-- Uploaded Successfully State (Status 200) -->
            <div *ngIf="uploadSuccess" class="border border-success border-2 bg-success-subtle rounded-3 p-4 text-center my-3" style="background-color: #f0fdf4 !important;">
              <i class="bi bi-check-circle-fill text-success display-4 mb-2 d-block"></i>
              <h5 class="fw-bold text-success mb-1">Uploaded Successfully!</h5>
              <p class="text-muted small mb-3">{{ uploadSuccess }}</p>
              
              <div class="d-inline-flex gap-2">
                <input type="file" id="fileUploadAgain" class="d-none" (change)="onFileSelected($event)">
                <label for="fileUploadAgain" class="btn btn-success btn-sm fw-bold px-4 cursor-pointer">
                  <i class="bi bi-plus-lg me-1"></i> Upload Another File
                </label>
                <button class="btn btn-outline-secondary btn-sm fw-bold px-3" (click)="resetUpload()">
                  Done
                </button>
              </div>
            </div>

            <!-- Error Banner -->
            <div *ngIf="uploadError" class="alert alert-danger alert-dismissible fade show text-center py-2 px-3 small my-2" role="alert">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ uploadError }}
              <button type="button" class="btn-close py-2" (click)="uploadError = null" aria-label="Close"></button>
            </div>
          </div>

          <!-- Document List Table -->
          <div class="card border-0 shadow-sm rounded-3 p-4 bg-white">
            <h5 class="fw-bold mb-4 text-secondary"><i class="bi bi-file-earmark-medical text-primary me-2"></i> My Document Archive</h5>
            
            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light text-muted">
                  <tr>
                    <th>Document Name</th>
                    <th>Category</th>
                    <th>Uploaded Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngIf="documents.length === 0">
                    <td colspan="5" class="text-center text-muted py-4">
                      <i class="bi bi-inbox fs-2 d-block text-secondary mb-2"></i>
                      No documents uploaded yet. Browse and upload a file above!
                    </td>
                  </tr>
                  <tr *ngFor="let doc of documents">
                    <td>
                      <div class="fw-semibold text-dark"><i class="bi bi-file-pdf text-danger me-2"></i>{{ doc.name }}</div>
                      <div class="small text-muted">{{ doc.size }}</div>
                    </td>
                    <td>{{ doc.category }}</td>
                    <td>{{ doc.uploadedDate }}</td>
                    <td>
                      <span class="badge rounded-pill" [ngClass]="{
                        'bg-success-subtle text-success': doc.status === 'Verified',
                        'bg-warning-subtle text-warning': doc.status === 'Pending Verification',
                        'bg-danger-subtle text-danger': doc.status === 'Expired'
                      }">{{ doc.status }}</span>
                    </td>
                    <td>
                      <button (click)="viewDoc(doc.name)" class="btn btn-sm btn-light border me-1" title="View">
                        <i class="bi bi-eye"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Corporate Handbooks -->
        <div class="col-12 col-lg-4">
          <div class="card border-0 shadow-sm rounded-3 p-4 bg-white h-100">
            <h5 class="fw-bold mb-4 text-secondary"><i class="bi bi-journal-bookmark text-primary me-2"></i> Company Handbooks</h5>
            <p class="text-muted small">Quick links to view or download global corporate policy guidelines:</p>
            
            <div class="list-group list-group-flush">
              <a href="javascript:void(0)" (click)="downloadHandbook('Employee Handbook 2026')" class="list-group-item list-group-item-action px-0 py-3 border-light-subtle d-flex align-items-center">
                <i class="bi bi-file-pdf text-danger fs-3 me-3"></i>
                <div>
                  <h6 class="mb-0 fw-bold text-dark small">Employee Handbook 2026</h6>
                  <span class="text-muted small">Updated: Jan 2026 • 2.4MB</span>
                </div>
              </a>
              
              <a href="javascript:void(0)" (click)="downloadHandbook('IT Security Policy')" class="list-group-item list-group-item-action px-0 py-3 border-light-subtle d-flex align-items-center">
                <i class="bi bi-file-pdf text-danger fs-3 me-3"></i>
                <div>
                  <h6 class="mb-0 fw-bold text-dark small">IT Security Policy</h6>
                  <span class="text-muted small">Updated: Nov 2025 • 1.1MB</span>
                </div>
              </a>

              <a href="javascript:void(0)" (click)="downloadHandbook('Code of Conduct & Ethics')" class="list-group-item list-group-item-action px-0 py-3 border-light-subtle d-flex align-items-center">
                <i class="bi bi-file-pdf text-danger fs-3 me-3"></i>
                <div>
                  <h6 class="mb-0 fw-bold text-dark small">Code of Conduct & Ethics</h6>
                  <span class="text-muted small">Updated: May 2025 • 850KB</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EmployeeDocumentsComponent {
  isUploading = false;
  uploadSuccess: string | null = null;
  uploadError: string | null = null;

  documents: DocumentFile[] = [];

  constructor(
    private ingestService: IngestService,
    private cdr: ChangeDetectorRef
  ) {}

  onFileSelected(event: any) {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    const files: File[] = Array.from(fileList);
    this.isUploading = true;
    this.uploadSuccess = null;
    this.uploadError = null;

    const now = new Date();
    const dateStr = now.toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' });

    const newDocs: DocumentFile[] = files.map((file) => {
      const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      return {
        name: file.name,
        category: 'Personal Upload',
        uploadedDate: dateStr,
        status: 'Pending Verification',
        size: sizeStr
      };
    });

    this.documents = [...newDocs, ...this.documents];
    this.cdr.detectChanges();

    this.ingestService.uploadPdfFiles(files).subscribe({
      next: (response) => {
        this.isUploading = false;
        if (response && response.success) {
          this.uploadSuccess = `File "${files.map(f => f.name).join(', ')}" was ingested and processed successfully.`;
          newDocs.forEach(doc => doc.status = 'Verified');
        } else {
          this.uploadError = response?.error?.message || 'Ingestion failed on backend server.';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isUploading = false;
        this.uploadError = err?.error?.detail || err?.error?.message || err?.message || 'Failed to upload document to backend API.';
        this.cdr.detectChanges();
      }
    });

    event.target.value = '';
  }

  resetUpload() {
    this.uploadSuccess = null;
    this.uploadError = null;
    this.isUploading = false;
    this.cdr.detectChanges();
  }

  viewDoc(name: string) {
    alert(`Opening document preview for "${name}"...`);
  }

  downloadHandbook(title: string) {
    alert(`Downloading handbook: "${title}"...`);
  }
}



