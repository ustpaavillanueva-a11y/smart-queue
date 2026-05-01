import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: any;
  status: 'active' | 'inactive';
}

interface AdminStats {
  totalAppointments: number;
  totalPatients: number;
  totalStaff: number;
  appointmentsThisWeek: number;
  appointmentCompletionRate: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  adminName = signal('Administrator');
  stats = signal<AdminStats>({
    totalAppointments: 0,
    totalPatients: 0,
    totalStaff: 0,
    appointmentsThisWeek: 0,
    appointmentCompletionRate: 0
  });
  staffMembers = signal<StaffMember[]>([]);
  loading = signal(true);
  showCreateStaffForm = signal(false);
  createStaffForm: FormGroup;
  submitted = signal(false);
  errorMessage = signal('');

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createStaffForm = this.fb.group({
      staffName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    // Check if user is logged in and is admin
    const currentUser = this.firebaseService.currentUser();
    const userRole = this.firebaseService.userRole();

    if (!currentUser || userRole !== 'admin') {
      this.router.navigate(['/admin/login']);
      return;
    }

    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading.set(true);
    this.firebaseService.getAllStaff()
      .then((staff: any[]) => {
        const staffMembers: StaffMember[] = staff.map((s: any) => ({
          id: s.id,
          name: s.name || s.email,
          email: s.email,
          role: 'staff',
          createdAt: s.createdAt,
          status: 'active'
        }));
        this.staffMembers.set(staffMembers);
        this.updateStats(staffMembers);
        this.loading.set(false);
      })
      .catch((error: any) => {
        console.error('Error loading staff:', error);
        this.errorMessage.set('Failed to load staff members');
        this.loading.set(false);
      });
  }

  updateStats(staff: StaffMember[]) {
    this.stats.set({
      totalAppointments: 250,
      totalPatients: 450,
      totalStaff: staff.length,
      appointmentsThisWeek: 65,
      appointmentCompletionRate: 92
    });
  }

  toggleCreateStaffForm() {
    this.showCreateStaffForm.set(!this.showCreateStaffForm());
    this.submitted.set(false);
    this.createStaffForm.reset();
    this.errorMessage.set('');
  }

  createStaffAccount() {
    this.submitted.set(true);
    this.errorMessage.set('');

    if (this.createStaffForm.invalid) {
      return;
    }

    const { staffName, email, password } = this.createStaffForm.value;

    this.firebaseService.createStaffAccount(email, password, staffName)
      .then(() => {
        alert(`Staff account created for ${email}`);
        this.createStaffForm.reset();
        this.submitted.set(false);
        this.showCreateStaffForm.set(false);
        this.loadDashboardData();
      })
      .catch((error: any) => {
        this.errorMessage.set(error.message);
      });
  }

  deleteStaffMember(staffId: string) {
    if (confirm('Are you sure you want to delete this staff member?')) {
      this.firebaseService.deleteStaffAccount(staffId)
        .then(() => {
          alert('Staff member deleted');
          this.loadDashboardData();
        })
        .catch((error: any) => {
          this.errorMessage.set('Failed to delete staff: ' + error.message);
        });
    }
  }

  logout() {
    this.firebaseService.logoutUser()
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch((error: any) => {
        this.errorMessage.set('Failed to logout: ' + error.message);
      });
  }
}
