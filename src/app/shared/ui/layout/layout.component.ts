import { Component, inject, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatSidenavModule, SidebarComponent, HeaderComponent],
  template: `
    <mat-sidenav-container class="h-screen bg-background" [hasBackdrop]="isMobile()">
      <mat-sidenav #sidenav [mode]="isMobile() ? 'over' : 'side'" [opened]="!isMobile() && isSidebarOpen()" class="w-64 border-r border-border bg-white shadow-none">
        <app-sidebar (linkClicked)="onSidebarLinkClicked()"></app-sidebar>
      </mat-sidenav>
      
      <mat-sidenav-content class="flex flex-col h-screen overflow-hidden bg-background">
        <app-header (toggleSidebar)="toggleSidebar()"></app-header>
        <main class="flex-1 overflow-y-auto p-4 md:p-8">
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
  isMobile = signal(false);
  breakpointObserver = inject(BreakpointObserver);
  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor() {
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.TabletPortrait]).subscribe(result => {
      this.isMobile.set(result.matches);
      if (!result.matches) {
         this.isSidebarOpen.set(true);
      }
    });
  }

  toggleSidebar() {
    if (this.isMobile()) {
      this.sidenav.toggle();
    } else {
      this.isSidebarOpen.update(val => !val);
    }
  }

  onSidebarLinkClicked() {
    if (this.isMobile()) {
      this.sidenav.close();
    }
  }
}
