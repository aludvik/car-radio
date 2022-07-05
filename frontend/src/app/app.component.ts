import { Component } from '@angular/core';
import { RadioService } from './radio.service';
import { Station } from './station';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'car-radio';
  drawerVisible: boolean = false;
  presetStation: Station = {name: '', freq: '', url: ''};
  constructor(private radio: RadioService) {}

  onPowerClick() {
    console.log("toggle power");
    this.radio.togglePower().subscribe(result => console.log(result));
  }

  onTunerClick() {
    console.log(`toggle tuner from ${this.drawerVisible}`);
    this.drawerVisible = !this.drawerVisible;
  }

  tunePreset(idx: number) {
    this.radio.tunePreset(idx).subscribe(result => {
      console.log(result);
      if (result.valid || false) {
        this.presetStation = result.station || {name: '', freq: '', url: ''};
      }
    });
  }

  setPreset(idx: number) {
    // TODO: Log station preset saved
    this.radio.setPreset(idx).subscribe(result => console.log(result));
  }
}
