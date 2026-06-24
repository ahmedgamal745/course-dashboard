import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/ui/layout/layout.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'courses', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard]
      },
      { 
        path: 'courses', 
        loadComponent: () => import('./features/courses-list/courses-list.component').then(m => m.CoursesListComponent) 
      },
      {
        path: 'courses/new',
        loadComponent: () => import('./features/course-form/course-form.component').then(m => m.CourseFormComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['employer', 'master'] }
      },
      {
        path: 'courses/:id',
        loadComponent: () => import('./features/course-details/course-details.component').then(m => m.CourseDetailsComponent)
      },
      {
        path: 'courses/:id/edit',
        loadComponent: () => import('./features/course-form/course-form.component').then(m => m.CourseFormComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['employer', 'master'] }
      },
      {
        path: 'students',
        loadComponent: () => import('./features/students/students.component').then(m => m.StudentsComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['employer', 'master'] }
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['employer', 'master'] }
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['employer', 'master'] }
      }
    ]
  }
];
