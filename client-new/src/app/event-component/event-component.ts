import { Component } from '@angular/core';
import {EventService} from '../service/event-service';
import {ActivatedRoute} from '@angular/router';
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

  constructor(private eventService: EventService, private route: ActivatedRoute, private registrationService: RegistrationService) {
    const id = this.route.snapshot.params['id'];

    // Get event details
    this.eventService.fetchSingleEvent(id).subscribe(result => {
      this.event = result
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
}
