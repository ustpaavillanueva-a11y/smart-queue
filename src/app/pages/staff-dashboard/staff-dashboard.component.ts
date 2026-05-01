import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';

interface Appointment {
  id?: string;
  priorityNumber: string;
  fullName: string;
  email: string;
  phone: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
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
  staffName = signal('Staff Member');
  appointments = signal<Appointment[]>([]);
  stats = signal<DashboardStats>({
    todayAppointments: 0,
    thisWeekAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0
  });
  selectedFilter = signal<'all' | 'today' | 'pending'>('all');
  loading = signal(true);
  errorMessage = signal('');

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  ngOnInit() {
    // Set staff name from current user
    const user = this.firebaseService.currentUser();
    if (user) {
      this.staffName.set(user.email);
    } else {
      // Redirect to login if not authenticated
      this.router.navigate(['/staff/login']);
      return;
    }
    
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading.set(true);
    this.errorMessage.set('');

    this.firebaseService.getAppointments()
      .then((appointments: any[]) => {
        // Convert Firebase data to Appointment format
        const formattedAppointments: Appointment[] = appointments.map(apt => ({
          id: apt.id,
          priorityNumber: apt.priorityNumber,
          fullName: apt.fullName,
          email: apt.email,
          phone: apt.phone,
          service: apt.service,
          preferredDate: apt.preferredDate,
          preferredTime: apt.preferredTime,
          status: apt.status || 'pending',
          notes: apt.notes || ''
        }));

        this.appointments.set(formattedAppointments);
        this.updateStats(formattedAppointments);
        this.loading.set(false);
      })
      .catch((error: any) => {
        console.error('Error loading appointments:', error);
        this.errorMessage.set('Failed to load appointments. Please try again.');
        this.loading.set(false);
      });
  }

  updateStats(appointments: Appointment[]) {
    const today = new Date().toISOString().split('T')[0];
    const thisWeekStart = new Date();
    thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());

    const todayCount = appointments.filter(a => a.preferredDate === today).length;
    const thisWeekCount = appointments.filter(a => {
      const appointmentDate = new Date(a.preferredDate);
      return appointmentDate >= thisWeekStart;
    }).length;
    const pendingCount = appointments.filter(a => a.status === 'pending').length;
    const completedCount = appointments.filter(a => a.status === 'completed').length;

    this.stats.set({
      todayAppointments: todayCount,
      thisWeekAppointments: thisWeekCount,
      pendingAppointments: pendingCount,
      completedAppointments: completedCount
    });
  }

  get filteredAppointments(): Appointment[] {
    let filtered = this.appointments();

    if (this.selectedFilter() === 'pending') {
      filtered = filtered.filter(a => a.status === 'pending');
    } else if (this.selectedFilter() === 'today') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(a => a.preferredDate === today);
    }

    return filtered;
  }

  setFilter(filter: 'all' | 'today' | 'pending') {
    this.selectedFilter.set(filter);
  }

  updateStatus(appointmentId: string | undefined, newStatus: string) {
    if (!appointmentId) return;

    this.firebaseService.updateAppointment(appointmentId, { status: newStatus })
      .then(() => {
        // Update local array
        const appointments = this.appointments();
        const index = appointments.findIndex(a => a.id === appointmentId);
        if (index !== -1) {
          appointments[index].status = newStatus as any;
          this.appointments.set([...appointments]);
        }
      })
      .catch((error: any) => {
        console.error('Error updating appointment:', error);
        this.errorMessage.set('Failed to update appointment status.');
      });
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
