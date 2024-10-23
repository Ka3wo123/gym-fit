import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { WorkoutType } from '../../../types/WorkoutType';
import { trigger, transition, style, animate } from '@angular/animations';
import { GymUserService } from '../../../services/GymUserService';
import GymUserRegistration from '../../../types/GymUserRegistration';

@Component({
  selector: 'app-registration',
  standalone: true,
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  workoutTypes: WorkoutType[] = Object.values(WorkoutType);
  userToSave: GymUserRegistration | null = null

  constructor(private readonly _fb: FormBuilder,
    private readonly _userService: GymUserService
  ) {
    this.registrationForm = this._fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      workoutType: [''],
      age: ['', [Validators.min(18), Validators.max(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      this.userToSave = this.registrationForm.value as GymUserRegistration;
      console.log('User to save:', this.userToSave);
      this._userService.createUser(this.userToSave).subscribe({
        next: () => {
          console.log('User registration successful');          
        },
        error: (error) => {
          console.error('Registration failed:', error); // Log error details
        }
      });
    } else {
      console.log("Form isn't valid");
      console.log(this.registrationForm.errors); // Log specific form errors
    }
  }
}
