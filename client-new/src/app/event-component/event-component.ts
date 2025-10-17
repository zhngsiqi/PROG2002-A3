import { Component } from '@angular/core';
import {EventService} from '../service/event-service';
import {ActivatedRoute} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Navigation} from '../navigation/navigation';
import {Information} from '../information/information';

@Component({
  selector: 'app-event-component',
  imports: [CommonModule, Navigation, Information],
  templateUrl: './event-component.html',
  styleUrl: './event-component.css'
})
export class EventComponent {
  event: any;
  err = ""

  constructor(private eventService: EventService, private route: ActivatedRoute) {
    const id = this.route.snapshot.params['id'];

    this.eventService.fetchSingleEvent(id).subscribe(result => {
      this.event = result
    }, err => {
      this.err = err?.error?.message || err?.error?.error?.message
    })
  }
}
