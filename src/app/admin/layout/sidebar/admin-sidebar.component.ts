import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar">
      <div class="logo-area">
        <span class="icon">✝️</span>
        <span class="brand">ACFI Admin</span>
      </div>
      
      <nav class="nav-links">
        <div class="nav-group">
          <span class="group-label">Overview</span>
          <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-item">
            <i class="fa-solid fa-chart-line"></i> Dashboard
          </a>
        </div>

        <div class="nav-group">
          <span class="group-label">Ministry</span>
          <a routerLink="/admin/events" routerLinkActive="active" class="nav-item">
            <i class="fa-regular fa-calendar"></i> Events Manager
          </a>
          <a routerLink="/admin/sermons" routerLinkActive="active" class="nav-item">
            <i class="fa-solid fa-book-bible"></i> Sermons
          </a>
          <a routerLink="/admin/ministries" routerLinkActive="active" class="nav-item">
            <i class="fa-solid fa-users-rays"></i> Ministries
          </a>
        </div>

        <div class="nav-group">
          <span class="group-label">Content</span>
          <a routerLink="/admin/media" routerLinkActive="active" class="nav-item">
            <i class="fa-regular fa-images"></i> Media Library
          </a>
          <a routerLink="/admin/timeline" routerLinkActive="active" class="nav-item">
            <i class="fa-solid fa-timeline"></i> Timeline
          </a>
        </div>

        <div class="nav-group">
          <span class="group-label">System</span>
           <!-- Placeholder for future RBAC UI -->
          <a class="nav-item disabled">
            <i class="fa-solid fa-user-shield"></i> Roles & People
          </a>
        </div>
      </nav>
      
      <div class="sidebar-footer">
        <span class="version">v2.0 Ministry Edition</span>
      </div>
    </aside>
  `,
  styles: [`
    :host {
      display: block;
      width: 260px;
      height: 100vh;
      background: #ffffff;
      border-right: 1px solid rgba(0,0,0,0.06);
      position: fixed;
      left: 0;
      top: 0;
      z-index: 100;
      box-shadow: 4px 0 24px rgba(0,0,0,0.02);
    }

    .sidebar {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 24px;
    }

    .logo-area {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-bottom: 32px;
      padding-left: 8px;
    }

    .icon {
      font-size: 1.5rem;
      color: #D4AF37; /* Mute Gold */
    }

    .brand {
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      font-size: 1.1rem;
      color: #111827;
      letter-spacing: -0.02em;
    }

    .nav-links {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 24px;
      overflow-y: auto;
    }

    .group-label {
      display: block;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #9CA3AF;
      margin-bottom: 8px;
      padding-left: 12px;
      font-weight: 600;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      color: #4B5563; /* Cool Gray 600 */
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .nav-item i {
      width: 20px;
      text-align: center;
      color: #9CA3AF;
      transition: color 0.2s ease;
    }

    .nav-item:hover {
      background: #F3F4F6;
      color: #111827;
    }

    .nav-item:hover i {
      color: #4B5563;
    }

    .nav-item.active {
      background: #FEFCE8; /* Very light yellow/gold bg */
      color: #92400E; /* Deep gold/amber */
      font-weight: 600;
    }

    .nav-item.active i {
      color: #D97706; /* Amber 600 */
    }

    .nav-item.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .sidebar-footer {
      padding-top: 20px;
      border-top: 1px solid #f3f4f6;
      text-align: center;
    }

    .version {
      font-size: 0.75rem;
      color: #D1D5DB;
    }
  `]
})
export class AdminSidebarComponent {}
