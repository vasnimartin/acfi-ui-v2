
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prayer-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="container">
        <div class="content-wrapper">
          <div class="form-section">
            <h1>Prayer Requests</h1>
            <p class="subtitle">"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God." - Philippians 4:6</p>

            <form (ngSubmit)="submitRequest()" #prayerForm="ngForm" class="prayer-form">
              <div class="form-group">
                <label for="request">How can we pray for you?</label>
                <textarea 
                  id="request" 
                  [(ngModel)]="requestText" 
                  name="request" 
                  rows="6" 
                  class="form-control" 
                  placeholder="Share your prayer request here..."
                  required>
                </textarea>
              </div>

              <div class="form-group checkbox-group">
                <input type="checkbox" id="private" [(ngModel)]="isPrivate" name="private">
                <label for="private">
                  Keep this private (Pastors only)
                  <small>Unchecked requests may be shared with the prayer team.</small>
                </label>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn-submit" [disabled]="!requestText || submitting">
                  {{ submitting ? 'Sending...' : 'Send Request' }}
                </button>
              </div>

              <p *ngIf="successMessage" class="success-message">
                <i class="fa-solid fa-check-circle"></i> {{ successMessage }}
              </p>
            </form>
          </div>

          <div class="info-section">
            <div class="info-card">
              <h3><i class="fa-solid fa-hands-praying"></i> We Pray Together</h3>
              <p>Our prayer team meets every Wednesday at 7 PM. Your requests are lifted up in community and confidentiality.</p>
            </div>
            
            <div class="info-card">
              <h3><i class="fa-solid fa-phone"></i> Urgent Need?</h3>
              <p>If you have an emergency, please contact the pastoral care line directly at (512) 555-0199.</p>
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

    .content-wrapper {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 40px;
    }

    @media (max-width: 768px) {
      .content-wrapper {
        grid-template-columns: 1fr;
      }
    }

    h1 {
      font-size: 2.5rem;
      color: #2c3e50;
      margin-bottom: 10px;
    }

    .subtitle {
      color: #7f8c8d;
      font-style: italic;
      margin-bottom: 30px;
    }

    .prayer-form {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.05);
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 10px;
      font-weight: 600;
      color: #34495e;
    }

    .form-control {
      width: 100%;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      font-family: inherit;
      resize: vertical;
    }

    .form-control:focus {
      outline: none;
      border-color: #3498db;
    }

    .checkbox-group {
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }

    .checkbox-group input {
      margin-top: 5px;
    }

    .checkbox-group label {
      font-weight: normal;
      margin-bottom: 0;
    }

    .checkbox-group small {
      display: block;
      color: #95a5a6;
      margin-top: 3px;
    }

    .btn-submit {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .btn-submit:hover {
      background-color: #2980b9;
    }

    .btn-submit:disabled {
      background-color: #bdc3c7;
      cursor: not-allowed;
    }

    .success-message {
      margin-top: 20px;
      color: #27ae60;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .info-card {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.05);
      margin-bottom: 20px;
    }

    .info-card h3 {
      color: #2c3e50;
      margin-bottom: 10px;
      font-size: 1.2rem;
    }

    .info-card h3 i {
      color: #e67e22;
      margin-right: 10px;
    }

    .info-card p {
      color: #7f8c8d;
      line-height: 1.6;
    }
  `]
})
export class PrayerRequestsComponent {
  requestText = '';
  isPrivate = false;
  submitting = false;
  successMessage = '';

  submitRequest() {
    this.submitting = true;
    
    // Simulate API call
    setTimeout(() => {
      this.submitting = false;
      this.successMessage = 'Your prayer request has been received. We are praying for you.';
      this.requestText = '';
      this.isPrivate = false;
      
      // Auto-hide success message
      setTimeout(() => {
        this.successMessage = '';
      }, 5000);
    }, 1500);
  }
}
