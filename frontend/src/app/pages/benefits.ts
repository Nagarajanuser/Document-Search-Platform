import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface BenefitPlan {
  name: string;
  provider: string;
  enrolledStatus: string;
  coverageType: string;
  premium: string;
}

@Component({
  selector: 'app-benefits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid py-4">
      <!-- Title -->
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 class="h3 mb-0 text-gray-800 fw-bold">Benefits</h1>
          <p class="text-muted small mb-0">Review your health plans, retirement savings accounts, and compute estimations.</p>
        </div>
      </div>

      <div class="row g-4">
        <!-- Benefit Plans List -->
        <div class="col-12 col-lg-7">
          <div class="card border-0 shadow-sm rounded-3 p-4 bg-white mb-4">
            <h5 class="fw-bold mb-4 text-secondary"><i class="bi bi-shield-heart text-primary me-2"></i> My Active Enrollments</h5>
            
            <div class="row g-3">
              <div *ngFor="let plan of plans" class="col-12">
                <div class="p-3 border border-light-subtle rounded-3 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center hover-card bg-light-subtle">
                  <div class="mb-3 mb-sm-0">
                    <h6 class="fw-bold text-dark mb-1">{{ plan.name }}</h6>
                    <p class="text-muted small mb-0">Provider: <strong>{{ plan.provider }}</strong></p>
                    <p class="text-muted small mb-0">Coverage: {{ plan.coverageType }}</p>
                  </div>
                  <div class="text-sm-end">
                    <span class="badge bg-success-subtle text-success mb-2 d-inline-block">{{ plan.enrolledStatus }}</span>
                    <p class="mb-0 fw-bold text-primary small">{{ plan.premium }} <span class="text-muted fw-normal font-monospace">/mo</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Dependents coverage -->
          <div class="card border-0 shadow-sm rounded-3 p-4 bg-white">
            <h5 class="fw-bold mb-3 text-secondary"><i class="bi bi-people text-primary me-2"></i> Covered Dependents</h5>
            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light text-muted">
                  <tr>
                    <th>Name</th>
                    <th>Relationship</th>
                    <th>Date of Birth</th>
                    <th>Plans Enrolled</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="fw-semibold">Jane Doe</td>
                    <td>Spouse</td>
                    <td>Sept 14, 1993</td>
                    <td>Medical, Dental, Vision</td>
                  </tr>
                  <tr>
                    <td class="fw-semibold">Tommy Doe</td>
                    <td>Child</td>
                    <td>April 08, 2021</td>
                    <td>Medical, Dental</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 401(k) / Savings Calculator -->
        <div class="col-12 col-lg-5">
          <div class="card border-0 shadow-sm rounded-3 p-4 bg-white mb-4">
            <h5 class="fw-bold mb-3 text-secondary"><i class="bi bi-calculator text-primary me-2"></i> 401(k) Match Calculator</h5>
            <p class="text-muted small">Enter your contribution percentage to project company matching and yearly savings.</p>
            
            <div class="mb-3">
              <label for="salaryInput" class="form-label small fw-semibold text-muted">Your Gross Annual Salary</label>
              <div class="input-group">
                <span class="input-group-text">$</span>
                <input type="number" id="salaryInput" class="form-control" [(ngModel)]="salary" (ngModelChange)="calculateSavings()">
              </div>
            </div>

            <div class="mb-3">
              <label for="percentInput" class="form-label small fw-semibold text-muted">Your Contribution Rate ({{ contributionRate }}%)</label>
              <input type="range" class="form-range" id="percentInput" min="1" max="15" step="1" [(ngModel)]="contributionRate" (ngModelChange)="calculateSavings()">
            </div>

            <div class="p-3 bg-light rounded-3">
              <div class="d-flex justify-content-between mb-2 small">
                <span class="text-muted">Your Annual Contribution:</span>
                <span class="fw-bold text-dark">\${{ annualContribution | number:'1.0-0' }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2 small">
                <span class="text-muted">Company Match (100% up to 5%):</span>
                <span class="fw-bold text-success">+\${{ companyMatch | number:'1.0-0' }}</span>
              </div>
              <hr class="my-2 text-muted">
              <div class="d-flex justify-content-between fw-bold text-dark small">
                <span>Total Projected Yearly Savings:</span>
                <span class="text-primary">\${{ totalProjectedSavings | number:'1.0-0' }}</span>
              </div>
            </div>
          </div>

          <!-- Benefits Support Contacts -->
          <div class="card border-0 shadow-sm rounded-3 p-4 bg-white">
            <h5 class="fw-bold mb-3 text-secondary"><i class="bi bi-telephone-inbound text-primary me-2"></i> Plan Support</h5>
            <div class="small">
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Aetna Medical Helpdesk:</span>
                <span class="fw-semibold">1-800-872-3862</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Delta Dental Support:</span>
                <span class="fw-semibold">1-800-452-9378</span>
              </div>
              <div class="d-flex justify-content-between">
                <span class="text-muted">Fidelity 401(k) Hotline:</span>
                <span class="fw-semibold">1-800-835-5097</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BenefitsComponent {
  salary = 75000;
  contributionRate = 5;
  annualContribution = 3750;
  companyMatch = 3750;
  totalProjectedSavings = 7500;

  plans: BenefitPlan[] = [
    { name: 'Gold Premium Choice PPO', provider: 'Aetna Health', enrolledStatus: 'Enrolled', coverageType: 'Employee + Family', premium: '$340.00' },
    { name: 'Delta Dental Premier PPO', provider: 'Delta Dental', enrolledStatus: 'Enrolled', coverageType: 'Employee + Family', premium: '$45.00' },
    { name: 'VSP Vision Premium Plus', provider: 'VSP Vision Care', enrolledStatus: 'Enrolled', coverageType: 'Employee + Family', premium: '$18.00' },
    { name: 'Fidelity Traditional 401(k)', provider: 'Fidelity Investments', enrolledStatus: 'Enrolled', coverageType: 'Employee Pre-Tax', premium: '5% salary' }
  ];

  constructor() {
    this.calculateSavings();
  }

  calculateSavings() {
    this.annualContribution = (this.salary * this.contributionRate) / 100;
    const matchRate = Math.min(this.contributionRate, 5); // Match 100% up to 5%
    this.companyMatch = (this.salary * matchRate) / 100;
    this.totalProjectedSavings = this.annualContribution + this.companyMatch;
  }
}
