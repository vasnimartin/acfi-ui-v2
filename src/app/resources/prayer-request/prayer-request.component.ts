import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prayer-request',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <h1>Prayer Request</h1>
      <p>Coming soon...</p>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 80px 20px;
      text-align: center;
    }
    h1 {
      font-family: 'Cinzel', serif;
      color: #2C3E50;
      margin-bottom: 20px;
    }
  `]
})
export class PrayerRequestComponent {}
