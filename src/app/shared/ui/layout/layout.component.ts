import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatSidenavModule, SidebarComponent, HeaderComponent],
  template: `
    <mat-sidenav-container class="h-screen bg-background" [hasBackdrop]="false">
      <mat-sidenav #sidenav [mode]="'side'" [opened]="isSidebarOpen()" class="w-64 border-r border-border bg-white shadow-none">
        <app-sidebar></app-sidebar>
      </mat-sidenav>
      
      <mat-sidenav-content class="flex flex-col h-screen overflow-hidden bg-background">
        <app-header (toggleSidebar)="toggleSidebar()"></app-header>
        <main class="flex-1 overflow-y-auto p-8">
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    mat-sidenav-container {
      background-color: hsl(var(--background));
    }
    mat-sidenav {
      border-right: 1px solid hsl(var(--border));
    }
  `]
})
export class LayoutComponent {
  isSidebarOpen = signal(true);

  toggleSidebar() {
    this.isSidebarOpen.update(val => !val);
  }
}
