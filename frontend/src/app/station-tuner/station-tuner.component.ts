import { Component, Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { RadioService } from '../radio.service';
import { Station } from '../station';

@Component({
  selector: 'app-station-tuner',
  templateUrl: './station-tuner.component.html',
  styleUrls: ['./station-tuner.component.css'],
  animations: [
    trigger('openClose', [
      state('open', style({
        top: '0px',
      })),
      state('closed', style({
        top: '-120px',
      })),
      transition('open => closed', [
        animate('0.25s'),
      ]),
      transition('closed => open', [
        animate('0.25s'),
      ])
    ])
  ]
})
export class StationTunerComponent {

  station: Station = {
    name: "",
    freq: "",
    url: ""
  };
  @Input() visible: boolean = false;

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
