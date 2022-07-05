import { Component } from '@angular/core';
import { RadioService } from '../radio.service';
import { Station } from '../station';

@Component({
  selector: 'app-station-tuner',
  templateUrl: './station-tuner.component.html',
  styleUrls: ['./station-tuner.component.css']
})
export class StationTunerComponent {

  station: Station = {
    name: "",
    freq: "",
    url: ""
  };

  constructor(private radio: RadioService) { }

  onSubmit() {
    console.log(`Submit ${this.station.name} ${this.station.freq} ${this.station.url}`);
    this.radio.tune(this.station).subscribe(result => console.log(result));
    this.station = {
      name: "",
      freq: "",
      url: ""
    };
  }

}
