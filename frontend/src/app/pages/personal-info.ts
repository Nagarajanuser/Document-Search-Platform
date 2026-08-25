import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid py-4">
      <!-- Header banner -->
      <div class="card border-0 shadow-sm rounded-3 p-4 bg-white mb-4">
        <div class="d-flex flex-column flex-md-row align-items-center align-items-md-start">
          <!-- Profile Pic Initials -->
          <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-1 me-md-4 mb-3 mb-md-0 shadow-sm" style="width: 100px; height: 100px; min-width: 100px;">
            JD
          </div>
          <div class="text-center text-md-start flex-grow-1">
            <h2 class="fw-bold mb-1 text-dark">John Doe</h2>
            <p class="text-primary mb-2 fw-semibold">Senior Frontend Engineer</p>
            <p class="text-muted small mb-0"><i class="bi bi-geo-alt me-1"></i> San Francisco Office • Full-Time</p>
            
            <div class="d-flex flex-wrap justify-content-center justify-content-md-start gap-3 mt-3">
              <span class="badge bg-light text-dark border"><i class="bi bi-envelope me-1"></i> john.doe&#64;company.com</span>
              <span class="badge bg-light text-dark border"><i class="bi bi-phone me-1"></i> +1 (555) 019-2834</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Detail Tabs -->
      <div class="row g-4">
        <div class="col-12 col-md-4">
          <div class="list-group shadow-sm rounded-3 border-0">
            <button 
              (click)="activeTab = 'personal'" 
              class="list-group-item list-group-item-action py-3 border-light-subtle fw-semibold d-flex align-items-center justify-content-between"
              [class.active]="activeTab === 'personal'"
            >
              <span><i class="bi bi-person-badge me-2"></i> Personal Details</span>
              <i class="bi bi-chevron-right"></i>
            </button>
            
            <button 
              (click)="activeTab = 'job'" 
              class="list-group-item list-group-item-action py-3 border-light-subtle fw-semibold d-flex align-items-center justify-content-between"
              [class.active]="activeTab === 'job'"
            >
              <span><i class="bi bi-briefcase me-2"></i> Job & Work Info</span>
              <i class="bi bi-chevron-right"></i>
            </button>
            
            <button 
              (click)="activeTab = 'emergency'" 
              class="list-group-item list-group-item-action py-3 border-light-subtle fw-semibold d-flex align-items-center justify-content-between"
              [class.active]="activeTab === 'emergency'"
            >
              <span><i class="bi bi-telephone-outbound me-2"></i> Emergency Contacts</span>
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>

        <!-- Display Area -->
        <div class="col-12 col-md-8">
          <div class="card border-0 shadow-sm rounded-3 p-4 bg-white h-100">
            <!-- Personal Details Tab -->
            <div *ngIf="activeTab === 'personal'">
              <h5 class="fw-bold mb-4 text-secondary border-bottom pb-2">Personal Information</h5>
              <div class="row g-3">
                <div class="col-6">
                  <p class="text-muted small mb-1">Full Legal Name</p>
                  <p class="fw-semibold text-dark mb-0">Johnathan Edward Doe</p>
                </div>
                <div class="col-6">
                  <p class="text-muted small mb-1">Date of Birth</p>
                  <p class="fw-semibold text-dark mb-0">November 12, 1991</p>
                </div>
                <div class="col-6">
                  <p class="text-muted small mb-1">Gender</p>
                  <p class="fw-semibold text-dark mb-0">Male</p>
                </div>
                <div class="col-6">
                  <p class="text-muted small mb-1">Marital Status</p>
                  <p class="fw-semibold text-dark mb-0">Married</p>
                </div>
                <div class="col-6">
                  <p class="text-muted small mb-1">Nationality</p>
                  <p class="fw-semibold text-dark mb-0">United States</p>
                </div>
                <div class="col-6">
                  <p class="text-muted small mb-1">Tax ID / SSN</p>
                  <p class="fw-semibold text-dark mb-0">XXX-XX-6789</p>
                </div>
              </div>
            </div>

            <!-- Job details Tab -->
            <div *ngIf="activeTab === 'job'">
              <h5 class="fw-bold mb-4 text-secondary border-bottom pb-2">Employment & Position Details</h5>
              <div class="row g-3">
                <div class="col-6">
                  <p class="text-muted small mb-1">Employee ID</p>
                  <p class="fw-semibold text-dark mb-0 font-monospace text-primary">EMP-2026-904</p>
                </div>
                <div class="col-6">
                  <p class="text-muted small mb-1">Date of Hire</p>
                  <p class="fw-semibold text-dark mb-0">January 15, 2024</p>
                </div>
                <div class="col-6">
                  <p class="text-muted small mb-1">Department</p>
                  <p class="fw-semibold text-dark mb-0">Engineering / Web Products</p>
                </div>
                <div class="col-6">
                  <p class="text-muted small mb-1">Direct Manager</p>
                  <p class="fw-semibold text-dark mb-0">Michael Scott</p>
                </div>
                <div class="col-6">
                  <p class="text-muted small mb-1">Work Location</p>
                  <p class="fw-semibold text-dark mb-0">San Francisco HQ - Desk 4C</p>
                </div>
                <div class="col-6">
                  <p class="text-muted small mb-1">Employment Type</p>
                  <p class="fw-semibold text-dark mb-0">Full-Time Regular</p>
                </div>
              </div>
            </div>

            <!-- Emergency details Tab -->
            <div *ngIf="activeTab === 'emergency'">
              <h5 class="fw-bold mb-4 text-secondary border-bottom pb-2">Emergency Contacts</h5>
              <div class="row g-3">
                <div class="col-12 col-sm-6">
                  <div class="p-3 border rounded-3 bg-light-subtle">
                    <p class="text-muted small mb-1">Primary Contact Name</p>
                    <p class="fw-bold text-dark mb-1">Jane Doe</p>
                    <p class="text-muted small mb-2">Relationship: Spouse</p>
                    <p class="fw-semibold text-primary mb-0"><i class="bi bi-telephone me-1"></i> +1 (555) 019-9021</p>
                  </div>
                </div>
                <div class="col-12 col-sm-6">
                  <div class="p-3 border rounded-3 bg-light-subtle">
                    <p class="text-muted small mb-1">Secondary Contact Name</p>
                    <p class="fw-bold text-dark mb-1">Robert Doe</p>
                    <p class="text-muted small mb-2">Relationship: Father</p>
                    <p class="fw-semibold text-primary mb-0"><i class="bi bi-telephone me-1"></i> +1 (555) 017-3849</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `
})
export class PersonalInfoComponent {
  activeTab: 'personal' | 'job' | 'emergency' = 'personal';
}
