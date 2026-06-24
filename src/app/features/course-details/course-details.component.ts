import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CourseStore } from '../../store/course.store';
import { AuthStore } from '../../store/auth.store';
import { CourseEditModalComponent } from '../course-edit-modal/course-edit-modal.component';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatSnackBarModule, MatDialogModule],
  template: `
    <div class="h-full flex flex-col">
      @if (store.isLoading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      } @else if (store.selectedCourse(); as course) {
        <div class="mb-6">
          <div class="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <a routerLink="/courses" class="hover:text-foreground transition-colors">Courses</a>
            <mat-icon style="font-size: 16px; width: 16px; height: 16px;">chevron_right</mat-icon>
            <span class="text-foreground font-medium">{{ course.title }}</span>
          </div>
          
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <span 
                  [class.bg-green-100]="course.status === 'Active'"
                  [class.text-green-700]="course.status === 'Active'"
                  [class.bg-amber-100]="course.status === 'Draft'"
                  [class.text-amber-700]="course.status === 'Draft'"
                  [class.bg-slate-200]="course.status === 'Archived'"
                  [class.text-slate-700]="course.status === 'Archived'"
                  class="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {{ course.status }}
                </span>
                <span class="text-sm font-medium text-muted-foreground">{{ course.category }} • {{ course.level }}</span>
              </div>
              <h1 class="text-3xl font-bold text-foreground mb-2">{{ course.title }}</h1>
              <p class="text-muted-foreground max-w-3xl">{{ course.description }}</p>
            </div>
            
            <div class="flex gap-3 shrink-0">
              <button (click)="toggleFavorite()" class="px-4 py-2 bg-white border border-border rounded-md font-medium text-sm hover:bg-muted transition-colors flex items-center gap-2"
                      [class.text-red-500]="course.isFavorite"
                      [class.border-red-200]="course.isFavorite"
                      [class.bg-red-50]="course.isFavorite">
                <mat-icon style="font-size: 18px; width: 18px; height: 18px;">
                  {{ course.isFavorite ? 'favorite' : 'favorite_border' }}
                </mat-icon>
                {{ course.isFavorite ? 'Favorited' : 'Favorite' }}
              </button>
              <button class="px-4 py-2 bg-white border border-border rounded-md font-medium text-sm hover:bg-muted transition-colors flex items-center gap-2">
                <mat-icon style="font-size: 18px; width: 18px; height: 18px;">share</mat-icon>
                Share
              </button>
              @if (canManageCourses()) {
                <button (click)="openEditModal(course)" class="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
                  <mat-icon style="font-size: 18px; width: 18px; height: 18px;">edit</mat-icon>
                  Edit Course
                </button>
              }
            </div>
          </div>
        </div>

        <div class="flex gap-8 mb-8 border-b border-border">
          <button class="px-1 py-4 text-sm font-medium border-b-2 border-primary text-foreground">
            Overview
          </button>
          <button class="px-1 py-4 text-sm font-medium border-b-2 border-transparent text-muted-foreground hover:text-foreground">
            Curriculum
          </button>
          <button class="px-1 py-4 text-sm font-medium border-b-2 border-transparent text-muted-foreground hover:text-foreground">
            Settings
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-white rounded-xl border border-border p-6 shadow-sm">
              <h3 class="text-lg font-bold mb-4">Course Performance</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="p-4 bg-muted/50 rounded-lg">
                  <div class="text-sm text-muted-foreground mb-1">Total Enrollment</div>
                  <div class="text-2xl font-bold">{{ course.studentsCount | number }}</div>
                </div>
                <div class="p-4 bg-muted/50 rounded-lg">
                  <div class="text-sm text-muted-foreground mb-1">Avg. Completion</div>
                  <div class="text-2xl font-bold">{{ course.avgCompletion || 0 }}%</div>
                </div>
                <div class="p-4 bg-muted/50 rounded-lg">
                  <div class="text-sm text-muted-foreground mb-1">Active Learners</div>
                  <div class="text-2xl font-bold">{{ course.activeLearners || 0 | number }}</div>
                </div>
                <div class="p-4 bg-muted/50 rounded-lg">
                  <div class="text-sm text-muted-foreground mb-1">Revenue</div>
                  <div class="text-2xl font-bold">\${{ course.revenue || 0 | number }}</div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
              <div class="p-6 border-b border-border">
                <h3 class="text-lg font-bold">Curriculum Modules</h3>
              </div>
              <div>
                @if (course.curriculum && course.curriculum.length > 0) {
                  @for (module of course.curriculum; track module.id; let i = $index) {
                    <div class="p-4 border-b border-border last:border-0 flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <div class="flex items-center gap-4">
                        <div class="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                          {{ i + 1 }}
                        </div>
                        <div>
                          <h4 class="font-medium text-foreground">{{ module.title }}</h4>
                          <p class="text-xs text-muted-foreground">{{ module.type }} • {{ module.duration }}</p>
                        </div>
                      </div>
                      <div>
                        @if (module.status === 'completed') {
                          <mat-icon class="text-green-500">check_circle</mat-icon>
                        } @else if (module.status === 'active') {
                          <mat-icon class="text-primary">play_circle_outline</mat-icon>
                        } @else {
                          <mat-icon class="text-muted-foreground">lock</mat-icon>
                        }
                      </div>
                    </div>
                  }
                } @else {
                  <div class="p-8 text-center text-muted-foreground">
                    No curriculum modules have been added yet.
                  </div>
                }
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="bg-white rounded-xl border border-border p-6 shadow-sm">
              <h3 class="text-lg font-bold mb-4">Instructor Profile</h3>
              <div class="flex items-center gap-4 mb-4">
                <div class="w-16 h-16 rounded-full bg-slate-200 overflow-hidden shrink-0">
                  <img src="https://i.pravatar.cc/150?u={{course.instructor.id}}" alt="" class="w-full h-full object-cover">
                </div>
                <div>
                  <h4 class="font-bold">{{ course.instructor.name }}</h4>
                  <p class="text-sm text-muted-foreground">{{ course.instructor.role }}</p>
                </div>
              </div>
              @if (course.instructor.bio) {
                <p class="text-sm text-muted-foreground leading-relaxed">
                  {{ course.instructor.bio }}
                </p>
              }
              <button class="w-full mt-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors">
                View Full Profile
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class CourseDetailsComponent implements OnInit {
  store = inject(CourseStore);
  route = inject(ActivatedRoute);
  authStore = inject(AuthStore);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  dialog = inject(MatDialog);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.store.loadCourseById(id);
      }
    });
  }

  canManageCourses(): boolean {
    return this.authStore.hasRole(['employer', 'master']);
  }

  openEditModal(course: any) {
    this.dialog.open(CourseEditModalComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: course
    });
  }

  toggleFavorite() {
    if (!this.authStore.isAuthenticated()) {
      this.snackBar.open('Please login to save courses to your favorites.', 'Login', { duration: 5000 }).onAction().subscribe(() => {
        this.router.navigate(['/login']);
      });
      return;
    }
    const course = this.store.selectedCourse();
    if (course) {
      this.store.toggleFavorite(course.id);
    }
  }
}
