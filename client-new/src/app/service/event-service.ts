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

  fetchSingleEvent(id: number): Observable<any[]> {
    return this.httpClient.get<any[]>(this.API_URL + '/' + id)
  }

  addEvent(event: any): Observable<any> {
    return this.httpClient.post(this.API_URL, event);
  }

  updateEvent(id: number, event: any): Observable<any> {
    return this.httpClient.put(this.API_URL + '/' + id, event);
  }

  deleteEvent(id: number): Observable<any> {
    return this.httpClient.delete(this.API_URL + '/' + id);
  }
}
