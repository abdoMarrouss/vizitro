import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  selectedCategory: string = 'buttons';
  copiedCode: string = '';

  categories = [
    { id: 'buttons', name: 'Buttons', icon: '🔘' },
    { id: 'cards', name: 'Cards', icon: '🃏' },
    { id: 'forms', name: 'Forms', icon: '📝' },
    { id: 'alerts', name: 'Alerts', icon: '⚠️' },
    { id: 'badges', name: 'Badges', icon: '🏷️' },
    { id: 'navigation', name: 'Navigation', icon: '🧭' }
  ];

  selectCategory(categoryId: string) {
    this.selectedCategory = categoryId;
  }

  copyCode(code: string) {
    navigator.clipboard.writeText(code);
    this.copiedCode = code;
    setTimeout(() => {
      this.copiedCode = '';
    }, 2000);
  }
}