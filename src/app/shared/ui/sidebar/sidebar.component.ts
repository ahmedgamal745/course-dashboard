import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthStore } from '../../../store/auth.store';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <aside class="w-64 bg-slate-900 h-full flex flex-col text-slate-300">
      <div class="h-16 flex items-center px-6 border-b border-slate-800">
        <div class="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold text-xl mr-3">
          P
        </div>
        <span class="text-xl font-bold text-white tracking-tight">PiCourses</span>
      </div>

      <div class="p-4 flex-1 overflow-y-auto">
        <nav class="space-y-1">
          <p class="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-4">Main Navigation</p>
          
          <a routerLink="/dashboard" routerLinkActive="bg-primary/10 text-primary" class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 transition-colors group">
            <mat-icon class="text-slate-400 group-hover:text-primary transition-colors" style="font-size: 20px; width: 20px; height: 20px;">dashboard</mat-icon>
            <span class="font-medium text-sm">Dashboard</span>
          </a>
          
          <a routerLink="/courses" routerLinkActive="bg-primary/10 text-primary" class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 transition-colors group">
            <mat-icon class="text-slate-400 group-hover:text-primary transition-colors" style="font-size: 20px; width: 20px; height: 20px;">menu_book</mat-icon>
            <span class="font-medium text-sm">Courses</span>
          </a>
          
          @if (authStore.hasRole(['employer', 'master'])) {
            <a routerLink="/students" routerLinkActive="bg-primary/10 text-primary" class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 transition-colors group">
              <mat-icon class="text-slate-400 group-hover:text-primary transition-colors" style="font-size: 20px; width: 20px; height: 20px;">people</mat-icon>
              <span class="font-medium text-sm">Students</span>
            </a>
          }

          @if (canManageCourses()) {
            <p class="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-8">Admin Portal</p>
            
            <a routerLink="/reports" routerLinkActive="bg-primary/10 text-primary" class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 transition-colors group">
              <mat-icon class="text-slate-400 group-hover:text-primary transition-colors" style="font-size: 20px; width: 20px; height: 20px;">bar_chart</mat-icon>
              <span class="font-medium text-sm">Reports</span>
            </a>
            
            <a routerLink="/settings" routerLinkActive="bg-primary/10 text-primary" class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 transition-colors group">
              <mat-icon class="text-slate-400 group-hover:text-primary transition-colors" style="font-size: 20px; width: 20px; height: 20px;">settings</mat-icon>
              <span class="font-medium text-sm">Settings</span>
            </a>
          }
        </nav>
      </div>
      
      <div class="p-4 border-t border-slate-800">
        <div class="bg-slate-800 rounded-lg p-4">
          <p class="text-sm font-medium text-white mb-1">PiCourses Enterprise</p>
          <p class="text-xs text-slate-400 mb-3">Premium Plan</p>
          <div class="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div class="bg-primary h-full w-3/4 rounded-full"></div>
          </div>
          <p class="text-[10px] text-slate-400 mt-2">75% storage used</p>
        </div>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  authStore = inject(AuthStore);

  canManageCourses(): boolean {
    return this.authStore.hasRole(['employer', 'master']);
  }
}
