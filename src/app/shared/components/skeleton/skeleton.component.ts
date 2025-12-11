import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton" 
         [style.width]="width" 
         [style.height]="height" 
         [style.borderRadius]="borderRadius"
         [class.circle]="variant === 'circle'">
    </div>
  `,
  styles: [`
    .skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      width: 100%;
      height: 20px; /* default */
    }

    .skeleton.circle {
      border-radius: 50% !important;
    }

    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `]
})
export class SkeletonComponent {
  @Input() width = '100%';
  @Input() height = '20px';
  @Input() borderRadius = '4px';
  @Input() variant: 'text' | 'rect' | 'circle' = 'text';
}
