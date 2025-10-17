import {Component, OnInit} from '@angular/core';
import {EventService} from '../../service/event-service';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastService} from 'angular-toastify';

@Component({
  selector: 'app-events-component',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './events-component.html',
  styleUrl: './events-component.css'
})
export class EventsComponent implements OnInit {
  events: any[] = []
  err = ""
  formVisible = false; // control form show/hide
  eventForm!: FormGroup; // event form
  editingEventId: number | null = null;

  constructor(private eventService: EventService, private fb: FormBuilder, private _toastService: ToastService) {
    // init form
    this.eventForm = this.fb.group({
      organisation_id: [null, Validators.required],
      category_id: [null, Validators.required],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)],
      location: ['', [Validators.required, Validators.maxLength(150)]],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      ticket_price: [0, [Validators.min(0)]],
      goal_amount: [0, [Validators.min(0)]],
      raised_amount: [0, [Validators.min(0)]],
      latitude: [null, [Validators.min(-90), Validators.max(90)]],
      longitude: [null, [Validators.min(-180), Validators.max(180)]],
    });
  }

  ngOnInit(): void {
    this.fetchEvent()
  }

  // fetch all event to show event list
  fetchEvent() {
    this.eventService.fetchEvents().subscribe(result => {
      this.events = result
    }, err => {
      this.err = err?.error?.message || err?.error?.error?.message
    })
  }

  showForm(event?: any) {
    this.formVisible = true;
    if (event) {
      const formEvent = { ...event }
      // format date as input date
      formEvent.start_date = formEvent.start_date.replace("T", " ").replace("Z", "")
      formEvent.end_date = formEvent.end_date.replace("T", " ").replace("Z", "")
      // set editing vent id
      this.editingEventId = event.event_id!;
      console.log(formEvent)
      // patch value to form
      this.eventForm.patchValue(formEvent);
    } else {
      this.editingEventId = null;
      this.eventForm.reset();
    }
  }

  // cancel form, hide modal and reset editing flag
  cancelForm() {
    this.formVisible = false;
    this.editingEventId = null;
  }

  submitForm() {
    console.log(this.eventForm)
    // mark fields as touched if form is invalid
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    // create/update service
    if (this.editingEventId) {
      // update event
      this.eventService.updateEvent(this.editingEventId, this.eventForm.value).subscribe(() => {
        // refresh events and reset form value
        this.fetchEvent()
        this.cancelForm();
        // success message
        this._toastService.warn("Event updated successfully")
      });
    } else {
      // add event
      this.eventService.addEvent(this.eventForm.value).subscribe(() => {
        // refresh events and reset form value
        this.fetchEvent()
        this.cancelForm();
        // success message
        this._toastService.warn("Event added successfully")
      });
    }
  }

  deleteEvent(event: any) {
    if (confirm(`Are you sure you want to delete event: ${event.name}?`)) {
      this.eventService.deleteEvent(event.event_id!).subscribe(() => {
        // refresh events
        this.fetchEvent()
        // success message
        this._toastService.warn("Event deleted successfully")
      }, error => {
        this._toastService.error(error?.error?.error || "Delete Error")
      });
    }
  }
}
