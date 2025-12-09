import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bible-studies',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bible-studies.component.html',
  styleUrl: './bible-studies.component.scss'
})
export class BibleStudiesComponent {

}
