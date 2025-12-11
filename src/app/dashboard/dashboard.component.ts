
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, UserProfile } from '../core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="dashboard-wrapper">
      <div class="dashboard-header-bg">
        <div class="overlay"></div>
        <div class="container header-content">
           <span class="user-greeting" *ngIf="userProfile$ | async as profile">
             Hello, {{ (profile?.full_name || 'Member').split(' ')[0] }}
           </span>
           <h1 class="page-title">My Dashboard</h1>
           <p class="page-subtitle">Manage your profile, prayer requests, and ministry involvement.</p>
        </div>
      </div>

      <div class="container main-content">
        <div class="dashboard-grid">
          
          <!-- Left Column: Quick Actions & Navigation -->
          <div class="grid-column left">
            
            <!-- Staff Shortcut Card -->
            <div class="feature-card staff-highlight" *ngIf="isStaff">
              <div class="card-icon-wrapper gold">
                <i class="fa-solid fa-user-shield"></i>
              </div>
              <div class="card-text">
                <h3>Admin Portal</h3>
                <p>Access church management resources.</p>
              </div>
              <a routerLink="/admin" class="btn-arrow">
                <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>

            <!-- Get Involved Section -->
            <div class="section-label">Get Involved</div>
            
            <a routerLink="/volunteer" class="feature-card" *ngIf="isMemberOnly || isStaff">
              <div class="card-icon-wrapper blue">
                <i class="fa-solid fa-clipboard-check"></i>
              </div>
              <div class="card-text">
                <h3>Volunteer Roster</h3>
                <p>Sign up for upcoming services.</p>
              </div>
              <i class="fa-solid fa-chevron-right card-arrow"></i>
            </a>

            <a routerLink="/prayer-requests" class="feature-card">
              <div class="card-icon-wrapper orange">
                <i class="fa-solid fa-hands-praying"></i>
              </div>
              <div class="card-text">
                <h3>Prayer Requests</h3>
                <p>Submit privacy-protected requests.</p>
              </div>
              <i class="fa-solid fa-chevron-right card-arrow"></i>
            </a>

            <a routerLink="/directory" class="feature-card">
              <div class="card-icon-wrapper green">
                <i class="fa-solid fa-address-book"></i>
              </div>
              <div class="card-text">
                <h3>Member Directory</h3>
                <p>Connect with our church family.</p>
              </div>
              <i class="fa-solid fa-chevron-right card-arrow"></i>
            </a>

          </div>

          <!-- Right Column: Profile Edit -->
          <div class="grid-column right">
            <div class="profile-panel">
              <div class="panel-header">
                <h2>My Profile</h2>
                <button class="btn-save" (click)="saveProfile()" [disabled]="loading || profileForm.invalid">
                   <i class="fa-solid fa-floppy-disk" *ngIf="!loading"></i>
                   <i class="fa-solid fa-circle-notch fa-spin" *ngIf="loading"></i>
                   {{ loading ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
              
              <form [formGroup]="profileForm" class="profile-form">
                <!-- Status Message -->
                <div class="status-banner" *ngIf="message" [class.error]="error" [class.success]="!error">
                  <i class="fa-solid" [class.fa-circle-check]="!error" [class.fa-circle-exclamation]="error"></i>
                  {{ message }}
                </div>

                <div class="form-row">
                  <div class="form-group full">
                    <label>Email Address</label>
                    <div class="input-wrapper disabled">
                      <i class="fa-regular fa-envelope"></i>
                      <input type="email" [value]="currentUserEmail" disabled />
                    </div>
                    <span class="help-text">Contact admin to change email.</span>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group full">
                    <label>Full Name</label>
                    <div class="input-wrapper">
                      <i class="fa-regular fa-user"></i>
                      <input type="text" formControlName="full_name" placeholder="Your Name" />
                    </div>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Phone</label>
                    <div class="input-wrapper">
                      <i class="fa-solid fa-phone"></i>
                      <input type="tel" formControlName="phone" placeholder="(555) 000-0000" />
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Privacy</label>
                    <div class="badge-display">Visible to Members</div>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group full">
                    <label>Mailing Address</label>
                    <div class="input-wrapper textarea">
                      <i class="fa-solid fa-house"></i>
                      <textarea formControlName="address" rows="3" placeholder="123 Faith Lane..."></textarea>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-wrapper {
      min-height: 100vh;
      background-color: #F3F4F6;
      font-family: 'Inter', sans-serif;
    }

    /* Header Hero */
    .dashboard-header-bg {
      background: #0F172A; /* Slate 900 */
      color: white;
      padding: 60px 0 100px 0; /* Extra bottom padding for overlap */
      position: relative;
      overflow: hidden;
    }
    
    .overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: radial-gradient(circle at top right, rgba(212, 175, 55, 0.15), transparent 40%);
    }

    .header-content {
      position: relative;
      z-index: 2;
    }

    .user-greeting {
      display: block;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #D4AF37; /* Gold */
      font-weight: 600;
      margin-bottom: 8px;
    }

    .page-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 8px 0;
      letter-spacing: -0.02em;
    }

    .page-subtitle {
      color: #94A3B8;
      font-size: 1.1rem;
      margin: 0;
      max-width: 600px;
    }

    /* Main Content Grid */
    .main-content {
      margin-top: -60px; /* Overlap header */
      position: relative;
      z-index: 10;
      padding-bottom: 80px;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 32px;
    }

    @media (max-width: 900px) {
      .dashboard-grid { grid-template-columns: 1fr; }
    }

    /* Cards */
    .feature-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 16px;
      text-decoration: none;
      color: #1F2937;
      border: 1px solid rgba(0,0,0,0.04);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .feature-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      border-color: rgba(212, 175, 55, 0.3);
    }

    .staff-highlight {
      background: #1E293B; /* Dark slate */
      color: white;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .staff-highlight:hover { border-color: #D4AF37; }
    .staff-highlight .card-text p { color: #94A3B8; }

    .card-icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .card-icon-wrapper.gold { background: rgba(212, 175, 55, 0.2); color: #D4AF37; }
    .card-icon-wrapper.blue { background: #EFF6FF; color: #3B82F6; }
    .card-icon-wrapper.orange { background: #FFF7ED; color: #EA580C; }
    .card-icon-wrapper.green { background: #ECFDF5; color: #10B981; }

    .card-text h3 {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 4px 0;
    }
    
    .card-text p {
      margin: 0;
      font-size: 0.9rem;
      color: #6B7280;
    }

    .card-arrow, .btn-arrow {
      margin-left: auto;
      color: #D1D5DB;
    }
    .staff-highlight .btn-arrow { color: #D4AF37; }

    .section-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      color: #64748B;
      font-weight: 700;
      letter-spacing: 0.05em;
      margin: 24px 0 12px 12px;
    }

    /* Profile Panel */
    .profile-panel {
      background: white;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid #F3F4F6;
    }

    .panel-header h2 { margin: 0; font-size: 1.5rem; color: #1F2937; }

    .btn-save {
      background: #D4AF37;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      gap: 8px;
      align-items: center;
      transition: background 0.2s;
    }
    .btn-save:hover { background: #B4941F; }
    .btn-save:disabled { opacity: 0.7; cursor: not-allowed; }

    /* Form Styles */
    .form-group { flex: 1; margin-bottom: 20px; }
    .form-group.full { width: 100%; }
    .form-row { display: flex; gap: 20px; }

    label {
      display: block;
      font-size: 0.9rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 8px;
    }

    .input-wrapper {
      position: relative;
    }

    .input-wrapper i {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: #9CA3AF;
      font-size: 1rem;
    }
    
    .input-wrapper.textarea i { top: 18px; transform: none; }

    .input-wrapper input, .input-wrapper textarea {
      width: 100%;
      padding: 12px 12px 12px 42px;
      border: 1px solid #E2E8F0;
      border-radius: 10px;
      font-size: 1rem;
      color: #1F2937;
      transition: border-color 0.2s;
      font-family: inherit;
    }

    .input-wrapper input:focus, .input-wrapper textarea:focus {
      outline: none;
      border-color: #D4AF37;
      box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
    }

    .input-wrapper.disabled { background: #F8FAFC; border-radius: 10px; }
    .input-wrapper.disabled input { background: transparent; border: none; color: #64748B; }

    .help-text { font-size: 0.8rem; color: #94A3B8; margin-top: 4px; display: block; }

    .badge-display {
      display: inline-block;
      padding: 8px 12px;
      background: #F0FDF4;
      color: #166534;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 500;
      margin-top: 4px;
    }

    .status-banner {
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 500;
      font-size: 0.95rem;
    }
    .status-banner.success { background: #F0FDF4; color: #166534; }
    .status-banner.error { background: #FEF2F2; color: #991B1B; }

    @media (max-width: 600px) {
      .form-row { flex-direction: column; gap: 0; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  profileForm: FormGroup;
  currentUserEmail: string = '';
  loading = false;
  message = '';
  error = false;
  isMemberOnly = false;
  isStaff = false; // New property for staff check
  userProfile$: Observable<UserProfile | null> | undefined; // Observable for template

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
    this.userProfile$ = this.auth.currentUserProfile$;

    this.auth.currentUserRole$.subscribe(role => {
      this.isMemberOnly = role === 'member';
      this.isStaff = ['admin', 'pastor', 'media'].includes(role || '');
    });

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
