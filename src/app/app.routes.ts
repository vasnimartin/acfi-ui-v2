import { Routes } from '@angular/router';
import { HomePageComponent } from './home/home-page/home-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },

  {
    path: 'about',
    children: [
      { path: 'who-we-are', loadComponent: () => import('./about/who-we-are/who-we-are.component').then(m => m.WhoWeAreComponent) },
      { path: 'vision-mission', loadComponent: () => import('./about/vision-mission/vision-mission.component').then(m => m.VisionMissionComponent) },
      { path: 'statement-of-faith', loadComponent: () => import('./about/statement-of-faith/statement-of-faith.component').then(m => m.StatementOfFaithComponent) },
      { path: 'pastors-welcome', loadComponent: () => import('./about/pastors-welcome/pastors-welcome.component').then(m => m.PastorsWelcomeComponent) },
      { path: 'timeline', loadComponent: () => import('./about/timeline/timeline.component').then(m => m.TimelineComponent) },
    ]
  },
  {
    path: 'ministries',
    children: [
      { path: 'children', loadComponent: () => import('./ministries/children/children.component').then(m => m.ChildrenComponent) },
      { path: 'music-worship', loadComponent: () => import('./ministries/music-worship/music-worship.component').then(m => m.MusicWorshipComponent) },
      { path: 'outreach', loadComponent: () => import('./ministries/outreach/outreach.component').then(m => m.OutreachComponent) },
      { path: 'prayer', loadComponent: () => import('./ministries/prayer/prayer.component').then(m => m.PrayerComponent) },
      { path: 'youth', loadComponent: () => import('./ministries/youth/youth.component').then(m => m.YouthComponent) },
      { path: 'women', loadComponent: () => import('./ministries/women/women.component').then(m => m.WomenComponent) },
      { path: 'men', loadComponent: () => import('./ministries/men/men.component').then(m => m.MenComponent) }
    ]
  },
  {
    path: 'gatherings',
    children: [
      { path: 'sunday-services', loadComponent: () => import('./gatherings/sunday-services/sunday-services.component').then(m => m.SundayServicesComponent) }
    ]
  },
  { path: 'contact', loadComponent: () => import('./contact/contact.component').then(m => m.ContactComponent) }
];
