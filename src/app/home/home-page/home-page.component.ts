import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { ChristmasWelcomeComponent } from '../christmas-welcome/christmas-welcome.component';
import { ServiceScheduleComponent } from '../service-schedule/service-schedule.component';
import { EventsComponent } from '../events/events.component';
import { TenetsComponent } from '../tenets/tenets.component';
import { CtaComponent } from '../cta/cta.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { PrayerRequestFormComponent } from '../prayer-request-form/prayer-request-form.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    HeroComponent,
    ChristmasWelcomeComponent,
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

}
