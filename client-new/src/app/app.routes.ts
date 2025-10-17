import { Routes } from '@angular/router';
import {IndexComponent} from './index-component/index-component';
import {SearchComponent} from './search-component/search-component';

export const routes: Routes = [
  {
    path: '',
    component: IndexComponent
  },
  {
    path: 'search',
    component: SearchComponent
  }
];
