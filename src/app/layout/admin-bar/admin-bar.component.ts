import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { AdminToolsService } from '../../core/services/admin-tools.service';
import { AuthService } from '../../core/services/auth.service';
import { ContentService } from '../../core/services/content.service';
import { map, Observable, take } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-bar" *ngIf="isAdmin$ | async">
      <div class="admin-bar-content">
        <div class="status-group">
          <span class="admin-badge">ADMIN</span>
          <span class="mode-label">Edit Mode:</span>
          <span class="mode-status" [class.active]="isEditMode$ | async">
            {{ (isEditMode$ | async) ? 'ACTIVE' : 'OFF' }}
          </span>
          
          <div class="theme-selector" *ngIf="isEditMode$ | async">
            <label for="theme-select">Theme:</label>
            <select id="theme-select" [(ngModel)]="currentTheme" (change)="onThemeChange()">
              <option value="christmas">Christmas</option>
              <option value="easter">Easter</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>
        
        <div class="action-group">
          <button class="btn-toggle-edit" (click)="toggleEdit()">
            <i class="fa-solid" [class.fa-toggle-on]="isEditMode$ | async" [class.fa-toggle-off]="!(isEditMode$ | async)"></i>
            {{ (isEditMode$ | async) ? 'Exit Edit Mode' : 'Enter Edit Mode' }}
          </button>
          <small class="hint" *ngIf="isEditMode$ | async">Click on content blocks to edit</small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-bar {
      background: #111827;
      color: white;
      padding: 8px 24px;
      font-size: 0.85rem;
      z-index: 2000;
      position: sticky;
      top: 0;
      border-bottom: 2px solid #D4AF37;
    }

    .admin-bar-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .status-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .admin-badge {
      background: #D4AF37;
      color: #111827;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 800;
      font-size: 0.7rem;
    }

    .mode-label {
      color: #9CA3AF;
    }

    .mode-status {
      font-weight: 700;
      color: #EF4444;
    }

    .mode-status.active {
      color: #10B981;
    }

    .theme-selector {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: 16px;
      padding-left: 16px;
      border-left: 1px solid #374151;

      label {
        font-size: 0.75rem;
        color: #9CA3AF;
        text-transform: uppercase;
        font-weight: 700;
      }

      select {
        background: #1F2937;
        color: white;
        border: 1px solid #374151;
        border-radius: 4px;
        padding: 2px 8px;
        font-size: 0.8rem;
        outline: none;
        cursor: pointer;

        &:focus {
          border-color: #D4AF37;
        }
      }
    }

    .action-group {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .btn-toggle-edit {
      background: #374151;
      color: white;
      border: none;
      padding: 4px 12px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      transition: background 0.2s;
    }

    .btn-toggle-edit:hover {
      background: #4B5563;
    }

    .hint {
      color: #D4AF37;
      font-style: italic;
    }

    i {
      font-size: 1.1rem;
    }
  `]
})
export class AdminBarComponent implements OnInit {
  isEditMode$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  currentTheme: string = 'christmas';

  constructor(
    private adminTools: AdminToolsService,
    private authService: AuthService,
    private contentService: ContentService
  ) {
    this.isEditMode$ = this.adminTools.isEditMode$;
    // Show for admin, pastor, or media roles
    this.isAdmin$ = this.authService.currentUserRole$.pipe(
      map(role => ['admin', 'pastor', 'media'].includes(role || ''))
    );
  }

  ngOnInit() {
    this.contentService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  toggleEdit() {
    this.adminTools.toggleEditMode();
  }

  onThemeChange() {
    this.contentService.updateContent('site.theme', 'global', this.currentTheme).subscribe({
      error: (err: any) => console.error('Error updating theme', err)
    });
  }
}
