import { Component } from '@angular/core';
import { RadioService } from '../radio.service';

@Component({
  selector: 'app-station-tuner',
  templateUrl: './station-tuner.component.html',
  styleUrls: ['./station-tuner.component.css']
})
export class StationTunerComponent {

  name: string = "";
  freq: string = "";
  url: string = "";

  constructor(private radio: RadioService) { }

  onSubmit() {
    console.log(`Submit ${this.name} ${this.freq} ${this.url}`);
    this.radio.tune(this.name, this.freq, this.url).subscribe(result => console.log(result));
    this.name = "";
    this.freq = "";
    this.url = "";
  }

}
