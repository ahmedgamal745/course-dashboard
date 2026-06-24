import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CourseStore } from '../../store/course.store';
import { CourseStatus } from '../../core/models/course.model';
import { AuthStore } from '../../store/auth.store';
import { CourseEditModalComponent } from '../course-edit-modal/course-edit-modal.component';

@Component({
  selector: 'app-courses-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatPaginatorModule, MatSnackBarModule, MatDialogModule],
  template: `
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground mb-2">Course Management</h1>
        <p class="text-muted-foreground text-sm">Oversee high-performance learning paths and student engagement analytics.</p>
      </div>
      @if (canManageCourses()) {
        <a routerLink="new" class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2">
          <mat-icon class="w-4 h-4" style="font-size: 16px; width: 16px; height: 16px;">add</mat-icon>
          Add Course
        </a>
      }
    </div>

    <div class="bg-white rounded-xl border border-border shadow-sm mb-6">
      <div class="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-4 flex-wrap">
          <span class="text-sm font-medium text-muted-foreground ml-2">FILTERS</span>
          <div class="hidden md:block h-6 w-px bg-border mx-2"></div>
          <div class="flex gap-2 flex-wrap">
            @for (status of statuses; track status) {
              <button 
                (click)="updateStatusFilter(status)"
                [class.bg-primary]="store.filter().status === status"
                [class.text-primary-foreground]="store.filter().status === status"
                [class.bg-muted]="store.filter().status !== status"
                [class.text-muted-foreground]="store.filter().status !== status"
                class="px-4 py-1.5 rounded-full text-xs font-medium transition-colors hover:opacity-80">
                {{ status }}
              </button>
            }
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <span class="text-sm text-muted-foreground">Sort by:</span>
          <select (change)="onSortChange($event)" [value]="store.filter().sort" class="bg-muted border border-border rounded-md px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary cursor-pointer">
            <option value="recent">Most Recent</option>
            <option value="enrollment">Highest Enrollment</option>
          </select>
        </div>
      </div>

      <div class="p-6">
        @if (store.isLoading()) {
          <div class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        } @else if (pagedCourses.length === 0) {
          <div class="text-center py-12 text-muted-foreground">
            No courses found matching your criteria.
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (course of pagedCourses; track course.id) {
              <div class="border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white flex flex-col group relative">
                
                <!-- Action overlay -->
                <div class="absolute top-4 right-4 z-10 flex gap-2">
                  <button (click)="toggleFavorite(course.id, $event)" class="w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center hover:bg-white transition-colors">
                    <mat-icon [class.text-red-500]="course.isFavorite" [class.text-muted-foreground]="!course.isFavorite" style="font-size: 18px; width: 18px; height: 18px;">
                      {{ course.isFavorite ? 'favorite' : 'favorite_border' }}
                    </mat-icon>
                  </button>
                </div>

                <div class="h-40 bg-muted relative border-b border-border overflow-hidden">
                  <div class="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-100 group-hover:scale-105 transition-transform duration-500"></div>
                  <div class="absolute top-4 left-4">
                    <span 
                      [class.bg-green-100]="course.status === 'Active'"
                      [class.text-green-700]="course.status === 'Active'"
                      [class.bg-amber-100]="course.status === 'Draft'"
                      [class.text-amber-700]="course.status === 'Draft'"
                      [class.bg-slate-200]="course.status === 'Archived'"
                      [class.text-slate-700]="course.status === 'Archived'"
                      class="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                      {{ course.status }}
                    </span>
                  </div>
                </div>
                
                <div class="p-5 flex-1 flex flex-col">
                  <div class="text-xs font-medium text-primary mb-2 flex items-center gap-2">
                    {{ course.category }}
                    <span class="w-1 h-1 rounded-full bg-border"></span>
                    {{ course.level }}
                  </div>
                  
                  <div (click)="viewDetails(course.id)" class="cursor-pointer block group/link">
                    <h3 class="text-lg font-bold text-foreground mb-2 group-hover/link:text-primary transition-colors line-clamp-2">
                      {{ course.title }}
                    </h3>
                  </div>
                  
                  <div class="flex items-center gap-3 mt-auto pt-4 text-sm text-muted-foreground border-t border-border/50">
                    <div class="w-6 h-6 rounded-full bg-slate-200 overflow-hidden shrink-0">
                      <img src="https://i.pravatar.cc/150?u={{course.instructor.id}}" alt="" class="w-full h-full object-cover">
                    </div>
                    <span class="truncate">{{ course.instructor.name }}</span>
                  </div>
                </div>

                <div class="px-5 py-3 bg-muted/30 border-t border-border flex items-center justify-between text-sm">
                  <div class="flex items-center gap-1.5 font-medium">
                    <mat-icon class="text-muted-foreground" style="font-size: 16px; width: 16px; height: 16px;">people</mat-icon>
                    {{ course.studentsCount | number }}
                  </div>
                  <div class="flex gap-1">
                    <button (click)="viewDetails(course.id)" class="text-primary hover:bg-primary/10 transition-colors px-2 py-1.5 rounded-md font-medium text-xs flex items-center gap-1">
                      Details
                    </button>
                    @if (canManageCourses()) {
                      <button (click)="openEditModal(course, $event)" class="text-primary hover:bg-primary/10 transition-colors px-2 py-1.5 rounded-md font-medium text-xs flex items-center gap-1">
                        Edit
                      </button>
                      <button (click)="promptDelete(course, $event)" class="text-destructive hover:bg-destructive/10 transition-colors p-1.5 rounded-md" title="Delete Course">
                        <mat-icon style="font-size: 16px; width: 16px; height: 16px;">delete</mat-icon>
                      </button>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
          
          <mat-paginator [length]="store.filteredCourses().length"
                         [pageSize]="pageSize"
                         [pageSizeOptions]="[6, 12, 24]"
                         (page)="onPageChange($event)"
                         class="mt-6 border border-border rounded-xl bg-white"
                         aria-label="Select page">
          </mat-paginator>
        }
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div *ngIf="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-lg w-full max-w-[400px] p-6 text-center">
        <div class="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4">
          <mat-icon style="font-size: 24px; width: 24px; height: 24px;">warning</mat-icon>
        </div>
        <h2 class="text-xl font-bold mb-2">Confirm Deletion</h2>
        <p class="text-muted-foreground mb-4">
          Deletions are irreversible. Are you sure you want to delete <span class="font-bold">"{{ courseToDelete?.title }}"</span>?
        </p>
        <div class="flex gap-3">
          <button (click)="cancelDelete()" class="flex-1 py-2 border border-border rounded-md hover:bg-muted font-medium transition-colors">
            Cancel
          </button>
          <button (click)="confirmDelete()" class="flex-1 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  `,
})
export class CoursesListComponent implements OnInit {
  store = inject(CourseStore);
  authStore = inject(AuthStore);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  dialog = inject(MatDialog);
  
  statuses: (CourseStatus | 'All')[] = ['All', 'Active', 'Draft', 'Archived'];
  
  showDeleteModal = false;
  courseToDelete: any = null;

  pageSize = 6;
  pageIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.store.loadCourses();
  }

  canManageCourses(): boolean {
    return this.authStore.hasRole(['employer', 'master']);
  }

  viewDetails(courseId: string) {
    if (!this.authStore.isAuthenticated()) {
      this.snackBar.open('Please login to view course details.', 'Login', { duration: 5000 }).onAction().subscribe(() => {
        this.router.navigate(['/login']);
      });
      return;
    }
    this.router.navigate(['/courses', courseId]);
  }

  openEditModal(course: any, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.dialog.open(CourseEditModalComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: course
    });
  }

  get pagedCourses() {
    const allFiltered = this.store.filteredCourses();
    const start = this.pageIndex * this.pageSize;
    return allFiltered.slice(start, start + this.pageSize);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  updateStatusFilter(status: CourseStatus | 'All') {
    this.store.updateFilter({ status });
    this.resetPagination();
  }

  onSortChange(event: Event) {
    const sort = (event.target as HTMLSelectElement).value as any;
    this.store.updateFilter({ sort });
    this.resetPagination();
  }

  resetPagination() {
    this.pageIndex = 0;
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  toggleFavorite(id: string, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (!this.authStore.isAuthenticated()) {
      this.snackBar.open('Please login to save courses to your favorites.', 'Login', { duration: 5000 }).onAction().subscribe(() => {
        this.router.navigate(['/login']);
      });
      return;
    }
    this.store.toggleFavorite(id);
  }

  promptDelete(course: any, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.courseToDelete = course;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.courseToDelete = null;
  }

  confirmDelete() {
    if (this.courseToDelete) {
      this.store.deleteCourse(this.courseToDelete.id);
      this.showDeleteModal = false;
      this.courseToDelete = null;
    }
  }
}
