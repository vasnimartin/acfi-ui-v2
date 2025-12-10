import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { Component } from '@angular/core';

// Placeholder components for now
@Component({ template: '<h2>Manage Events</h2><p>Coming soon...</p>', standalone: true }) class EventsAdminComponent {}
@Component({ template: '<h2>Manage Ministries</h2><p>Coming soon...</p>', standalone: true }) class MinistriesAdminComponent {}
@Component({ template: '<h2>Manage Sermons</h2><p>Coming soon...</p>', standalone: true }) class SermonsAdminComponent {}
@Component({ template: '<h2>Manage Timeline</h2><p>Coming soon...</p>', standalone: true }) class TimelineAdminComponent {}
@Component({ template: '<h2>Manage Media</h2><p>Coming soon...</p>', standalone: true }) class MediaAdminComponent {}

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'events', pathMatch: 'full' },
      { path: 'events', component: EventsAdminComponent },
      { path: 'ministries', component: MinistriesAdminComponent },
      { path: 'sermons', component: SermonsAdminComponent },
      { path: 'timeline', component: TimelineAdminComponent },
      { path: 'media', component: MediaAdminComponent }
    ]
  }
];
