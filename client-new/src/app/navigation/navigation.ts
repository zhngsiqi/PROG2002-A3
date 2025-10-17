import { Component } from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-navigation',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css'
})
export class Navigation {

}
