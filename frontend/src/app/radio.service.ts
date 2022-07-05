import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Station } from './station';
import { Status } from './status';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RadioService {

  private apiUrl = 'api';

  constructor(private http: HttpClient) { }

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(
      `${this.apiUrl}/${path}`,
      {'headers': {'Content-Type': 'application/json'}}
    );
  }

  post<T>(path: string, body?: object): Observable<T> {
    return this.http.post<T>(
      `${this.apiUrl}/${path}`,
      body,
      {'headers': {'Content-Type': 'application/json'}}
    );
  }

  togglePower(): Observable<Object> {
    return this.post('power', {});
  }

  tune(station: Station): Observable<Object> {
    return this.post('tune', station);
  }

  status(): Observable<Status> {
    return this.get<Status>('status');
  }
}
