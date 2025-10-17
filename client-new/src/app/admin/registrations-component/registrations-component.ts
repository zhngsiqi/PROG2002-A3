import {Component, OnInit} from '@angular/core';
import {ToastService} from 'angular-toastify';
import {RegistrationService} from '../../service/registration-service';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-registrations-component',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registrations-component.html',
  styleUrl: './registrations-component.css'
})
export class RegistrationsComponent implements OnInit {
  registrations: any[] = [];

  constructor(
    private regService: RegistrationService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.fetchRegistrations();
  }

  fetchRegistrations() {
    this.regService.fetchAllRegistrations().subscribe(result =>
      this.registrations = result
    );
  }
}
