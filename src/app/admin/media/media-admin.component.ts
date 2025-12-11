import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaService, MediaItem } from '../../core/services/media.service';

@Component({
  selector: 'app-media-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-page-container">
      
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Media Library</h1>
          <p class="page-subtitle">Manage images and videos for sermons, events, and the website.</p>
        </div>
        <button class="btn-primary">
          <i class="fa-solid fa-cloud-arrow-up"></i> Upload Media
        </button>
      </div>

      <!-- Filters & Stats -->
      <div class="filters-bar">
        <div class="tabs">
          <button class="tab-btn" [class.active]="activeFilter === 'all'" (click)="filter('all')">All Media</button>
          <button class="tab-btn" [class.active]="activeFilter === 'sunday'" (click)="filter('sunday')">Sunday Service</button>
          <button class="tab-btn" [class.active]="activeFilter === 'kids'" (click)="filter('kids')">Kids</button>
          <button class="tab-btn" [class.active]="activeFilter === 'outreach'" (click)="filter('outreach')">Outreach</button>
        </div>
        
        <div class="storage-indicator">
           <span class="storage-text">2.4 GB used</span>
           <div class="storage-bar"><div class="storage-progress" style="width: 45%"></div></div>
        </div>
      </div>

      <!-- Upload Zone (Collapsible or always visible? Let's make it compact) -->
      <div class="upload-zone" (dragover)="onDragOver($event)" (dragleave)="onDragLeave($event)" (drop)="onDrop($event)" [class.drag-active]="isDragging">
        <div class="upload-content">
          <i class="fa-solid fa-cloud-arrow-up upload-icon"></i>
          <span><strong>Drag & drop</strong> files here to upload</span>
        </div>
      </div>

      <!-- Grid -->
      <div class="media-grid" *ngIf="filteredMedia.length > 0; else emptyState">
        <div class="media-card" *ngFor="let item of filteredMedia">
          <div class="media-preview" [style.backgroundImage]="'url(' + item.file_url + ')'">
            <span class="media-type-badge" *ngIf="item.file_type === 'video'"><i class="fa-solid fa-video"></i></span>
            
            <div class="media-overlay">
              <button class="icon-btn" title="Copy Link" (click)="copyLink(item.file_url)">
                <i class="fa-regular fa-copy"></i>
              </button>
              <button class="icon-btn delete" title="Delete" (click)="deleteMedia(item)">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </div>
          <div class="media-info">
            <span class="media-name" [title]="item.title || 'Untitled'">{{ item.title || 'Untitled' }}</span>
          </div>
        </div>
      </div>

      <ng-template #emptyState>
        <div class="empty-state">
           <i class="fa-regular fa-images empty-icon"></i>
           <h3>No media found</h3>
           <p>Upload files to get started.</p>
        </div>
      </ng-template>

    </div>
  `,
  styles: [`
    .admin-page-container { max-width: 1200px; margin: 0 auto; }
    
    .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; }
    .page-title { font-size: 1.75rem; font-weight: 700; color: #111827; margin: 0 0 8px 0; }
    .page-subtitle { color: #6B7280; font-size: 0.95rem; margin: 0; }

    .btn-primary { background: #D4AF37; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; gap: 8px; align-items: center; }
    .btn-primary:hover { background: #B4941F; }

    .filters-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; background: white; padding: 8px 16px; border-radius: 12px; border: 1px solid #E5E7EB; }
    
    .tabs { display: flex; gap: 4px; }
    .tab-btn { background: none; border: none; padding: 8px 16px; border-radius: 8px; color: #6B7280; font-weight: 500; cursor: pointer; transition: all 0.2s; }
    .tab-btn:hover { background: #F3F4F6; color: #374151; }
    .tab-btn.active { background: #FEFCE8; color: #D97706; font-weight: 600; }

    .storage-indicator { display: flex; align-items: center; gap: 12px; }
    .storage-text { font-size: 0.85rem; color: #6B7280; }
    .storage-bar { width: 100px; height: 6px; background: #E5E7EB; border-radius: 3px; overflow: hidden; }
    .storage-progress { height: 100%; background: #D4AF37; }

    .upload-zone { border: 2px dashed #D1D5DB; border-radius: 12px; padding: 20px; text-align: center; background: #F9FAFB; margin-bottom: 32px; transition: all 0.2s; }
    .upload-zone.drag-active { border-color: #D4AF37; background: #FEFCE8; }
    .upload-content { display: flex; align-items: center; justify-content: center; gap: 12px; color: #6B7280; }
    .upload-icon { font-size: 1.2rem; color: #9CA3AF; }

    .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; }
    .media-card { background: white; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; }
    
    .media-preview { height: 160px; background-size: cover; background-position: center; position: relative; background-color: #F3F4F6; }
    .media-type-badge { position: absolute; top: 8px; left: 8px; background: rgba(0,0,0,0.6); color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; }
    
    .media-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; justify-content: center; align-items: center; gap: 12px; opacity: 0; transition: opacity 0.2s; }
    .media-preview:hover .media-overlay { opacity: 1; }

    .icon-btn { background: white; border: none; width: 36px; height: 36px; border-radius: 50%; color: #374151; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.2s; }
    .icon-btn:hover { transform: scale(1.1); color: #D4AF37; }
    .icon-btn.delete:hover { color: #DC2626; }

    .media-info { padding: 12px; border-top: 1px solid #E5E7EB; }
    .media-name { display: block; font-size: 0.9rem; font-weight: 500; color: #374151; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .empty-state { text-align: center; padding: 64px 20px; background: white; border-radius: 12px; border: 1px dashed #E5E7EB; margin-top: 20px; }
    .empty-icon { font-size: 3rem; color: #D1D5DB; margin-bottom: 16px; }
  `]
})
export class MediaAdminComponent {
  activeFilter = 'all';
  isDragging = false;
  mediaItems: MediaItem[] = [];
  filteredMedia: MediaItem[] = [];

  constructor(private mediaService: MediaService) {
    this.loadMedia();
  }

  loadMedia() {
    this.mediaService.getMedia().subscribe({
      next: (data: MediaItem[]) => {
        this.mediaItems = data;
        this.filter(this.activeFilter);
      },
      error: (err: any) => console.error('Error loading media', err)
    });
  }

  filter(tag: string) {
    this.activeFilter = tag;
    if (tag === 'all') {
      this.filteredMedia = this.mediaItems;
    } else {
      this.filteredMedia = this.mediaItems.filter(item => 
        item.tags && item.tags.includes(tag)
      );
    }
  }

  deleteMedia(item: MediaItem) {
    if (confirm('Are you sure you want to delete this file?')) {
        if (item.id) {
            this.mediaService.deleteMedia(item.id).subscribe(() => {
                this.loadMedia();
            });
        }
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    console.log('Files dropped:', event.dataTransfer?.files);
  }

  copyLink(url: string) {
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!'); 
    });
  }
}
