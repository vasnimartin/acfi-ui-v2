import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  tags: string[];
  title: string;
  dimensions?: string;
}

@Component({
  selector: 'app-media-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="media-container">
      
      <!-- Sidebar Filters -->
      <aside class="media-sidebar">
        <h3 class="sidebar-title">Library</h3>
        <nav class="filter-nav">
          <a (click)="filter('all')" [class.active]="activeFilter === 'all'" class="filter-item">
            <i class="fa-solid fa-layer-group"></i> All Media
          </a>
          <a (click)="filter('sunday')" [class.active]="activeFilter === 'sunday'" class="filter-item">
            <i class="fa-solid fa-church"></i> Sunday Service
          </a>
          <a (click)="filter('worship')" [class.active]="activeFilter === 'worship'" class="filter-item">
            <i class="fa-solid fa-music"></i> Worship
          </a>
          <a (click)="filter('kids')" [class.active]="activeFilter === 'kids'" class="filter-item">
            <i class="fa-solid fa-child-reaching"></i> Kids Ministry
          </a>
          <a (click)="filter('outreach')" [class.active]="activeFilter === 'outreach'" class="filter-item">
            <i class="fa-solid fa-hand-holding-heart"></i> Outreach
          </a>
        </nav>

        <div class="storage-info">
          <div class="storage-bar">
            <div class="storage-progress" style="width: 45%"></div>
          </div>
          <p class="storage-text">2.4 GB of 5 GB used</p>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="media-content">
        
        <!-- Header -->
        <header class="content-header">
          <div>
            <h1 class="page-title">Media Library</h1>
            <p class="page-subtitle">Manage images and videos for sermons, events, and the website.</p>
          </div>
          <button class="btn-primary">
            <i class="fa-solid fa-cloud-arrow-up"></i> Upload
          </button>
        </header>

        <!-- Upload Zone -->
        <div class="upload-zone" (dragover)="onDragOver($event)" (dragleave)="onDragLeave($event)" (drop)="onDrop($event)" [class.drag-active]="isDragging">
          <i class="fa-solid fa-images upload-icon"></i>
          <p class="upload-text"><strong>Drag and drop</strong> files here, or <span class="browse-link">browse</span> to upload</p>
          <p class="upload-hint">Supports JPG, PNG, MP4 up to 50MB</p>
        </div>

        <!-- Grid -->
        <div class="media-grid">
          <div class="media-card" *ngFor="let item of filteredMedia">
            <div class="media-preview" [style.backgroundImage]="'url(' + item.url + ')'">
              <span class="media-type-badge" *ngIf="item.type === 'video'"><i class="fa-solid fa-video"></i></span>
              
              <div class="media-overlay">
                <button class="icon-btn" title="Copy Link" (click)="copyLink(item.url)">
                  <i class="fa-regular fa-copy"></i>
                </button>
                <button class="icon-btn delete" title="Delete">
                  <i class="fa-regular fa-trash-can"></i>
                </button>
              </div>
            </div>
            <div class="media-info">
              <span class="media-name">{{ item.title }}</span>
              <span class="media-details">{{ item.dimensions }}</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  `,
  styles: [`
    .media-container {
      display: flex;
      min-height: calc(100vh - 100px); /* Adjust based on layout */
      gap: 32px;
    }

    /* Sidebar */
    .media-sidebar {
      width: 240px;
      flex-shrink: 0;
      padding-right: 24px;
      border-right: 1px solid #E5E7EB;
    }

    .sidebar-title {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #9CA3AF;
      margin: 0 0 16px 12px;
      font-weight: 700;
    }

    .filter-nav {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-bottom: 32px;
    }

    .filter-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      color: #4B5563;
      cursor: pointer;
      font-size: 0.95rem;
      font-weight: 500;
      transition: all 0.2s;
    }

    .filter-item:hover {
      background: #F3F4F6;
      color: #111827;
    }

    .filter-item.active {
      background: #FEFCE8;
      color: #D97706;
      font-weight: 600;
    }

    .filter-item i {
      width: 20px;
      text-align: center;
      color: #9CA3AF;
    }

    .filter-item.active i {
      color: #D97706;
    }

    .storage-info {
      background: #F9FAFB;
      padding: 16px;
      border-radius: 8px;
    }

    .storage-bar {
      height: 6px;
      background: #E5E7EB;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 8px;
    }

    .storage-progress {
      height: 100%;
      background: #D4AF37;
      border-radius: 3px;
    }

    .storage-text {
      font-size: 0.8rem;
      color: #6B7280;
      margin: 0;
    }

    /* Main Content */
    .media-content {
      flex: 1;
    }

    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
    }

    .page-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 8px 0;
    }

    .page-subtitle {
      color: #6B7280;
      font-size: 0.95rem;
      margin: 0;
    }

    .btn-primary {
      background: #D4AF37;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      gap: 8px;
      align-items: center;
      transition: background 0.2s;
    }

    .btn-primary:hover {
      background: #B4941F;
    }

    /* Upload Zone */
    .upload-zone {
      border: 2px dashed #D1D5DB;
      border-radius: 12px;
      padding: 40px;
      text-align: center;
      background: #F9FAFB;
      margin-bottom: 32px;
      transition: all 0.2s;
    }

    .upload-zone.drag-active {
      border-color: #D4AF37;
      background: #FEFCE8;
    }

    .upload-icon {
      font-size: 2.5rem;
      color: #9CA3AF;
      margin-bottom: 16px;
    }

    .upload-text {
      color: #374151;
      margin-bottom: 8px;
    }

    .browse-link {
      color: #D4AF37;
      font-weight: 600;
      cursor: pointer;
    }

    .upload-hint {
      font-size: 0.85rem;
      color: #9CA3AF;
    }

    /* Grid */
    .media-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 20px;
    }

    .media-card {
      group: relative;
    }

    .media-preview {
      height: 180px;
      background-size: cover;
      background-position: center;
      border-radius: 12px;
      position: relative;
      background-color: #E5E7EB;
      overflow: hidden;
      margin-bottom: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .media-type-badge {
      position: absolute;
      top: 8px;
      left: 8px;
      background: rgba(0,0,0,0.6);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
    }

    .media-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.4);
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 12px;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .media-preview:hover .media-overlay {
      opacity: 1;
    }

    .icon-btn {
      background: white;
      border: none;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      color: #374151;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
    }

    .icon-btn:hover {
      transform: scale(1.1);
      color: #D4AF37;
    }
    
    .icon-btn.delete:hover {
      color: #DC2626;
    }

    .media-name {
      display: block;
      font-size: 0.9rem;
      font-weight: 500;
      color: #374151;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .media-details {
      display: block;
      font-size: 0.8rem;
      color: #9CA3AF;
    }
  `]
})
export class MediaAdminComponent {
  activeFilter = 'all';
  isDragging = false;

  // Mock Data
  mediaItems: MediaItem[] = [
    { id: '1', title: 'Sunday Worship 1.jpg', url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', type: 'image', tags: ['sunday', 'worship'], dimensions: '1920x1080' },
    { id: '2', title: 'Kids Service.jpg', url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', type: 'image', tags: ['kids'], dimensions: '2400x1600' },
    { id: '3', title: 'Pastors Message.mp4', url: 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', type: 'video', tags: ['sunday', 'sermon'], dimensions: '1080p' },
    { id: '4', title: 'Outreach Event.jpg', url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', type: 'image', tags: ['outreach'], dimensions: '2048x1365' },
    { id: '5', title: 'Baptism.jpg', url: 'https://images.unsplash.com/photo-1519750783826-e2420f4d687f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', type: 'image', tags: ['sunday'], dimensions: '1920x1080' },
  ];

  filteredMedia = this.mediaItems;

  filter(tag: string) {
    this.activeFilter = tag;
    if (tag === 'all') {
      this.filteredMedia = this.mediaItems;
    } else {
      this.filteredMedia = this.mediaItems.filter(item => item.tags.includes(tag));
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
    // Placeholder for actual drop logic
    console.log('Files dropped:', event.dataTransfer?.files);
  }

  copyLink(url: string) {
    navigator.clipboard.writeText(url).then(() => {
      // Could add toast here
      alert('Link copied to clipboard!'); 
    });
  }
}
