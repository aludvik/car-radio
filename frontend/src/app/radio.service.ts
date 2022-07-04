import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RadioService {

  private apiUrl = 'api';

  constructor(private http: HttpClient) { }

  post(path: string, body?: object) {
    return this.http.post(
      `${this.apiUrl}/${path}`,
      body,
      {'headers': {'Content-Type': 'application/json'}}
    );
  }

  togglePower() {
    return this.post('power', {});
  }

  tune(name: string, freq: string, url: string) {
    return this.post('tune', {'name': name, 'freq': freq, 'url': url});
  }
}
