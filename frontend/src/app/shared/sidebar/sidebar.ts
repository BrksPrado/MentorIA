import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  activeSubmenu: string | null = null;
  isCollapsed: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Carrega o estado salvo do localStorage
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      this.isCollapsed = savedState === 'true';
    }
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;

    // Salva o estado no localStorage
    localStorage.setItem('sidebarCollapsed', this.isCollapsed.toString());

    // Fecha todos os submenus ao recolher
    if (this.isCollapsed) {
      this.activeSubmenu = null;
    }
  }

  toggleSubmenu(key: string): void {
    this.activeSubmenu = this.activeSubmenu === key ? null : key;
  }

  isSubmenuOpen(key: string): boolean {
    return this.activeSubmenu === key;
  }

  logout(): void {
    this.authService.logout();
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  navigateToSimulado(): void {
    this.router.navigate(['/enem']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/home/configuracao']);
  }

  navigateToGenerative(): void {
    this.router.navigate(['/generativa']);
  }
}
