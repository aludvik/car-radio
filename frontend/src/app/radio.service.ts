import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RadioService {

  private apiUrl = 'api';

  constructor(private http: HttpClient) { }

  tune(name: string, freq: string, url: string) {
    return this.http.post(
      `${this.apiUrl}/tune`,
      {'name': name, 'freq': freq, 'url': url},
      {'headers': {'Content-Type': 'application/json'}}
    );
  }
}
