import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  readonly title = 'smart-queue';

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    // Initialize default admin account if none exists
    this.firebaseService.initializeDefaultAdmin();
  }
}
