import { Component } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { CommonModule, Location  } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../service/event-service';
import { Navigation } from '../navigation/navigation';
import { Information } from '../information/information';
import {RegistrationService} from '../service/registration-service';

@Component({
  selector: 'app-register-component',
  imports: [CommonModule, FormsModule, Navigation, Information],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css'
})
export class RegisterComponent {
  event: any;
  form = {
    full_name: '',
    email: '',
    phone: '',
    tickets: 1
  };
  message = '';
  error = '';

  constructor(private route: ActivatedRoute, private eventService: EventService, private registrationService: RegistrationService, private location: Location) {
    const id = this.route.snapshot.params['id'];
    this.getEvent(id);
  }

  // Get events to display on the page
  getEvent(id: number) {
    this.eventService.fetchSingleEvent(id).subscribe(result => {
      this.event = result;
    }, err => {
      this.error = err?.error?.message || 'Failed to load event.';
    });
  }

  // Submit registration form
  submitForm() {
    this.error = '';
    this.message = '';

    if (!this.form.full_name || !this.form.email || !this.form.tickets) {
      this.error = 'Please enter name and email.';
      return;
    }

    const payload = {
      event_id: this.event.event_id,
      full_name: this.form.full_name,
      email: this.form.email,
      phone: this.form.phone,
      tickets: this.form.tickets
    };

    this.registrationService.registerForEvent(payload).subscribe(result => {
      this.message = 'Registration successful!';
      // Clear Form
      this.form = {
        full_name: '',
        email: '',
        phone: '',
        tickets: 1
      };
    }, err => {
      this.error = err?.error?.error || 'Failed to register.';
    });
  }

  goBack() {
    this.location.back()
  }
}
