import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StaffMember {
  id: number;
  name: string;
  email: string;
  role: 'doctor' | 'nurse' | 'receptionist';
  appointmentsToday: number;
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
  imports: [CommonModule],
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

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading.set(true);

    // Simulate API call
    setTimeout(() => {
      // Mock data
      const mockStaff: StaffMember[] = [
        {
          id: 1,
          name: 'Dr. Maria Santos',
          email: 'maria.santos@hospital.com',
          role: 'doctor',
          appointmentsToday: 8,
          status: 'active'
        },
        {
          id: 2,
          name: 'Dr. Juan Dela Cruz',
          email: 'juan.cruz@hospital.com',
          role: 'doctor',
          appointmentsToday: 6,
          status: 'active'
        },
        {
          id: 3,
          name: 'Nurse Rosa',
          email: 'rosa@hospital.com',
          role: 'nurse',
          appointmentsToday: 12,
          status: 'active'
        },
        {
          id: 4,
          name: 'Receptionist Ana',
          email: 'ana@hospital.com',
          role: 'receptionist',
          appointmentsToday: 0,
          status: 'active'
        },
        {
          id: 5,
          name: 'Dr. Carlos Lopez',
          email: 'carlos@hospital.com',
          role: 'doctor',
          appointmentsToday: 0,
          status: 'inactive'
        }
      ];

      this.staffMembers.set(mockStaff);

      this.stats.set({
        totalAppointments: 342,
        totalPatients: 156,
        totalStaff: mockStaff.length,
        appointmentsThisWeek: 89,
        appointmentCompletionRate: 92
      });

      this.loading.set(false);
    }, 1000);
  }

  getRoleIcon(role: string): string {
    switch (role) {
      case 'doctor':
        return 'user md';
      case 'nurse':
        return 'hospital';
      case 'receptionist':
        return 'phone';
      default:
        return 'user';
    }
  }

  getRoleColor(role: string): string {
    switch (role) {
      case 'doctor':
        return 'blue';
      case 'nurse':
        return 'green';
      case 'receptionist':
        return 'purple';
      default:
        return 'gray';
    }
  }

  getStatusClass(status: string): string {
    return status === 'active' ? 'ui green label' : 'ui red label';
  }

  logout() {
    console.log('Admin logging out...');
  }
}
