import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CourseStore } from '../../store/course.store';
import { CourseService } from '../../core/services/course.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatIconModule],
  template: `
    <div class="max-w-4xl mx-auto h-full flex flex-col">
      <div class="mb-8">
        <div class="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <a routerLink="/courses" class="hover:text-foreground transition-colors">Courses</a>
          <mat-icon style="font-size: 16px; width: 16px; height: 16px;">chevron_right</mat-icon>
          <span class="text-foreground font-medium">{{ isEditMode ? 'Edit Course' : 'New Course' }}</span>
        </div>
        
        <div class="flex items-center gap-8 border-b border-border pb-4 overflow-x-auto whitespace-nowrap">
          <div class="flex items-center gap-3 shrink-0">
            <div class="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
              1
            </div>
            <span class="font-bold text-primary">Course Identification</span>
          </div>
          <div class="h-px bg-border w-8 md:w-16 shrink-0"></div>
          <div class="flex items-center gap-3 opacity-50 shrink-0">
            <div class="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold text-sm">
              2
            </div>
            <span class="font-medium text-muted-foreground">Curriculum</span>
          </div>
          <div class="h-px bg-border w-8 md:w-16 shrink-0"></div>
          <div class="flex items-center gap-3 opacity-50 shrink-0">
            <div class="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold text-sm">
              3
            </div>
            <span class="font-medium text-muted-foreground">Settings</span>
          </div>
        </div>
      </div>

      <div class="bg-white border border-border rounded-xl shadow-sm flex-1 mb-8 p-4 md:p-8 relative">
        <div class="mb-8">
          <h2 class="text-2xl font-bold mb-2">General Information</h2>
          <p class="text-muted-foreground text-sm md:text-base">Define the core identity of your executive training module. These details will be visible to students in the catalog.</p>
        </div>

        <form [formGroup]="courseForm" (ngSubmit)="onSubmit()" class="space-y-6">
          
          <div>
            <label class="block text-sm font-bold text-foreground mb-2">Course Name</label>
            <input type="text" formControlName="title" 
                   placeholder="e.g. Advanced Strategic Leadership for Global Markets"
                   class="w-full px-4 py-2.5 rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
            @if (courseForm.get('title')?.touched && courseForm.get('title')?.invalid) {
              <p class="text-xs text-destructive mt-1">Course name is required.</p>
            }
            <p class="text-xs text-muted-foreground mt-2">Limit of 100 characters. Use professional, descriptive titles.</p>
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
            <textarea formControlName="description" rows="5"
                      placeholder="Provide a detailed overview of the learning objectives and the value proposition..."
                      class="w-full px-4 py-3 rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"></textarea>
            <p class="text-xs text-muted-foreground mt-2">Summarize the curriculum and key takeaways.</p>
          </div>

          <div>
            <label class="block text-sm font-bold text-foreground mb-2">Featured Cover Image</label>
            
            <input type="file" id="coverImage" accept="image/*" class="hidden" (change)="onFileSelected($event)">
            
            <label for="coverImage" class="border-2 border-dashed border-border rounded-lg p-6 md:p-10 flex flex-col items-center justify-center text-center hover:bg-muted/30 transition-colors cursor-pointer group relative overflow-hidden h-64">
              @if (previewImage) {
                <img [src]="previewImage" class="absolute inset-0 w-full h-full object-cover" alt="Preview">
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span class="text-white font-medium flex items-center gap-2">
                    <mat-icon>change_circle</mat-icon> Change Image
                  </span>
                </div>
              } @else {
                <div class="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <mat-icon class="text-muted-foreground">cloud_upload</mat-icon>
                </div>
                <p class="font-bold text-primary mb-1">Click to upload or drag and drop</p>
                <p class="text-xs text-muted-foreground">SVG, PNG, JPG or WebP (max. 1600x900px, 5MB)</p>
              }
            </label>
            @if (previewImage) {
              <div class="mt-2 text-right">
                <button type="button" (click)="previewImage = null" class="text-xs text-destructive hover:underline">Remove image</button>
              </div>
            }
          </div>
          
          <div class="pt-6 border-t border-border flex flex-col-reverse md:flex-row justify-end gap-3 md:gap-4 mt-8">
            <button type="button" routerLink="/courses" class="w-full md:w-auto px-6 py-2.5 border border-border rounded-md font-medium hover:bg-muted transition-colors">
              Cancel
            </button>
            <button type="submit" [disabled]="courseForm.invalid || isSubmitting" class="w-full md:w-auto px-6 py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              @if (isSubmitting) {
                <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              } @else {
                <span>{{ isEditMode ? 'Save Changes' : 'Create Course' }}</span>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CourseFormComponent implements OnInit {
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  store = inject(CourseStore);
  courseService = inject(CourseService);
  notificationService = inject(NotificationService);

  courseForm!: FormGroup;
  isEditMode = false;
  courseId: string | null = null;
  isSubmitting = false;
  previewImage: string | null = null;

  ngOnInit() {
    this.initForm();
    
    this.route.paramMap.subscribe(params => {
      this.courseId = params.get('id');
      if (this.courseId) {
        this.isEditMode = true;
        this.store.loadCourseById(this.courseId);
        setTimeout(() => {
          const course = this.store.selectedCourse();
          if (course) {
            this.courseForm.patchValue({
              title: course.title,
              category: course.category,
              level: course.level,
              description: course.description
            });
            if (course.coverImageUrl) {
              this.previewImage = course.coverImageUrl;
            }
          }
        }, 100);
      }
    });
  }

  initForm() {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      category: ['Leadership', Validators.required],
      level: ['Managerial', Validators.required],
      description: ['', Validators.required],
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.courseForm.invalid) return;

    this.isSubmitting = true;
    const formValue = this.courseForm.value;
    const payload = { ...formValue };
    if (this.previewImage) {
      payload.coverImageUrl = this.previewImage;
    }

    if (this.isEditMode && this.courseId) {
      this.courseService.updateCourse(this.courseId, payload).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.notificationService.broadcast('COURSE_UPDATED', 'Course Updated', `The course "${payload.title}" was updated.`);
          this.store.loadCourses(); // Refresh
          this.router.navigate(['/courses', this.courseId]);
        },
        error: () => this.isSubmitting = false
      });
    } else {
      const newCourse: any = {
        ...payload,
        status: 'Draft',
        duration: 'TBD',
        hours: 0,
        studentsCount: 0,
        instructor: { id: 'tbd', name: 'To be assigned', role: 'Faculty' },
      };

      this.courseService.addCourse(newCourse).subscribe({
        next: (course) => {
          this.isSubmitting = false;
          this.notificationService.broadcast('COURSE_CREATED', 'New Course Added', `The course "${newCourse.title}" was successfully created.`);
          this.store.loadCourses();
          this.router.navigate(['/courses']);
        },
        error: () => this.isSubmitting = false
      });
    }
  }
}
