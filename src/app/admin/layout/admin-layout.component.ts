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
    <div class="admin-wrapper">
      <div class="admin-sidebar-col">
          <app-admin-sidebar></app-admin-sidebar>
      </div>
      
      <div class="admin-main-col">
          <app-admin-topbar></app-admin-topbar>
          
          <main class="admin-content-area">
            <router-outlet></router-outlet>
          </main>
      </div>
    </div>
  `,
  styles: [`
    .admin-wrapper {
      display: flex;
      min-height: calc(100vh - 160px); /* Approx header+footer height offset */
      background-color: #F9FAFB;
      position: relative;
    }

    .admin-sidebar-col {
      width: 280px;
      flex-shrink: 0;
      background: #0F172A;
      /* Sticky sidebar logic */
      position: sticky;
      top: 0; 
      height: 100vh; /* Or however tall it needs to be */
      max-height: 100vh;
      overflow-y: auto;
    }

    .admin-main-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0; /* Prevent overflow */
    }

    .admin-content-area {
      padding: 32px;
      flex: 1;
    }

    @media (max-width: 900px) {
      .admin-wrapper {
        flex-direction: column;
      }
      .admin-sidebar-col {
        width: 100%;
        height: auto;
        position: relative;
        top: 0;
      }
    }
  `]
})
export class AdminLayoutComponent {}
