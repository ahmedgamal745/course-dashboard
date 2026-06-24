import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '../../../store/auth.store';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-muted/30">
      <div class="bg-white p-8 rounded-xl shadow-sm border border-border w-full max-w-md">
        <div class="text-center mb-8">
          <div class="w-12 h-12 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold text-2xl mx-auto mb-4">
            P
          </div>
          <h1 class="text-2xl font-bold text-foreground">Welcome Back to PiCourses</h1>
          <p class="text-muted-foreground mt-2">Sign in to your account</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Email Address</label>
            <input type="email" formControlName="email" class="w-full px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Password</label>
            <input type="password" formControlName="password" class="w-full px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
          </div>

          <button type="submit" [disabled]="loginForm.invalid" class="w-full py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 mt-6">
            Sign In
          </button>
        </form>

        <p class="text-center text-sm text-muted-foreground mt-6">
          Don't have an account? <a routerLink="/register" class="text-primary font-medium hover:underline">Register</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authStore = inject(AuthStore);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      let role: 'user' | 'employer' | 'master' = 'user';
      
      if (email === 'master@picourses.com') role = 'master';
      else if (email === 'admin@picourses.com') role = 'employer';

      const user: User = {
        id: Math.random().toString(36).substring(7),
        email,
        name: email.split('@')[0],
        role
      };

      this.authStore.login(user);
    }
  }
}
