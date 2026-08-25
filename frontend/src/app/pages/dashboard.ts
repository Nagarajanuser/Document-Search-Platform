import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid py-4">
      <!-- Title -->
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 class="h3 mb-0 text-gray-800 fw-bold">Dashboard</h1>
          <p class="text-muted small mb-0">Welcome back, John Doe! Here is your HR overview for today.</p>
        </div>
        <span class="badge bg-primary px-3 py-2">July 2026</span>
      </div>

      <!-- Stats Cards -->
      <div class="row g-3 mb-4">
        <div class="col-12 col-sm-6 col-xl-3">
          <div class="card border-0 shadow-sm rounded-3 hover-card h-100 p-3" style="border-left: 4px solid var(--primary-color) !important;">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="text-uppercase text-muted small fw-bold mb-1">Total Employees</p>
                <h3 class="fw-bold mb-0">154</h3>
                <span class="text-success small fw-semibold"><i class="bi bi-arrow-up"></i> +4 this month</span>
              </div>
              <div class="bg-light-primary rounded-circle p-3 text-primary d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; background-color: #e0e7ff;">
                <i class="bi bi-people fs-4"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-12 col-sm-6 col-xl-3">
          <div class="card border-0 shadow-sm rounded-3 hover-card h-100 p-3" style="border-left: 4px solid #f59e0b !important;">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="text-uppercase text-muted small fw-bold mb-1">On Leave Today</p>
                <h3 class="fw-bold mb-0">8</h3>
                <span class="text-muted small">Out of office</span>
              </div>
              <div class="bg-light-warning rounded-circle p-3 text-warning d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; background-color: #fef3c7;">
                <i class="bi bi-calendar-event fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-xl-3">
          <div class="card border-0 shadow-sm rounded-3 hover-card h-100 p-3" style="border-left: 4px solid #06b6d4 !important;">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="text-uppercase text-muted small fw-bold mb-1">Job Applications</p>
                <h3 class="fw-bold mb-0">12</h3>
                <span class="text-info small fw-semibold"><i class="bi bi-plus"></i> 3 new today</span>
              </div>
              <div class="bg-light-info rounded-circle p-3 text-info d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; background-color: #e0f7fa;">
                <i class="bi bi-journal-check fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-xl-3">
          <div class="card border-0 shadow-sm rounded-3 hover-card h-100 p-3" style="border-left: 4px solid #10b981 !important;">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="text-uppercase text-muted small fw-bold mb-1">Training Completed</p>
                <h3 class="fw-bold mb-0">88%</h3>
                <span class="text-success small fw-semibold"><i class="bi bi-check-circle"></i> Target reached</span>
              </div>
              <div class="bg-light-success rounded-circle p-3 text-success d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; background-color: #d1fae5;">
                <i class="bi bi-mortarboard fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="row g-4">
        <!-- Recent Activities -->
        <div class="col-12 col-lg-8">
          <div class="card border-0 shadow-sm rounded-3 p-4 h-100">
            <h5 class="fw-bold mb-4 d-flex align-items-center">
              <i class="bi bi-activity text-primary me-2"></i> Recent Activities
            </h5>
            <div class="position-relative ps-4 border-start border-2 border-light-subtle">
              <!-- Item 1 -->
              <div class="mb-4 position-relative">
                <span class="position-absolute start-0 translate-middle rounded-circle bg-primary" style="width: 12px; height: 12px; left: -26px !important; top: 8px;"></span>
                <div class="d-flex justify-content-between align-items-center">
                  <h6 class="mb-0 fw-semibold">Sarah Connor (Frontend Engineer) clocked in late</h6>
                  <span class="text-muted small">9:15 AM</span>
                </div>
                <p class="text-muted small mb-0 mt-1">Status changed: Delayed by 15 mins (Approved transit issue).</p>
              </div>
              <!-- Item 2 -->
              <div class="mb-4 position-relative">
                <span class="position-absolute start-0 translate-middle rounded-circle bg-success" style="width: 12px; height: 12px; left: -26px !important; top: 8px;"></span>
                <div class="d-flex justify-content-between align-items-center">
                  <h6 class="mb-0 fw-semibold">Leave Request Approved</h6>
                  <span class="text-muted small">Yesterday</span>
                </div>
                <p class="text-muted small mb-0 mt-1">James Smith's annual leave request (July 15 - July 20) approved by Manager.</p>
              </div>
              <!-- Item 3 -->
              <div class="mb-4 position-relative">
                <span class="position-absolute start-0 translate-middle rounded-circle bg-info" style="width: 12px; height: 12px; left: -26px !important; top: 8px;"></span>
                <div class="d-flex justify-content-between align-items-center">
                  <h6 class="mb-0 fw-semibold">New Job Application Received</h6>
                  <span class="text-muted small">Yesterday</span>
                </div>
                <p class="text-muted small mb-0 mt-1">Elena Rostova applied for Senior Angular Developer position.</p>
              </div>
              <!-- Item 4 -->
              <div class="position-relative">
                <span class="position-absolute start-0 translate-middle rounded-circle bg-warning" style="width: 12px; height: 12px; left: -26px !important; top: 8px;"></span>
                <div class="d-flex justify-content-between align-items-center">
                  <h6 class="mb-0 fw-semibold">Monthly Payroll Finalized</h6>
                  <span class="text-muted small">2 days ago</span>
                </div>
                <p class="text-muted small mb-0 mt-1">Payroll for June 2026 has been processed and payslips dispatched.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side Panel -->
        <div class="col-12 col-lg-4">
          <div class="card border-0 shadow-sm rounded-3 p-4 h-100">
            <h5 class="fw-bold mb-4 d-flex align-items-center">
              <i class="bi bi-calendar2-check text-primary me-2"></i> Upcoming Events
            </h5>
            
            <div class="mb-4">
              <p class="text-muted small fw-bold text-uppercase mb-2">Birthdays</p>
              <div class="d-flex align-items-center mb-3">
                <div class="avatar-circle-sm bg-primary text-white d-flex align-items-center justify-content-center rounded-circle me-3 fw-bold" style="width: 38px; height: 38px;">MS</div>
                <div>
                  <h6 class="mb-0 fw-semibold">Michael Scott</h6>
                  <span class="text-primary small fw-semibold"><i class="bi bi-gift-fill me-1"></i> Today!</span>
                </div>
              </div>
              <div class="d-flex align-items-center">
                <div class="avatar-circle-sm bg-info text-white d-flex align-items-center justify-content-center rounded-circle me-3 fw-bold" style="width: 38px; height: 38px;">PB</div>
                <div>
                  <h6 class="mb-0 fw-semibold">Pam Beesly</h6>
                  <span class="text-muted small">July 10</span>
                </div>
              </div>
            </div>

            <hr class="text-light-subtle my-3">

            <div>
              <p class="text-muted small fw-bold text-uppercase mb-2">Work Anniversaries</p>
              <div class="d-flex align-items-center">
                <div class="avatar-circle-sm bg-success text-white d-flex align-items-center justify-content-center rounded-circle me-3 fw-bold" style="width: 38px; height: 38px;">DS</div>
                <div>
                  <h6 class="mb-0 fw-semibold">Dwight Schrute</h6>
                  <span class="text-muted small">5 Years • July 12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {}
