import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MinistryService, Ministry } from '../core/services/ministry.service';

@Component({
  selector: 'app-ministries',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ministries-page">
      <div class="page-hero">
        <div class="container">
          <h1>Our Ministries</h1>
          <p class="subtitle">Discover ways to serve and connect with our church family</p>
        </div>
      </div>

      <div class="container">
        <div class="ministries-grid" *ngIf="ministries.length > 0; else emptyState">
          <div class="ministry-card" *ngFor="let ministry of ministries">
            <div class="card-image" *ngIf="ministry.image_url" [style.backgroundImage]="'url(' + ministry.image_url + ')'"></div>
            <div class="card-content">
              <h2 class="ministry-name">{{ ministry.name }}</h2>
              <p class="ministry-description" *ngIf="ministry.description">{{ ministry.description }}</p>
              
              <div class="ministry-info">
                <div class="info-item" *ngIf="ministry.leader_name">
                  <i class="fa-solid fa-user"></i>
                  <span><strong>Leader:</strong> {{ ministry.leader_name }}</span>
                </div>
                <div class="info-item" *ngIf="ministry.meeting_schedule">
                  <i class="fa-solid fa-clock"></i>
                  <span><strong>Meets:</strong> {{ ministry.meeting_schedule }}</span>
                </div>
                <div class="info-item" *ngIf="ministry.contact_email">
                  <i class="fa-solid fa-envelope"></i>
                  <a [href]="'mailto:' + ministry.contact_email">{{ ministry.contact_email }}</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ng-template #emptyState>
          <div class="empty-state">
            <i class="fa-solid fa-users-rays"></i>
            <h3>No ministries available</h3>
            <p>Check back soon for ministry opportunities!</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .ministries-page {
      min-height: 80vh;
    }

    .page-hero {
      background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
      color: white;
      padding: 80px 0;
      text-align: center;
    }

    .page-hero h1 {
      font-family: 'Cinzel', serif;
      font-size: 3rem;
      margin-bottom: 16px;
    }

    .subtitle {
      font-size: 1.2rem;
      opacity: 0.9;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .ministries-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 32px;
      padding: 60px 0;
    }

    @media (max-width: 768px) {
      .ministries-grid {
        grid-template-columns: 1fr;
      }
    }

    .ministry-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .ministry-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.15);
    }

    .card-image {
      height: 200px;
      background-size: cover;
      background-position: center;
      background-color: #e0e0e0;
    }

    .card-content {
      padding: 24px;
    }

    .ministry-name {
      font-family: 'Cinzel', serif;
      font-size: 1.5rem;
      color: #2c3e50;
      margin-bottom: 12px;
    }

    .ministry-description {
      color: #666;
      line-height: 1.7;
      margin-bottom: 20px;
    }

    .ministry-info {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 0.95rem;
      color: #555;
    }

    .info-item i {
      color: #D4AF37;
      width: 20px;
      text-align: center;
    }

    .info-item a {
      color: #3498db;
      text-decoration: none;
    }

    .info-item a:hover {
      text-decoration: underline;
    }

    .empty-state {
      text-align: center;
      padding: 100px 20px;
      color: #999;
    }

    .empty-state i {
      font-size: 4rem;
      margin-bottom: 20px;
      display: block;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      margin-bottom: 10px;
    }
  `]
})
export class MinistriesComponent implements OnInit {
  ministries: Ministry[] = [];

  constructor(private ministryService: MinistryService) {}

  ngOnInit() {
    this.ministryService.getActiveMinistries().subscribe({
      next: (data) => {
        this.ministries = data;
      },
      error: (err) => console.error('Error loading ministries', err)
    });
  }
}
