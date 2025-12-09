import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss'
})
export class JobsComponent {

}
