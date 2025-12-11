import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MinistryService, Ministry } from '../../../core/services/ministry.service';
import { MinistryFormComponent } from '../ministry-form/ministry-form.component';

@Component({
  selector: 'app-ministries-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, MinistryFormComponent],
  template: `
    <div class="admin-page-container">
      <!-- Page Header -->
      <div class="admin-header">
        <div class="admin-title-group">
          <h1 class="admin-page-title">Ministries Manager</h1>
          <p class="admin-page-subtitle">Manage church ministries and their information.</p>
        </div>
        <button class="btn-admin-primary" (click)="openAddModal()">
          <i class="fa-solid fa-plus"></i> Add Ministry
        </button>
      </div>

      <!-- Search -->
      <div class="admin-toolbar">
        <div class="admin-search-box">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="Search ministries..." [(ngModel)]="searchQuery" (ngModelChange)="filterMinistries()">
        </div>
      </div>

      <!-- Ministries Grid -->
      <div class="admin-grid" *ngIf="filteredMinistries.length > 0; else emptyState">
        <div class="admin-card" *ngFor="let ministry of filteredMinistries">
          <div class="card-header">
            <h3 class="ministry-name">{{ ministry.name }}</h3>
            <span class="status-badge" [class.active]="ministry.is_active" [class.inactive]="!ministry.is_active">
              {{ ministry.is_active ? 'Active' : 'Inactive' }}
            </span>
          </div>

          <div class="card-body">
            <p class="ministry-description" *ngIf="ministry.description">{{ ministry.description }}</p>
            
            <div class="ministry-details">
              <div class="detail-item" *ngIf="ministry.leader_name">
                <i class="fa-solid fa-user"></i>
                <span>{{ ministry.leader_name }}</span>
              </div>
              <div class="detail-item" *ngIf="ministry.contact_email">
                <i class="fa-solid fa-envelope"></i>
                <span>{{ ministry.contact_email }}</span>
              </div>
              <div class="detail-item" *ngIf="ministry.meeting_schedule">
                <i class="fa-solid fa-clock"></i>
                <span>{{ ministry.meeting_schedule }}</span>
              </div>
            </div>
          </div>

          <div class="card-actions">
            <button class="btn-icon" (click)="openEditModal(ministry)" title="Edit Ministry">
              <i class="fa-solid fa-pen-to-square"></i> Edit
            </button>
            <button class="btn-icon delete" (click)="deleteMinistry(ministry)" title="Delete Ministry">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <ng-template #emptyState>
        <div class="admin-empty-state">
          <i class="fa-solid fa-users-rays"></i>
          <h3>No ministries found</h3>
          <p>Create your first ministry to get started.</p>
          <button class="btn-admin-secondary" (click)="openAddModal()">Add Ministry</button>
        </div>
      </ng-template>

      <!-- Modal Form -->
      <app-ministry-form 
        *ngIf="showModal"
        [ministry]="selectedMinistry"
        (save)="onSave($event)"
        (cancel)="onCancel()">
      </app-ministry-form>
    </div>
  `,
  styles: [`
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .ministry-name {
      font-size: 1.2rem;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }

    .status-badge {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 12px;
      text-transform: uppercase;
    }

    .status-badge.active {
      background: #ECFDF5;
      color: #059669;
    }

    .status-badge.inactive {
      background: #FEF2F2;
      color: #DC2626;
    }

    .card-body {
      margin-bottom: 20px;
    }

    .ministry-description {
      color: #6B7280;
      line-height: 1.6;
      margin-bottom: 16px;
    }

    .ministry-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.9rem;
      color: #4B5563;
    }

    .detail-item i {
      color: #9CA3AF;
      width: 16px;
    }

    .card-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid #F3F4F6;
    }
  `]
})
export class MinistriesAdminComponent implements OnInit {
  ministries: Ministry[] = [];
  filteredMinistries: Ministry[] = [];
  showModal = false;
  selectedMinistry: Ministry | null = null;
  searchQuery = '';

  constructor(private ministryService: MinistryService) {}

  ngOnInit() {
    this.loadMinistries();
  }

  loadMinistries() {
    this.ministryService.getMinistries().subscribe({
      next: (data) => {
        this.ministries = data;
        this.filterMinistries();
      },
      error: (err) => console.error('Error loading ministries', err)
    });
  }

  filterMinistries() {
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      this.filteredMinistries = this.ministries.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.description?.toLowerCase().includes(q) ||
        m.leader_name?.toLowerCase().includes(q)
      );
    } else {
      this.filteredMinistries = this.ministries;
    }
  }

  openAddModal() {
    this.selectedMinistry = null;
    this.showModal = true;
  }

  openEditModal(ministry: Ministry) {
    this.selectedMinistry = ministry;
    this.showModal = true;
  }

  onCancel() {
    this.showModal = false;
    this.selectedMinistry = null;
  }

  onSave(ministryData: Ministry) {
    if (this.selectedMinistry && this.selectedMinistry.id) {
      this.ministryService.updateMinistry(this.selectedMinistry.id, ministryData).subscribe({
        next: () => {
          this.showModal = false;
          this.loadMinistries();
        },
        error: (err) => console.error('Error updating ministry', err)
      });
    } else {
      this.ministryService.createMinistry(ministryData).subscribe({
        next: () => {
          this.showModal = false;
          this.loadMinistries();
        },
        error: (err) => console.error('Error creating ministry', err)
      });
    }
  }

  deleteMinistry(ministry: Ministry) {
    if (confirm(`Are you sure you want to delete "${ministry.name}"?`)) {
      if (ministry.id) {
        this.ministryService.deleteMinistry(ministry.id).subscribe({
          next: () => this.loadMinistries(),
          error: (err) => console.error('Error deleting ministry', err)
        });
      }
    }
  }
}
