import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStore } from '../../store/auth.store';
import { CourseStore } from '../../store/course.store';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="h-full flex flex-col max-w-6xl mx-auto w-full">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground">Welcome, {{ authStore.user()?.name }}</h1>
        <p class="text-muted-foreground mt-1 capitalize">{{ authStore.user()?.role }} Dashboard</p>
      </div>

      <!-- MASTER DASHBOARD -->
      @if (authStore.user()?.role === 'master') {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white p-6 rounded-xl border border-border flex items-center gap-4 shadow-sm">
            <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <mat-icon>group</mat-icon>
            </div>
            <div>
              <p class="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Total Users</p>
              <h3 class="text-3xl font-bold text-foreground">1,248</h3>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-xl border border-border flex items-center gap-4 shadow-sm">
            <div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <mat-icon>attach_money</mat-icon>
            </div>
            <div>
              <p class="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Total Revenue</p>
              <h3 class="text-3xl font-bold text-foreground">$42,500</h3>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-xl border border-border flex items-center gap-4 shadow-sm">
            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <mat-icon>library_books</mat-icon>
            </div>
            <div>
              <p class="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Global Courses</p>
              <h3 class="text-3xl font-bold text-foreground">{{ store.courses().length }}</h3>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl border border-border shadow-sm flex-1">
          <h2 class="text-xl font-bold mb-4">Platform Overview</h2>
          <div class="h-64 bg-slate-50 rounded-lg flex items-center justify-center border border-dashed border-slate-200">
            <p class="text-muted-foreground text-sm flex items-center gap-2">
              <mat-icon style="font-size: 20px; width: 20px; height: 20px;">bar_chart</mat-icon>
              Global analytics charts will be rendered here
            </p>
          </div>
        </div>
      }

      <!-- EMPLOYER DASHBOARD -->
      @if (authStore.user()?.role === 'employer') {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="bg-white p-6 rounded-xl border border-border flex items-center gap-4 shadow-sm">
            <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <mat-icon>library_books</mat-icon>
            </div>
            <div>
              <p class="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">My Active Courses</p>
              <h3 class="text-3xl font-bold text-foreground">{{ store.courses().length - 12 }}</h3>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-xl border border-border flex items-center gap-4 shadow-sm">
            <div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <mat-icon>school</mat-icon>
            </div>
            <div>
              <p class="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Enrolled Students</p>
              <h3 class="text-3xl font-bold text-foreground">432</h3>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-xl border border-border shadow-sm flex-1">
          <h2 class="text-xl font-bold mb-4">Course Performance</h2>
          <div class="h-64 bg-slate-50 rounded-lg flex items-center justify-center border border-dashed border-slate-200">
            <p class="text-muted-foreground text-sm flex items-center gap-2">
              <mat-icon style="font-size: 20px; width: 20px; height: 20px;">pie_chart</mat-icon>
              Enrollment distribution charts will be rendered here
            </p>
          </div>
        </div>
      }

      <!-- CANDIDATE DASHBOARD -->
      @if (authStore.user()?.role === 'user') {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="bg-white p-6 rounded-xl border border-border flex items-center gap-4 shadow-sm">
            <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <mat-icon>bookmark</mat-icon>
            </div>
            <div>
              <p class="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Saved Courses</p>
              <h3 class="text-3xl font-bold text-foreground">{{ favoriteCount() }}</h3>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-xl border border-border flex items-center gap-4 shadow-sm">
            <div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <mat-icon>stars</mat-icon>
            </div>
            <div>
              <p class="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Completed Courses</p>
              <h3 class="text-3xl font-bold text-foreground">3</h3>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-xl border border-border shadow-sm flex-1">
          <h2 class="text-xl font-bold mb-4">Learning Progress</h2>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between items-center mb-1 text-sm font-medium">
                <span>Advanced Strategic Leadership</span>
                <span class="text-primary">70%</span>
              </div>
              <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div class="bg-primary h-full w-[70%] rounded-full"></div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between items-center mb-1 text-sm font-medium mt-6">
                <span>Data Analytics Fundamentals</span>
                <span class="text-primary">45%</span>
              </div>
              <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div class="bg-primary h-full w-[45%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class DashboardComponent {
  authStore = inject(AuthStore);
  store = inject(CourseStore);

  favoriteCount = computed(() => this.store.courses().filter(c => c.isFavorite).length);
}
