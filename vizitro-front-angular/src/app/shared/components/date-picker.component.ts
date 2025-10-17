import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <select 
      (change)="onRangeChange($event)"
      class="bg-secondary border border-default rounded-lg px-4 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
    >
      <option value="today">Today</option>
      <option value="7d" selected>Last 7 days</option>
      <option value="30d">Last 30 days</option>
      <option value="90d">Last 90 days</option>
    </select>
  `
})
export class DatePickerComponent {
  @Output() rangeChange = new EventEmitter<{ start: string; end: string }>();

  onRangeChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    const end = new Date().toISOString();
    let start = new Date();

    switch(value) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        break;
      case '7d':
        start.setDate(start.getDate() - 7);
        break;
      case '30d':
        start.setDate(start.getDate() - 30);
        break;
      case '90d':
        start.setDate(start.getDate() - 90);
        break;
    }

    this.rangeChange.emit({ start: start.toISOString(), end });
  }
}