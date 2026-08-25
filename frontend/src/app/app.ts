import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChatbotComponent } from './components/chatbot';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, ChatbotComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');
  
  // UI Signals
  isSidebarCollapsed = signal(false);
  isAvatarDropdownOpen = signal(false);
  isNotificationsOpen = signal(false);

  toggleSidebar() {
    this.isSidebarCollapsed.update(val => !val);
  }

  toggleAvatarDropdown() {
    this.isAvatarDropdownOpen.update(val => !val);
    if (this.isAvatarDropdownOpen()) {
      this.isNotificationsOpen.set(false);
    }
  }

  toggleNotifications() {
    this.isNotificationsOpen.update(val => !val);
    if (this.isNotificationsOpen()) {
      this.isAvatarDropdownOpen.set(false);
    }
  }

  closeDropdowns() {
    this.isAvatarDropdownOpen.set(false);
    this.isNotificationsOpen.set(false);
  }
}
