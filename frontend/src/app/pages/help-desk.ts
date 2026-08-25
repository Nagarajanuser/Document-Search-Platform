import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Ticket {
  id: string;
  title: string;
  category: string;
  urgency: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Closed';
  date: string;
}

@Component({
  selector: 'app-help-desk',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid py-4">
      <!-- Title -->
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 class="h3 mb-0 text-gray-800 fw-bold">Help Desk</h1>
          <p class="text-muted small mb-0">Submit IT/HR requests, track pending tickets, or read frequently asked questions.</p>
        </div>
      </div>

      <div class="row g-4">
        <!-- Submit Ticket Form & FAQ -->
        <div class="col-12 col-lg-5">
          <div class="card border-0 shadow-sm rounded-3 p-4 bg-white mb-4">
            <h5 class="fw-bold mb-4 text-secondary"><i class="bi bi-patch-question text-primary me-2"></i> Submit Help Ticket</h5>
            
            <form (ngSubmit)="createTicket()" #ticketForm="ngForm">
              <div class="mb-3">
                <label for="ticketTitle" class="form-label small fw-semibold text-muted">Ticket Subject / Title</label>
                <input type="text" id="ticketTitle" name="title" class="form-control" placeholder="Brief subject..." [(ngModel)]="newTicket.title" required>
              </div>

              <div class="row g-3 mb-3">
                <div class="col-6">
                  <label for="category" class="form-label small fw-semibold text-muted">Category</label>
                  <select id="category" name="category" class="form-select" [(ngModel)]="newTicket.category" required>
                    <option value="IT Support">IT Support</option>
                    <option value="HR Query">HR Operations</option>
                    <option value="Payroll">Payroll / Tax</option>
                    <option value="Facilities">Facilities</option>
                  </select>
                </div>
                <div class="col-6">
                  <label for="urgency" class="form-label small fw-semibold text-muted">Urgency</label>
                  <select id="urgency" name="urgency" class="form-select" [(ngModel)]="newTicket.urgency" required>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div class="mb-4">
                <label for="description" class="form-label small fw-semibold text-muted">Detailed Description</label>
                <textarea id="description" name="description" class="form-control" rows="3" placeholder="Please elaborate..." [(ngModel)]="newTicket.description" required></textarea>
              </div>

              <div class="d-grid">
                <button type="submit" [disabled]="!ticketForm.valid" class="btn btn-primary fw-bold py-2 shadow-sm rounded-3">
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>

          <!-- FAQ Accordion -->
          <div class="card border-0 shadow-sm rounded-3 p-4 bg-white">
            <h5 class="fw-bold mb-3 text-secondary"><i class="bi bi-info-circle text-primary me-2"></i> FAQ & Guide</h5>
            <div class="accordion" id="faqAccordion">
              
              <div class="accordion-item border-0 border-bottom">
                <h2 class="accordion-header" id="headingOne">
                  <button class="accordion-button collapsed px-0 py-3 fw-bold small text-dark bg-transparent shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                    How do I order a hardware upgrade?
                  </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#faqAccordion">
                  <div class="accordion-body px-0 py-2 small text-muted">
                    Submit a ticket selecting "IT Support" category. Include the specification required and manager budget approval email attachments.
                  </div>
                </div>
              </div>

              <div class="accordion-item border-0 border-bottom">
                <h2 class="accordion-header" id="headingTwo">
                  <button class="accordion-button collapsed px-0 py-3 fw-bold small text-dark bg-transparent shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    When is the payroll monthly cut-off?
                  </button>
                </h2>
                <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#faqAccordion">
                  <div class="accordion-body px-0 py-2 small text-muted">
                    All timesheets, expenses, and leaves must be submitted and approved by the 20th day of each calendar month.
                  </div>
                </div>
              </div>

              <div class="accordion-item border-0">
                <h2 class="accordion-header" id="headingThree">
                  <button class="accordion-button collapsed px-0 py-3 fw-bold small text-dark bg-transparent shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                    Where is the corporate calendar?
                  </button>
                </h2>
                <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#faqAccordion">
                  <div class="accordion-body px-0 py-2 small text-muted">
                    The calendar with all national and company holidays can be accessed in Dashboard -> Upcoming Events or via the shared portal resources link.
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Active Tickets List -->
        <div class="col-12 col-lg-7">
          <div class="card border-0 shadow-sm rounded-3 p-4 bg-white h-100">
            <h5 class="fw-bold mb-4 text-secondary"><i class="bi bi-ticket-detailed text-primary me-2"></i> Support Tickets Log</h5>
            
            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light text-muted">
                  <tr>
                    <th>Ticket ID</th>
                    <th>Subject</th>
                    <th>Category</th>
                    <th>Urgency</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let t of tickets">
                    <td class="font-monospace text-primary fw-bold">{{ t.id }}</td>
                    <td>
                      <div class="fw-semibold text-dark">{{ t.title }}</div>
                      <div class="small text-muted">Created on {{ t.date }}</div>
                    </td>
                    <td>{{ t.category }}</td>
                    <td>
                      <span class="badge" [ngClass]="{
                        'bg-danger': t.urgency === 'High',
                        'bg-warning text-dark': t.urgency === 'Medium',
                        'bg-secondary': t.urgency === 'Low'
                      }">{{ t.urgency }}</span>
                    </td>
                    <td>
                      <span class="badge rounded-pill" [ngClass]="{
                        'bg-primary-subtle text-primary': t.status === 'Open',
                        'bg-warning-subtle text-warning': t.status === 'In Progress',
                        'bg-success-subtle text-success': t.status === 'Closed'
                      }">{{ t.status }}</span>
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
export class HelpDeskComponent {
  newTicket = {
    title: '',
    category: 'IT Support',
    urgency: 'Medium' as 'Low' | 'Medium' | 'High',
    description: ''
  };

  tickets: Ticket[] = [
    { id: 'TKT-8902', title: 'Need replacement keyboard for home office', category: 'IT Support', urgency: 'Low', status: 'In Progress', date: 'July 05, 2026' },
    { id: 'TKT-8841', title: 'Question regarding W-4 tax declaration corrections', category: 'Payroll', urgency: 'Medium', status: 'Closed', date: 'June 20, 2026' }
  ];

  createTicket() {
    if (!this.newTicket.title || !this.newTicket.description) return;
    
    const randomIdNum = Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const dateStr = now.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });

    const ticket: Ticket = {
      id: `TKT-${randomIdNum}`,
      title: this.newTicket.title,
      category: this.newTicket.category,
      urgency: this.newTicket.urgency,
      status: 'Open',
      date: dateStr
    };

    this.tickets = [ticket, ...this.tickets];

    // Reset Form
    this.newTicket = {
      title: '',
      category: 'IT Support',
      urgency: 'Medium',
      description: ''
    };

    alert(`Ticket ${ticket.id} submitted successfully! A help desk operator will follow up shortly.`);
  }
}
