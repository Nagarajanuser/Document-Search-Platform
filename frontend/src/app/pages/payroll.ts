import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Payslip {
  month: string;
  year: string;
  basic: number;
  allowance: number;
  deduction: number;
  netPay: number;
  status: 'Paid' | 'Processing';
}

@Component({
  selector: 'app-payroll',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid py-4">
      <!-- Title -->
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 class="h3 mb-0 text-gray-800 fw-bold">Payroll</h1>
          <p class="text-muted small mb-0">View your current payslip breakdown, history, and payment details.</p>
        </div>
      </div>

      <div class="row g-4">
        <!-- Current Payslip Detail -->
        <div class="col-12 col-lg-7">
          <div class="card border-0 shadow-sm rounded-3 p-4 bg-white">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h5 class="fw-bold mb-0 text-secondary">Current Month Payslip</h5>
              <span class="badge bg-success-subtle text-success px-3 py-2 fw-semibold">June 2026</span>
            </div>

            <!-- Payslip Breakdown -->
            <div class="row g-4 mb-4">
              <div class="col-12 col-sm-6">
                <div class="p-3 bg-light rounded-3">
                  <h6 class="fw-bold text-success mb-3"><i class="bi bi-plus-circle me-2"></i> Earnings</h6>
                  <div class="d-flex justify-content-between mb-2 small">
                    <span class="text-muted">Basic Salary:</span>
                    <span class="fw-semibold">$5,200.00</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2 small">
                    <span class="text-muted">House Rent Allowance:</span>
                    <span class="fw-semibold">$800.00</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2 small">
                    <span class="text-muted">Special Allowance:</span>
                    <span class="fw-semibold">$400.00</span>
                  </div>
                  <hr class="my-2 text-muted">
                  <div class="d-flex justify-content-between fw-bold text-dark small">
                    <span>Total Earnings:</span>
                    <span>$6,400.00</span>
                  </div>
                </div>
              </div>

              <div class="col-12 col-sm-6">
                <div class="p-3 bg-light rounded-3">
                  <h6 class="fw-bold text-danger mb-3"><i class="bi bi-dash-circle me-2"></i> Deductions</h6>
                  <div class="d-flex justify-content-between mb-2 small">
                    <span class="text-muted">Income Tax (FIT):</span>
                    <span class="fw-semibold">$620.00</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2 small">
                    <span class="text-muted">Health Insurance:</span>
                    <span class="fw-semibold">$150.00</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2 small">
                    <span class="text-muted">Provident Fund (401k):</span>
                    <span class="fw-semibold">$260.00</span>
                  </div>
                  <hr class="my-2 text-muted">
                  <div class="d-flex justify-content-between fw-bold text-dark small">
                    <span>Total Deductions:</span>
                    <span>$1,030.00</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Net Pay Box -->
            <div class="card border-0 bg-primary-subtle text-primary p-4 rounded-3 text-center mb-3">
              <span class="text-uppercase small fw-bold text-primary-emphasis mb-1">Net Take-Home Pay</span>
              <h2 class="fw-bold mb-0 text-primary-emphasis">$5,370.00</h2>
              <p class="small mb-0 text-muted mt-2">Disbursed on June 28, 2026 via Direct Deposit</p>
            </div>
            
            <div class="d-flex justify-content-end">
              <button (click)="downloadPayslip('June', '2026')" class="btn btn-outline-primary btn-sm fw-bold">
                <i class="bi bi-download me-1"></i> Download PDF Copy
              </button>
            </div>
          </div>
        </div>

        <!-- Bank Details and Payslip History -->
        <div class="col-12 col-lg-5">
          <!-- Bank Details -->
          <div class="card border-0 shadow-sm rounded-3 p-4 bg-white mb-4">
            <h5 class="fw-bold mb-3 text-secondary"><i class="bi bi-bank text-primary me-2"></i> Direct Deposit</h5>
            <div class="d-flex justify-content-between align-items-center p-3 bg-light rounded-3">
              <div>
                <h6 class="mb-1 fw-bold text-dark">Chase Bank N.A.</h6>
                <p class="mb-0 text-muted small">Account: •••• 5689 (Savings)</p>
                <p class="mb-0 text-muted small">Routing: •••• 1024</p>
              </div>
              <i class="bi bi-shield-check text-success fs-2"></i>
            </div>
          </div>

          <!-- History -->
          <div class="card border-0 shadow-sm rounded-3 p-4 bg-white">
            <h5 class="fw-bold mb-3 text-secondary"><i class="bi bi-journals text-primary me-2"></i> Salary History</h5>
            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light text-muted">
                  <tr>
                    <th>Month</th>
                    <th>Net Paid</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let pay of history">
                    <td>
                      <span class="fw-semibold">{{ pay.month }} {{ pay.year }}</span>
                    </td>
                    <td class="fw-bold text-dark">{{ pay.netPay | currency:'USD' }}</td>
                    <td>
                      <button (click)="downloadPayslip(pay.month, pay.year)" class="btn btn-sm btn-light border" title="Download">
                        <i class="bi bi-download"></i>
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
export class PayrollComponent {
  history: Payslip[] = [
    { month: 'May', year: '2026', basic: 5200, allowance: 1200, deduction: 1030, netPay: 5370, status: 'Paid' },
    { month: 'April', year: '2026', basic: 5200, allowance: 1200, deduction: 1030, netPay: 5370, status: 'Paid' },
    { month: 'March', year: '2026', basic: 5200, allowance: 1200, deduction: 980, netPay: 5420, status: 'Paid' }
  ];

  downloadPayslip(month: string, year: string) {
    alert(`Generating and downloading PDF payslip for ${month} ${year}...`);
  }
}
