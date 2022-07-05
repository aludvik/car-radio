import { Component, OnInit } from '@angular/core';
import { RadioService } from '../radio.service';
import { Station } from '../station';
import { Status } from '../status';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {

  private off: Station = {
    name: '---',
    freq: '--.-',
    url: ''
  };

  private err: Station = {
    name: 'ERR',
    freq: 'EE.E',
    url: ''
  };

  station: Station = this.off;

  constructor(private radio: RadioService) { }

  ngOnInit(): void {
    this.getStatus();
    // TODO: Use a web socket
    setInterval(() => {
      this.getStatus();
    }, 1000);
  }

  getStatus(): void {
    this.radio.status().subscribe((status: Status) => {
      if (status.status === 'off' || status.status === 'no station') {
        this.station = this.off;
      } else if (status.status == 'playing') {
        this.station = status.station || this.off;
      } else {
        this.station = this.err;
        // TODO: Show error to user
        if (status.status == 'error') {
          console.log(`ERROR: ${status.msg}`);
        }
      }
    });
  }

}
