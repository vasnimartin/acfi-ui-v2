import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roles-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-page-container">
      <div class="admin-header">
         <div class="admin-title-group">
             <h1 class="admin-page-title">Roles & People</h1>
             <p class="admin-page-subtitle">Manage staff access and user permissions.</p>
         </div>
      </div>
      
      <div class="admin-empty-state">
        <i class="fa-solid fa-user-shield"></i>
        <h3>Coming Soon</h3>
        <p>This module is under development.</p>
      </div>
    </div>
  `,
  styles: [`
    /* Using Global Admin Theme */
  `]
})
export class RolesAdminComponent {}
