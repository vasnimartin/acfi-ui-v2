import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService, ChurchEvent } from '../../../core/services/event.service';
import { EventFormComponent } from '../form/event-form.component';

@Component({
  selector: 'app-events-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, EventFormComponent],
  template: `
    <div class="admin-page-container">
      <!-- Page Header -->
      <div class="admin-header">
        <div class="admin-title-group">
          <h1 class="admin-page-title">Events Manager</h1>
          <p class="admin-page-subtitle">Manage upcoming services, gatherings, and special events.</p>
        </div>
        <button class="btn-admin-primary" (click)="openAddModal()">
          <i class="fa-solid fa-plus"></i> Add Event
        </button>
      </div>

      <!-- Filters & Search -->
      <div class="admin-toolbar">
        <div class="tabs">
          <button class="tab-btn" [class.active]="activeTab === 'upcoming'" (click)="setTab('upcoming')">Upcoming</button>
          <button class="tab-btn" [class.active]="activeTab === 'past'" (click)="setTab('past')">Past History</button>
          <button class="tab-btn" [class.active]="activeTab === 'all'" (click)="setTab('all')">All Events</button>
        </div>
        <div class="admin-search-box">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="Search events..." [(ngModel)]="searchQuery" (ngModelChange)="filterEvents()">
        </div>
      </div>

      <!-- Events List (Card Grid) -->
      <div class="admin-grid" *ngIf="filteredEvents.length > 0; else emptyState">
        <div class="admin-card" style="padding: 0; display: flex; overflow: hidden;" *ngFor="let event of filteredEvents">
          <div class="card-status-strip" [class]="event.event_type"></div>
          <div class="card-content">
            <div class="event-meta">
              <span class="event-type-badge {{ event.event_type }}">{{ event.event_type }}</span>
              <span class="event-date">
                <i class="fa-regular fa-calendar"></i> {{ event.start_time | date:'MMM d, y • h:mm a' }}
              </span>
            </div>
            
            <h3 class="event-title">{{ event.title }}</h3>
            <div class="event-location" *ngIf="event.location">
              <i class="fa-solid fa-location-dot"></i> {{ event.location }}
            </div>
            
            <div class="card-actions">
              <button class="btn-icon" (click)="openEditModal(event)" title="Edit Event">
                <i class="fa-solid fa-pen-to-square"></i> Edit
              </button>
              <button class="btn-icon delete" (click)="deleteEvent(event)" title="Delete Event">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <ng-template #emptyState>
        <div class="admin-empty-state">
          <i class="fa-regular fa-calendar-xmark"></i>
          <h3>No events found</h3>
          <p>Try adjusting your search or filters, or create a new event.</p>
          <button class="btn-admin-secondary" (click)="openAddModal()" *ngIf="events.length > 0">Add Event</button>
        </div>
      </ng-template>

      <!-- Modal Form -->
      <app-event-form 
        *ngIf="showModal"
        [event]="selectedEvent"
        (save)="onSave($event)"
        (cancel)="onCancel()">
      </app-event-form>

    </div>
  `,
  styles: [`
    /* Using Global Admin Theme - No local overrides needed for layout */
    /* Add only specific tweaks here if necessary */
    
    .card-status-strip {
      width: 6px;
      /* Default strip color */
      background: #9CA3AF; 
    }
    
    /* Strip Colors */
    .card-status-strip.service { background: #4F46E5; }
    .card-status-strip.fellowship { background: #059669; }
    .card-status-strip.bible-study { background: #D97706; }
    .card-status-strip.outreach { background: #EA580C; }

    .card-content {
      flex: 1;
      padding: 20px;
      display: flex;
      flex-direction: column;
    }

    .event-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .event-type-badge {
      font-size: 0.7rem;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.05em;
      padding: 4px 8px;
      border-radius: 4px;
      background: #F3F4F6;
      color: #4B5563;
    }
    
    .event-type-badge.service { background: #EEF2FF; color: #4F46E5; }
    .event-type-badge.fellowship { background: #ECFDF5; color: #059669; }
    .event-type-badge.bible-study { background: #FEF3C7; color: #D97706; }

    .event-date {
      font-size: 0.85rem;
      color: #6B7280;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .event-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 8px 0;
      line-height: 1.4;
    }

    .event-location {
      font-size: 0.9rem;
      color: #6B7280;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .card-actions {
      margin-top: auto;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid #F3F4F6;
    }
    
    /* Tabs specific to this page */
    .tabs { display: flex; gap: 4px; }
    .tab-btn { background: none; border: none; padding: 8px 16px; border-radius: 8px; color: #64748B; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .tab-btn:hover { background: #F1F5F9; color: #1E293B; }
    .tab-btn.active { background: #FEFCE8; color: #D4AF37; }
  `]
})
export class EventsAdminComponent implements OnInit {
  events: ChurchEvent[] = [];
  filteredEvents: ChurchEvent[] = [];
  showModal = false;
  selectedEvent: ChurchEvent | null = null;
  
  // Filters
  activeTab: 'upcoming' | 'past' | 'all' = 'upcoming';
  searchQuery = '';

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getEvents().subscribe({
      next: (data) => {
        // Sort by date (newest/nearest first depending on tab, effectively raw list sorted by DB usually)
        // Let's sort locally to be sure: nearest date first
        this.events = data.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
        this.filterEvents();
      },
      error: (err) => console.error('Error loading events', err)
    });
  }
  
  setTab(tab: 'upcoming' | 'past' | 'all') {
    this.activeTab = tab;
    this.filterEvents();
  }

  filterEvents() {
    const now = new Date();
    let temp = this.events;

    // 1. Filter by Tab
    if (this.activeTab === 'upcoming') {
      temp = temp.filter(e => new Date(e.start_time) >= now);
    } else if (this.activeTab === 'past') {
      temp = temp.filter(e => new Date(e.start_time) < now);
      // Reverse sort for past events (most recent first)
      temp.sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
    }

    // 2. Filter by Search
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      temp = temp.filter(e => 
        e.title.toLowerCase().includes(q) || 
        e.location?.toLowerCase().includes(q) ||
        e.event_type?.toLowerCase().includes(q)
      );
    }

    this.filteredEvents = temp;
  }

  openAddModal() {
    this.selectedEvent = null;
    this.showModal = true;
  }

  openEditModal(event: ChurchEvent) {
    this.selectedEvent = event;
    this.showModal = true;
  }

  onCancel() {
    this.showModal = false;
    this.selectedEvent = null;
  }

  onSave(eventData: ChurchEvent) {
    if (this.selectedEvent && this.selectedEvent.id) {
      this.eventService.updateEvent(this.selectedEvent.id, eventData).subscribe({
        next: () => {
          this.showModal = false;
          this.loadEvents();
        },
        error: (err) => console.error('Error updating event', err)
      });
    } else {
      this.eventService.createEvent(eventData).subscribe({
        next: () => {
          this.showModal = false;
          this.loadEvents();
        },
        error: (err) => console.error('Error creating event', err)
      });
    }
  }

  deleteEvent(event: ChurchEvent) {
    if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
      if (event.id) {
        this.eventService.deleteEvent(event.id).subscribe({
          next: () => this.loadEvents(),
          error: (err) => console.error('Error deleting event', err)
        });
      }
    }
  }
}
