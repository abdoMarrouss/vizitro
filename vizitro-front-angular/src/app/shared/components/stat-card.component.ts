import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberFormatPipe } from '../pipes';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, NumberFormatPipe],
  template: `
    <div class="bg-secondary rounded-lg p-6 border border-default">
      <p class="text-secondary text-sm mb-1">{{ label }}</p>
      <p class="text-primary text-3xl font-bold">{{ value | numberFormat }}</p>
      @if (change !== undefined) {
        <p class="text-sm mt-2" [class.text-emerald-500]="change >= 0" [class.text-red-500]="change < 0">
          {{ change >= 0 ? '+' : '' }}{{ change }}%
        </p>
      }
    </div>
  `
})
export class StatCardComponent {
  @Input() label!: string;
  @Input() value!: number;
  @Input() change?: number;
}