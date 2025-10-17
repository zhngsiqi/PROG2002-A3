import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AngularToastifyModule, ToastService} from 'angular-toastify';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AngularToastifyModule],
  providers: [ToastService],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('client-new');
}
