import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50" (click)="close()"></div>
        <div class="relative bg-secondary rounded-lg p-6 max-w-md w-full mx-4 border border-default">
          <ng-content></ng-content>
        </div>
      </div>
    }
  `
})
export class ModalComponent {
  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();

  close() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }
}