import {Component, OnInit} from '@angular/core';
import {EventService} from '../service/event-service';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-index-component',
  imports: [CommonModule, RouterModule],
  templateUrl: './index-component.html',
  styleUrl: './index-component.css'
})
export class IndexComponent implements OnInit {
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
