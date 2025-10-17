import {Component, OnInit} from '@angular/core';
import {EventService} from '../../service/event-service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-events-component',
  imports: [CommonModule],
  templateUrl: './events-component.html',
  styleUrl: './events-component.css'
})
export class EventsComponent implements OnInit {
  events: any[] = []
  err = ""

  constructor(private eventService: EventService) {
  }

  ngOnInit(): void {
    this.eventService.fetchEvents().subscribe(result => {
      this.events = result
    }, err => {
      this.err = err?.error?.message || err?.error?.error?.message
    })
  }
}
