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
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Events Manager</h1>
          <p class="page-subtitle">Manage upcoming services, gatherings, and special events.</p>
        </div>
        <button class="btn-primary" (click)="openAddModal()">
          <i class="fa-solid fa-plus"></i> Add Event
        </button>
      </div>

      <!-- Filters & Search -->
      <div class="filters-bar">
        <div class="tabs">
          <button class="tab-btn" [class.active]="activeTab === 'upcoming'" (click)="setTab('upcoming')">Upcoming</button>
          <button class="tab-btn" [class.active]="activeTab === 'past'" (click)="setTab('past')">Past History</button>
          <button class="tab-btn" [class.active]="activeTab === 'all'" (click)="setTab('all')">All Events</button>
        </div>
        <div class="search-box">
          <i class="fa-solid fa-magnifying-glass search-icon"></i>
          <input type="text" placeholder="Search events..." [(ngModel)]="searchQuery" (ngModelChange)="filterEvents()">
        </div>
      </div>

      <!-- Events List (Card Grid) -->
      <div class="events-grid" *ngIf="filteredEvents.length > 0; else emptyState">
        <div class="event-card" *ngFor="let event of filteredEvents">
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
        <div class="empty-state">
          <div class="empty-icon">
            <i class="fa-regular fa-calendar-xmark"></i>
          </div>
          <h3>No events found</h3>
          <p>Try adjusting your search or filters, or create a new event.</p>
          <button class="btn-secondary" (click)="openAddModal()" *ngIf="events.length > 0">Add Event</button>
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
    .admin-page-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    /* Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
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
      background: #D4AF37; /* Mute Gold */
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
    
    .btn-secondary {
      background: white;
      color: #374151;
      border: 1px solid #D1D5DB;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
    }

    /* Filters Bar */
    .filters-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      background: white;
      padding: 8px;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
    }

    .tabs {
      display: flex;
      gap: 4px;
    }

    .tab-btn {
      background: none;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      color: #6B7280;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .tab-btn:hover {
      background: #F3F4F6;
      color: #374151;
    }

    .tab-btn.active {
      background: #FEFCE8;
      color: #D97706;
      font-weight: 600;
    }

    .search-box {
      position: relative;
      width: 300px;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #9CA3AF;
    }

    .search-box input {
      width: 100%;
      padding: 10px 10px 10px 36px;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      font-family: inherit;
      font-size: 0.9rem;
    }
    
    .search-box input:focus {
      outline: none;
      border-color: #D4AF37;
      box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.1);
    }

    /* Grid Layout */
    .events-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 24px;
    }

    .event-card {
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      position: relative;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .event-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.1);
    }

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

    .btn-icon {
      background: none;
      border: none;
      font-size: 0.9rem;
      color: #6B7280;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 8px;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .btn-icon:hover {
      background: #F3F4F6;
      color: #111827;
    }

    .btn-icon.delete:hover {
      background: #FEF2F2;
      color: #DC2626;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 64px 20px;
      background: white;
      border-radius: 12px;
      border: 1px dashed #E5E7EB;
    }

    .empty-icon {
      font-size: 3rem;
      color: #D1D5DB;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      font-size: 1.1rem;
      color: #374151;
      margin: 0 0 8px 0;
    }

    .empty-state p {
      color: #6B7280;
      margin-bottom: 24px;
    }
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
