import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface LeaveRequest {
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  daysRequested: number;
}

@Component({
  selector: 'app-leave-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DatePipe],
  template: `
    <div class="container-fluid py-4">
      <!-- Title -->
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 class="h3 mb-0 text-gray-800 fw-bold">Leave Management</h1>
          <p class="text-muted small mb-0">Apply for leaves and track your available balances.</p>
        </div>
      </div>

      <!-- Leave Balances -->
      <div class="row g-3 mb-4">
        <div class="col-12 col-md-4">
          <div class="card border-0 shadow-sm rounded-3 p-3 bg-white text-center">
            <h6 class="text-uppercase text-muted small fw-bold mb-2">Annual Leave</h6>
            <h2 class="fw-bold mb-0 text-primary">{{ annualBalance }}</h2>
            <span class="text-muted small">Days Remaining</span>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="card border-0 shadow-sm rounded-3 p-3 bg-white text-center">
            <h6 class="text-uppercase text-muted small fw-bold mb-2">Sick Leave</h6>
            <h2 class="fw-bold mb-0 text-success">{{ sickBalance }}</h2>
            <span class="text-muted small">Days Remaining</span>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="card border-0 shadow-sm rounded-3 p-3 bg-white text-center">
            <h6 class="text-uppercase text-muted small fw-bold mb-2">Personal Leave</h6>
            <h2 class="fw-bold mb-0 text-warning">{{ personalBalance }}</h2>
            <span class="text-muted small">Days Remaining</span>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <!-- Leave Form -->
        <div class="col-12 col-lg-5">
          <div class="card border-0 shadow-sm rounded-3 p-4 bg-white">
            <h5 class="fw-bold mb-4 d-flex align-items-center">
              <i class="bi bi-file-earmark-plus text-primary me-2"></i> Apply for Leave
            </h5>
            
            <form (ngSubmit)="submitRequest()" #leaveForm="ngForm">
              <div class="mb-3">
                <label for="leaveType" class="form-label small fw-semibold">Leave Type</label>
                <select id="leaveType" name="leaveType" class="form-select" [(ngModel)]="newRequest.type" required>
                  <option value="Annual">Annual Leave</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Personal">Personal Leave</option>
                </select>
              </div>

              <div class="row g-3 mb-3">
                <div class="col-6">
                  <label for="startDate" class="form-label small fw-semibold">Start Date</label>
                  <input type="date" id="startDate" name="startDate" class="form-control" [(ngModel)]="newRequest.startDate" required>
                </div>
                <div class="col-6">
                  <label for="endDate" class="form-label small fw-semibold">End Date</label>
                  <input type="date" id="endDate" name="endDate" class="form-control" [(ngModel)]="newRequest.endDate" required>
                </div>
              </div>

              <div class="mb-4">
                <label for="reason" class="form-label small fw-semibold">Reason for Absence</label>
                <textarea id="reason" name="reason" class="form-control" rows="3" placeholder="Please provide brief reason..." [(ngModel)]="newRequest.reason" required></textarea>
              </div>

              <div class="d-grid">
                <button type="submit" [disabled]="!leaveForm.valid" class="btn btn-primary fw-bold py-2 shadow-sm rounded-3">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Leave Requests Table -->
        <div class="col-12 col-lg-7">
          <div class="card border-0 shadow-sm rounded-3 p-4 bg-white">
            <h5 class="fw-bold mb-4 d-flex align-items-center">
              <i class="bi bi-list-task text-primary me-2"></i> Leave Request History
            </h5>
            
            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light text-muted">
                  <tr>
                    <th>Type</th>
                    <th>Date Range</th>
                    <th>Days</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let req of requests">
                    <td class="fw-semibold">{{ req.type }}</td>
                    <td>{{ formatDateRange(req.startDate, req.endDate) }}</td>
                    <td>{{ req.daysRequested }}</td>
                    <td class="text-truncate" style="max-width: 150px;">{{ req.reason }}</td>
                    <td>
                      <span class="badge rounded-pill" [ngClass]="{
                        'bg-success-subtle text-success': req.status === 'Approved',
                        'bg-warning-subtle text-warning': req.status === 'Pending',
                        'bg-danger-subtle text-danger': req.status === 'Rejected'
                      }">{{ req.status }}</span>
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
export class LeaveManagementComponent {
  annualBalance = 12;
  sickBalance = 8;
  personalBalance = 3;

  newRequest = {
    type: 'Annual',
    startDate: '',
    endDate: '',
    reason: ''
  };

  requests: LeaveRequest[] = [
    { type: 'Sick Leave', startDate: '2026-06-14', endDate: '2026-06-15', daysRequested: 1, reason: 'Dental appointment and root canal recovery', status: 'Approved' },
    { type: 'Annual Leave', startDate: '2026-05-02', endDate: '2026-05-05', daysRequested: 3, reason: 'Family trip', status: 'Approved' }
  ];

  constructor(private datePipe: DatePipe) {}

  formatDateRange(start: string, end: string): string {
    const formattedStart = this.datePipe.transform(start, 'MMM dd, yyyy');
    const formattedEnd = this.datePipe.transform(end, 'MMM dd, yyyy');
    return `${formattedStart} - ${formattedEnd}`;
  }

  submitRequest() {
    if (!this.newRequest.startDate || !this.newRequest.endDate || !this.newRequest.reason) return;
    
    // Calculate days requested
    const start = new Date(this.newRequest.startDate);
    const end = new Date(this.newRequest.endDate);
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    if (daysDiff <= 0) {
      alert('End date must be on or after start date.');
      return;
    }

    const req: LeaveRequest = {
      type: this.newRequest.type + ' Leave',
      startDate: this.newRequest.startDate,
      endDate: this.newRequest.endDate,
      daysRequested: daysDiff,
      reason: this.newRequest.reason,
      status: 'Pending'
    };

    // Add to requests list
    this.requests = [req, ...this.requests];

    // Reset Form
    this.newRequest = {
      type: 'Annual',
      startDate: '',
      endDate: '',
      reason: ''
    };
  }
}
