import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AttendanceLog {
  date: string;
  clockIn: string;
  clockOut: string;
  hours: string;
  status: 'On Time' | 'Late' | 'Absent' | 'Active';
}

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid py-4">
      <!-- Title -->
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 class="h3 mb-0 text-gray-800 fw-bold">Attendance</h1>
          <p class="text-muted small mb-0">Track your daily working hours and clock in or clock out.</p>
        </div>
      </div>

      <div class="row g-4">
        <!-- Interactive Clock Area -->
        <div class="col-12 col-md-4">
          <div class="card border-0 shadow-sm rounded-3 p-4 text-center h-100 bg-white">
            <h5 class="fw-bold mb-3 text-secondary">My Work Status</h5>
            
            <div class="my-4">
              <div class="display-5 fw-bold text-dark font-monospace mb-2">{{ currentTime }}</div>
              <p class="text-muted small">{{ currentDate }}</p>
            </div>

            <div class="d-grid gap-3">
              <button 
                *ngIf="!isClockedIn" 
                (click)="clockIn()" 
                class="btn btn-primary py-3 fw-bold transition-all shadow-sm rounded-3 d-flex align-items-center justify-content-center"
              >
                <i class="bi bi-box-arrow-in-right fs-4 me-2"></i> Clock In
              </button>

              <button 
                *ngIf="isClockedIn" 
                (click)="clockOut()" 
                class="btn btn-danger py-3 fw-bold transition-all shadow-sm rounded-3 d-flex align-items-center justify-content-center"
              >
                <i class="bi bi-box-arrow-left fs-4 me-2"></i> Clock Out
              </button>
            </div>

            <div class="mt-4 p-3 bg-light rounded-3 text-start">
              <div class="d-flex justify-content-between align-items-center small mb-2">
                <span class="text-muted">Current Session:</span>
                <span class="badge" [ngClass]="isClockedIn ? 'bg-success' : 'bg-secondary'">
                  {{ isClockedIn ? 'Working' : 'Offline' }}
                </span>
              </div>
              <p class="mb-0 text-muted small" *ngIf="isClockedIn">
                You clocked in at <strong class="text-dark">{{ activeClockInTime }}</strong>. Don't forget to clock out!
              </p>
              <p class="mb-0 text-muted small" *ngIf="!isClockedIn">
                You are currently clocked out. Press "Clock In" to begin your shift.
              </p>
            </div>
          </div>
        </div>

        <!-- Stats Area -->
        <div class="col-12 col-md-8">
          <div class="row g-3 mb-4">
            <div class="col-12 col-sm-4">
              <div class="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
                <p class="text-muted small fw-bold text-uppercase mb-1">Present Days</p>
                <h3 class="fw-bold mb-0 text-primary">{{ presentDaysCount }}</h3>
                <span class="text-muted small">This Month</span>
              </div>
            </div>
            <div class="col-12 col-sm-4">
              <div class="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
                <p class="text-muted small fw-bold text-uppercase mb-1">Avg Hours/Day</p>
                <h3 class="fw-bold mb-0 text-success">8.3h</h3>
                <span class="text-muted small">Target: 8h</span>
              </div>
            </div>
            <div class="col-12 col-sm-4">
              <div class="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
                <p class="text-muted small fw-bold text-uppercase mb-1">Late Arrivals</p>
                <h3 class="fw-bold mb-0 text-warning">{{ lateCount }}</h3>
                <span class="text-muted small">Grace period: 15m</span>
              </div>
            </div>
          </div>

          <!-- Log Table -->
          <div class="card border-0 shadow-sm rounded-3 p-4 bg-white">
            <h5 class="fw-bold mb-4 d-flex align-items-center">
              <i class="bi bi-clock-history text-primary me-2"></i> Attendance Log
            </h5>
            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light text-muted">
                  <tr>
                    <th>Date</th>
                    <th>Clock In</th>
                    <th>Clock Out</th>
                    <th>Total Hours</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let log of logs">
                    <td class="fw-semibold">{{ log.date }}</td>
                    <td>{{ log.clockIn }}</td>
                    <td>{{ log.clockOut || '—' }}</td>
                    <td>{{ log.hours || '—' }}</td>
                    <td>
                      <span class="badge rounded-pill" [ngClass]="{
                        'bg-success-subtle text-success': log.status === 'On Time',
                        'bg-warning-subtle text-warning': log.status === 'Late',
                        'bg-danger-subtle text-danger': log.status === 'Absent',
                        'bg-primary-subtle text-primary': log.status === 'Active'
                      }">{{ log.status }}</span>
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
export class AttendanceComponent {
  isClockedIn = false;
  activeClockInTime = '';
  currentTime = '';
  currentDate = '';
  
  presentDaysCount = 4;
  lateCount = 1;

  logs: AttendanceLog[] = [
    { date: 'July 6, 2026', clockIn: '08:58 AM', clockOut: '05:30 PM', hours: '8.5 hrs', status: 'On Time' },
    { date: 'July 5, 2026', clockIn: '09:12 AM', clockOut: '05:00 PM', hours: '7.8 hrs', status: 'Late' },
    { date: 'July 4, 2026', clockIn: '08:52 AM', clockOut: '06:05 PM', hours: '9.2 hrs', status: 'On Time' },
    { date: 'July 3, 2026', clockIn: '08:57 AM', clockOut: '05:33 PM', hours: '8.6 hrs', status: 'On Time' }
  ];

  constructor() {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.currentDate = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  clockIn() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
    
    this.isClockedIn = true;
    this.activeClockInTime = timeStr;

    // Check if late (let's say late is after 9:00 AM)
    const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 0);

    const newLog: AttendanceLog = {
      date: dateStr,
      clockIn: timeStr,
      clockOut: '',
      hours: '',
      status: 'Active'
    };
    
    // Add to the top of logs
    this.logs = [newLog, ...this.logs];
  }

  clockOut() {
    if (this.logs.length > 0 && this.logs[0].status === 'Active') {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const log = this.logs[0];
      log.clockOut = timeStr;
      log.hours = '8.0 hrs'; // simulated hours
      
      // Calculate real status based on clockIn
      const [time, modifier] = log.clockIn.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      
      const lateTime = hours > 9 || (hours === 9 && minutes > 0);
      log.status = lateTime ? 'Late' : 'On Time';
      
      this.isClockedIn = false;
      this.activeClockInTime = '';
      this.presentDaysCount += 1;
      if (lateTime) {
        this.lateCount += 1;
      }
    }
  }
}
