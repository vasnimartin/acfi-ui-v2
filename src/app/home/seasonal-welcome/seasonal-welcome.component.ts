import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { AdminToolsService } from '../../core/services/admin-tools.service';
import { Observable, take, map } from 'rxjs';
import { FormsModule } from '@angular/forms';

interface ChristmasEvent {
  id: number;
  title: string;
  location: string;
  date: string;
  time: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-seasonal-welcome',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './seasonal-welcome.component.html',
  styleUrl: './seasonal-welcome.component.scss'
})
export class SeasonalWelcomeComponent {
  announcements$: Observable<any[]>;
  isEditMode$: Observable<boolean>;
  theme$: Observable<string>;
  
  isModalOpen = false;
  selectedEvent: any | null = null;
  
  // CMS state
  editing = false;
  editingAnnouncement: any = null;

  constructor(
    private contentService: ContentService,
    private adminTools: AdminToolsService
  ) {
    this.announcements$ = this.contentService.getAnnouncements();
    this.isEditMode$ = this.adminTools.isEditMode$;
    this.theme$ = this.contentService.currentTheme$;
  }

  openModal() {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedEvent = null;
    document.body.style.overflow = '';
  }

  selectEvent(event: any) {
    this.selectedEvent = event;
  }

  backToList() {
    this.selectedEvent = null;
  }

  // --- CMS Methods ---
  
  startAdd() {
    this.editingAnnouncement = {
      title: '',
      subtitle: '',
      content: '',
      image_url: '',
      metadata: { location: '', date: '', time: '' },
      is_active: true
    };
    this.editing = true;
  }

  startEditAnnouncement(announcement: any, event: Event) {
    event.stopPropagation();
    this.editingAnnouncement = { ...announcement };
    // Ensure metadata exists
    if (!this.editingAnnouncement.metadata) {
      this.editingAnnouncement.metadata = { location: '', date: '', time: '' };
    }
    this.editing = true;
  }

  saveAnnouncement() {
    this.contentService.saveAnnouncement(this.editingAnnouncement).pipe(take(1)).subscribe({
      next: () => {
        this.editing = false;
        this.editingAnnouncement = null;
        this.announcements$ = this.contentService.getAnnouncements(); // Refresh
      },
      error: (err: any) => console.error('Error saving announcement', err)
    });
  }

  deleteAnnouncement(id: string, event: Event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this announcement?')) {
      this.contentService.deleteAnnouncement(id).pipe(take(1)).subscribe({
        next: () => {
          this.announcements$ = this.contentService.getAnnouncements(); // Refresh
          if (this.selectedEvent?.id === id) this.selectedEvent = null;
        },
        error: (err: any) => console.error('Error deleting announcement', err)
      });
    }
  }

  cancelEditing() {
    this.editing = false;
    this.editingAnnouncement = null;
  }
}
