import { Component } from '@angular/core';
import {EventService} from '../service/event-service';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Navigation} from '../navigation/navigation';
import {Information} from '../information/information';
import {RegistrationService} from '../service/registration-service';

@Component({
  selector: 'app-event-component',
  imports: [CommonModule, Navigation, Information],
  templateUrl: './event-component.html',
  styleUrl: './event-component.css'
})
export class EventComponent {
  event: any;
  err = ""
  registrations: any[] = [] // Array to save registration records
  weather: any = null; // weather data

  constructor(private eventService: EventService, private route: ActivatedRoute, private registrationService: RegistrationService, private router: Router) {
    const id = this.route.snapshot.params['id'];

    // Get event details
    this.eventService.fetchSingleEvent(id).subscribe((result: any) => {
      this.event = result

      // fetch weather information
      if (result.latitude && result.longitude) {
        this.fetchWeather(result.latitude, result.longitude);
      }
    }, err => {
      this.err = err?.error?.message || err?.error?.error?.message
    })

    // Retrieve the registration list
    this.registrationService.fetchEventRegistrations(id).subscribe(result => {
      this.registrations = result
    }, err => {
      this.err = err?.error?.message || err?.error?.error?.message
    })
  }

  toRegister() {
    this.router.navigateByUrl('/register/' + this.event.event_id)
  }

  fetchWeather(lat: number, lng: number) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        // get daily
        const today = data.daily;

        // get max and min temperature
        this.weather = {
          max: today.temperature_2m_max[0],
          min: today.temperature_2m_min[0],
          code: today.weather_code[0]
        };
      })
      .catch(err => {
        console.error('Weather API error:', err);
      });
  }

  // get weather descirption by code
  getWeatherDescription(code: number): string {
    const mapping: any = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Light rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      80: 'Light rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      95: 'Thunderstorm',
    };
    return mapping[code] || 'Unknown';
  }
}
