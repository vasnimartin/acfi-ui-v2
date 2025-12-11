import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roles-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-page-container">
      <div class="page-header">
         <h1 class="page-title">Roles & People</h1>
         <p class="page-subtitle">Manage staff access and user permissions.</p>
      </div>
      
      <div class="empty-state">
        <i class="fa-solid fa-user-shield empty-icon"></i>
        <h3>Coming Soon</h3>
        <p>This module is under development.</p>
      </div>
    </div>
  `,
  styles: [`
    .admin-page-container { max-width: 1200px; margin: 0 auto; }
    .page-header { margin-bottom: 32px; }
    .page-title { font-size: 1.75rem; font-weight: 700; color: #111827; margin: 0 0 8px 0; }
    .page-subtitle { color: #6B7280; font-size: 0.95rem; margin: 0; }
    
    .empty-state {
        text-align: center;
        padding: 64px;
        background: white;
        border-radius: 12px;
        border: 1px dashed #E5E7EB;
        color: #6B7280;
    }
    .empty-icon { font-size: 3rem; margin-bottom: 16px; color: #D1D5DB; }
  `]
})
export class RolesAdminComponent {}
