import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { SeasonalWelcomeComponent } from '../seasonal-welcome/seasonal-welcome.component';
import { ServiceScheduleComponent } from '../service-schedule/service-schedule.component';
import { EventsComponent } from '../events/events.component';
import { TenetsComponent } from '../tenets/tenets.component';
import { CtaComponent } from '../cta/cta.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { PrayerRequestFormComponent } from '../prayer-request-form/prayer-request-form.component';
import { ContentService } from '../../core/services/content.service';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    SeasonalWelcomeComponent,
    ServiceScheduleComponent,
    EventsComponent,
    TenetsComponent,
    CtaComponent,
    TestimonialsComponent,
    GalleryComponent,
    PrayerRequestFormComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  theme$: Observable<string>;

  constructor(private contentService: ContentService) {
    this.theme$ = this.contentService.currentTheme$;
  }
}
