import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { Component } from '@angular/core';
import { EventsAdminComponent } from './events/list/events-list.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { MediaAdminComponent } from './media/media-admin.component';
import { SermonsAdminComponent } from './sermons/sermons-admin.component';
import { RolesAdminComponent } from './people/people-admin.component';
import { PrayerRequestsAdminComponent } from './prayer-requests/prayer-requests-admin.component';

// Placeholder components for now
@Component({ selector: 'admin-ministries', template: '<h2>Manage Ministries</h2><p>Coming soon...</p>', standalone: true }) class MinistriesAdminComponent {}
@Component({ selector: 'admin-timeline', template: '<h2>Manage Timeline</h2><p>Coming soon...</p>', standalone: true }) class TimelineAdminComponent {}

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'events', component: EventsAdminComponent },
      { path: 'ministries', component: MinistriesAdminComponent },
      { path: 'sermons', component: SermonsAdminComponent },
      { path: 'timeline', component: TimelineAdminComponent },
      { path: 'media', component: MediaAdminComponent },
      { path: 'people', component: RolesAdminComponent },
      { path: 'prayer-requests', component: PrayerRequestsAdminComponent }
    ]
  }
];
