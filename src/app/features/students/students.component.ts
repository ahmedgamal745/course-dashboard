import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStore } from '../../store/auth.store';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User, Role } from '../../core/models/user.model';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, MatIconModule, ReactiveFormsModule, MatSnackBarModule],
  template: `
    <div class="h-full flex flex-col max-w-6xl mx-auto w-full">
      <div class="mb-8 flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-foreground">User Management</h1>
          <p class="text-muted-foreground mt-1">Manage students and administrative roles across the platform.</p>
        </div>
        
        @if (authStore.user()?.role === 'master') {
          <button (click)="isAddingEmployer = !isAddingEmployer" class="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
            <mat-icon style="font-size: 18px; width: 18px; height: 18px;">{{ isAddingEmployer ? 'close' : 'person_add' }}</mat-icon>
            {{ isAddingEmployer ? 'Cancel' : 'Add Employer' }}
          </button>
        }
      </div>

      @if (isAddingEmployer) {
        <div class="bg-white p-6 rounded-xl border border-border shadow-sm mb-8 animate-in slide-in-from-top-4">
          <h2 class="text-lg font-bold mb-4">Add New Employer</h2>
          <form [formGroup]="employerForm" (ngSubmit)="onAddEmployer()" class="flex gap-4 items-end">
            <div class="flex-1">
              <label class="block text-sm font-medium text-foreground mb-1">Full Name</label>
              <input type="text" formControlName="name" class="w-full px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-foreground mb-1">Email Address</label>
              <input type="email" formControlName="email" class="w-full px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
            </div>
            <button type="submit" [disabled]="employerForm.invalid" class="px-6 py-2.5 bg-slate-900 text-white rounded-md font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 h-[42px]">
              Create Account
            </button>
          </form>
        </div>
      }

      <div class="bg-white rounded-xl border border-border shadow-sm overflow-hidden flex-1">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-muted-foreground uppercase bg-slate-50 border-b border-border">
            <tr>
              <th scope="col" class="px-6 py-4 font-medium">User</th>
              <th scope="col" class="px-6 py-4 font-medium">Role</th>
              <th scope="col" class="px-6 py-4 font-medium">Joined</th>
              <th scope="col" class="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (user of users; track user.id) {
              <tr class="border-b border-border hover:bg-slate-50/50 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {{ user.name.charAt(0) }}
                    </div>
                    <div>
                      <div class="font-medium text-foreground">{{ user.name }}</div>
                      <div class="text-muted-foreground">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full"
                        [class.bg-purple-100]="user.role === 'master'" [class.text-purple-700]="user.role === 'master'"
                        [class.bg-blue-100]="user.role === 'employer'" [class.text-blue-700]="user.role === 'employer'"
                        [class.bg-slate-100]="user.role === 'user'" [class.text-slate-700]="user.role === 'user'">
                    {{ user.role === 'user' ? 'Candidate' : user.role }}
                  </span>
                </td>
                <td class="px-6 py-4 text-muted-foreground">
                  Oct 12, 2023
                </td>
                <td class="px-6 py-4 text-right">
                  @if (authStore.user()?.role === 'master' && user.role !== 'master') {
                    <button (click)="deleteUser(user.id)" class="text-muted-foreground hover:text-destructive transition-colors p-1" title="Delete User">
                      <mat-icon style="font-size: 18px; width: 18px; height: 18px;">delete</mat-icon>
                    </button>
                  } @else {
                    <span class="text-muted-foreground text-xs italic">No actions</span>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class StudentsComponent {
  authStore = inject(AuthStore);
  fb = inject(FormBuilder);
  snackBar = inject(MatSnackBar);

  isAddingEmployer = false;

  employerForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  // Mock users list
  users: User[] = [
    { id: '1', name: 'Master Admin', email: 'master@picourses.com', role: 'master' },
    { id: '2', name: 'John Employer', email: 'admin@picourses.com', role: 'employer' },
    { id: '3', name: 'Sarah Student', email: 'user@picourses.com', role: 'user' },
    { id: '4', name: 'David Candidate', email: 'david@example.com', role: 'user' },
    { id: '5', name: 'Emma Learner', email: 'emma@example.com', role: 'user' }
  ];

  onAddEmployer() {
    if (this.employerForm.valid) {
      const newUser: User = {
        id: Math.random().toString(36).substring(7),
        name: this.employerForm.value.name,
        email: this.employerForm.value.email,
        role: 'employer'
      };
      this.users = [newUser, ...this.users];
      this.employerForm.reset();
      this.isAddingEmployer = false;
      this.snackBar.open('Employer account created successfully', 'Close', { duration: 3000 });
    }
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.users = this.users.filter(u => u.id !== id);
      this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
    }
  }
}
