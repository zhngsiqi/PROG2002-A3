import { Component } from '@angular/core';
import {EventService} from '../service/event-service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {Navigation} from '../navigation/navigation';
import {Information} from '../information/information';

@Component({
  selector: 'app-search-component',
  imports: [CommonModule, FormsModule, RouterModule, Navigation, Information],
  templateUrl: './search-component.html',
  styleUrl: './search-component.css'
})
export class SearchComponent {
  events: any[] = []
  err = ""
  date = ""
  location = ""
  category = ""

  constructor(private eventService: EventService) {
  }

  formSubmit() {
    this.eventService.searchEvents(this.date, this.location, this.category).subscribe(result => {
      this.events = result
    }, err => {
      this.err = err?.error?.message || err?.error?.error?.message
    })
  }

  clearFilters() {
    // reset search form input
    this.events = []
    this.err = ""
    this.date = ""
    this.location = ""
    this.category = ""
  }
}
