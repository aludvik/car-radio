import { Component } from '@angular/core';
import { RadioService } from './radio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'car-radio';
  drawerVisible: boolean = false;
  constructor(private radio: RadioService) {}

  onPowerClick() {
    console.log("toggle power");
    this.radio.togglePower().subscribe(result => console.log(result));
  }

  onTunerClick() {
    console.log(`toggle tuner from ${this.drawerVisible}`);
    this.drawerVisible = !this.drawerVisible;
  }
}
