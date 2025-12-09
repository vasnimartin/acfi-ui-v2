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
  { path: 'contact', loadComponent: () => import('./contact/contact.component').then(m => m.ContactComponent) }
];
