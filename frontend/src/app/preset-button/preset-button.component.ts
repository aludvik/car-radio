import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RadioService } from '../radio.service';

@Component({
  selector: 'app-preset-button',
  templateUrl: './preset-button.component.html',
  styleUrls: ['./preset-button.component.css']
})
export class PresetButtonComponent {

  @Input() preset: string = "";
  @Output() clickShort = new EventEmitter<number>();
  @Output() clickLong = new EventEmitter<number>();
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
    this.clickShort.emit(Number(this.preset));
  }

  longPress() {
    console.log(`Preset ${this.preset} long press`);
    this.clickLong.emit(Number(this.preset));
  }
}
