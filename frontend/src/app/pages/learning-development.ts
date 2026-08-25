import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Course {
  id: number;
  title: string;
  category: string;
  duration: string;
  progress: number;
  enrolled: boolean;
}

@Component({
  selector: 'app-learning-development',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid py-4">
      <!-- Title -->
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 class="h3 mb-0 text-gray-800 fw-bold">Learning & Development</h1>
          <p class="text-muted small mb-0">Upskill your professional capability, view certification archives, and enroll in classes.</p>
        </div>
      </div>

      <div class="row g-4">
        <!-- My Enrolled Courses -->
        <div class="col-12 col-lg-8">
          <div class="card border-0 shadow-sm rounded-3 p-4 bg-white mb-4">
            <h5 class="fw-bold mb-4 text-secondary"><i class="bi bi-play-circle text-primary me-2"></i> In-Progress Training</h5>
            
            <div class="row g-3">
              <ng-container *ngFor="let course of courses">
                <div class="col-12 col-md-6" *ngIf="course.enrolled && course.progress < 100">
                  <div class="card border border-light-subtle rounded-3 p-3 h-100 hover-card">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                      <span class="badge bg-primary-subtle text-primary small">{{ course.category }}</span>
                      <span class="text-muted small"><i class="bi bi-clock me-1"></i> {{ course.duration }}</span>
                    </div>
                    <h6 class="fw-bold text-dark mb-3">{{ course.title }}</h6>
                    
                    <div class="d-flex justify-content-between align-items-center mb-1 small text-muted">
                      <span>Progress:</span>
                      <span class="fw-bold">{{ course.progress }}%</span>
                    </div>
                    <div class="progress mb-3" style="height: 6px;">
                      <div class="progress-bar rounded" role="progressbar" [style.width.%]="course.progress" aria-valuenow="course.progress" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <div class="d-flex justify-content-end">
                      <button class="btn btn-primary btn-sm fw-bold px-3" (click)="resumeCourse(course.title)">
                        Resume <i class="bi bi-chevron-right ms-1"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </ng-container>
            </div>
          </div>

          <!-- Catalog of Courses -->
          <div class="card border-0 shadow-sm rounded-3 p-4 bg-white">
            <h5 class="fw-bold mb-4 text-secondary"><i class="bi bi-journal-code text-primary me-2"></i> Course Catalog</h5>
            
            <div class="list-group list-group-flush">
              <div *ngFor="let course of courses" class="list-group-item px-0 py-3 border-light-subtle d-flex flex-column flex-sm-row justify-content-between align-items-sm-center">
                <div class="mb-3 mb-sm-0">
                  <div class="d-flex align-items-center mb-1">
                    <span class="badge bg-light text-dark border me-2 small">{{ course.category }}</span>
                    <span class="text-muted small"><i class="bi bi-clock me-1"></i> {{ course.duration }}</span>
                  </div>
                  <h6 class="mb-0 fw-bold text-dark">{{ course.title }}</h6>
                </div>
                <div>
                  <button *ngIf="!course.enrolled" (click)="enrollCourse(course.id)" class="btn btn-outline-primary btn-sm fw-bold px-3">
                    Enroll Course
                  </button>
                  <span *ngIf="course.enrolled && course.progress < 100" class="badge bg-warning-subtle text-warning p-2">
                    Enrolled
                  </span>
                  <span *ngIf="course.progress === 100" class="badge bg-success-subtle text-success p-2">
                    Completed <i class="bi bi-patch-check-fill ms-1"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Accomplishments & Certificates -->
        <div class="col-12 col-lg-4">
          <div class="card border-0 shadow-sm rounded-3 p-4 bg-white h-100">
            <h5 class="fw-bold mb-4 text-secondary"><i class="bi bi-award text-primary me-2"></i> Certifications</h5>
            
            <div class="d-flex align-items-center mb-3 p-3 bg-light rounded-3">
              <div class="bg-success text-white rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                <i class="bi bi-patch-check fs-5"></i>
              </div>
              <div>
                <h6 class="mb-0 fw-bold text-dark">Clean Code Principles</h6>
                <p class="mb-0 text-muted small">Earned: April 2026</p>
              </div>
            </div>

            <div class="d-flex align-items-center p-3 bg-light rounded-3">
              <div class="bg-success text-white rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                <i class="bi bi-patch-check fs-5"></i>
              </div>
              <div>
                <h6 class="mb-0 fw-bold text-dark">Angular Architecture (Intermediate)</h6>
                <p class="mb-0 text-muted small">Earned: Feb 2026</p>
              </div>
            </div>
            
            <hr class="text-muted my-4">
            
            <div class="text-center p-3 border border-dashed rounded-3">
              <p class="small text-muted mb-2">Need a specific technical certificate paid for by the company?</p>
              <button class="btn btn-sm btn-outline-secondary fw-bold" (click)="requestBudget()">Request Budget Approval</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LearningDevelopmentComponent {
  courses: Course[] = [
    { id: 1, title: 'Angular 21 Deep Dive & State Management', category: 'Technology', duration: '12 hrs', progress: 75, enrolled: true },
    { id: 2, title: 'Clean Code & SOLID Design Principles', category: 'Technology', duration: '6 hrs', progress: 100, enrolled: true },
    { id: 3, title: 'Introduction to Agile Project Management', category: 'Business', duration: '4 hrs', progress: 20, enrolled: true },
    { id: 4, title: 'Cybersecurity Awareness Training', category: 'Compliance', duration: '2 hrs', progress: 0, enrolled: false },
    { id: 5, title: 'Effective Communication in Remote Teams', category: 'Leadership', duration: '5 hrs', progress: 0, enrolled: false }
  ];

  resumeCourse(title: string) {
    alert(`Launching virtual course viewer for "${title}"...`);
  }

  enrollCourse(id: number) {
    const course = this.courses.find(c => c.id === id);
    if (course) {
      course.enrolled = true;
      course.progress = 5; // Start progress
      alert(`Success! Enrolled in "${course.title}". Check your active trainings tab!`);
    }
  }

  requestBudget() {
    alert('Budgets and reimbursement request form initiated.');
  }
}
