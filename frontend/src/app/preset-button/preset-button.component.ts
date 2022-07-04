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
    this.timeoutId = window.setTimeout(() => {this.setPreset()}, 1000);
  }

  onMouseUp() {
    if (this.timeoutId === 0) { // long press, do nothing
      return;
    } else { // short press
      window.clearTimeout(this.timeoutId);
      console.log(`Preset ${this.preset} short press`);
    }
  }

  setPreset() {
    console.log(`Preset ${this.preset} long press`);
    this.timeoutId = 0;
  }
}
