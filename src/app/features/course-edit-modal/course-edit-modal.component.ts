import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CourseStore } from '../../store/course.store';
import { CourseService } from '../../core/services/course.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-course-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatDialogModule, MatSnackBarModule],
  template: `
    <div class="p-4 md:p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl md:text-2xl font-bold">Edit Course</h2>
        <button mat-dialog-close class="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground">
          <mat-icon style="font-size: 20px; width: 20px; height: 20px;">close</mat-icon>
        </button>
      </div>

      <form [formGroup]="courseForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <div>
          <label class="block text-sm font-bold text-foreground mb-2">Course Name</label>
          <input type="text" formControlName="title" 
                 class="w-full px-4 py-2.5 rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
          @if (courseForm.get('title')?.touched && courseForm.get('title')?.invalid) {
            <p class="text-xs text-destructive mt-1">Course name is required.</p>
          }
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-bold text-foreground mb-2">Category</label>
            <select formControlName="category" class="w-full px-4 py-2.5 rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white appearance-none">
              <option value="Leadership">Leadership</option>
              <option value="Strategic Planning">Strategic Planning</option>
              <option value="Corporate Finance">Corporate Finance</option>
              <option value="Data Analytics">Data Analytics</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold text-foreground mb-2">Executive Level</label>
            <select formControlName="level" class="w-full px-4 py-2.5 rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white appearance-none">
              <option value="Managerial">Managerial</option>
              <option value="Executive Tier 1">Executive Tier 1</option>
              <option value="Executive Tier 2">Executive Tier 2</option>
              <option value="C-Suite">C-Suite</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-bold text-foreground mb-2">Course Description</label>
          <textarea formControlName="description" rows="4"
                    class="w-full px-4 py-3 rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"></textarea>
        </div>

        <div class="pt-6 border-t border-border flex flex-col-reverse md:flex-row justify-end gap-3 mt-4">
          <button type="button" mat-dialog-close class="w-full md:w-auto px-5 py-2 border border-border rounded-md font-medium hover:bg-muted transition-colors">
            Cancel
          </button>
          <button type="submit" [disabled]="courseForm.invalid || isSubmitting" class="w-full md:w-auto px-5 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            @if (isSubmitting) {
              <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Saving...
            } @else {
              <span>Save Changes</span>
            }
          </button>
        </div>
      </form>
    </div>
  `
})
export class CourseEditModalComponent implements OnInit {
  fb = inject(FormBuilder);
  store = inject(CourseStore);
  courseService = inject(CourseService);
  dialogRef = inject(MatDialogRef<CourseEditModalComponent>);
  data = inject(MAT_DIALOG_DATA);
  snackBar = inject(MatSnackBar);
  notificationService = inject(NotificationService);

  courseForm!: FormGroup;
  isSubmitting = false;

  ngOnInit() {
    this.courseForm = this.fb.group({
      title: [this.data.title, Validators.required],
      category: [this.data.category, Validators.required],
      level: [this.data.level, Validators.required],
      description: [this.data.description, Validators.required],
    });
  }

  onSubmit() {
    if (this.courseForm.invalid) return;

    this.isSubmitting = true;
    const formValue = this.courseForm.value;

    this.courseService.updateCourse(this.data.id, formValue).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.store.loadCourses(); // Refresh list
        this.notificationService.broadcast('COURSE_UPDATED', 'Course Updated', `The course "${formValue.title}" was updated.`);
        this.snackBar.open('Course updated successfully', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: () => {
        this.isSubmitting = false;
        this.snackBar.open('Failed to update course', 'Close', { duration: 3000 });
      }
    });
  }
}
