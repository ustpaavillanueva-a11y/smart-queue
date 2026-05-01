import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { PatientBookingComponent } from './pages/patient-booking/patient-booking.component';
import { StaffDashboardComponent } from './pages/staff-dashboard/staff-dashboard.component';
import { StaffLoginComponent } from './pages/staff-login/staff-login.component';
import { LandingComponent } from './pages/landing/landing.component';
import { AboutComponent } from './pages/about/about.component';
import { ServicesComponent } from './pages/services/services.component';
import { ContactComponent } from './pages/contact/contact.component';
import { FAQComponent } from './pages/faq/faq.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'about', component: AboutComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'faq', component: FAQComponent },
  { path: 'booking', component: PatientBookingComponent },
  { path: 'staff/login', component: StaffLoginComponent },
  { path: 'staff/dashboard', component: StaffDashboardComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: '**', redirectTo: '' }
];
