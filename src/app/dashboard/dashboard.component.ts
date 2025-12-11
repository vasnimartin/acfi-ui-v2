
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, UserProfile } from '../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="container">
        <h1>Member Dashboard</h1>
        
        <div class="dashboard-grid">
          <!-- Profile Section -->
          <div class="dashboard-card profile-card">
            <h2>My Profile</h2>
            <p class="subtitle">Keep your contact information up to date.</p>
            
            <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="profile-form">
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" [value]="currentUserEmail" disabled class="form-control" />
                <small>Email cannot be changed manually.</small>
              </div>

              <div class="form-group">
                <label for="full_name">Full Name</label>
                <input type="text" id="full_name" formControlName="full_name" class="form-control" placeholder="John Doe" />
              </div>

              <div class="form-group">
                <label for="phone">Phone Number</label>
                <input type="tel" id="phone" formControlName="phone" class="form-control" placeholder="(555) 123-4567" />
              </div>

              <div class="form-group">
                <label for="address">Mailing Address</label>
                <textarea id="address" formControlName="address" class="form-control" rows="3" placeholder="123 Church St, Austin, TX"></textarea>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn btn-primary" [disabled]="loading || profileForm.invalid">
                  {{ loading ? 'Saving...' : 'Save Changes' }}
                </button>
                <p *ngIf="message" [class.success]="!error" [class.error]="error" class="status-message">
                  {{ message }}
                </p>
              </div>
            </form>
          </div>

          <!-- Feature Links -->
          <div class="dashboard-card actions-card">
            <h2>Get Involved</h2>
            <div class="action-links">
              <a routerLink="/volunteer" class="action-link">
                <i class="fa-solid fa-clipboard-list"></i>
                <div class="action-text">
                  <h3>Volunteer Roster</h3>
                  <span>Sign up for services</span>
                </div>
                <i class="fa-solid fa-chevron-right arrow"></i>
              </a>

              <a routerLink="/prayer-requests" class="action-link">
                <i class="fa-solid fa-hands-praying"></i>
                <div class="action-text">
                  <h3>Prayer Requests</h3>
                  <span>Share your needs</span>
                </div>
                <i class="fa-solid fa-chevron-right arrow"></i>
              </a>

              <a routerLink="/directory" class="action-link">
                <i class="fa-solid fa-users"></i>
                <div class="action-text">
                  <h3>Member Directory</h3>
                  <span>Connect with family</span>
                </div>
                <i class="fa-solid fa-chevron-right arrow"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 60px 0;
      background-color: #f9f9f9;
      min-height: 80vh;
    }
    
    .dashboard-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 30px;
      margin-top: 30px;
    }

    @media (max-width: 768px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }

    .dashboard-card {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.05);
    }

    h1 {
      font-size: 2.5rem;
      color: #333;
      margin-bottom: 10px;
    }

    h2 {
      font-size: 1.5rem;
      margin-bottom: 10px;
      color: #2c3e50;
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 10px;
    }

    .subtitle {
      color: #7f8c8d;
      margin-bottom: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #34495e;
    }

    .form-control {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    .form-control:focus {
      border-color: #3498db;
      outline: none;
    }

    .form-control:disabled {
      background-color: #f8f9fa;
      color: #7f8c8d;
    }

    .btn-primary {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .btn-primary:hover {
      background-color: #2980b9;
    }

    .btn-primary:disabled {
      background-color: #bdc3c7;
      cursor: not-allowed;
    }

    .status-message {
      margin-top: 15px;
      font-weight: 500;
    }

    .success { color: #27ae60; }
    .error { color: #e74c3c; }

    .error { color: #e74c3c; }

    .action-links {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .action-link {
      display: flex;
      align-items: center;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 8px;
      text-decoration: none;
      color: #2c3e50;
      transition: all 0.2s;
      border: 1px solid transparent;
    }

    .action-link:hover {
      background-color: white;
      border-color: #3498db;
      box-shadow: 0 4px 12px rgba(52, 152, 219, 0.1);
      transform: translateX(5px);
    }

    .action-link i:first-child {
      font-size: 1.5rem;
      color: #3498db;
      margin-right: 15px;
      width: 30px;
      text-align: center;
    }

    .action-text {
      flex: 1;
    }

    .action-text h3 {
      font-size: 1rem;
      margin: 0;
      font-weight: 600;
      border: none;
      padding: 0;
    }

    .action-text span {
      font-size: 0.85rem;
      color: #7f8c8d;
    }

    .arrow {
      color: #bdc3c7;
      font-size: 0.9rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
  profileForm: FormGroup;
  currentUserEmail: string = '';
  loading = false;
  message = '';
  error = false;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      full_name: ['', Validators.required],
      phone: [''],
      address: ['']
    });
  }

  ngOnInit() {
    this.auth.currentUserProfile$.subscribe(profile => {
      if (profile) {
        this.currentUserEmail = profile.email;
        this.profileForm.patchValue({
          full_name: profile.full_name || '',
          phone: profile.phone || '',
          address: profile.address || ''
        });
      }
    });

    // Ensure we have the latest profile data
    const user = this.auth.currentUserValue;
    if (user) {
      this.currentUserEmail = user.email || '';
    }
  }

  async saveProfile() {
    if (this.profileForm.invalid) return;

    this.loading = true;
    this.message = '';
    this.error = false;

    try {
      await this.auth.updateProfile(this.profileForm.value);
      this.message = 'Profile updated successfully!';
      this.error = false;
    } catch (err: any) {
      console.error('Error updating profile:', err);
      this.message = 'Failed to update profile. Please try again.';
      this.error = true;
    } finally {
      this.loading = false;
    }
  }
}
