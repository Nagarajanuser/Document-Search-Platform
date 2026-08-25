import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard';
import { AttendanceComponent } from './pages/attendance';
import { LeaveManagementComponent } from './pages/leave-management';
import { PayrollComponent } from './pages/payroll';
import { RecruitmentComponent } from './pages/recruitment';
import { PerformanceManagementComponent } from './pages/performance-management';
import { LearningDevelopmentComponent } from './pages/learning-development';
import { EmployeeDocumentsComponent } from './pages/employee-documents';
import { BenefitsComponent } from './pages/benefits';
import { HelpDeskComponent } from './pages/help-desk';
import { PersonalInfoComponent } from './pages/personal-info';
import { IngestComponent } from './pages/ingest';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'attendance', component: AttendanceComponent },
  { path: 'leave-management', component: LeaveManagementComponent },
  { path: 'payroll', component: PayrollComponent },
  { path: 'recruitment', component: RecruitmentComponent },
  { path: 'performance-management', component: PerformanceManagementComponent },
  { path: 'learning-development', component: LearningDevelopmentComponent },
  { path: 'employee-documents', component: EmployeeDocumentsComponent },
  { path: 'ingest', component: IngestComponent },
  { path: 'benefits', component: BenefitsComponent },
  { path: 'help-desk', component: HelpDeskComponent },
  { path: 'personal-info', component: PersonalInfoComponent },
  { path: '**', redirectTo: 'dashboard' }
];
