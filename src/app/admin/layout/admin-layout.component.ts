import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminSidebarComponent } from './sidebar/admin-sidebar.component';
import { AdminTopbarComponent } from './topbar/admin-topbar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminSidebarComponent, AdminTopbarComponent],
  template: `
    <div class="admin-shell">
      <app-admin-sidebar></app-admin-sidebar>
      <app-admin-topbar></app-admin-topbar>
      
      <main class="admin-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-shell {
      min-height: 100vh;
      background-color: #F9FAFB; /* Soft gray premium background */
    }

    .admin-content {
      margin-left: 280px; /* Match sidebar width */
      padding-top: 64px; /* Match topbar height */
      padding: 96px 32px 32px 32px; /* Top padding = 64px + 32px spacing */
      min-height: 100vh;
    }

    @media (max-width: 768px) {
      .admin-content {
        margin-left: 0;
        padding: 80px 16px 16px 16px;
      }
    }
  `]
})
export class AdminLayoutComponent {}
