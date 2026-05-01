import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterLink],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
  services = [
    {
      icon: 'stethoscope',
      title: 'General Check-up',
      description: 'Comprehensive health assessment with our experienced physicians including vital signs, medical history review, and preventive care guidance.'
    },
    {
      icon: 'tooth',
      title: 'Dental Check-up',
      description: 'Professional dental care including cleaning, cavity detection, and cosmetic dentistry services by our expert dentists.'
    },
    {
      icon: 'eye',
      title: 'Eye Examination',
      description: 'Complete vision assessment, eye disease screening, and prescription glasses/contacts consultation.'
    },
    {
      icon: 'flask',
      title: 'Blood Test',
      description: 'Laboratory testing services including CBC, blood chemistry, hormone levels, and infectious disease screening.'
    },
    {
      icon: 'x-ray',
      title: 'X-Ray & Imaging',
      description: 'State-of-the-art diagnostic imaging including X-ray, CT scan, and ultrasound services with expert radiologists.'
    },
    {
      icon: 'video',
      title: 'Telemedicine',
      description: 'Virtual consultations with doctors from the comfort of your home. Convenient and secure online healthcare services.'
    },
    {
      icon: 'heartbeat',
      title: 'Cardiology',
      description: 'Specialized cardiac care including EKG, echocardiogram, and cardiology consultations for heart health.'
    },
    {
      icon: 'baby carriage',
      title: 'Pediatrics',
      description: 'Specialized healthcare for infants and children including vaccinations, development screening, and pediatric care.'
    },
    {
      icon: 'user nurse',
      title: 'Nursing Care',
      description: 'Professional nursing services including home care, wound care, and post-operative nursing support.'
    },
    {
      icon: 'wheelchair',
      title: 'Emergency Services',
      description: '24/7 emergency department with trauma specialists, life support equipment, and ambulance services.'
    },
    {
      icon: 'microscope',
      title: 'Surgery',
      description: 'Modern surgical facilities with experienced surgeons in general, orthopedic, and specialized procedures.'
    },
    {
      icon: 'pills',
      title: 'Pharmacy',
      description: 'Full-service pharmacy with prescription medications, OTC drugs, and pharmaceutical consultations.'
    }
  ];
}
