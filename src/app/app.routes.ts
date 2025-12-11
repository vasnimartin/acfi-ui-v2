import { Routes } from '@angular/router';
import { HomePageComponent } from './home/home-page/home-page.component';
import { roleGuard } from './core/guards/role.guard';

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
      { path: 'sunday-services', loadComponent: () => import('./gatherings/sunday-services/sunday-services.component').then(m => m.SundayServicesComponent) },
      { path: 'bible-studies', loadComponent: () => import('./gatherings/bible-studies/bible-studies.component').then(m => m.BibleStudiesComponent) },
      { path: 'monthly-fellowship', loadComponent: () => import('./gatherings/monthly-fellowship/monthly-fellowship.component').then(m => m.MonthlyFellowshipComponent) },
      { path: 'full-calendar', loadComponent: () => import('./gatherings/full-calendar/full-calendar.component').then(m => m.FullCalendarComponent) }
    ]
  },
  {
    path: 'resources',
    children: [
      { path: 'lenten-devotionals', loadComponent: () => import('./resources/lenten-devotionals/lenten-devotionals.component').then(m => m.LentenDevotionalsComponent) },
      { path: 'bulletins', loadComponent: () => import('./resources/bulletins/bulletins.component').then(m => m.BulletinsComponent) },
      { path: 'gallery', loadComponent: () => import('./resources/gallery/gallery.component').then(m => m.GalleryComponent) },
      { path: 'videos', loadComponent: () => import('./resources/videos/videos.component').then(m => m.VideosComponent) },
      { path: 'testimonials', loadComponent: () => import('./resources/testimonials/testimonials.component').then(m => m.TestimonialsComponent) },
      { path: 'silent-auction', loadComponent: () => import('./resources/silent-auction/silent-auction.component').then(m => m.SilentAuctionComponent) },
      { path: 'archives', loadComponent: () => import('./resources/archives/archives.component').then(m => m.ArchivesComponent) },
      { path: 'shop', loadComponent: () => import('./resources/shop/shop.component').then(m => m.ShopComponent) },
      { path: 'prayer-request', loadComponent: () => import('./resources/prayer-request/prayer-request.component').then(m => m.PrayerRequestComponent) }
    ]
  },
  {
    path: 'give',
    children: [
      { path: 'online-giving', loadComponent: () => import('./give/online-giving/online-giving.component').then(m => m.OnlineGivingComponent) },
      { path: 'building-fund', loadComponent: () => import('./give/building-fund/building-fund.component').then(m => m.BuildingFundComponent) }
    ]
  },
  { path: 'contact', loadComponent: () => import('./contact/contact.component').then(m => m.ContactComponent) },
  { path: 'jobs', loadComponent: () => import('./jobs/jobs.component').then(m => m.JobsComponent) },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    // Simple check: user must be logged in. We can reuse roleGuard if we want strict 'member' role check,
    // or create an AuthGuard. For now, let's assume if you have a role (even member), you can access it.
    // Reusing roleGuard with implicit 'member' requirement or just letting it be accessible to any auth user?
    // Let's use roleGuard with 'member' which covers everyone in ACFI usually.
    canActivate: [roleGuard],
    data: { roles: ['member', 'admin', 'pastor', 'media'] }
  },
  { 
    path: 'volunteer', 
    loadComponent: () => import('./dashboard/volunteer/volunteer.component').then(m => m.VolunteerComponent),
    canActivate: [roleGuard],
    data: { roles: ['member', 'admin', 'pastor', 'media'] }
  },
  { 
    path: 'prayer-requests', 
    loadComponent: () => import('./dashboard/prayer-requests/prayer-requests.component').then(m => m.PrayerRequestsComponent),
    canActivate: [roleGuard],
    data: { roles: ['member', 'admin', 'pastor', 'media'] }
  },
  { 
    path: 'directory', 
    loadComponent: () => import('./dashboard/directory/directory.component').then(m => m.DirectoryComponent),
    canActivate: [roleGuard],
    data: { roles: ['member', 'admin', 'pastor', 'media'] }
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [roleGuard],
    data: { roles: ['admin', 'pastor', 'media'] }
  }
];
