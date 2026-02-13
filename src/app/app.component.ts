import { Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from "./layout/header/header.component";
import { FooterComponent } from "./layout/footer/footer.component";
import { ToastComponent } from "./shared/components/toast/toast.component";
import { AdminBarComponent } from "./layout/admin-bar/admin-bar.component";
import { AuthService } from './core/services/auth.service';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule, ToastComponent, AdminBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'acfi-church';
  private router = inject(Router);
  private authService = inject(AuthService);

  isAdmin$ = this.authService.currentUserRole$.pipe(
    map(role => ['admin', 'pastor', 'media'].includes(role || ''))
  );

  isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }
}
