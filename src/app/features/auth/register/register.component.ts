import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '../../../store/auth.store';
import { User, Role } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-muted/30 py-12">
      <div class="bg-white p-8 rounded-xl shadow-sm border border-border w-full max-w-md">
        <div class="text-center mb-8">
          <div class="w-12 h-12 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold text-2xl mx-auto mb-4">
            P
          </div>
          <h1 class="text-2xl font-bold text-foreground">Create an Account</h1>
          <p class="text-muted-foreground mt-2">Join PiCourses as a candidate or employer</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Full Name</label>
            <input type="text" formControlName="name" class="w-full px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Email Address</label>
            <input type="email" formControlName="email" class="w-full px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Password</label>
            <input type="password" formControlName="password" class="w-full px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-2">I am joining as a:</label>
            <div class="grid grid-cols-2 gap-4">
              <label class="border border-border rounded-lg p-4 cursor-pointer flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors"
                     [class.border-primary]="registerForm.get('role')?.value === 'user'"
                     [class.bg-primary/5]="registerForm.get('role')?.value === 'user'">
                <input type="radio" formControlName="role" value="user" class="sr-only">
                <span class="font-bold">Candidate</span>
                <span class="text-xs text-muted-foreground mt-1">Looking for courses</span>
              </label>
              
              <label class="border border-border rounded-lg p-4 cursor-pointer flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors"
                     [class.border-primary]="registerForm.get('role')?.value === 'employer'"
                     [class.bg-primary/5]="registerForm.get('role')?.value === 'employer'">
                <input type="radio" formControlName="role" value="employer" class="sr-only">
                <span class="font-bold">Employer</span>
                <span class="text-xs text-muted-foreground mt-1">Managing courses</span>
              </label>
            </div>
          </div>

          <button type="submit" [disabled]="registerForm.invalid" class="w-full py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 mt-6">
            Register
          </button>
        </form>

        <p class="text-center text-sm text-muted-foreground mt-6">
          Already have an account? <a routerLink="/login" class="text-primary font-medium hover:underline">Sign In</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  authStore = inject(AuthStore);

  registerForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['user', Validators.required]
  });

  onSubmit() {
    if (this.registerForm.valid) {
      const { name, email, role } = this.registerForm.value;
      const finalRole = email === 'master@picourses.com' ? 'master' : role;
      
      const user: User = {
        id: Math.random().toString(36).substring(7),
        email,
        name,
        role: finalRole as Role
      };

      this.authStore.login(user);
    }
  }
}
