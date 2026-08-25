import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Goal {
  title: string;
  weight: number;
  progress: number;
  dueDate: string;
}

@Component({
  selector: 'app-performance-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid py-4">
      <!-- Title -->
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 class="h3 mb-0 text-gray-800 fw-bold">Performance Management</h1>
          <p class="text-muted small mb-0">Review performance goals, competency evaluations, and manager feedback.</p>
        </div>
        <span class="badge bg-primary px-3 py-2">Mid-Year Review 2026</span>
      </div>

      <div class="row g-4">
        <!-- Core Goals and Progress -->
        <div class="col-12 col-lg-8">
          <div class="card border-0 shadow-sm rounded-3 p-4 bg-white mb-4">
            <h5 class="fw-bold mb-4 text-secondary"><i class="bi bi-bullseye text-primary me-2"></i> Key Performance Goals</h5>
            
            <div *ngFor="let goal of goals" class="mb-4">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="fw-semibold text-dark">{{ goal.title }}</span>
                <span class="fw-bold text-primary">{{ goal.progress }}%</span>
              </div>
              <div class="progress" style="height: 8px;">
                <div class="progress-bar rounded" role="progressbar" 
                     [style.width.%]="goal.progress" 
                     [attr.aria-valuenow]="goal.progress" 
                     aria-valuemin="0" 
                     aria-valuemax="100">
                </div>
              </div>
              <div class="d-flex justify-content-between text-muted small mt-1">
                <span>Weight: {{ goal.weight }}%</span>
                <span>Due Date: {{ goal.dueDate }}</span>
              </div>
            </div>
          </div>

          <!-- Manager's Feedback -->
          <div class="card border-0 shadow-sm rounded-3 p-4 bg-white">
            <h5 class="fw-bold mb-3 text-secondary"><i class="bi bi-chat-left-quote text-primary me-2"></i> Manager's Feedback</h5>
            <div class="d-flex align-items-start p-3 bg-light rounded-3">
              <div class="avatar-circle bg-primary text-white d-flex align-items-center justify-content-center rounded-circle me-3 fw-bold flex-shrink-0" style="width: 42px; height: 42px;">MS</div>
              <div>
                <h6 class="mb-1 fw-bold text-dark">Michael Scott <span class="text-muted fw-normal small">(Regional Manager)</span></h6>
                <p class="mb-2 text-muted small font-italic">"John has done an outstanding job leading the technical design and migration of our core HR applications into Angular 21. His code structure is exceptionally clean. For the next quarter, we'd love to see him run technical sharing sessions to mentor junior devs."</p>
                <span class="badge bg-success-subtle text-success small">Approved Review</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Core Competencies Radar/Progress Bars -->
        <div class="col-12 col-lg-4">
          <div class="card border-0 shadow-sm rounded-3 p-4 bg-white h-100">
            <h5 class="fw-bold mb-4 text-secondary"><i class="bi bi-bar-chart-line text-primary me-2"></i> Skill Competency</h5>
            
            <div class="mb-4">
              <label class="form-label small fw-semibold text-muted mb-1">Technical Skills</label>
              <div class="d-flex align-items-center">
                <div class="progress flex-grow-1" style="height: 6px;">
                  <div class="progress-bar bg-success rounded" role="progressbar" style="width: 92%" aria-valuenow="92" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <span class="ms-3 fw-bold text-success small">9.2 / 10</span>
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label small fw-semibold text-muted mb-1">Problem Solving</label>
              <div class="d-flex align-items-center">
                <div class="progress flex-grow-1" style="height: 6px;">
                  <div class="progress-bar bg-success rounded" role="progressbar" style="width: 88%" aria-valuenow="88" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <span class="ms-3 fw-bold text-success small">8.8 / 10</span>
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label small fw-semibold text-muted mb-1">Collaboration</label>
              <div class="d-flex align-items-center">
                <div class="progress flex-grow-1" style="height: 6px;">
                  <div class="progress-bar bg-info rounded" role="progressbar" style="width: 80%" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <span class="ms-3 fw-bold text-info small">8.0 / 10</span>
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label small fw-semibold text-muted mb-1">Communication</label>
              <div class="d-flex align-items-center">
                <div class="progress flex-grow-1" style="height: 6px;">
                  <div class="progress-bar bg-warning rounded" role="progressbar" style="width: 75%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <span class="ms-3 fw-bold text-warning small">7.5 / 10</span>
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label small fw-semibold text-muted mb-1">Leadership</label>
              <div class="d-flex align-items-center">
                <div class="progress flex-grow-1" style="height: 6px;">
                  <div class="progress-bar bg-warning rounded" role="progressbar" style="width: 70%" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <span class="ms-3 fw-bold text-warning small">7.0 / 10</span>
              </div>
            </div>
            
            <div class="p-3 bg-light rounded-3 text-center small text-muted">
              Overall rating calculated: <strong>8.1 / 10</strong> (Exceeds Expectations)
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PerformanceManagementComponent {
  goals: Goal[] = [
    { title: 'Migrate legacy HR modules to Angular 21 structure', weight: 40, progress: 85, dueDate: 'Sept 30, 2026' },
    { title: 'Improve frontend application performance score to >90 on Lighthouse', weight: 30, progress: 65, dueDate: 'Oct 31, 2026' },
    { title: 'Implement full-coverage Bootstrap UI styles with responsive components', weight: 30, progress: 100, dueDate: 'Completed' }
  ];
}
