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

  constructor(private authService: AuthService,
    private router: Router  
  ) {}

  toggleSubmenu(key: string) {
    this.activeSubmenu = this.activeSubmenu === key ? null : key;
  }

  isSubmenuOpen(key: string) {
    return this.activeSubmenu === key;
  }

  logout() {
    this.authService.logout();
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }
}
