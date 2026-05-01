import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';

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

  services = [
    { id: 1, name: 'General Check-up' },
    { id: 2, name: 'Dental Check-up' },
    { id: 3, name: 'Eye Examination' },
    { id: 4, name: 'Blood Test' },
    { id: 5, name: 'X-Ray' },
    { id: 6, name: 'Consultation' }
  ];

  constructor(private fb: FormBuilder) {
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

  onSubmit() {
    this.submitted.set(true);

    if (this.bookingForm.invalid) {
      return;
    }

    this.loading.set(true);
    
    // Simulate API call
    setTimeout(() => {
      this.loading.set(false);
      this.successMessage.set(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        this.bookingForm.reset();
        this.submitted.set(false);
        this.successMessage.set(false);
      }, 3000);
    }, 1500);
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
