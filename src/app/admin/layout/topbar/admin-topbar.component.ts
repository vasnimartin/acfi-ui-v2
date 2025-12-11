import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="topbar">
      <div class="left-section">
        <!-- Breadcrumb or Title placeholder -->
        <h2 class="page-title">Admin Dashboard</h2>
      </div>

      <div class="right-section">
        <div class="actions">
          <button class="btn-icon" title="Notifications">
             <i class="fa-regular fa-bell"></i>
          </button>
        </div>

        <div class="profile-menu" *ngIf="userProfile$ | async as profile">
          <div class="avatar">
            {{ getInitials(profile.full_name) }}
          </div>
          <div class="user-info">
            <span class="name">{{ profile.full_name }}</span>
            <span class="role-badge" [class]="profile.role">{{ profile.role }}</span>
          </div>
          <button class="logout-btn" (click)="logout()">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
      width: calc(100% - 260px); /* Sidebar width */
      height: 64px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid rgba(0,0,0,0.06);
      position: fixed;
      top: 0;
      left: 260px;
      z-index: 90;
    }

    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      padding: 0 32px;
    }

    .page-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }

    .right-section {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .btn-icon {
      background: none;
      border: none;
      font-size: 1.1rem;
      color: #6B7280;
      cursor: pointer;
      transition: color 0.2s;
    }

    .btn-icon:hover {
      color: #111827;
    }

    .profile-menu {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-left: 24px;
      border-left: 1px solid #E5E7EB;
    }

    .avatar {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #D4AF37, #B4941F);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.9rem;
      text-transform: uppercase;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }

    .name {
      font-size: 0.9rem;
      font-weight: 500;
      color: #1F2937;
    }

    .role-badge {
      font-size: 0.7rem;
      text-transform: uppercase;
      font-weight: 700;
      color: #9CA3AF;
      letter-spacing: 0.05em;
    }
    
    .role-badge.admin { color: #DC2626; } /* Red for Admin */
    .role-badge.pastor { color: #7C3AED; } /* Purple for Pastor */
    .role-badge.media { color: #2563EB; } /* Blue for Media */

    .logout-btn {
      background: none;
      border: none;
      margin-left: 12px;
      color: #9CA3AF;
      cursor: pointer;
      font-size: 1rem;
      transition: color 0.2s;
    }
    
    .logout-btn:hover {
      color: #DC2626;
    }
  `]
})
export class AdminTopbarComponent implements OnInit {
  userProfile$: Observable<any> | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userProfile$ = this.authService.currentUserProfile$;
  }

  getInitials(name: string | undefined): string {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  logout() {
    this.authService.signOut();
  }
}
