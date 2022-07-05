import { Component, Input } from '@angular/core';
import { RadioService } from '../radio.service';

@Component({
  selector: 'app-preset-button',
  templateUrl: './preset-button.component.html',
  styleUrls: ['./preset-button.component.css']
})
export class PresetButtonComponent {

  @Input() preset: string = "";
  timeoutId: number = 0;

  constructor(private radio: RadioService) { }

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
    this.radio.tunePreset(Number(this.preset)).subscribe(result => console.log(result));
  }

  longPress() {
    console.log(`Preset ${this.preset} long press`);
    // TODO: Log station preset saved
    this.radio.setPreset(Number(this.preset)).subscribe(result => console.log(result));
  }
}
