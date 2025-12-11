import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar-container">
      <!-- Dark Overlay with Blur -->
      <div class="sidebar-backdrop"></div>

      <div class="sidebar-content">
        <!-- Logo Area -->
        <div class="logo-section">
          <div class="logo-icon-wrapper">
             <span class="logo-icon">✝️</span>
          </div>
          <div class="logo-text">
            <span class="brand-name">ACFI Admin</span>
            <span class="role-badge" [ngClass]="(currentUserRole$ | async) || ''">
              {{ roleLabel$ | async }}
            </span>
          </div>
        </div>
        
        <!-- Navigation -->
        <nav class="nav-menu">
          
          <!-- Section: Overview -->
          <div class="nav-section">
            <h4 class="section-title">Overview</h4>
            <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-item">
              <span class="nav-icon"><i class="fa-solid fa-chart-pie"></i></span>
              <span class="nav-label">Dashboard</span>
            </a>
          </div>

          <!-- Section: Ministry -->
          <!-- Visible to Admin AND Pastor ONLY -->
          <div class="nav-section" *ngIf="(currentUserRole$ | async) === 'admin' || (currentUserRole$ | async) === 'pastor'">
            <h4 class="section-title">Ministry</h4>
            <!-- Events: Admin only (Pastor sees it per requirements but Media hidden? User said: PASTOR sees Dashboard, Sermons, Ministries. Hide Volunteer Roster, Media, Events Manager. Wait, user said PASTOR 'Hide Events Manager'. So Admin only?) -->
            <!-- User Requirement: PASTOR sees: Dashboard, Sermons Manager, Ministries. (Hide ... Events Manager) -->
            <!-- So Events is Admin Only? Or maybe Admin + Volunteer? Let's stick to Admin for now based on 'Hide Events Manager' for Pastor. -->
            <a routerLink="/admin/events" routerLinkActive="active" class="nav-item" *ngIf="(currentUserRole$ | async) === 'admin'">
              <span class="nav-icon"><i class="fa-regular fa-calendar-check"></i></span>
              <span class="nav-label">Events</span>
            </a>
            <a routerLink="/admin/sermons" routerLinkActive="active" class="nav-item">
              <span class="nav-icon"><i class="fa-solid fa-book-bible"></i></span>
              <span class="nav-label">Sermons</span>
            </a>
            <a routerLink="/admin/ministries" routerLinkActive="active" class="nav-item">
              <span class="nav-icon"><i class="fa-solid fa-users-rays"></i></span>
              <span class="nav-label">Ministries</span>
            </a>
          </div>

          <!-- Section: Content -->
          <!-- Admin and Media. Pastor does NOT see Media Library per instructions. -->
          <div class="nav-section" *ngIf="(currentUserRole$ | async) === 'admin' || (currentUserRole$ | async) === 'media'">
            <h4 class="section-title">Content</h4>
            <a routerLink="/admin/media" routerLinkActive="active" class="nav-item">
              <span class="nav-icon"><i class="fa-solid fa-photo-film"></i></span>
              <span class="nav-label">Media Library</span>
            </a>
            <!-- Media gets 'Sermons Upload' - which is likely the Sermons Manager? User said MEDIA sees "Sermons Upload". Usually that's part of Sermons module. Let's show Sermons to Media too? -->
            <!-- But current structure has Sermons in Ministry. I will duplicate the link or move logic. -->
            <!-- Let's Add Sermons for Media here if not present above? Or just allow Media to see Ministry section but hide other items? -->
            <!-- Complexity. Let's just follow strict list. -->
            <!-- ADMIN sees: Media Library. MEDIA sees: Media Library. -->
            
            <a routerLink="/admin/timeline" routerLinkActive="active" class="nav-item" *ngIf="(currentUserRole$ | async) === 'admin'">
              <span class="nav-icon"><i class="fa-solid fa-timeline"></i></span>
              <span class="nav-label">Timeline</span>
            </a>
          </div>
          
           <!-- Special Case: Media needs Sermons? "MEDIA TEAM sees: Media Library, Sermons Upload". -->
           <!-- So Media needs access to /admin/sermons. -->
           <div class="nav-section" *ngIf="(currentUserRole$ | async) === 'media'">
              <h4 class="section-title">Quick Actions</h4>
              <a routerLink="/admin/sermons" routerLinkActive="active" class="nav-item">
                <span class="nav-icon"><i class="fa-solid fa-upload"></i></span>
                <span class="nav-label">Upload Sermon</span>
              </a>
           </div>

          <!-- Section: System -->
          <div class="nav-section">
            <h4 class="section-title">System</h4>
            <a routerLink="/admin/people" routerLinkActive="active" class="nav-item"
               *ngIf="(currentUserRole$ | async) === 'admin'">
              <span class="nav-icon"><i class="fa-solid fa-user-gear"></i></span>
              <span class="nav-label">Roles & People</span>
            </a>
          </div>

        </nav>

        <!-- Footer -->
        <div class="sidebar-footer">
          <div class="version-badge">v2.0 Beta</div>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    :host {
      display: block;
      width: 280px;
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
    }

    .sidebar-container {
      position: relative;
      width: 100%;
      height: 100%;
      background: #0F172A; /* Slate 900 */
      color: #E2E8F0;
      box-shadow: 4px 0 24px rgba(0,0,0,0.2);
    }

    .sidebar-content {
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
      z-index: 2;
    }

    /* Logo Section */
    .logo-section {
      padding: 32px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%);
    }

    .logo-icon-wrapper {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #FFD700 0%, #B8860B 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
    }

    .logo-text {
      display: flex;
      flex-direction: column;
    }

    .brand-name {
      font-family: 'Inter', sans-serif;
      font-weight: 700;
      font-size: 1.1rem;
      color: white;
      letter-spacing: -0.01em;
    }

    .role-badge {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 600;
      margin-top: 4px;
      padding: 2px 0;
      opacity: 0.8;
    }
    .role-badge.admin { color: #FCD34D; } /* Amber 300 */
    .role-badge.pastor { color: #60A5FA; } /* Blue 400 */
    .role-badge.media { color: #C084FC; }  /* Purple 400 */

    /* Navigation */
    .nav-menu {
      flex: 1;
      padding: 24px 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .section-title {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: rgba(255,255,255,0.4);
      margin: 0 0 12px 12px;
      font-weight: 600;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 16px;
      border-radius: 12px;
      color: rgba(255,255,255,0.7);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.95rem;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      margin-bottom: 4px;
      border: 1px solid transparent;
    }

    .nav-icon {
      width: 24px;
      display: flex;
      justify-content: center;
      font-size: 1.1rem;
      opacity: 0.8;
      transition: all 0.2s;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.05);
      color: white;
      transform: translateX(4px);
    }
    
    .nav-item:hover .nav-icon {
      opacity: 1;
      transform: scale(1.1);
    }

    .nav-item.active {
      background: linear-gradient(90deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%);
      border: 1px solid rgba(212, 175, 55, 0.2);
      color: #FCD34D; /* Gold text */
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .nav-item.active .nav-icon {
      color: #FCD34D;
      opacity: 1;
    }

    .nav-item.disabled {
      opacity: 0.3;
      pointer-events: none;
    }

    .lock-icon {
      margin-left: auto;
      font-size: 0.8rem;
      opacity: 0.5;
    }

    /* Footer */
    .sidebar-footer {
      padding: 24px;
      text-align: center;
      border-top: 1px solid rgba(255,255,255,0.05);
    }

    .version-badge {
      background: rgba(255,255,255,0.05);
      color: rgba(255,255,255,0.4);
      font-size: 0.75rem;
      padding: 4px 12px;
      border-radius: 20px;
      display: inline-block;
    }
  `]
})
export class AdminSidebarComponent {
  currentUserRole$: Observable<string | null>;
  roleLabel$: Observable<string>;
  currentTheme$: Observable<string>;

  constructor(private authService: AuthService) {
    this.currentUserRole$ = this.authService.currentUserRole$;
    
    this.roleLabel$ = this.currentUserRole$.pipe(
      map(role => {
        switch(role) {
          case 'admin': return 'Global Admin';
          case 'pastor': return 'Pastor Access';
          case 'media': return 'Media Team';
          default: return 'Staff Access';
        }
      })
    );

    this.currentTheme$ = this.currentUserRole$.pipe(
      map(role => {
        switch(role) {
          case 'pastor': return 'theme-pastor';
          case 'media': return 'theme-media';
          default: return '';
        }
      })
    );
  }
}
