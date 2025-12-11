import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService, ChurchEvent } from '../../../core/services/event.service';
import { EventFormComponent } from '../form/event-form.component';

@Component({
  selector: 'app-events-admin',
  standalone: true,
  imports: [CommonModule, EventFormComponent],
  template: `
    <div class="admin-page">
      <div class="page-header">
        <h2>Manage Events</h2>
        <button class="btn-add" (click)="openAddModal()">
          <i class="fa fa-plus"></i> Add New Event
        </button>
      </div>

      <div class="events-table-wrapper">
        <table class="events-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Type</th>
              <th>Location</th>
              <th class="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let event of events">
              <td>{{ event.start_time | date:'mediumDate' }}</td>
              <td>{{ event.title }}</td>
              <td><span class="badge {{ event.event_type }}">{{ event.event_type }}</span></td>
              <td>{{ event.location }}</td>
              <td class="actions-col">
                <button class="btn-icon" (click)="openEditModal(event)" title="Edit">
                  <i class="fa fa-pencil"></i> Edit
                </button>
                <button class="btn-icon delete" (click)="deleteEvent(event)" title="Delete">
                  <i class="fa fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr *ngIf="events.length === 0">
              <td colspan="5" class="empty-state">No events found. Click "Add New Event" to create one.</td>
            </tr>
          </tbody>
        </table>
      </div>

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
    .admin-page { padding: 0; }
    .page-header { 
      display: flex; justify-content: space-between; align-items: center; 
      margin-bottom: 2rem; 
    }
    h2 { margin: 0; font-size: 1.8rem; color: #333; }
    
    .btn-add {
      background: #28a745; color: white; border: none; padding: 0.75rem 1.25rem;
      border-radius: 4px; cursor: pointer; font-weight: 600; display: flex; gap: 0.5rem; align-items: center;
    }
    .btn-add:hover { background: #218838; }

    .events-table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    th, td { padding: 1rem; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #f8f9fa; font-weight: 600; color: #555; }
    tr:hover { background: #fcfcfc; }
    
    .badge { 
      padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.8rem; font-weight: 600; text-transform: uppercase;
      background: #eee; color: #555;
    }
    .badge.service { background: #e3f2fd; color: #0d47a1; }
    .badge.christmas { background: #ffebee; color: #c62828; }
    .badge.fellowship { background: #e8f5e9; color: #2e7d32; }

    .actions-col { text-align: right; white-space: nowrap; }
    .btn-icon {
      background: none; border: none; cursor: pointer; padding: 0.5rem; color: #666; font-size: 0.9rem;
    }
    .btn-icon:hover { color: #007bff; }
    .btn-icon.delete:hover { color: #dc3545; }
    
    .empty-state { text-align: center; color: #888; padding: 3rem; font-style: italic; }
  `]
})
export class EventsAdminComponent implements OnInit {
  events: ChurchEvent[] = [];
  showModal = false;
  selectedEvent: ChurchEvent | null = null;

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getEvents().subscribe({
      next: (data) => this.events = data,
      error: (err) => console.error('Error loading events', err)
    });
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
      // Edit Mode
      this.eventService.updateEvent(this.selectedEvent.id, eventData).subscribe({
        next: () => {
          this.showModal = false;
          this.loadEvents();
        },
        error: (err) => console.error('Error updating event', err)
      });
    } else {
      // Create Mode
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
