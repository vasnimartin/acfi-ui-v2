import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ChristmasEvent {
  id: number;
  title: string;
  location: string;
  date: string;
  time: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent {
  isModalOpen = false;
  selectedEvent: ChristmasEvent | null = null;

  events: ChristmasEvent[] = [
    {
      id: 1,
      title: 'Carol Rounds',
      location: 'Round Rock / Hutto',
      date: 'Friday, December 12',
      time: '7:00 PM',
      description: 'A joyful time of singing carols, prayer, and visiting families with the love of Christ. Join us as we spread Christmas joy in the Round Rock and Hutto communities.',
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 2,
      title: 'Carol Rounds',
      location: 'Pflugerville',
      date: 'Sunday, December 14',
      time: '6:00 PM',
      description: 'Join us as we visit homes in Pflugerville sharing worship, joy, and the message of Christ. Experience the warmth of fellowship this Christmas season.',
      image: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 3,
      title: 'Carol Rounds',
      location: 'North Austin',
      date: 'Friday, December 19',
      time: '7:00 PM',
      description: 'Worship, fellowship, and carols as we visit families in the North Austin community. Let\'s celebrate the birth of our Savior together.',
      image: 'https://images.unsplash.com/photo-1505324394634-1b40b67a9e2e?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 4,
      title: 'Carol Rounds',
      location: 'Georgetown',
      date: 'Saturday, December 20',
      time: '6:30 PM',
      description: 'Celebrate the season with carols, prayer, and outreach in the Georgetown area. Spread the joy and light of Christmas with your church family.',
      image: 'https://images.unsplash.com/photo-1607082350899-7e1052bb65ba?auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 5,
      title: 'Carol Rounds',
      location: 'Cedar Park / Leander',
      date: 'Sunday, December 21',
      time: '6:00 PM',
      description: 'Bringing the joy of Christ to homes and families through worship and Christmas carols. An evening of praise and community.',
      image: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=1200&q=80'
    }
  ];

  openModal() {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedEvent = null;
    document.body.style.overflow = '';
  }

  selectEvent(event: ChristmasEvent) {
    this.selectedEvent = event;
  }

  backToList() {
    this.selectedEvent = null;
  }
}
