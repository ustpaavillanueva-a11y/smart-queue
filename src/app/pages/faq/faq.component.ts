import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';

interface FAQItem {
  question: string;
  answer: string;
  open: boolean;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterLink],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FAQComponent {
  faqs: FAQItem[] = [
    {
      question: 'How do I book an appointment?',
      answer: 'You can book an appointment by visiting our website and clicking on "Book Your Appointment" button. Fill in your details, select your preferred service, date, and time. You will receive a confirmation email with your appointment details.',
      open: false
    },
    {
      question: 'What documents do I need to bring for my first visit?',
      answer: 'Please bring a valid ID, insurance card (if applicable), and any medical records from previous treatments. If you have existing health conditions, please also bring relevant medical documents.',
      open: false
    },
    {
      question: 'Can I cancel or reschedule my appointment?',
      answer: 'Yes, you can cancel or reschedule your appointment up to 24 hours before the scheduled time. Please contact our customer service at support@smartqueue.hospital or call us at +63-123-456-7890.',
      open: false
    },
    {
      question: 'Do you offer telemedicine consultations?',
      answer: 'Yes! We offer telemedicine consultations for many services. You can select "Telemedicine" as your preferred service when booking an appointment. A secure video link will be provided before your consultation.',
      open: false
    },
    {
      question: 'What is your cancellation policy?',
      answer: 'Cancellations made 24 hours before the appointment are free. Cancellations made less than 24 hours in advance may incur a cancellation fee of PHP 500.',
      open: false
    },
    {
      question: 'How long does a typical appointment take?',
      answer: 'Most appointments take 30-45 minutes including registration and consultation. Some specialized services may take longer. You will receive an estimated duration when booking.',
      open: false
    },
    {
      question: 'Do you accept insurance?',
      answer: 'Yes, we accept most major insurance plans. Please contact our billing department at billing@smartqueue.hospital to verify your coverage before your appointment.',
      open: false
    },
    {
      question: 'Is your hospital open during holidays?',
      answer: 'Our emergency department is open 24/7 including holidays. Regular services may have modified hours during holidays. Please call ahead to confirm.',
      open: false
    },
    {
      question: 'How can I pay for my services?',
      answer: 'We accept cash, credit/debit cards, insurance, and online transfers. Payment plans are available for major procedures. Contact our billing team for more information.',
      open: false
    },
    {
      question: 'Can I request a specific doctor?',
      answer: 'Yes, you can request a specific doctor when booking. Availability depends on the doctor\'s schedule. We will confirm if your preferred doctor is available.',
      open: false
    }
  ];

  toggleFAQ(index: number) {
    this.faqs[index].open = !this.faqs[index].open;
  }
}
