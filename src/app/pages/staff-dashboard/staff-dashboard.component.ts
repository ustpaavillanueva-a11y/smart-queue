import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Appointment {
  id: number;
  patientName: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
}

interface DashboardStats {
  todayAppointments: number;
  thisWeekAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
}

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './staff-dashboard.component.html',
  styleUrl: './staff-dashboard.component.css'
})
export class StaffDashboardComponent implements OnInit {
  staffName = signal('Dr. Maria Santos');
  appointments = signal<Appointment[]>([]);
  stats = signal<DashboardStats>({
    todayAppointments: 0,
    thisWeekAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0
  });
  selectedFilter = signal<'all' | 'today' | 'pending'>('all');
  loading = signal(true);

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading.set(true);

    // Simulate API call
    setTimeout(() => {
      // Mock data
      const mockAppointments: Appointment[] = [
        {
          id: 1,
          patientName: 'Juan dela Cruz',
          email: 'juan@email.com',
          phone: '09991234567',
          service: 'General Check-up',
          date: '2026-05-05',
          time: '09:00',
          status: 'pending',
          notes: 'Patient has hypertension'
        },
        {
          id: 2,
          patientName: 'Maria Garcia',
          email: 'maria@email.com',
          phone: '09998765432',
          service: 'Dental Check-up',
          date: '2026-05-05',
          time: '10:00',
          status: 'confirmed',
          notes: 'Regular check-up'
        },
        {
          id: 3,
          patientName: 'Pedro Reyes',
          email: 'pedro@email.com',
          phone: '09995554433',
          service: 'Blood Test',
          date: '2026-05-06',
          time: '14:00',
          status: 'pending',
          notes: 'Lab work needed'
        },
        {
          id: 4,
          patientName: 'Ana Martinez',
          email: 'ana@email.com',
          phone: '09996661122',
          service: 'Eye Examination',
          date: '2026-05-04',
          time: '15:00',
          status: 'completed',
          notes: 'Patient prescribed glasses'
        },
        {
          id: 5,
          patientName: 'Carlos Lopez',
          email: 'carlos@email.com',
          phone: '09997772233',
          service: 'Consultation',
          date: '2026-05-07',
          time: '11:00',
          status: 'pending',
          notes: 'Follow-up consultation'
        }
      ];

      this.appointments.set(mockAppointments);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const thisWeekStart = new Date();
      thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());

      const todayCount = mockAppointments.filter(a => a.date === today).length;
      const thisWeekCount = mockAppointments.filter(a => {
        const appointmentDate = new Date(a.date);
        return appointmentDate >= thisWeekStart;
      }).length;
      const pendingCount = mockAppointments.filter(a => a.status === 'pending').length;
      const completedCount = mockAppointments.filter(a => a.status === 'completed').length;

      this.stats.set({
        todayAppointments: todayCount,
        thisWeekAppointments: thisWeekCount,
        pendingAppointments: pendingCount,
        completedAppointments: completedCount
      });

      this.loading.set(false);
    }, 800);
  }

  get filteredAppointments(): Appointment[] {
    let filtered = this.appointments();

    if (this.selectedFilter() === 'pending') {
      filtered = filtered.filter(a => a.status === 'pending');
    } else if (this.selectedFilter() === 'today') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(a => a.date === today);
    }

    return filtered;
  }

  setFilter(filter: 'all' | 'today' | 'pending') {
    this.selectedFilter.set(filter);
  }

  updateStatus(appointmentId: number, newStatus: string) {
    const appointments = this.appointments();
    const index = appointments.findIndex(a => a.id === appointmentId);
    if (index !== -1) {
      appointments[index].status = newStatus as any;
      this.appointments.set([...appointments]);
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'ui blue label';
      case 'completed':
        return 'ui green label';
      case 'pending':
        return 'ui yellow label';
      case 'cancelled':
        return 'ui red label';
      default:
        return 'ui gray label';
    }
  }

  logout() {
    // In real app, this would clear auth token and redirect to login
    console.log('Logging out...');
  }
}
