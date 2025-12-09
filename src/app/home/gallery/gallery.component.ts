import { Component, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-gallery',
  imports: [],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements AfterViewInit, OnDestroy {
  @ViewChild('galleryScroll', { static: false }) galleryScroll!: ElementRef;
  
  private animationFrameId: any;
  private scrollPosition = 0;
  private scrollSpeed = 0.5; // Slower, smoother speed
  private isPaused = false;

  ngAfterViewInit() {
    // Start auto-scrolling after view is initialized
    setTimeout(() => {
      this.startAutoScroll();
    }, 500);
  }

  ngOnDestroy() {
    this.stopAutoScroll();
  }

  startAutoScroll() {
    const scroll = () => {
      if (!this.isPaused && this.galleryScroll?.nativeElement) {
        const element = this.galleryScroll.nativeElement;
        const maxScroll = element.scrollWidth - element.clientWidth;
        
        // Increment scroll position
        this.scrollPosition += this.scrollSpeed;
        
        // Reset to beginning when reaching the end
        if (this.scrollPosition >= maxScroll) {
          this.scrollPosition = 0;
        }
        
        // Apply scroll
        element.scrollLeft = this.scrollPosition;
      }
      
      // Continue animation loop
      this.animationFrameId = requestAnimationFrame(scroll);
    };
    
    // Start the animation loop
    this.animationFrameId = requestAnimationFrame(scroll);
  }

  stopAutoScroll() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  // Pause auto-scroll on hover
  onMouseEnter() {
    this.isPaused = true;
  }

  // Resume auto-scroll when mouse leaves
  onMouseLeave() {
    this.isPaused = false;
  }
}
