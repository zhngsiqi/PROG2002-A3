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

  // get all events
  fetchEvents(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.API_URL)
  }

  // search events
  searchEvents(date: string, location: string, category: string): Observable<any[]> {
    const params: any = {}

    // If the search input box is filled in, the corresponding parameters should be concatenated in the URL
    if (date) {
      params['date'] = date
    }
    if (location) {
      params['location'] = location
    }
    if (category) {
      params['category'] = category
    }

    return this.httpClient.get<any[]>(this.API_URL + '/search', { params })
  }

  // get single event
  fetchSingleEvent(id: number): Observable<any[]> {
    return this.httpClient.get<any[]>(this.API_URL + '/' + id)
  }

  // add event
  addEvent(event: any): Observable<any> {
    return this.httpClient.post(this.API_URL, event);
  }

  // update event
  updateEvent(id: number, event: any): Observable<any> {
    return this.httpClient.put(this.API_URL + '/' + id, event);
  }

  // delete event
  deleteEvent(id: number): Observable<any> {
    return this.httpClient.delete(this.API_URL + '/' + id);
  }
}
