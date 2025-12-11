
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ServiceSlot {
  id: number;
  date: string;
  service: string;
  role: string;
  status: 'Open' | 'Filled';
  volunteer?: string;
}

@Component({
  selector: 'app-volunteer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="container">
        <div class="header-section">
          <h1>Volunteer Roster</h1>
          <p>Serve one another in love. Join a team for upcoming services.</p>
        </div>

        <div class="roster-grid">
          <div autowidth class="service-card" *ngFor="let slot of slots">
            <div class="date-badge">
              <span class="day">{{ slot.date | date:'dd' }}</span>
              <span class="month">{{ slot.date | date:'MMM' }}</span>
            </div>
            <div class="details">
              <h3>{{ slot.service }}</h3>
              <p class="role"><i class="fa-solid fa-user-tag"></i> {{ slot.role }}</p>
              
              <div class="status-action">
                <span class="status" [class.open]="slot.status === 'Open'" [class.filled]="slot.status === 'Filled'">
                  {{ slot.status }}
                </span>
                
                <button *ngIf="slot.status === 'Open'" (click)="signUp(slot)" class="btn-signup">
                  Sign Up
                </button>
                <span *ngIf="slot.status === 'Filled'" class="volunteer-name">
                  <i class="fa-solid fa-check"></i> {{ slot.volunteer }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 60px 0;
      background-color: #f9f9f9;
      min-height: 80vh;
    }

    .header-section {
      text-align: center;
      margin-bottom: 40px;
    }

    h1 {
      font-size: 2.5rem;
      color: #2c3e50;
      margin-bottom: 10px;
    }

    p {
      color: #7f8c8d;
      font-size: 1.1rem;
    }

    .roster-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .service-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      gap: 20px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      transition: transform 0.2s;
    }

    .service-card:hover {
      transform: translateY(-5px);
    }

    .date-badge {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #ecf0f1;
      padding: 10px;
      border-radius: 8px;
      min-width: 60px;
      height: 70px;
    }

    .day {
      font-size: 1.5rem;
      font-weight: 700;
      color: #2c3e50;
      line-height: 1;
    }

    .month {
      font-size: 0.9rem;
      text-transform: uppercase;
      color: #7f8c8d;
    }

    .details {
      flex: 1;
    }

    h3 {
      font-size: 1.2rem;
      margin: 0 0 5px 0;
      color: #34495e;
    }

    .role {
      color: #7f8c8d;
      margin-bottom: 15px;
      font-size: 0.95rem;
    }
    
    .role i {
      margin-right: 5px;
      color: #3498db;
    }

    .status-action {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .status {
      font-size: 0.8rem;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status.open {
      background-color: #e8f8f5;
      color: #27ae60;
    }

    .status.filled {
      background-color: #fef9e7;
      color: #f39c12;
    }

    .btn-signup {
      background-color: #27ae60;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background-color 0.2s;
    }

    .btn-signup:hover {
      background-color: #219150;
    }

    .volunteer-name {
      font-size: 0.9rem;
      color: #7f8c8d;
    }
  `]
})
export class VolunteerComponent {
  slots: ServiceSlot[] = [
    { id: 1, date: '2025-12-14', service: 'Sunday Service', role: 'Usher', status: 'Open' },
    { id: 2, date: '2025-12-14', service: 'Sunday Service', role: 'Greeter', status: 'Filled', volunteer: 'Jane Doe' },
    { id: 3, date: '2025-12-14', service: 'Sunday Service', role: 'Worship Team', status: 'Open' },
    { id: 4, date: '2025-12-21', service: 'Christmas Service', role: 'Parking Lot', status: 'Open' },
    { id: 5, date: '2025-12-21', service: 'Christmas Service', role: 'Children Ministry', status: 'Open' }
  ];

  signUp(slot: ServiceSlot) {
    if (confirm(`Sign up for ${slot.role} on ${slot.date}?`)) {
      // Logic to save to DB would go here
      slot.status = 'Filled';
      slot.volunteer = 'You'; // In real app, use current user name
    }
  }
}
