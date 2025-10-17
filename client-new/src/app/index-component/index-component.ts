import {Component, OnInit} from '@angular/core';
import {EventService} from '../service/event-service';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {Navigation} from '../navigation/navigation';
import {Information} from '../information/information';

@Component({
  selector: 'app-index-component',
  imports: [CommonModule, RouterModule, Navigation, Information],
  templateUrl: './index-component.html',
  styleUrl: './index-component.css'
})
export class IndexComponent implements OnInit {
  events: any[] = []
  err = ""

  // inject event service
  constructor(private eventService: EventService) {
  }

  ngOnInit(): void {
    // fetch all events to show list card
    this.eventService.fetchEvents().subscribe(result => {
      this.events = result
    }, err => {
      this.err = err?.error?.message || err?.error?.error?.message
    })
  }
}
