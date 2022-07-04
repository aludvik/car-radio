import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-preset-button',
  templateUrl: './preset-button.component.html',
  styleUrls: ['./preset-button.component.css']
})
export class PresetButtonComponent {

  @Input() preset?: string;
  timeoutId: number = 0;

  constructor() { }

  onMouseDown() {
    this.timeoutId = window.setTimeout(() => {
      this.longPress();
      this.timeoutId = 0;
    }, 1000);
  }

  onMouseUp() {
    if (this.timeoutId === 0) {
      return; // long press fired, do nothing
    }
    // short press firing, prevent long press
    window.clearTimeout(this.timeoutId);
    this.shortPress();
  }

  shortPress() {
    console.log(`Preset ${this.preset} short press`);
  }

  longPress() {
    console.log(`Preset ${this.preset} long press`);
  }
}
