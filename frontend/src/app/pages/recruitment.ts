import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface JobVacancy {
  title: string;
  department: string;
  type: string;
  applicationsCount: number;
  status: 'Active' | 'On Hold' | 'Closed';
}

interface Candidate {
  name: string;
  position: string;
  appliedDate: string;
  source: string;
  rating: number;
  status: 'Applied' | 'Shortlisted' | 'Interview' | 'Offered' | 'Rejected';
}

@Component({
  selector: 'app-recruitment',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid py-4">
      <!-- Title -->
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 class="h3 mb-0 text-gray-800 fw-bold">Recruitment</h1>
          <p class="text-muted small mb-0">Manage job postings, track applicant pipelines, and hire top talent.</p>
        </div>
      </div>

      <!-- Recruitment Pipeline Banner -->
      <div class="card border-0 shadow-sm rounded-3 p-4 bg-white mb-4">
        <h5 class="fw-bold mb-4 text-secondary">Hiring Pipeline Overview</h5>
        <div class="row g-3 text-center">
          <div class="col-6 col-md-3">
            <div class="p-3 bg-light rounded-3">
              <h3 class="fw-bold text-primary mb-1">12</h3>
              <p class="text-muted small mb-0 fw-semibold text-uppercase">Applied</p>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="p-3 bg-light rounded-3">
              <h3 class="fw-bold text-info mb-1">5</h3>
              <p class="text-muted small mb-0 fw-semibold text-uppercase">Shortlisted</p>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="p-3 bg-light rounded-3">
              <h3 class="fw-bold text-warning mb-1">3</h3>
              <p class="text-muted small mb-0 fw-semibold text-uppercase">Interviewing</p>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="p-3 bg-light rounded-3">
              <h3 class="fw-bold text-success mb-1">1</h3>
              <p class="text-muted small mb-0 fw-semibold text-uppercase">Offered</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <!-- Open Vacancies -->
        <div class="col-12 col-lg-5">
          <div class="card border-0 shadow-sm rounded-3 p-4 bg-white h-100">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h5 class="fw-bold mb-0 text-secondary">Active Job Openings</h5>
              <button class="btn btn-primary btn-sm fw-bold" (click)="addPosting()"><i class="bi bi-plus"></i> Post Job</button>
            </div>
            
            <div class="list-group list-group-flush">
              <div *ngFor="let job of vacancies" class="list-group-item px-0 py-3 border-light-subtle">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 class="mb-1 fw-bold text-dark">{{ job.title }}</h6>
                    <p class="text-muted small mb-0">{{ job.department }} • {{ job.type }}</p>
                  </div>
                  <span class="badge" [ngClass]="{
                    'bg-success-subtle text-success': job.status === 'Active',
                    'bg-warning-subtle text-warning': job.status === 'On Hold'
                  }">{{ job.status }}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-2 small text-muted">
                  <span>{{ job.applicationsCount }} Candidates applied</span>
                  <a href="javascript:void(0)" class="text-decoration-none fw-bold text-primary">Manage <i class="bi bi-chevron-right ms-1"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Candidate Tracker -->
        <div class="col-12 col-lg-7">
          <div class="card border-0 shadow-sm rounded-3 p-4 bg-white h-100">
            <h5 class="fw-bold mb-4 text-secondary">Recent Applications</h5>
            
            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light text-muted">
                  <tr>
                    <th>Candidate</th>
                    <th>Target Position</th>
                    <th>Source</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let cand of candidates">
                    <td>
                      <div class="fw-semibold">{{ cand.name }}</div>
                      <div class="small text-muted">{{ cand.appliedDate }}</div>
                    </td>
                    <td>{{ cand.position }}</td>
                    <td>{{ cand.source }}</td>
                    <td>
                      <span class="badge rounded-pill" [ngClass]="{
                        'bg-secondary-subtle text-secondary': cand.status === 'Applied',
                        'bg-info-subtle text-info': cand.status === 'Shortlisted',
                        'bg-warning-subtle text-warning': cand.status === 'Interview',
                        'bg-success-subtle text-success': cand.status === 'Offered'
                      }">{{ cand.status }}</span>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary border-0" (click)="viewCandidate(cand.name)" title="Review Profile">
                        <i class="bi bi-file-earmark-person fs-5"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RecruitmentComponent {
  vacancies: JobVacancy[] = [
    { title: 'Senior Angular Developer', department: 'Engineering', type: 'Full Time', applicationsCount: 8, status: 'Active' },
    { title: 'HR Operations Manager', department: 'HR & Talent', type: 'Full Time', applicationsCount: 3, status: 'Active' },
    { title: 'Lead Product Designer', department: 'Product Design', type: 'Remote', applicationsCount: 1, status: 'On Hold' }
  ];

  candidates: Candidate[] = [
    { name: 'Elena Rostova', position: 'Senior Angular Developer', appliedDate: 'Today', source: 'LinkedIn Ref', rating: 4, status: 'Interview' },
    { name: 'Adam Jensen', position: 'Senior Angular Developer', appliedDate: 'Yesterday', source: 'Indeed', rating: 5, status: 'Offered' },
    { name: 'Chloe Fraser', position: 'HR Operations Manager', appliedDate: 'July 5, 2026', source: 'Referral', rating: 3, status: 'Shortlisted' },
    { name: 'Marcus Holloway', position: 'Lead Product Designer', appliedDate: 'July 3, 2026', source: 'Company Site', rating: 4, status: 'Applied' }
  ];

  addPosting() {
    alert('Redirecting to create a new job posting form...');
  }

  viewCandidate(name: string) {
    alert(`Opening detailed profile and resume dashboard for candidate: ${name}`);
  }
}
