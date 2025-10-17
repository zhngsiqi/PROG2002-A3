import { Component } from '@angular/core';
import {Navigation} from '../navigation/navigation';
import {RouterModule, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-admin-component',
  imports: [Navigation, RouterOutlet, RouterModule],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.css'
})
export class AdminComponent {

}
