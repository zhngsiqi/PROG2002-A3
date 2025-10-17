import { Routes } from '@angular/router';
import {IndexComponent} from './index-component/index-component';
import {SearchComponent} from './search-component/search-component';
import {EventComponent} from './event-component/event-component';
import {RegisterComponent} from './register-component/register-component';
import {AdminComponent} from './admin-component/admin-component';
import {EventsComponent} from './admin/events-component/events-component';
import {RegistrationsComponent} from './admin/registrations-component/registrations-component';

export const routes: Routes = [
  {
    path: '',
    component: IndexComponent
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'event/:id',
    component: EventComponent
  },
  {
    path: 'register/:id',
    component: RegisterComponent
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: EventsComponent
      },
      {
        path: 'registrations',
        component: RegistrationsComponent
      }
    ]
  }
];
