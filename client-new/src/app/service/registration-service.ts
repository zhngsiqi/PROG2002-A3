import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  // defined API URL
  API_URL = 'http://localhost:3000/api/registrations';

  constructor(private httpClient: HttpClient) {
  }

  fetchAllRegistrations(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.API_URL);
  }

  fetchEventRegistrations(eventId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(this.API_URL + `/${eventId}`);
  }

  registerForEvent(payload: any) {
    return this.httpClient.post(this.API_URL, payload);
  }

  // add registration
  addRegistration(registration: any): Observable<any> {
    return this.httpClient.post(this.API_URL, registration);
  }

  // update registration
  updateRegistration(id: number, registration: any): Observable<any> {
    return this.httpClient.put(this.API_URL + '/' + id, registration);
  }
}
