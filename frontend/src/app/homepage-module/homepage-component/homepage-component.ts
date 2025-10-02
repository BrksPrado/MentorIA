import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-homepage-component',
  standalone: false,
  templateUrl: './homepage-component.html',
  styleUrls: ['./homepage-component.css']
})
export class HomepageComponent {
  activeSubmenu: string | null = null;

  constructor(private authService: AuthService) {}

  toggleSubmenu(key: string) {
    this.activeSubmenu = this.activeSubmenu === key ? null : key;
  }

  isSubmenuOpen(key: string) {
    return this.activeSubmenu === key;
  }

  logout() {
    this.authService.logout();
  }
}