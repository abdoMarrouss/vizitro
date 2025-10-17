import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-copy-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      (click)="copy()" 
      class="px-3 py-1 text-sm bg-tertiary hover:bg-primary-500 text-primary rounded transition-colors"
    >
      {{ copied ? 'Copied!' : 'Copy' }}
    </button>
  `
})
export class CopyButtonComponent {
  @Input() text!: string;
  copied = false;

  copy() {
    navigator.clipboard.writeText(this.text);
    this.copied = true;
    setTimeout(() => this.copied = false, 2000);
  }
}