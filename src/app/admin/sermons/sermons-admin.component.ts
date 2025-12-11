import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SermonService, Sermon } from '../../core/services/sermon.service';
import { SermonFormComponent } from './form/sermon-form.component';

@Component({
  selector: 'app-sermons-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, SermonFormComponent],
  template: `
    <div class="admin-page-container">
      
      <!-- Header -->
      <div class="admin-header">
        <div class="admin-title-group">
          <h1 class="admin-page-title">Sermons</h1>
          <p class="admin-page-subtitle">Manage sermon archives, audio, video, and notes.</p>
        </div>
        <button class="btn-admin-primary" (click)="openAddModal()">
          <i class="fa-solid fa-plus"></i> Add Sermon
        </button>
      </div>

      <!-- Filters & Search -->
      <div class="admin-toolbar">
        <div class="admin-search-box">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="Search by title, speaker..." [(ngModel)]="searchQuery" (ngModelChange)="filterSermons()">
        </div>
        
        <div class="filters-group">
           <span class="filter-label" style="margin-right:8px; font-weight:600; color:#64748B;">Filter by:</span>
           <select class="filter-select" (change)="filterSermons()" style="padding: 8px; border-radius: 6px; border: 1px solid #E2E8F0;">
             <option value="all">All Speakers</option>
           </select>
        </div>
      </div>

      <!-- Sermons List -->
      <div class="sermons-list" *ngIf="filteredSermons.length > 0; else emptyState">
        <div class="sermon-row" *ngFor="let sermon of filteredSermons">
          
          <div class="row-main">
            <h3 class="sermon-title">{{ sermon.title }}</h3>
            <div class="sermon-meta">
              <span class="meta-item"><i class="fa-solid fa-user"></i> {{ sermon.speaker || 'Unknown Speaker' }}</span>
              <span class="meta-item"><i class="fa-regular fa-calendar"></i> {{ sermon.created_at | date:'mediumDate' }}</span>
              <span class="meta-item" *ngIf="sermon.scripture"><i class="fa-solid fa-book-open"></i> {{ sermon.scripture }}</span>
            </div>
          </div>

          <div class="row-media">
             <span class="media-badge video" *ngIf="sermon.video_url" title="Video available"><i class="fa-solid fa-video"></i></span>
             <span class="media-badge audio" *ngIf="sermon.audio_url" title="Audio available"><i class="fa-solid fa-microphone"></i></span>
             <span class="media-badge notes" *ngIf="sermon.notes_url" title="Notes available"><i class="fa-solid fa-file-pdf"></i></span>
          </div>

          <div class="row-actions">
            <button class="btn-icon" (click)="openEditModal(sermon)" title="Edit">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn-icon delete" (click)="deleteSermon(sermon)" title="Delete">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>

        </div>
      </div>

      <ng-template #emptyState>
        <div class="admin-empty-state">
           <i class="fa-solid fa-book-bible"></i>
           <h3>No sermons found</h3>
           <p>Upload your first sermon to get started.</p>
           <button class="btn-admin-secondary" (click)="openAddModal()">Add Sermon</button>
        </div>
      </ng-template>

      <!-- Modal -->
      <app-sermon-form 
        *ngIf="showModal"
        [sermon]="selectedSermon"
        (save)="onSave($event)"
        (cancel)="onCancel()">
      </app-sermon-form>

    </div>
  `,
  styles: [`
    /* Using Global Admin Theme */
    /* Only list specific styles here */

    .sermons-list { display: flex; flex-direction: column; gap: 12px; }
    
    .sermon-row { 
      background: white; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px 24px;
      display: flex; align-items: center; gap: 24px; transition: transform 0.2s, box-shadow 0.2s;
    }
    .sermon-row:hover { transform: translateX(4px); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border-color: #D4AF37; }

    .row-main { flex: 1; }
    .sermon-title { font-size: 1.1rem; font-weight: 600; color: #0F172A; margin: 0 0 4px 0; }
    .sermon-meta { display: flex; gap: 16px; font-size: 0.85rem; color: #64748B; }
    .meta-item i { margin-right: 6px; color: #94A3B8; }

    .row-media { display: flex; gap: 8px; }
    .media-badge { 
      width: 32px; height: 32px; border-radius: 50%; background: #F3F4F6; color: #94A3B8;
      display: flex; align-items: center; justify-content: center; font-size: 0.9rem;
    }
    .media-badge.video { background: #EEF2FF; color: #4F46E5; }
    .media-badge.audio { background: #ECFDF5; color: #059669; }
    .media-badge.notes { background: #FFF7ED; color: #EA580C; }

    .row-actions { display: flex; gap: 8px; }
  `]
})
export class SermonsAdminComponent implements OnInit {
  sermons: Sermon[] = [];
  filteredSermons: Sermon[] = [];
  searchQuery = '';
  
  showModal = false;
  selectedSermon: Sermon | null = null;

  constructor(private sermonService: SermonService) {}

  ngOnInit() {
    this.loadSermons();
  }

  loadSermons() {
    this.sermonService.getSermons().subscribe({
      next: (data: Sermon[]) => {
        this.sermons = data;
        this.filterSermons();
      },
      error: (err: any) => console.error(err)
    });
  }

  filterSermons() {
    let temp = this.sermons;
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      temp = temp.filter(s => 
        s.title.toLowerCase().includes(q) || 
        (s.speaker && s.speaker.toLowerCase().includes(q))
      );
    }
    // Sort by created_at (date preached) desc
    this.filteredSermons = temp.sort((a, b) => {
       const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
       const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
       return dateB - dateA;
    });
  }

  openAddModal() {
    this.selectedSermon = null;
    this.showModal = true;
  }

  openEditModal(sermon: Sermon) {
    this.selectedSermon = sermon;
    this.showModal = true;
  }

  onCancel() {
    this.showModal = false;
    this.selectedSermon = null;
  }

  onSave(data: Sermon) {
    if (this.selectedSermon && this.selectedSermon.id) {
       this.sermonService.updateSermon(this.selectedSermon.id, data).subscribe(() => {
         this.showModal = false;
         this.loadSermons();
       });
    } else {
      this.sermonService.createSermon(data).subscribe(() => {
        this.showModal = false;
        this.loadSermons();
      });
    }
  }

  deleteSermon(sermon: Sermon) {
    if (confirm(`Delete "\${sermon.title}"?`)) {
      if (sermon.id) {
        this.sermonService.deleteSermon(sermon.id).subscribe({
          next: () => this.loadSermons(),
          error: (err: any) => console.error(err)
        });
      }
    }
  }
}
