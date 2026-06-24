import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CourseStore } from '../../../store/course.store';
import { AuthStore } from '../../../store/auth.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  template: `
    <header class="h-16 bg-white border-b border-border px-6 flex items-center justify-between sticky top-0 z-30">
      <div class="flex items-center gap-4">
        <!-- Sidebar Toggle -->
        <button (click)="onToggleSidebar()" class="p-2 text-muted-foreground hover:bg-muted rounded-md transition-colors">
          <mat-icon style="font-size: 20px; width: 20px; height: 20px;">menu</mat-icon>
        </button>

        <div class="relative w-64 hidden md:block">
          <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" style="font-size: 16px; width: 16px; height: 16px;">search</mat-icon>
          <input 
            type="text" 
            placeholder="Search courses..." 
            [value]="store.filter().query"
            (input)="onSearch($event)"
            class="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all">
        </div>
      </div>
      
      <div class="flex items-center gap-4">
        @if (!authStore.isAuthenticated()) {
          <button (click)="router.navigate(['/login'])" class="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:bg-primary/90 transition-colors">
            Login
          </button>
        } @else {
          <button class="relative p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors">
            <mat-icon style="font-size: 20px; width: 20px; height: 20px;">notifications</mat-icon>
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-white"></span>
          </button>
          <div class="h-8 w-px bg-border"></div>
          
          @if (authStore.user(); as user) {
            <div class="flex items-center gap-3">
              <div class="flex flex-col items-end hidden sm:flex">
                <span class="text-sm font-medium text-foreground leading-none">{{ user.name }}</span>
                <span class="text-xs text-muted-foreground mt-1 capitalize">{{ user.role }}</span>
              </div>
              <div class="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 overflow-hidden cursor-pointer flex items-center justify-center font-bold text-primary">
                {{ user.name.charAt(0).toUpperCase() }}
              </div>
              <button (click)="logout()" class="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors ml-2" title="Logout">
                <mat-icon style="font-size: 20px; width: 20px; height: 20px;">logout</mat-icon>
              </button>
            </div>
          }
        }
      </div>
    </header>
  `,
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  
  store = inject(CourseStore);
  authStore = inject(AuthStore);
  router = inject(Router);

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.store.updateFilter({ query });
  }

  logout() {
    this.authStore.logout();
    this.router.navigate(['/courses']);
  }
}
