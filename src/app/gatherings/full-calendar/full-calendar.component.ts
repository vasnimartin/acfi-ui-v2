import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-full-calendar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './full-calendar.component.html',
  styleUrl: './full-calendar.component.scss'
})
export class FullCalendarComponent {

}
