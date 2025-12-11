import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <header class="welcome-header" *ngIf="userProfile$ | async as profile">
        <div>
          <h1 class="welcome-title">Welcome back, {{ profile.full_name?.split(' ')[0] }}</h1>
          <p class="subtitle">Here's what's happening at ACFI Church today.</p>
        </div>
        <div class="date-display">
          {{ today | date:'EEEE, MMMM d' }}
        </div>
      </header>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon events"><i class="fa-regular fa-calendar"></i></div>
          <div class="stat-content">
            <span class="stat-value">3</span>
            <span class="stat-label">Upcoming Events</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon people"><i class="fa-solid fa-users"></i></div>
          <div class="stat-content">
            <span class="stat-value">12</span>
            <span class="stat-label">New Members</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon prayer"><i class="fa-solid fa-hands-praying"></i></div>
          <div class="stat-content">
            <span class="stat-value">5</span>
            <span class="stat-label">Prayer Requests</span>
          </div>
        </div>
      </div>

      <h3 class="section-title">Quick Actions</h3>
      <div class="actions-grid">
        <a routerLink="../events" class="action-card">
          <span class="action-icon"><i class="fa-solid fa-plus"></i></span>
          <span class="action-text">Add Event</span>
        </a>
        <a routerLink="../sermons" class="action-card">
          <span class="action-icon"><i class="fa-solid fa-microphone"></i></span>
          <span class="action-text">Upload Sermon</span>
        </a>
        <a routerLink="../media" class="action-card">
          <span class="action-icon"><i class="fa-solid fa-cloud-arrow-up"></i></span>
          <span class="action-text">Upload Media</span>
        </a>
        <a routerLink="../ministries" class="action-card">
          <span class="action-icon"><i class="fa-solid fa-clipboard-list"></i></span>
          <span class="action-text">Manage Rosters</span>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 1px solid #E5E7EB;
    }

    .welcome-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 8px 0;
      letter-spacing: -0.02em;
    }
    
    .subtitle {
      color: #6B7280;
      font-size: 1rem;
      margin: 0;
    }

    .date-display {
      font-size: 0.9rem;
      font-weight: 600;
      color: #9CA3AF;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 48px;
    }

    .stat-card {
      background: white;
      padding: 24px;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
      display: flex;
      align-items: center;
      gap: 20px;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }

    .stat-icon.events { background: #EEF2FF; color: #4F46E5; }
    .stat-icon.people { background: #ECFDF5; color: #059669; }
    .stat-icon.prayer { background: #FFF7ED; color: #EA580C; }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      line-height: 1.1;
    }

    .stat-label {
      font-size: 0.85rem;
      color: #6B7280;
    }

    .section-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1F2937;
      margin-bottom: 20px;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }

    .action-card {
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: #4B5563;
      transition: all 0.2s;
    }

    .action-card:hover {
      border-color: #D4AF37;
      color: #D4AF37;
      background: #FFFCF5;
    }

    .action-icon {
      font-size: 1.5rem;
    }

    .action-text {
      font-weight: 500;
      font-size: 0.95rem;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  userProfile$: Observable<any> | undefined;
  today = new Date();

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userProfile$ = this.authService.currentUserProfile$;
  }
}
