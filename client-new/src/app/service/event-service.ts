import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  // defined API URL
  API_URL = 'http://localhost:3000/api/events';

  constructor(private httpClient: HttpClient) {
  }

  fetchEvents(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.API_URL)
  }
}
