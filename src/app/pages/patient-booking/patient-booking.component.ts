import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FirebaseService } from '../../services/firebase.service';

interface BookingDetails {
  priorityNumber: string;
  fullName: string;
  email: string;
  phone: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  bookingDate: string;
}

@Component({
  selector: 'app-patient-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './patient-booking.component.html',
  styleUrl: './patient-booking.component.css'
})
export class PatientBookingComponent {
  bookingForm: FormGroup;
  submitted = signal(false);
  loading = signal(false);
  successMessage = signal(false);
  errorMessage = signal('');
  showModal = signal(false);
  bookingDetails = signal<BookingDetails | null>(null);

  services = [
    { id: 1, name: 'General Check-up' },
    { id: 2, name: 'Dental Check-up' },
    { id: 3, name: 'Eye Examination' },
    { id: 4, name: 'Blood Test' },
    { id: 5, name: 'X-Ray' },
    { id: 6, name: 'Consultation' }
  ];

  constructor(private fb: FormBuilder, private firebaseService: FirebaseService) {
    this.bookingForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,}$/)]],
      service: ['', Validators.required],
      preferredDate: ['', Validators.required],
      preferredTime: ['', Validators.required],
      notes: ['']
    });
  }

  get f() {
    return this.bookingForm.controls;
  }

  generatePriorityNumber(): string {
    // Generate priority number like A-001, A-002, etc.
    const random = Math.floor(Math.random() * 999) + 1;
    return `A-${random.toString().padStart(3, '0')}`;
  }

  getServiceName(serviceId: string): string {
    const service = this.services.find(s => s.id === parseInt(serviceId));
    return service ? service.name : 'N/A';
  }

  onSubmit() {
    this.submitted.set(true);

    if (this.bookingForm.invalid) {
      return;
    }

    this.loading.set(true);
    
    const formValue = this.bookingForm.value;
    const priorityNumber = this.generatePriorityNumber();
    const booking: BookingDetails = {
      priorityNumber: priorityNumber,
      fullName: formValue.fullName,
      email: formValue.email,
      phone: formValue.phone,
      service: this.getServiceName(formValue.service),
      preferredDate: formValue.preferredDate,
      preferredTime: formValue.preferredTime,
      bookingDate: new Date().toLocaleString()
    };

    // Save to Firebase
    this.firebaseService.addAppointment({
      fullName: booking.fullName,
      email: booking.email,
      phone: booking.phone,
      service: booking.service,
      preferredDate: booking.preferredDate,
      preferredTime: booking.preferredTime,
      priorityNumber: booking.priorityNumber,
      notes: formValue.notes || '',
      status: 'pending'
    }).then(() => {
      this.loading.set(false);
      this.bookingDetails.set(booking);
      this.showModal.set(true);
      this.successMessage.set(true);
      this.errorMessage.set('');
    }).catch(error => {
      this.loading.set(false);
      this.errorMessage.set('Failed to save appointment: ' + error.message);
      console.error('Firebase error:', error);
    });
  }

  downloadConfirmationPDF() {
    const details = this.bookingDetails();
    if (!details) return;

    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Appointment Confirmation</title>
        <style>
          * { margin: 0; padding: 0; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; }
          .container { max-width: 210mm; height: 297mm; padding: 20mm; box-sizing: border-box; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #10b981; padding-bottom: 20px; }
          .header h1 { color: #10b981; font-size: 24px; margin-bottom: 5px; }
          .header p { color: #666; font-size: 12px; }
          .priority-box { background: #f0fdf4; border: 2px solid #10b981; border-radius: 8px; padding: 15px; text-align: center; margin: 20px 0; }
          .priority-number { font-size: 36px; font-weight: 700; color: #10b981; font-family: 'Courier New', monospace; }
          .section { margin: 20px 0; }
          .section-title { font-size: 14px; font-weight: 600; color: #10b981; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 12px; border-bottom: 1px solid #f0f0f0; }
          .detail-label { font-weight: 600; color: #666; flex: 0 0 40%; }
          .detail-value { color: #333; flex: 1; text-align: right; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 11px; }
          .booking-date { text-align: right; color: #999; font-size: 10px; margin-top: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>APPOINTMENT CONFIRMATION</h1>
            <p>SMART QUEUE HEALTH VILLANUEVA</p>
            <div class="booking-date">Booked on: ${details.bookingDate}</div>
          </div>

          <div class="priority-box">
            <div style="font-size: 12px; color: #666; margin-bottom: 8px;">Your Priority Number</div>
            <div class="priority-number">${details.priorityNumber}</div>
          </div>

          <div class="section">
            <div class="section-title">APPOINTMENT DETAILS</div>
            <div class="detail-row">
              <span class="detail-label">Service</span>
              <span class="detail-value">${details.service}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date</span>
              <span class="detail-value">${details.preferredDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Time</span>
              <span class="detail-value">${details.preferredTime}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">PATIENT INFORMATION</div>
            <div class="detail-row">
              <span class="detail-label">Name</span>
              <span class="detail-value">${details.fullName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email</span>
              <span class="detail-value">${details.email}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone</span>
              <span class="detail-value">${details.phone}</span>
            </div>
          </div>

          <div class="footer">
            <p>Please keep this confirmation for your records.</p>
            <p>Arrive 10 minutes before your scheduled appointment time.</p>
            <p style="margin-top: 10px;">For inquiries, contact us at (555) 123-4567</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create blob and download/print
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Appointment_${details.priorityNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Open in new window for printing to PDF
    const printWindow = window.open(url);
    if (printWindow) {
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  }

  closeModal() {
    this.showModal.set(false);
    this.successMessage.set(false);
    this.bookingForm.reset();
    this.submitted.set(false);
  }

  resetForm() {
    this.bookingForm.reset();
    this.submitted.set(false);
  }

  // Get minimum date (today)
  getMinDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}
