import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-container">
      <aside class="admin-sidebar">
        <div class="sidebar-header">
          <h3>Admin Panel</h3>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="./events" routerLinkActive="active">Events</a>
          <a routerLink="./ministries" routerLinkActive="active">Ministries</a>
          <a routerLink="./sermons" routerLinkActive="active">Sermons</a>
          <a routerLink="./timeline" routerLinkActive="active">Timeline</a>
          <a routerLink="./media" routerLinkActive="active">Media</a>
        </nav>
      </aside>
      <main class="admin-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-container {
      display: flex;
      min-height: 100vh;
      margin-top: 80px; /* Offset for main header */
    }
    .admin-sidebar {
      width: 250px;
      background: #f4f4f4;
      border-right: 1px solid #ddd;
      padding: 20px;
    }
    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .sidebar-nav a {
      text-decoration: none;
      color: #333;
      padding: 10px;
      border-radius: 4px;
      transition: background 0.2s;
    }
    .sidebar-nav a:hover, .sidebar-nav a.active {
      background: #e0e0e0;
      color: #000;
      font-weight: bold;
    }
    .admin-content {
      flex: 1;
      padding: 30px;
    }
  `]
})
export class AdminLayoutComponent {}
