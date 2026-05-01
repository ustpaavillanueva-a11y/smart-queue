import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';

interface Announcement {
  id: number;
  title: string;
  description: string;
  date: string;
  icon: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  announcements: Announcement[] = [
    {
      id: 1,
      title: 'New Telemedicine Service',
      description: 'Now available! Consult with our doctors from the comfort of your home. Book your virtual appointment today.',
      date: '2026-04-28',
      icon: 'video'
    },
    {
      id: 2,
      title: 'Extended Operating Hours',
      description: 'Our hospital is now open 24/7 for emergency services. Walk-in patients welcome at our emergency department.',
      date: '2026-04-25',
      icon: 'clock'
    },
    {
      id: 3,
      title: 'New Cardiac Center',
      description: 'We are proud to introduce our state-of-the-art Cardiac Care Center with advanced diagnostic equipment and expert cardiologists.',
      date: '2026-04-20',
      icon: 'heartbeat'
    },
    {
      id: 4,
      title: 'Health & Wellness Campaign',
      description: 'Free health screening for patients aged 40 and above. Schedule your appointment online and get priority billing.',
      date: '2026-04-15',
      icon: 'heartbeat'
    }
  ];

  features = [
    {
      title: 'Easy Scheduling',
      description: 'Book your appointment in just a few clicks, no account needed.',
      icon: 'calendar'
    },
    {
      title: 'Priority System',
      description: 'Get assigned a priority number to minimize waiting time.',
      icon: 'list'
    },
    {
      title: 'Email Confirmation',
      description: 'Receive instant confirmation of your appointment via email.',
      icon: 'envelope'
    },
    {
      title: 'Expert Doctors',
      description: 'Our team of experienced physicians and specialists are ready to serve you.',
      icon: 'user md'
    }
  ];
}
