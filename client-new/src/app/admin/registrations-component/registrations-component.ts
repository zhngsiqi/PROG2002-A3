import {Component, OnInit} from '@angular/core';
import {ToastService} from 'angular-toastify';
import {RegistrationService} from '../../service/registration-service';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {EventService} from '../../service/event-service';

@Component({
  selector: 'app-registrations-component',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registrations-component.html',
  styleUrl: './registrations-component.css'
})
export class RegistrationsComponent implements OnInit {
  registrations: any[] = [];
  events: any[] = [];
  err = '';
  formVisible = false; // control modal show/hide
  editingRegId: number | null = null;
  regForm!: FormGroup; // // registration form

  constructor(
    private regService: RegistrationService,
    private eventService: EventService,
    private fb: FormBuilder,
    private toast: ToastService
  ) {
    // init form
    this.regForm = this.fb.group({
      event_id: [null, Validators.required],
      full_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      tickets: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.fetchRegistrations();
    this.fetchEvents();
  }

  // fetch all event to show dropdown list
  fetchEvents() {
    this.eventService.fetchEvents().subscribe(result =>
      this.events = result
    );
  }

  // fetch all registrations to show registration list
  fetchRegistrations() {
    this.regService.fetchAllRegistrations().subscribe(result =>
      this.registrations = result
    );
  }

  showForm(reg?: any) {
    this.formVisible = true;
    if (reg) {
      this.editingRegId = reg.registration_id;
      // // patch value to form
      this.regForm.patchValue(reg);
    } else {
      this.editingRegId = null;
      this.regForm.reset({ tickets: 1 });
    }
  }

  // cancel form, hide modal and reset editing flag
  cancelForm() {
    this.formVisible = false;
    this.editingRegId = null;
  }

  submitForm() {
    // mark fields as touched if form is invalid
    if (this.regForm.invalid) {
      this.regForm.markAllAsTouched();
      return;
    }

    // create/update service
    if (this.editingRegId) {
      // update registration
      this.regService.updateRegistration(this.editingRegId, this.regForm.value).subscribe(() => {
        // refresh registrations and reset form value
        this.fetchRegistrations();
        this.cancelForm();
        // success message
        this.toast.warn('Registration updated successfully');
      }, err => {
        this.toast.error(err?.error?.error || 'Update failed')
      });
    } else {
      // add registration
      this.regService.addRegistration(this.regForm.value).subscribe(() => {
        // refresh registrations and reset form value
        this.fetchRegistrations();
        this.cancelForm();
        // success message
        this.toast.warn('Registration added successfully');
      }, err => {
        this.toast.error(err?.error?.error || 'Add failed')
      });
    }
  }

  deleteRegistration(reg: any) {
    if (confirm(`Are you sure you want to delete registration, User name: ${reg.full_name}?`)) {
      this.regService.deleteRegistration(reg.registration_id).subscribe(() => {
        this.fetchRegistrations();
        this.toast.warn('Registration deleted successfully');
      }, err => {
        this.toast.error(err?.error?.error || 'Delete failed')
      });
    }
  }
}
