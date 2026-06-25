import { Component, inject, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CourseStore } from '../../../store/course.store';
import { AuthStore } from '../../../store/auth.store';
import { NotificationService } from '../../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  template: `
    <header class="h-16 bg-white border-b border-border px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
      <div class="flex items-center gap-4">
        <!-- Sidebar Toggle -->
        <button (click)="onToggleSidebar()" class="p-2 text-muted-foreground hover:bg-muted rounded-md transition-colors">
          <mat-icon style="font-size: 20px; width: 20px; height: 20px;">menu</mat-icon>
        </button>

        <div class="relative w-48 md:w-64 hidden sm:block">
          <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" style="font-size: 16px; width: 16px; height: 16px;">search</mat-icon>
          <input 
            type="text" 
            placeholder="Search courses..." 
            [value]="store.filter().query"
            (input)="onSearch($event)"
            class="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all">
        </div>
      </div>
      
      <div class="flex items-center gap-2 md:gap-4">
        @if (!authStore.isAuthenticated()) {
          <button (click)="router.navigate(['/login'])" class="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:bg-primary/90 transition-colors">
            Login
          </button>
        } @else {
          <!-- Notifications -->
          <div class="relative">
            <button (click)="toggleNotifications($event)" class="relative p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors">
              <mat-icon style="font-size: 20px; width: 20px; height: 20px;">notifications</mat-icon>
              @if (notificationService.unreadCount() > 0) {
                <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-white"></span>
              }
            </button>
            
            @if (showNotifications) {
              <div class="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-border overflow-hidden z-50 transform origin-top-right transition-all">
                <div class="px-4 py-3 border-b border-border flex justify-between items-center bg-muted/30">
                  <h3 class="font-bold text-sm">Notifications</h3>
                  @if (notificationService.unreadCount() > 0) {
                    <span class="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {{ notificationService.unreadCount() }} New
                    </span>
                  }
                </div>
                
                <div class="max-h-80 overflow-y-auto">
                  @if (notificationService.notifications().length === 0) {
                    <div class="p-6 text-center text-muted-foreground text-sm">
                      <mat-icon class="mb-2 opacity-50" style="font-size: 24px; width: 24px; height: 24px;">notifications_off</mat-icon>
                      <p>You're all caught up!</p>
                    </div>
                  } @else {
                    <div class="divide-y divide-border">
                      @for (notification of notificationService.notifications(); track notification.id) {
                        <div class="p-4 hover:bg-muted/50 transition-colors" [class.bg-blue-50]="!notification.read">
                          <div class="flex gap-3 items-start">
                            <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                              <mat-icon style="font-size: 16px; width: 16px; height: 16px;">
                                {{ notification.type === 'COURSE_CREATED' ? 'add_circle' : 'edit' }}
                              </mat-icon>
                            </div>
                            <div>
                              <p class="text-sm font-medium text-foreground">{{ notification.title }}</p>
                              <p class="text-xs text-muted-foreground mt-1">{{ notification.message }}</p>
                              <p class="text-[10px] text-muted-foreground mt-2">{{ notification.timestamp | date:'short' }}</p>
                            </div>
                          </div>
                        </div>
                      }
                    </div>
                  }
                </div>
              </div>
            }
          </div>

          <div class="h-6 w-px bg-border hidden sm:block"></div>
          
          @if (authStore.user(); as user) {
            <div class="flex items-center gap-2 md:gap-3">
              <div class="flex-col items-end hidden sm:flex">
                <span class="text-sm font-medium text-foreground leading-none">{{ user.name }}</span>
                <span class="text-xs text-muted-foreground mt-1 capitalize">{{ user.role }}</span>
              </div>
              <div class="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary/10 border border-primary/20 overflow-hidden cursor-pointer flex items-center justify-center font-bold text-primary text-sm md:text-base">
                {{ user.name.charAt(0).toUpperCase() }}
              </div>
              <button (click)="logout()" class="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors sm:ml-2" title="Logout">
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
  notificationService = inject(NotificationService);

  showNotifications = false;

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.store.updateFilter({ query });
  }

  toggleNotifications(event: Event) {
    event.stopPropagation();
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.notificationService.markAllAsRead();
    }
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.showNotifications = false;
  }

  logout() {
    this.authStore.logout();
    this.router.navigate(['/courses']);
  }
}
