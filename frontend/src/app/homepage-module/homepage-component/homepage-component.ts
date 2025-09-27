import { Component } from '@angular/core';

@Component({
  selector: 'app-homepage-component',
  standalone: false,
  templateUrl: './homepage-component.html',
  styleUrls: ['./homepage-component.css']
})
export class HomepageComponent {

  activeSubmenu: string | null = null;

  toggleSubmenu(key: string) {
    this.activeSubmenu = this.activeSubmenu === key ? null : key;
  }

  isSubmenuOpen(key: string) {
    return this.activeSubmenu === key;
  }
}
